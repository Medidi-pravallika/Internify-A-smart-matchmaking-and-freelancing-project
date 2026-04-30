package com.internify.repository;

import com.internify.entity.Internship;
import com.internify.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InternshipRepository extends JpaRepository<Internship, Long> {
    List<Internship> findByPostedBy(Recruiter recruiter);
    List<Internship> findByStatus(String status);
    long countByStatus(String status);
}