package com.internify.controller;

import com.internify.entity.Application;
import com.internify.entity.Internship;
import com.internify.entity.Student;
import com.internify.entity.Freelance;
import com.internify.entity.FreelanceApplication;
import com.internify.payload.StudentProfileUpdateRequest;
import com.internify.security.UserPrincipal;
import com.internify.service.ApplicationService;
import com.internify.service.FreelanceApplicationService;
import com.internify.service.FreelanceService;
import com.internify.service.InternshipService;
import com.internify.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final InternshipService internshipService;
    private final FreelanceService freelanceService;
    private final ApplicationService applicationService;
    private final FreelanceApplicationService freelanceApplicationService;

    public StudentController(StudentService studentService, InternshipService internshipService, ApplicationService applicationService, FreelanceService freelanceService, FreelanceApplicationService freelanceApplicationService) {
        this.studentService = studentService;
        this.internshipService = internshipService;
        this.applicationService = applicationService;
        this.freelanceService = freelanceService;
        this.freelanceApplicationService = freelanceApplicationService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Student> getCurrentStudentProfile(@AuthenticationPrincipal UserPrincipal currentUser) {
        Student student = studentService.getStudentProfile(currentUser.getId());
        return ResponseEntity.ok(student);
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Student> updateStudentProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestPart("profile") StudentProfileUpdateRequest updateRequest,
            @RequestPart(value = "resume", required = false) MultipartFile resumeFile) {
        Student updatedStudent = studentService.updateStudentProfile(currentUser.getId(), updateRequest, resumeFile);
        return ResponseEntity.ok(updatedStudent);
    }

    @GetMapping("/internships")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Internship>> getAllActiveInternships() {
        return ResponseEntity.ok(internshipService.findActiveInternships());
    }
    
    @GetMapping("/freelance")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Freelance>> getAllFreelanceGigs() {
        return ResponseEntity.ok(freelanceService.getAllFreelanceGigs());
    }

    @PostMapping("/internships/{internshipId}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> applyForInternship(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long internshipId) {
        try {
            System.out.println(">>> Controller - Apply for internship: " + internshipId + " by user: " + currentUser.getId());
            Application application = applicationService.applyForInternship(internshipId);
            System.out.println(">>> Application created successfully with ID: " + application.getId());
            return new ResponseEntity<>(application, HttpStatus.CREATED);
        } catch (IOException e) {
            System.err.println(">>> IOException in apply: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing application: " + e.getMessage());
        } catch (Exception e) {
            System.err.println(">>> Exception in apply: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    
    @PostMapping("/freelance/{freelanceId}/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> applyForFreelance(@AuthenticationPrincipal UserPrincipal currentUser, @PathVariable Long freelanceId) {
        try {
            System.out.println(">>> Controller - Apply for freelance: " + freelanceId + " by user: " + currentUser.getId());
            FreelanceApplication application = freelanceApplicationService.applyForFreelance(freelanceId, currentUser.getId());
            System.out.println(">>> Freelance application created successfully with ID: " + application.getId());
            return new ResponseEntity<>(application, HttpStatus.CREATED);
        } catch (Exception e) {
            System.err.println(">>> Exception in freelance apply: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Application>> getMyApplications(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Application> applications = applicationService.getApplicationsByStudent(currentUser.getId());
        return ResponseEntity.ok(applications);
    }

    @GetMapping("/freelance/applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<FreelanceApplication>> getMyFreelanceApplications(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(freelanceApplicationService.getMyFreelanceApplications(currentUser.getId()));
    }
}