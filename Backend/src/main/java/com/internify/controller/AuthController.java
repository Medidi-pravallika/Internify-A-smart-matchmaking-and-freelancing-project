package com.internify.controller;

import com.internify.payload.AuthRequest;
import com.internify.payload.RecruiterRegisterRequest;
import com.internify.payload.StudentRegisterRequest;
import com.internify.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/student")
    public ResponseEntity<String> registerStudent(@RequestBody StudentRegisterRequest request) {
        try {
            authService.registerStudent(request.getEmail(), request.getPassword(), request.getName());
            return new ResponseEntity<>("Student registered successfully!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/register/recruiter")
    public ResponseEntity<String> registerRecruiter(@RequestBody RecruiterRegisterRequest request) {
        try {
            authService.registerRecruiter(request.getEmail(), request.getPassword(), request.getOrganizationName(), request.getOrganizationType());
            return new ResponseEntity<>("Recruiter registered successfully!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    
    // Admin registration - for initial setup or internal use only, not for public exposure
    @PostMapping("/register/admin")
    public ResponseEntity<String> registerAdmin(@RequestBody AuthRequest request) {
        try {
            authService.registerAdmin(request.getEmail(), request.getPassword());
            return new ResponseEntity<>("Admin registered successfully!", HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody AuthRequest request) {
        Map<String, String> response = authService.authenticateUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }
}