package com.internify.service;

import com.internify.entity.Freelance;
import com.internify.entity.FreelanceApplication;
import com.internify.entity.Student;
import com.internify.exception.BadRequestException;
import com.internify.exception.ResourceNotFoundException;
import com.internify.repository.FreelanceApplicationRepository;
import com.internify.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FreelanceApplicationService {
    private final FreelanceApplicationRepository freelanceApplicationRepository;
    private final StudentRepository studentRepository;
    private final FreelanceService freelanceService;
    private final EmailService emailService;

    public FreelanceApplicationService(FreelanceApplicationRepository freelanceApplicationRepository, StudentRepository studentRepository, FreelanceService freelanceService, EmailService emailService) {
        this.freelanceApplicationRepository = freelanceApplicationRepository;
        this.studentRepository = studentRepository;
        this.freelanceService = freelanceService;
        this.emailService = emailService;
    }

    public FreelanceApplication applyForFreelance(Long freelanceId, Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        Freelance freelance = freelanceService.getFreelanceGigById(freelanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance gig not found with ID: " + freelanceId));

        // Check if freelance gig is open for applications
        if (!"OPEN".equals(freelance.getStatus())) {
            throw new BadRequestException("This freelance gig is not open for applications. Current status: " + freelance.getStatus());
        }

        if (freelanceApplicationRepository.findByStudentAndFreelance(student, freelance).isPresent()) {
            throw new BadRequestException("Student has already applied for this freelance gig.");
        }

        FreelanceApplication freelanceApplication = new FreelanceApplication();
        freelanceApplication.setStudent(student);
        freelanceApplication.setFreelance(freelance);
        freelanceApplication.setApplicationDate(LocalDateTime.now());
        freelanceApplication.setStatus("APPLIED");
        
        FreelanceApplication savedApplication = freelanceApplicationRepository.save(freelanceApplication);

        // Notify recruiter of a new application
        String subject = "New Application for Your Freelance Gig";
        String htmlBody = "<h1>New Application</h1>"
                        + "<p>Hello " + freelance.getPostedBy().getEmail() + ",</p>"
                        + "<p>A new student has applied for your freelance gig: <strong>" + freelance.getTitle() + "</strong>.</p>"
                        + "<p>Regards,<br>Internify Team</p>";
        
        emailService.sendHtmlEmail(freelance.getPostedBy().getEmail(), subject, htmlBody);

        return savedApplication;
    }
    
    public List<FreelanceApplication> getMyFreelanceApplications(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        return freelanceApplicationRepository.findByStudent(student);
    }
    
    public List<com.internify.payload.ApplicationWithStudentDTO> getApplicationsForFreelanceGig(Long freelanceId) {
        Freelance freelance = freelanceService.getFreelanceGigById(freelanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelance gig not found with ID: " + freelanceId));
        
        List<FreelanceApplication> applications = freelanceApplicationRepository.findByFreelance(freelance);
        
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
                null // FreelanceApplication doesn't have matchScore
            );
        }).toList();
    }

    public FreelanceApplication updateApplicationStatusAsRecruiter(Long applicationId, String newStatus, Long recruiterId) {
        FreelanceApplication application = freelanceApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        Long postedById = application.getFreelance().getPostedBy().getId();

        if (!postedById.equals(recruiterId)) {
            throw new BadRequestException("You are not authorized to update this application's status.");
        }

        application.setStatus(newStatus);
        FreelanceApplication updatedApplication = freelanceApplicationRepository.save(application);

        // Send email notification to student
        Student student = updatedApplication.getStudent();
        emailService.sendApplicationStatusEmail(
            student.getEmail(),
            student.getName(),
            updatedApplication.getFreelance().getTitle(),
            newStatus,
            "freelance"
        );

        return updatedApplication;
    }
}