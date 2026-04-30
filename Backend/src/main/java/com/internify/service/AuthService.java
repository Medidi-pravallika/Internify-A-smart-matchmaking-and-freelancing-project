package com.internify.service;

import com.internify.entity.Recruiter;
import com.internify.entity.Student;
import com.internify.entity.User;
import com.internify.entity.UserType;
import com.internify.exception.BadRequestException;
import com.internify.repository.RecruiterRepository;
import com.internify.repository.StudentRepository;
import com.internify.repository.UserRepository;
import com.internify.security.JwtTokenProvider;
import com.internify.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final RecruiterRepository recruiterRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository, RecruiterRepository recruiterRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.recruiterRepository = recruiterRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public void registerStudent(String email, String password, String name) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already taken!");
        }
        Student student = new Student();
        student.setEmail(email);
        student.setPassword(passwordEncoder.encode(password));
        student.setUserType(UserType.STUDENT);
        student.setName(name);

        userRepository.save(student);
    }

    public void registerRecruiter(String email, String password, String organizationName, String organizationType) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already taken!");
        }
        Recruiter recruiter = new Recruiter();
        recruiter.setEmail(email);
        recruiter.setPassword(passwordEncoder.encode(password));
        recruiter.setUserType(UserType.RECRUITER);
        recruiter.setOrganizationName(organizationName);
        recruiter.setOrganizationType(organizationType);

        userRepository.save(recruiter);
    }

    // For Admin registration (can be done manually or via a secure endpoint)
    public void registerAdmin(String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already taken!");
        }
        User admin = new User();
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setUserType(UserType.ADMIN);
        userRepository.save(admin);
    }


    public Map<String, String> authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Map<String, String> response = new HashMap<>();
        response.put("token", jwt);
        response.put("userId", String.valueOf(userPrincipal.getId()));
        response.put("userType", userPrincipal.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "")); // Return just STUDENT/RECRUITER/ADMIN
        return response;
    }
}