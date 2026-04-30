package com.internify.repository;

import com.internify.entity.Application;
import com.internify.entity.Internship;
import com.internify.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByStudent(Student student);
    List<Application> findByInternship(Internship internship);
    Optional<Application> findByStudentAndInternship(Student student, Internship internship);
    long countByStatus(String status);
}