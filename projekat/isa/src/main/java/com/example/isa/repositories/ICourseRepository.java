package com.example.isa.repositories;

import com.example.isa.entities.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ICourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCategoryId(Long categoryId);
}