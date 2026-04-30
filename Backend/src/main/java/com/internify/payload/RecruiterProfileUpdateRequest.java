package com.internify.payload;

import lombok.Data;

@Data
public class RecruiterProfileUpdateRequest {
    private String organizationName;
    private String organizationType;
}