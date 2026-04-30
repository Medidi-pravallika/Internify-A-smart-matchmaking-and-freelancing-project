package com.internify.service;

import com.internify.entity.Application;
import com.internify.entity.Internship;
import com.internify.entity.Recruiter;
import com.internify.entity.Student;
import com.internify.exception.BadRequestException;
import com.internify.exception.ResourceNotFoundException;
import com.internify.repository.ApplicationRepository;
import com.internify.repository.InternshipRepository;
import com.internify.repository.StudentRepository;
import com.internify.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final InternshipRepository internshipRepository;
    private final MatchingService matchingService;
    private final FileStorageService fileStorageService;
    private final EmailService emailService;
    private final InternshipService internshipService;

    public ApplicationService(ApplicationRepository applicationRepository, StudentRepository studentRepository,
                              InternshipRepository internshipRepository, MatchingService matchingService,
                              FileStorageService fileStorageService, EmailService emailService, InternshipService internshipService) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.internshipRepository = internshipRepository;
        this.matchingService = matchingService;
        this.fileStorageService = fileStorageService;
        this.emailService = emailService;
        this.internshipService = internshipService;
    }

    public Application applyForInternship(Long internshipId) throws IOException {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Student student = studentRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + currentUser.getId()));
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + internshipId));

        if (applicationRepository.findByStudentAndInternship(student, internship).isPresent()) {
            throw new BadRequestException("Student has already applied for this internship.");
        }

        if (student.getResumePath() == null || internship.getJdPath() == null) {
            throw new BadRequestException("Resume or Job Description file not found. Please upload files to enable matching.");
        }

        Double matchScore = null;
        try {
            Path resumePath = fileStorageService.loadFileAsResource(student.getResumePath());
            Path jdPath = fileStorageService.loadFileAsResource(internship.getJdPath());

            System.out.println(">>> Resume Path: " + resumePath);
            System.out.println(">>> JD Path: " + jdPath);

            matchScore = matchingService.getMatchScore(resumePath, jdPath);
            System.out.println(">>> Match Score from ML API: " + matchScore);
        } catch (Exception e) {
            System.err.println("!!! Error calling ML service for match score: " + e.getMessage());
        }

        // Fallback if ML API failed or returned null
        if (matchScore == null) {
            matchScore = 50.0;
            System.out.println(">>> Using fallback match score = " + matchScore);
        }

        Application application = new Application();
        application.setStudent(student);
        application.setInternship(internship);
        application.setApplicationDate(LocalDateTime.now());
        application.setStatus("APPLIED");
        application.setMatchScore(matchScore);

        Application savedApplication = applicationRepository.save(application);
        System.out.println(">>> Application saved with MatchScore = " + savedApplication.getMatchScore());

        Recruiter recruiter = internship.getPostedBy();
        String subject = "New Application for Your Internship";
        String htmlBody = "<h1>New Application</h1>"
                + "<p>Hello " + recruiter.getEmail() + ",</p>"
                + "<p>A new student has applied for your internship: <strong>" + internship.getTitle() + "</strong>.</p>"
                + "<p>Regards,<br>Internify Team</p>";

        emailService.sendHtmlEmail(recruiter.getEmail(), subject, htmlBody);

        return savedApplication;
    }

    public List<Application> getApplicationsByStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        return applicationRepository.findByStudent(student);
    }

    public List<com.internify.payload.ApplicationWithStudentDTO> getApplicationsForInternship(Long internshipId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + internshipId));
        
        List<Application> applications = applicationRepository.findByInternship(internship);
        
        // Convert to DTO with student information
        return applications.stream().map(app -> {
            return new com.internify.payload.ApplicationWithStudentDTO(
                app.getId(),
                app.getStudent().getId(),
                app.getStudent().getName(),
                app.getStudent().getEmail(),
                app.getStudent().getSkills(),
                app.getStatus(),
                app.getApplicationDate(),
                app.getMatchScore()
            );
        }).toList();
    }

    public Application updateApplicationStatus(Long applicationId, String status, Long adminId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        if (adminId == null) {
            throw new BadRequestException("This operation requires admin privileges.");
        }

        application.setStatus(status);
        Application updatedApplication = applicationRepository.save(application);

        Student student = updatedApplication.getStudent();
        String subject = "Your application for " + updatedApplication.getInternship().getTitle() + " has been updated";
        String htmlBody = "<h1>Application Status Update</h1>"
                + "<p>Dear " + student.getName() + ",</p>"
                + "<p>The status of your application for the '" + updatedApplication.getInternship().getTitle() + "' internship has been updated to: <strong>" + status + "</strong>.</p>"
                + "<p>Regards,<br>Internify Team</p>";

        emailService.sendHtmlEmail(student.getEmail(), subject, htmlBody);

        return updatedApplication;
    }

    public Application updateApplicationStatusAsRecruiter(Long applicationId, String newStatus, Long recruiterId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        Long postedById = application.getInternship().getPostedBy().getId();

        if (!postedById.equals(recruiterId)) {
            throw new BadRequestException("You are not authorized to update this application's status.");
        }

        application.setStatus(newStatus);
        Application updatedApplication = applicationRepository.save(application);

        // Send email notification to student
        Student student = updatedApplication.getStudent();
        emailService.sendApplicationStatusEmail(
            student.getEmail(),
            student.getName(),
            updatedApplication.getInternship().getTitle(),
            newStatus,
            "internship"
        );

        return updatedApplication;
    }

    public List<Student> getApplicantsByRecruiter(Long recruiterId) {
        // Get all internships posted by this recruiter
        List<Internship> recruiterInternships = internshipService.getInternshipsByRecruiter(recruiterId);
        
        // Get all students who applied to these internships
        List<Student> applicants = new ArrayList<>();
        Set<Long> uniqueStudentIds = new HashSet<>();
        
        for (Internship internship : recruiterInternships) {
            List<Application> applications = applicationRepository.findByInternship(internship);
            for (Application application : applications) {
                Student student = application.getStudent();
                if (uniqueStudentIds.add(student.getId())) { // Only add if not already added
                    applicants.add(student);
                }
            }
        }
        
        System.out.println(">>> Found " + applicants.size() + " unique applicants for recruiter " + recruiterId);
        return applicants;
    }

    public List<com.internify.payload.StudentApplicationDTO> getApplicantsWithApplicationsByRecruiter(Long recruiterId) {
        // Get all internships posted by this recruiter
        List<Internship> recruiterInternships = internshipService.getInternshipsByRecruiter(recruiterId);
        
        // Get all applications with student and application details
        List<com.internify.payload.StudentApplicationDTO> applicants = new ArrayList<>();
        Set<String> uniqueApplicationKeys = new HashSet<>(); // Use student-internship combination as key
        
        for (Internship internship : recruiterInternships) {
            List<Application> applications = applicationRepository.findByInternship(internship);
            for (Application application : applications) {
                Student student = application.getStudent();
                String applicationKey = student.getId() + "-" + internship.getId();
                
                if (uniqueApplicationKeys.add(applicationKey)) { // Only add unique student-internship combinations
                    com.internify.payload.StudentApplicationDTO dto = new com.internify.payload.StudentApplicationDTO(
                        student.getId(),
                        student.getName(),
                        student.getEmail(),
                        student.getSkills(),
                        student.getResumePath(),
                        application.getId(),
                        application.getStatus(),
                        internship.getId(),
                        internship.getTitle()
                    );
                    applicants.add(dto);
                }
            }
        }
        
        System.out.println(">>> Found " + applicants.size() + " unique applications for recruiter " + recruiterId);
        return applicants;
    }
}
