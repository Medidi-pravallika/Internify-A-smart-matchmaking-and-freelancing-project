package com.internify.payload;

import lombok.Data;

@Data
public class StudentProfileUpdateRequest {
    private String name;
    private String skills;
    // Note: resumeFile will be passed as MultipartFile in controller, not in DTO
}