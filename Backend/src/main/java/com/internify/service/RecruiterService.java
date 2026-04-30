package com.internify.service;

import com.internify.entity.Recruiter;
import com.internify.entity.User;
import com.internify.exception.ResourceNotFoundException;
import com.internify.payload.RecruiterProfileUpdateRequest;
import com.internify.repository.RecruiterRepository;
import com.internify.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RecruiterService {

    private final RecruiterRepository recruiterRepository;
    private final UserRepository userRepository;

    public RecruiterService(RecruiterRepository recruiterRepository, UserRepository userRepository) {
        this.recruiterRepository = recruiterRepository;
        this.userRepository = userRepository;
    }

    public Recruiter getRecruiterProfile(Long userId) {
        return recruiterRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with ID: " + userId));
    }

    public Recruiter updateRecruiterProfile(Long userId, RecruiterProfileUpdateRequest updateRequest) {
        Recruiter recruiter = recruiterRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found with ID: " + userId));

        Optional.ofNullable(updateRequest.getOrganizationName()).ifPresent(recruiter::setOrganizationName);
        Optional.ofNullable(updateRequest.getOrganizationType()).ifPresent(recruiter::setOrganizationType);

        return recruiterRepository.save(recruiter);
    }
}