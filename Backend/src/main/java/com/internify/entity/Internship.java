package com.internify.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "internships")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Internship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String requirements;
    private String jdPath;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by")
    private Recruiter postedBy;
    
    private LocalDateTime postedDate;
    private String status;
    
    // Additional fields for frontend compatibility
    private String skills;
    private String duration;
    private String location;
    private String stipend;
    
    // Transient methods for frontend compatibility
    @Transient
    public String getCreatedAt() {
        return postedDate != null ? postedDate.toString() : null;
    }
    
    @Transient
    public String getRecruiterOrgName() {
        return postedBy != null ? postedBy.getOrganizationName() : "Unknown";
    }
}