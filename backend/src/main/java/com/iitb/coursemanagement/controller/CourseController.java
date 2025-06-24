package com.iitb.coursemanagement.controller;

import com.iitb.coursemanagement.model.Course;
import com.iitb.coursemanagement.repository.CourseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Course Management", description = "APIs for managing courses and their prerequisites")
public class CourseController {
    
    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Operation(
        summary = "Create a new course",
        description = "Creates a new course with optional prerequisites. Prerequisites must exist in the system."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Course created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid request - missing required fields or invalid prerequisites"),
        @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    @PostMapping
    @Transactional
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        try {
            logger.debug("Attempting to create course: {}", course);
            
            // Validate required fields
            if (course.getCourseId() == null || course.getCourseId().trim().isEmpty() ||
                course.getTitle() == null || course.getTitle().trim().isEmpty()) {
                logger.warn("Invalid course data - missing required fields");
                return ResponseEntity.badRequest().body("Course ID and title are required");
            }

            // Check if course with same ID already exists
            Optional<Course> existingCourse = courseRepository.findByCourseId(course.getCourseId());
            if (existingCourse.isPresent()) {
                logger.warn("Course with ID {} already exists", course.getCourseId());
                return ResponseEntity.badRequest().body("Course with this ID already exists");
            }

            // Initialize prerequisites list if null
            if (course.getPrerequisites() == null) {
                course.setPrerequisites(new ArrayList<>());
            }

            // Validate and set prerequisites
            if (!course.getPrerequisites().isEmpty()) {
                Set<String> prereqIds = course.getPrerequisites().stream()
                    .map(Course::getCourseId)
                    .collect(Collectors.toSet());

                logger.debug("Validating prerequisites: {}", prereqIds);

                // Check if all prerequisites exist
                List<Course> foundPrereqs = courseRepository.findByCourseIdIn(prereqIds);
                if (foundPrereqs.size() != prereqIds.size()) {
                    logger.warn("One or more prerequisites not found: {}", prereqIds);
                    return ResponseEntity.badRequest().body("One or more prerequisites do not exist");
                }

                // Set the actual prerequisite objects
                course.setPrerequisites(foundPrereqs);
            }

            logger.debug("Saving course with prerequisites");
            Course savedCourse = courseRepository.save(course);
            
            URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(savedCourse.getId())
                .toUri();

            logger.info("Successfully created course: {}", savedCourse.getCourseId());
            return ResponseEntity.created(location).body(savedCourse);
            
        } catch (Exception e) {
            logger.error("Error creating course", e);
            return ResponseEntity.internalServerError()
                .body("Failed to create course: " + e.getMessage());
        }
    }
    
    @Operation(
        summary = "Get all courses",
        description = "Retrieves all courses with their prerequisites"
    )
    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        try {
            List<Course> courses = courseRepository.findAll();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            logger.error("Error retrieving courses", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(
        summary = "Get course by ID",
        description = "Retrieves a specific course by its ID including prerequisites"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Course found"),
        @ApiResponse(responseCode = "404", description = "Course not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> getCourseById(@PathVariable Long id) {
        try {
            return courseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            logger.error("Error retrieving course with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Operation(
        summary = "Delete course",
        description = "Deletes a course if it's not a prerequisite for any other course"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Course deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Course not found"),
        @ApiResponse(responseCode = "409", description = "Course cannot be deleted as it's a prerequisite for other courses")
    })
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            Optional<Course> course = courseRepository.findById(id);
            
            if (course.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // Check if this course is a prerequisite for any other course
            List<Course> dependentCourses = courseRepository.findByPrerequisitesContaining(course.get());
            if (!dependentCourses.isEmpty()) {
                return ResponseEntity
                    .status(409)
                    .body("Cannot delete course as it is a prerequisite for other courses: " + 
                        dependentCourses.stream()
                            .map(Course::getCourseId)
                            .collect(Collectors.joining(", ")));
            }

            courseRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error deleting course with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}