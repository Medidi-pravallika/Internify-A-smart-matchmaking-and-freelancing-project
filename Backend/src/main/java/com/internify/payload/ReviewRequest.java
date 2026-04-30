package com.internify.payload;

import lombok.Data;

@Data
public class ReviewRequest {
    private Long revieweeId;
    private Long internshipId; // Optional
    private Integer rating;
    private String comment;
}