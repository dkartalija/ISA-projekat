package com.example.isa.services;

import com.example.isa.entities.Enrollment;
import com.example.isa.repositories.IEnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentService {

    private final IEnrollmentRepository enrollmentRepository;

    public EnrollmentService(IEnrollmentRepository enrollmentRepository) {
        this.enrollmentRepository = enrollmentRepository;
    }

    public Enrollment enrollStudent(Enrollment enrollment) {
        return enrollmentRepository.save(enrollment);
    }

    public List<Enrollment> getEnrollmentsByUserId(Long userId) {
        return enrollmentRepository.findByUserId(userId);
    }

    public List<Enrollment> getEnrollmentsByCourseId(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId);
    }
}