package com.internify.payload;

import lombok.Data;

@Data
public class StudentRegisterRequest {
    private String name;
    private String email;
    private String password;
}