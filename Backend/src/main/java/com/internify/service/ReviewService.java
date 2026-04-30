package com.internify.service;

import com.internify.entity.Internship;
import com.internify.entity.Review;
import com.internify.entity.User;
import com.internify.exception.BadRequestException;
import com.internify.exception.ResourceNotFoundException;
import com.internify.payload.ReviewRequest;
import com.internify.repository.InternshipRepository;
import com.internify.repository.ReviewRepository;
import com.internify.repository.UserRepository;
import com.internify.security.UserPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final InternshipRepository internshipRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository, InternshipRepository internshipRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
        this.internshipRepository = internshipRepository;
    }

    public Review createReview(ReviewRequest request, UserPrincipal currentUser) {
        User reviewer = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewer not found with ID: " + currentUser.getId()));

        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new ResourceNotFoundException("Reviewee not found with ID: " + request.getRevieweeId()));

        Internship internship = null;
        if (request.getInternshipId() != null) {
            internship = internshipRepository.findById(request.getInternshipId())
                    .orElseThrow(() -> new ResourceNotFoundException("Internship not found with ID: " + request.getInternshipId()));
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BadRequestException("Rating must be between 1 and 5.");
        }

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewee(reviewee);
        review.setInternship(internship);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());
        review.setStatus(Review.ReviewStatus.PENDING);

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsForUser(Long userId) {
        User reviewee = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return reviewRepository.findByReviewee(reviewee);
    }

    public List<Review> getReviewsByUser(Long userId) {
        User reviewer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
        return reviewRepository.findByReviewer(reviewer);
    }

    public void deleteReview(Long reviewId) {
        if (!reviewRepository.existsById(reviewId)) {
            throw new ResourceNotFoundException("Review not found with ID: " + reviewId);
        }
        reviewRepository.deleteById(reviewId);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review approveReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        review.setStatus(Review.ReviewStatus.APPROVED);
        return reviewRepository.save(review);
    }

    public Review rejectReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with ID: " + reviewId));
        review.setStatus(Review.ReviewStatus.REJECTED);
        return reviewRepository.save(review);
    }

    public Review createReviewDirect(Review review) {
        return reviewRepository.save(review);
    }
}