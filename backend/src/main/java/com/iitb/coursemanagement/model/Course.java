package com.iitb.coursemanagement.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "course")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "course_id", unique = true, nullable = false)
    private String courseId;  // e.g., CS 209
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "course_prerequisites",
        joinColumns = @JoinColumn(name = "course_id"),
        inverseJoinColumns = @JoinColumn(name = "prerequisite_id")
    )
    private List<Course> prerequisites = new ArrayList<>();

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<CourseInstance> instances = new ArrayList<>();

    // Default constructor
    public Course() {
        this.prerequisites = new ArrayList<>();
        this.instances = new ArrayList<>();
    }

    // Constructor with required fields
    public Course(String courseId, String title) {
        this.courseId = courseId;
        this.title = title;
        this.prerequisites = new ArrayList<>();
        this.instances = new ArrayList<>();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<Course> getPrerequisites() {
        return prerequisites;
    }

    public void setPrerequisites(List<Course> prerequisites) {
        this.prerequisites = prerequisites != null ? prerequisites : new ArrayList<>();
    }

    public List<CourseInstance> getInstances() {
        return instances;
    }

    public void setInstances(List<CourseInstance> instances) {
        this.instances = instances != null ? instances : new ArrayList<>();
    }

    // Helper method to add a prerequisite
    public void addPrerequisite(Course prerequisite) {
        if (prerequisite != null && !this.prerequisites.contains(prerequisite)) {
            this.prerequisites.add(prerequisite);
        }
    }

    // Helper method to remove a prerequisite
    public void removePrerequisite(Course prerequisite) {
        this.prerequisites.remove(prerequisite);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Course course = (Course) o;
        return Objects.equals(courseId, course.courseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseId);
    }

    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", courseId='" + courseId + '\'' +
                ", title='" + title + '\'' +
                '}';
    }
} 