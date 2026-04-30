package com.internify.payload;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class ApplicationWithStudentDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;
    private String studentSkills;
    private String status;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime applicationDate;
    
    private Double matchScore;

    // Default constructor
    public ApplicationWithStudentDTO() {}

    // Constructor
    public ApplicationWithStudentDTO(Long id, Long studentId, String studentName, String studentEmail, 
                                   String studentSkills, String status, LocalDateTime applicationDate, Double matchScore) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.studentSkills = studentSkills;
        this.status = status;
        this.applicationDate = applicationDate;
        this.matchScore = matchScore;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getStudentName() { return studentName; }
    public void setStudentName(String studentName) { this.studentName = studentName; }

    public String getStudentEmail() { return studentEmail; }
    public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

    public String getStudentSkills() { return studentSkills; }
    public void setStudentSkills(String studentSkills) { this.studentSkills = studentSkills; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getApplicationDate() { return applicationDate; }
    public void setApplicationDate(LocalDateTime applicationDate) { this.applicationDate = applicationDate; }

    public Double getMatchScore() { return matchScore; }
    public void setMatchScore(Double matchScore) { this.matchScore = matchScore; }
}