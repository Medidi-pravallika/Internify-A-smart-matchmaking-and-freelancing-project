package com.internify.payload;

import com.internify.entity.User;
import com.internify.entity.Student;
import com.internify.entity.Recruiter;
import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String role;
    private String name;
    private String orgName;

    public UserDTO(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getUserType().name();
        
        if (user instanceof Student) {
            Student student = (Student) user;
            this.name = student.getName();
        } else if (user instanceof Recruiter) {
            Recruiter recruiter = (Recruiter) user;
            this.orgName = recruiter.getOrganizationName();
        }
    }
}