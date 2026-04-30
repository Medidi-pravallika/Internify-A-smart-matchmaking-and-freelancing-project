package com.internify.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Entity
@Table(name = "students")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Student extends User {
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    private User user;

    private String name;
    private String skills;
    
    @JsonProperty("resume")
    private String resumePath;

    @Transient
    private Double matchScore;

    @Transient
    private String createdAt;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Application> applications;
    
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FreelanceApplication> freelanceApplications;
}