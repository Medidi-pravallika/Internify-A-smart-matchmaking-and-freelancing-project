package com.internify.service;

import com.internify.entity.Student;
import com.internify.entity.User;
import com.internify.exception.ResourceNotFoundException;
import com.internify.payload.StudentProfileUpdateRequest;
import com.internify.repository.StudentRepository;
import com.internify.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public StudentService(StudentRepository studentRepository, UserRepository userRepository, FileStorageService fileStorageService) {
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public Student getStudentProfile(Long userId) {
        return studentRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + userId));
    }

    public Student updateStudentProfile(Long userId, StudentProfileUpdateRequest updateRequest, MultipartFile resumeFile) {
        Student student = studentRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + userId));

        Optional.ofNullable(updateRequest.getName()).ifPresent(student::setName);
        Optional.ofNullable(updateRequest.getSkills()).ifPresent(student::setSkills);

        if (resumeFile != null && !resumeFile.isEmpty()) {
            try {
                String resumePath = fileStorageService.storeFile(resumeFile, "resumes");
                student.setResumePath(resumePath);
            } catch (Exception e) {
                throw new RuntimeException("Failed to store resume file: " + e.getMessage());
            }
        }
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
}