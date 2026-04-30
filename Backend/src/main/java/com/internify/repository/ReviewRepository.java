package com.internify.repository;

import com.internify.entity.Review;
import com.internify.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByReviewee(User reviewee);
    List<Review> findByReviewer(User reviewer);
}