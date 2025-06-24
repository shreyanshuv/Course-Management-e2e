package com.iitb.coursemanagement.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "course_instance",
       uniqueConstraints = @UniqueConstraint(columnNames = {"year", "semester", "course_code"}))
public class CourseInstance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"instances", "prerequisites"})
    private Course course;

    @Column(name = "course_code", nullable = false)
    private String courseId;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private String instructor;

    // Default constructor
    public CourseInstance() {
    }

    // Constructor with fields
    public CourseInstance(Course course, Integer year, Integer semester, String instructor) {
        this.setCourse(course);
        this.year = year;
        this.semester = semester;
        this.instructor = instructor;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
        this.courseId = course != null ? course.getCourseId() : null;
    }

    public String getCourseId() {
        return courseId;
    }

    public void setCourseId(String courseId) {
        this.courseId = courseId;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getSemester() {
        return semester;
    }

    public void setSemester(Integer semester) {
        this.semester = semester;
    }

    public String getInstructor() {
        return instructor;
    }

    public void setInstructor(String instructor) {
        this.instructor = instructor;
    }

    // Add custom JSON properties for course details
    @JsonProperty("courseTitle")
    public String getCourseTitle() {
        return course != null ? course.getTitle() : null;
    }

    @JsonProperty("courseDescription")
    public String getCourseDescription() {
        return course != null ? course.getDescription() : null;
    }

    @Override
    public String toString() {
        return "CourseInstance{" +
                "id=" + id +
                ", courseId='" + courseId + '\'' +
                ", year=" + year +
                ", semester=" + semester +
                ", instructor='" + instructor + '\'' +
                '}';
    }
} 