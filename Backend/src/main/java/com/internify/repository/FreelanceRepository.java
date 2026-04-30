package com.internify.repository;

import com.internify.entity.Freelance;
import com.internify.entity.Recruiter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FreelanceRepository extends JpaRepository<Freelance, Long> {
    List<Freelance> findByPostedBy(Recruiter recruiter);
    List<Freelance> findByStatus(String status);
}