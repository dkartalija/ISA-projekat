package com.example.isa.controllers;

import com.example.isa.entities.Enrollment;
import com.example.isa.services.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<Enrollment> enroll(@RequestBody Enrollment enrollment) {
        return ResponseEntity.ok(enrollmentService.enrollStudent(enrollment));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Enrollment>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByUserId(userId));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Enrollment>> getByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByCourseId(courseId));
    }
}