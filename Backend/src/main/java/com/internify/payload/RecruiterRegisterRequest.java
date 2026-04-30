package com.internify.payload;

import lombok.Data;

@Data
public class RecruiterRegisterRequest {
    private String organizationName;
    private String organizationType;
    private String email;
    private String password;
}