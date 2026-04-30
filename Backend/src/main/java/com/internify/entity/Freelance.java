package com.internify.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "freelance_gigs")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Freelance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String requirements;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by")
    private Recruiter postedBy;
    
    private LocalDateTime postedDate;
    private String status;
    
    @OneToMany(mappedBy = "freelance", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FreelanceApplication> applications;
}