package com.iitb.coursemanagement.controller;

import com.iitb.coursemanagement.model.Course;
import com.iitb.coursemanagement.model.CourseInstance;
import com.iitb.coursemanagement.repository.CourseInstanceRepository;
import com.iitb.coursemanagement.repository.CourseRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Optional;
import java.util.Calendar;

@RestController
@RequestMapping("/api/instances")
@Tag(name = "Course Instance Management", description = "APIs for managing course instances")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CourseInstanceController {

    @Autowired
    private CourseInstanceRepository instanceRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Operation(
        summary = "Create a course instance",
        description = "Creates a new instance of a course delivery for a specific year and semester"
    )
    @PostMapping(
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> createInstance(@RequestBody CourseInstance instance) {
        try {
            // Validate required fields
            if (instance.getCourseId() == null || instance.getCourseId().trim().isEmpty() ||
                instance.getYear() == null || instance.getSemester() == null ||
                instance.getInstructor() == null || instance.getInstructor().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Course ID, year, semester, and instructor are required");
            }

            // Validate year format (YYYY)
            if (instance.getYear() < 2000 || instance.getYear() > 2100) {
                return ResponseEntity.badRequest().body("Year must be in YYYY format between 2000 and 2100");
            }

            // Validate semester value
            if (instance.getSemester() != 1 && instance.getSemester() != 2) {
                return ResponseEntity.badRequest().body("Semester must be either 1 or 2");
            }

            // Find the associated course
            Optional<Course> course = courseRepository.findByCourseId(instance.getCourseId());
            if (course.isEmpty()) {
                return ResponseEntity.badRequest().body("Course not found: " + instance.getCourseId());
            }

            // Check if instance already exists
            Optional<CourseInstance> existingInstance = instanceRepository
                .findByYearAndSemesterAndCourseId(instance.getYear(), instance.getSemester(), instance.getCourseId());
            if (existingInstance.isPresent()) {
                return ResponseEntity.badRequest().body("Course instance already exists for this year and semester");
            }

            // Set the course and save the instance
            instance.setCourse(course.get());
            CourseInstance savedInstance = instanceRepository.save(instance);

            URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{year}/{semester}/{courseId}")
                .buildAndExpand(
                    savedInstance.getYear(),
                    savedInstance.getSemester(),
                    savedInstance.getCourseId())
                .toUri();

            return ResponseEntity.created(location).body(savedInstance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to create course instance: " + e.getMessage());
        }
    }

    @Operation(
        summary = "Get instances by year and semester",
        description = "Retrieves all course instances for a specific year and semester"
    )
    @GetMapping(
        value = "/{year}/{semester}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<List<CourseInstance>> getInstancesByYearAndSemester(
            @PathVariable Integer year,
            @PathVariable Integer semester) {
        
        // Validate year format
        if (year < 2000 || year > 2100) {
            return ResponseEntity.badRequest().build();
        }

        // Validate semester
        if (semester != 1 && semester != 2) {
            return ResponseEntity.badRequest().build();
        }

        List<CourseInstance> instances = instanceRepository.findByYearAndSemester(year, semester);
        return ResponseEntity.ok(instances);
    }

    @Operation(
        summary = "Get specific instance",
        description = "Retrieves a specific course instance by year, semester, and course ID"
    )
    @GetMapping(
        value = "/{year}/{semester}/{courseId}",
        produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<?> getInstance(
            @PathVariable Integer year,
            @PathVariable Integer semester,
            @PathVariable String courseId) {
        
        // Validate year and semester
        if (year < 2000 || year > 2100 || (semester != 1 && semester != 2)) {
            return ResponseEntity.badRequest().body("Invalid year or semester");
        }

        Optional<CourseInstance> instance = instanceRepository
            .findByYearAndSemesterAndCourseId(year, semester, courseId);
        
        return instance
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @Operation(
        summary = "Delete instance",
        description = "Deletes a specific course instance"
    )
    @DeleteMapping("/{year}/{semester}/{courseId}")
    public ResponseEntity<?> deleteInstance(
            @PathVariable Integer year,
            @PathVariable Integer semester,
            @PathVariable String courseId) {
        
        // Validate year and semester
        if (year < 2000 || year > 2100 || (semester != 1 && semester != 2)) {
            return ResponseEntity.badRequest().body("Invalid year or semester");
        }

        Optional<CourseInstance> instance = instanceRepository
            .findByYearAndSemesterAndCourseId(year, semester, courseId);
        
        if (instance.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        instanceRepository.delete(instance.get());
        return ResponseEntity.ok().build();
    }
} 