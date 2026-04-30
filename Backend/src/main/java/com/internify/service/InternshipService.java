package com.internify.service;

import com.internify.entity.Internship;
import com.internify.entity.Recruiter;
import com.internify.exception.BadRequestException;
import com.internify.exception.ResourceNotFoundException;
import com.internify.payload.InternshipRequest;
import com.internify.repository.InternshipRepository;
import com.internify.repository.RecruiterRepository;
import com.internify.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final RecruiterRepository recruiterRepository;
    private final FileStorageService fileStorageService;

    public InternshipService(InternshipRepository internshipRepository, RecruiterRepository recruiterRepository, FileStorageService fileStorageService) {
        this.internshipRepository = internshipRepository;
        this.recruiterRepository = recruiterRepository;
        this.fileStorageService = fileStorageService;
    }

    public Internship createInternship(InternshipRequest request, MultipartFile jdFile) {
        UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Recruiter recruiter = recruiterRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with ID: " + currentUser.getId()));

        Internship internship = new Internship();
        internship.setTitle(request.getTitle());
        internship.setDescription(request.getDescription());
        internship.setRequirements(request.getRequirements());
        internship.setPostedBy(recruiter);
        internship.setPostedDate(LocalDateTime.now());
        internship.setStatus("PENDING_APPROVAL");

        if (jdFile != null && !jdFile.isEmpty()) {
            try {
                String jdPath = fileStorageService.storeFile(jdFile, "job_descriptions");
                internship.setJdPath(jdPath);
            } catch (Exception e) {
                throw new RuntimeException("Failed to store job description file: " + e.getMessage());
            }
        }
        return internshipRepository.save(internship);
    }

    public List<Internship> getAllInternships() {
        return internshipRepository.findAll();
    }
    
    // ✅ This is the method you need to add.
    public List<Internship> findActiveInternships() {
        return internshipRepository.findByStatus("ACTIVE");
    }

    public Internship getInternshipById(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + id));
    }

    public List<Internship> getInternshipsByRecruiter(Long recruiterId) {
        Recruiter recruiter = recruiterRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with ID: " + recruiterId));
        return internshipRepository.findByPostedBy(recruiter);
    }

    public List<Internship> findByStatus(String status) {
        return internshipRepository.findByStatus(status);
    }

    public Internship updateInternshipStatus(Long internshipId, String status) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + internshipId));
        internship.setStatus(status);
        return internshipRepository.save(internship);
    }

    public void deleteInternship(Long internshipId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + internshipId));
        internshipRepository.delete(internship);
    }

    public Internship updateInternshipStatusAsRecruiter(Long internshipId, String status, Long recruiterId) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + internshipId));
        
        if (!internship.getPostedBy().getId().equals(recruiterId)) {
            throw new BadRequestException("You are not authorized to update this internship's status.");
        }
        
        internship.setStatus(status);
        return internshipRepository.save(internship);
    }

    public long countByStatus(String status) {
        return internshipRepository.findByStatus(status).size();
    }

    public Internship saveInternship(Internship internship) {
        return internshipRepository.save(internship);
    }
}