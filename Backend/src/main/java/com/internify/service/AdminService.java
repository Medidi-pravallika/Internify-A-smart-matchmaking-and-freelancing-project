package com.internify.service;

import com.internify.entity.User;
import com.internify.repository.UserRepository;
import com.internify.repository.InternshipRepository;
import com.internify.repository.ApplicationRepository;
import com.internify.repository.FreelanceApplicationRepository;
import com.internify.repository.RecruiterRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {
    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;
    private final ApplicationRepository applicationRepository;
    private final FreelanceApplicationRepository freelanceApplicationRepository;
    private final RecruiterRepository recruiterRepository;

    public AdminService(UserRepository userRepository, InternshipRepository internshipRepository, 
                       ApplicationRepository applicationRepository, FreelanceApplicationRepository freelanceApplicationRepository,
                       RecruiterRepository recruiterRepository) {
        this.userRepository = userRepository;
        this.internshipRepository = internshipRepository;
        this.applicationRepository = applicationRepository;
        this.freelanceApplicationRepository = freelanceApplicationRepository;
        this.recruiterRepository = recruiterRepository;
    }

    @Transactional
    public void deleteUser(Long userId) {
        // Check if user exists and is not an admin
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));
        
        if (user.getUserType() == com.internify.entity.UserType.ADMIN) {
            throw new RuntimeException("Cannot delete admin users");
        }
        
        userRepository.deleteById(userId);
    }

    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        
        long totalUsers = userRepository.count();
        long totalInternships = internshipRepository.count();
        long totalApplications = applicationRepository.count() + freelanceApplicationRepository.count();
        long acceptedApplications = applicationRepository.countByStatus("ACCEPTED") + 
                                   freelanceApplicationRepository.countByStatus("ACCEPTED");
        
        double successRate = totalApplications > 0 ? (double) acceptedApplications / totalApplications * 100 : 0.0;
        
        // Add status breakdowns
        Map<String, Object> internshipsByStatus = new HashMap<>();
        internshipsByStatus.put("pending", internshipRepository.countByStatus("PENDING"));
        internshipsByStatus.put("active", internshipRepository.countByStatus("ACTIVE"));
        internshipsByStatus.put("closed", internshipRepository.countByStatus("CLOSED"));
        
        Map<String, Object> applicationsByStatus = new HashMap<>();
        applicationsByStatus.put("pending", applicationRepository.countByStatus("PENDING") + 
                                           freelanceApplicationRepository.countByStatus("PENDING"));
        applicationsByStatus.put("accepted", acceptedApplications);
        applicationsByStatus.put("rejected", applicationRepository.countByStatus("REJECTED") + 
                                           freelanceApplicationRepository.countByStatus("REJECTED"));
        
        analytics.put("totalUsers", totalUsers);
        analytics.put("totalInternships", totalInternships);
        analytics.put("totalApplications", totalApplications);
        analytics.put("successRate", Math.round(successRate * 100.0) / 100.0);
        analytics.put("internshipsByStatus", internshipsByStatus);
        analytics.put("applicationsByStatus", applicationsByStatus);
        
        return analytics;
    }

    @Transactional
    public void createSampleInternships() {
        // Check if sample data already exists
        long existingInternships = internshipRepository.count();
        if (existingInternships > 0) {
            return; // Don't create duplicates
        }

        // First, we need to find a recruiter to associate internships with
        java.util.List<com.internify.entity.Recruiter> recruiters = recruiterRepository.findAll();
        
        if (recruiters.isEmpty()) {
            // Create a sample recruiter first
            createSampleRecruiter();
            recruiters = recruiterRepository.findAll();
        }

        com.internify.entity.Recruiter sampleRecruiter = recruiters.get(0);

        // Create sample internships
        for (int i = 1; i <= 3; i++) {
            com.internify.entity.Internship internship = new com.internify.entity.Internship();
            internship.setTitle("Software Development Intern " + i);
            internship.setDescription("Work on exciting projects with our development team. Learn modern technologies and best practices.");
            internship.setRequirements("Computer Science student, Java/Spring Boot knowledge preferred");
            internship.setSkills("Java,Spring Boot,MySQL,React");
            internship.setDuration("3 months");
            internship.setLocation("Remote/Hybrid");
            internship.setStipend("₹" + (15000 + (i * 5000)) + "/month");
            internship.setStatus("PENDING_APPROVAL");
            internship.setPostedBy(sampleRecruiter);
            internship.setPostedDate(java.time.LocalDateTime.now().minusDays(i));

            internshipRepository.save(internship);
        }
    }

    private void createSampleRecruiter() {
        // This is a simplified version - you might need to adjust based on your User/Recruiter creation logic
        com.internify.entity.User user = new com.internify.entity.User();
        user.setEmail("sample.recruiter@company.com");
        user.setPassword("password"); // In real app, this should be encoded
        user.setUserType(com.internify.entity.UserType.RECRUITER);
        userRepository.save(user);

        com.internify.entity.Recruiter recruiter = new com.internify.entity.Recruiter();
        recruiter.setOrganizationName("Tech Solutions Inc");
        recruiter.setOrganizationType("Technology");
        recruiter.setUser(user);
        
        recruiterRepository.save(recruiter);
    }
}