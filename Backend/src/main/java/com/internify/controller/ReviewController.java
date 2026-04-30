package com.internify.controller;

import com.internify.entity.Review;
import com.internify.payload.ReviewRequest;
import com.internify.security.UserPrincipal;
import com.internify.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request, @AuthenticationPrincipal UserPrincipal currentUser) {
        System.out.println(">>> ReviewController - createReview called");
        System.out.println(">>> Current user: " + (currentUser != null ? currentUser.getUsername() : "null"));
        System.out.println(">>> Current user authorities: " + (currentUser != null ? currentUser.getAuthorities() : "null"));
        System.out.println(">>> Request data: " + request);
        
        // Check if user is authenticated
        if (currentUser == null) {
            System.out.println(">>> ERROR: No authenticated user found!");
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        Review review = reviewService.createReview(request, currentUser);
        System.out.println(">>> Review created successfully: " + review.getId());
        return new ResponseEntity<>(review, HttpStatus.CREATED);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getReviewsForUser(@PathVariable Long userId) {
        List<Review> reviews = reviewService.getReviewsForUser(userId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<List<Review>> getReviewsByCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        List<Review> reviews = reviewService.getReviewsByUser(currentUser.getId());
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<String> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully.");
    }
}