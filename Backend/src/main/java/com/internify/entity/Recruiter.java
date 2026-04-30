package com.internify.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.util.List;

@Entity
@Table(name = "recruiters")
@PrimaryKeyJoinColumn(name = "id")
@Data
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Recruiter extends User {
    @OneToOne
    @MapsId
    @JoinColumn(name = "id")
    @JsonIgnore
    private User user;

    private String organizationName;
    private String organizationType;

    @OneToMany(mappedBy = "postedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Internship> internships;
    
    @OneToMany(mappedBy = "postedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Freelance> freelanceGigs;
}