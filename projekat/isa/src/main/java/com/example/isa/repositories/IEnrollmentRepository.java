package com.example.isa.repositories;

import com.example.isa.entities.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface IEnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByUserId(Long userId);
    List<Enrollment> findByCourseId(Long courseId);
}