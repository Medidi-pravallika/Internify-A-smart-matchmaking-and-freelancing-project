package com.internify.controller;

import com.internify.entity.Internship;
import com.internify.entity.Freelance;
import com.internify.entity.Review;
import com.internify.entity.User;
import com.internify.payload.UserDTO;
import com.internify.service.AdminService;
import com.internify.service.InternshipService;
import com.internify.service.FreelanceService;
import com.internify.service.ReviewService;
import com.internify.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final InternshipService internshipService;
    private final FreelanceService freelanceService;
    private final ReviewService reviewService;
    private final AdminService adminService;

    public AdminController(UserRepository userRepository, InternshipService internshipService, FreelanceService freelanceService, ReviewService reviewService, AdminService adminService) {
        this.userRepository = userRepository;
        this.internshipService = internshipService;
        this.freelanceService = freelanceService;
        this.reviewService = reviewService;
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = users.stream()
                .map(UserDTO::new)
                .toList();
        return ResponseEntity.ok(userDTOs);
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        System.out.println(">>> DELETE /users/" + userId + " - Authentication: " + 
                          org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication());
        
        if (org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication() != null) {
            System.out.println(">>> Authentication name: " + 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName());
            System.out.println(">>> Authentication authorities: " + 
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        }
        
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully.");
    }

    @GetMapping("/internships")
    public ResponseEntity<List<Internship>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/internships/pending")
    public ResponseEntity<List<Internship>> getPendingInternships() {
        return ResponseEntity.ok(internshipService.findByStatus("PENDING"));
    }

    @PutMapping("/internships/{id}/status")
    public ResponseEntity<String> updateInternshipStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            Internship internship = internshipService.getInternshipById(id);
            internship.setStatus(newStatus);
            internshipService.saveInternship(internship);
            return ResponseEntity.ok("Internship status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating internship status: " + e.getMessage());
        }
    }

    @DeleteMapping("/internships/{internshipId}")
    public ResponseEntity<String> deleteInternship(@PathVariable Long internshipId) {
        internshipService.deleteInternship(internshipId);
        return ResponseEntity.ok("Internship deleted successfully.");
    }

    // Freelance Management Endpoints
    @GetMapping("/freelance")
    public ResponseEntity<List<Freelance>> getAllFreelanceProjects() {
        return ResponseEntity.ok(freelanceService.getAllFreelanceGigs());
    }

    @GetMapping("/freelance/pending")
    public ResponseEntity<List<Freelance>> getPendingFreelanceProjects() {
        return ResponseEntity.ok(freelanceService.findByStatus("PENDING"));
    }

    @PutMapping("/freelance/{id}/status")
    public ResponseEntity<String> updateFreelanceStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String newStatus = request.get("status");
            Freelance freelance = freelanceService.getFreelanceById(id);
            freelance.setStatus(newStatus);
            freelanceService.saveFreelance(freelance);
            return ResponseEntity.ok("Freelance project status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating freelance status: " + e.getMessage());
        }
    }

    // Review Management Endpoints
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @PutMapping("/reviews/{id}/approve")
    public ResponseEntity<String> approveReview(@PathVariable Long id) {
        try {
            reviewService.approveReview(id);
            return ResponseEntity.ok("Review approved successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error approving review: " + e.getMessage());
        }
    }

    @PutMapping("/reviews/{id}/reject")
    public ResponseEntity<String> rejectReview(@PathVariable Long id) {
        try {
            reviewService.rejectReview(id);
            return ResponseEntity.ok("Review rejected successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error rejecting review: " + e.getMessage());
        }
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting review: " + e.getMessage());
        }
    }

    @GetMapping("/analytics")
    public ResponseEntity<?> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @PostMapping("/sample-data/internships")
    public ResponseEntity<String> createSampleInternships() {
        try {
            System.out.println(">>> Sample data creation endpoint called!");
            
            // Check if sample data already exists
            long existingCount = internshipService.countByStatus("PENDING");
            System.out.println(">>> Existing pending internships count: " + existingCount);
            
            if (existingCount > 0) {
                return ResponseEntity.ok("Sample data already exists. Found " + existingCount + " pending internships.");
            }

            // Create sample internships directly
            for (int i = 1; i <= 5; i++) {
                com.internify.entity.Internship internship = new com.internify.entity.Internship();
                internship.setTitle("Software Development Intern " + i);
                internship.setDescription("Work on exciting projects with our development team. Learn modern technologies and best practices in software development.");
                internship.setRequirements("Computer Science student, Java/Spring Boot knowledge preferred");
                internship.setSkills("Java,Spring Boot,MySQL,React,JavaScript");
                internship.setDuration("3-6 months");
                internship.setLocation("Remote/Hybrid");
                internship.setStipend("₹" + (15000 + (i * 5000)) + "/month");
                internship.setStatus("PENDING");
                internship.setPostedDate(java.time.LocalDateTime.now().minusDays(i));
                
                // For now, leave postedBy as null - we'll fix this later
                // internship.setPostedBy(null);

                internshipService.saveInternship(internship);
            }
            
            return ResponseEntity.ok("Created 5 sample internships successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating sample data: " + e.getMessage());
        }
    }

    @PostMapping("/sample-data")
    public ResponseEntity<String> createSampleData() {
        adminService.createSampleInternships();
        return ResponseEntity.ok("Sample internship data created successfully!");
    }

    @PostMapping("/sample-data/reviews")
    public ResponseEntity<String> createSampleReviews() {
        try {
            System.out.println(">>> Sample review creation endpoint called!");
            
            // Check if sample reviews already exist
            List<Review> existingReviews = reviewService.getAllReviews();
            if (!existingReviews.isEmpty()) {
                return ResponseEntity.ok("Sample review data already exists. Found " + existingReviews.size() + " reviews.");
            }

            // Get some users to create reviews between them
            List<User> users = userRepository.findAll();
            if (users.size() < 2) {
                return ResponseEntity.badRequest().body("Need at least 2 users to create sample reviews");
            }

            // Create sample reviews
            for (int i = 0; i < Math.min(5, users.size() - 1); i++) {
                Review review = new Review();
                review.setReviewer(users.get(i));
                review.setReviewee(users.get(i + 1));
                review.setRating(3 + (i % 3)); // Ratings between 3-5
                review.setComment("Sample review comment " + (i + 1) + ". This is a test review for moderation purposes.");
                review.setReviewDate(java.time.LocalDateTime.now().minusDays(i));
                review.setStatus(Review.ReviewStatus.PENDING);
                
                reviewService.createReviewDirect(review);
            }
            
            return ResponseEntity.ok("Created sample reviews successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating sample review data: " + e.getMessage());
        }
    }

    // Admin can still manually update an application's status for cleanup, but it's not the primary operation.
//    @PutMapping("/applications/{applicationId}/status")
//    public ResponseEntity<?> updateApplicationStatus(@PathVariable Long applicationId, @RequestParam String status) {
//        return ResponseEntity.ok(applicationService.updateApplicationStatus(applicationId, status, null)); // Null indicates admin override
//    }
    
//    // Admin can still manually update an internship's status for cleanup.
//    @PutMapping("/internships/{internshipId}/status")
//    public ResponseEntity<Internship> updateInternshipStatus(@PathVariable Long internshipId, @RequestParam String status) {
//        return ResponseEntity.ok(internshipService.updateInternshipStatus(internshipId, status, null)); // Null indicates admin override
//    }
}