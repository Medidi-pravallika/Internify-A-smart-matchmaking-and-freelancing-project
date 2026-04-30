package com.internify.payload;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StudentApplicationDTO {
    private Long id;
    private String name;
    private String email;
    private String skills;
    
    @JsonProperty("resume") 
    private String resumePath;
    
    private Double matchScore;
    private String createdAt;
    
    // Application specific data
    private Long applicationId;
    private String applicationStatus;
    private Long internshipId;
    private String internshipTitle;

    // Default constructor
    public StudentApplicationDTO() {}

    // Constructor
    public StudentApplicationDTO(Long id, String name, String email, String skills, String resumePath, 
                                 Long applicationId, String applicationStatus, Long internshipId, String internshipTitle) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.skills = skills;
        this.resumePath = resumePath;
        this.applicationId = applicationId;
        this.applicationStatus = applicationStatus;
        this.internshipId = internshipId;
        this.internshipTitle = internshipTitle;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }

    public String getApplicationStatus() { return applicationStatus; }
    public void setApplicationStatus(String applicationStatus) { this.applicationStatus = applicationStatus; }

    public Long getInternshipId() { return internshipId; }
    public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }

    public String getInternshipTitle() { return internshipTitle; }
    public void setInternshipTitle(String internshipTitle) { this.internshipTitle = internshipTitle; }
}