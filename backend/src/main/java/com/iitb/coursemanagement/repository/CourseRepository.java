package com.iitb.coursemanagement.repository;

import com.iitb.coursemanagement.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCourseId(String courseId);
    List<Course> findByCourseIdIn(Set<String> courseIds);
    List<Course> findByPrerequisitesContaining(Course course);
} 