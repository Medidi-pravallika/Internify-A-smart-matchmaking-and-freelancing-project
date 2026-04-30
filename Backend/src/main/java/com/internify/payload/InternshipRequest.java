package com.internify.payload;

import lombok.Data;

@Data
public class InternshipRequest {
    private String title;
    private String description;
    private String requirements;
    // Note: jdFile will be passed as MultipartFile in controller, not in DTO
}