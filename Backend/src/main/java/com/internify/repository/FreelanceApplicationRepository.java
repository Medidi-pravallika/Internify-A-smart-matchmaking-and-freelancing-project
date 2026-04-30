package com.internify.repository;

import com.internify.entity.Freelance;
import com.internify.entity.FreelanceApplication;
import com.internify.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FreelanceApplicationRepository extends JpaRepository<FreelanceApplication, Long> {
    Optional<FreelanceApplication> findByStudentAndFreelance(Student student, Freelance freelance);
    List<FreelanceApplication> findByStudent(Student student);
    List<FreelanceApplication> findByFreelance(Freelance freelance);
    long countByStatus(String status);
}