package com.internify.payload;

import lombok.Data;

@Data
public class ApplicationStatusUpdateRequest {
    private String status; // e.g., "ACCEPTED", "REJECTED", "REVIEWED"
}