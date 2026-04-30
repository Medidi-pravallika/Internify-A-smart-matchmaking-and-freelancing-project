package com.internify.controller;

import com.internify.entity.Internship;
import com.internify.service.InternshipService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
public class InternshipController {

    private final InternshipService internshipService;

    public InternshipController(InternshipService internshipService) {
        this.internshipService = internshipService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('STUDENT', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<List<Internship>> getAllInternships() {
        // In a real app, you might only return 'ACTIVE' internships for students/recruiters
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'RECRUITER', 'ADMIN')")
    public ResponseEntity<Internship> getInternshipById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }
}