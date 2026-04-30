package com.internify.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id")
    private Internship internship;

    @Column(nullable = false)
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDateTime reviewDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReviewStatus status = ReviewStatus.PENDING;

    public enum ReviewStatus {
        PENDING, APPROVED, REJECTED
    }
}