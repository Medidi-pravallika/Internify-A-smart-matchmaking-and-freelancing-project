package com.internify.controller;

import com.internify.entity.Application;
import com.internify.entity.Internship;
import com.internify.entity.Freelance;
import com.internify.entity.FreelanceApplication;
import com.internify.payload.InternshipRequest;
import com.internify.payload.RecruiterProfileUpdateRequest;
import com.internify.payload.FreelanceRequest;
import com.internify.security.UserPrincipal;
import com.internify.service.ApplicationService;
import com.internify.service.FreelanceApplicationService;
import com.internify.service.FreelanceService;
import com.internify.service.InternshipService;
import com.internify.service.RecruiterService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/recruiters")
public class RecruiterController {

    private final RecruiterService recruiterService;
    private final InternshipService internshipService;
    private final FreelanceService freelanceService;
    private final ApplicationService applicationService;
    private final FreelanceApplicationService freelanceApplicationService;

    public RecruiterController(RecruiterService recruiterService, InternshipService internshipService, ApplicationService applicationService, FreelanceService freelanceService, FreelanceApplicationService freelanceApplicationService) {
        this.recruiterService = recruiterService;
        this.internshipService = internshipService;
        this.applicationService = applicationService;
        this.freelanceService = freelanceService;
        this.freelanceApplicationService = freelanceApplicationService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getCurrentRecruiterProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(recruiterService.getRecruiterProfile(currentUser.getId()));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> updateRecruiterProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestBody RecruiterProfileUpdateRequest updateRequest) {
        return ResponseEntity.ok(recruiterService.updateRecruiterProfile(currentUser.getId(), updateRequest));
    }

    @PostMapping("/internships")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Internship> postInternship(
            @RequestPart("internship") InternshipRequest request,
            @RequestPart(value = "jd", required = false) MultipartFile jdFile) {
        Internship newInternship = internshipService.createInternship(request, jdFile);
        return new ResponseEntity<>(newInternship, HttpStatus.CREATED);
    }
    
    @PostMapping("/freelance")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Freelance> postFreelance(@RequestBody FreelanceRequest request) {
        Freelance newGig = freelanceService.createFreelanceGig(request);
        return new ResponseEntity<>(newGig, HttpStatus.CREATED);
    }

    @GetMapping("/internships")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<Internship>> getMyPostedInternships(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Internship> internships = internshipService.getInternshipsByRecruiter(currentUser.getId());
        return ResponseEntity.ok(internships);
    }
    
    @GetMapping("/freelance")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<List<Freelance>> getMyPostedFreelanceGigs(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(freelanceService.getFreelanceGigsByRecruiter(currentUser.getId()));
    }
    
    @DeleteMapping("/internships/{internshipId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<String> deleteInternship(@PathVariable Long internshipId) {
        System.out.println(">>> DELETE INTERNSHIP REQUEST - ID: " + internshipId);
        internshipService.deleteInternship(internshipId);
        return ResponseEntity.ok("Internship deleted successfully.");
    }
    
    @DeleteMapping("/freelance/{freelanceId}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<String> deleteFreelanceGig(@PathVariable Long freelanceId) {
        freelanceService.deleteFreelanceGig(freelanceId);
        return ResponseEntity.ok("Freelance gig deleted successfully.");
    }

    @GetMapping("/internships/{internshipId}/applications")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getApplicationsForInternship(@PathVariable Long internshipId) {
        return ResponseEntity.ok(applicationService.getApplicationsForInternship(internshipId));
    }

    @GetMapping("/freelance/{freelanceId}/applications")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<?> getApplicationsForFreelanceGig(@PathVariable Long freelanceId) {
        return ResponseEntity.ok(freelanceApplicationService.getApplicationsForFreelanceGig(freelanceId));
    }

    @PutMapping("/applications/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Application> updateApplicationStatusAsRecruiter(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long applicationId,
            @RequestParam String status) {
        Application updatedApplication = applicationService.updateApplicationStatusAsRecruiter(applicationId, status, currentUser.getId());
        return ResponseEntity.ok(updatedApplication);
    }
    
    @PutMapping("/internships/{internshipId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Internship> updateInternshipStatusAsRecruiter(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long internshipId,
            @RequestParam String status) {
        Internship updatedInternship = internshipService.updateInternshipStatusAsRecruiter(internshipId, status, currentUser.getId());
        return ResponseEntity.ok(updatedInternship);
    }
    
    @PutMapping("/freelance/{freelanceId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<Freelance> updateFreelanceStatusAsRecruiter(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long freelanceId,
            @RequestParam String status) {
        Freelance updatedFreelance = freelanceService.updateFreelanceStatus(freelanceId, status, currentUser.getId());
        return ResponseEntity.ok(updatedFreelance);
    }

    @PutMapping("/freelance/applications/{applicationId}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<FreelanceApplication> updateFreelanceApplicationStatusAsRecruiter(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long applicationId,
            @RequestParam String status) {
        FreelanceApplication updatedApplication = freelanceApplicationService.updateApplicationStatusAsRecruiter(applicationId, status, currentUser.getId());
        return ResponseEntity.ok(updatedApplication);
    }
}