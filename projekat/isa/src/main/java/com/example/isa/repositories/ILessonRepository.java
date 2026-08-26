package com.example.isa.repositories;

import com.example.isa.entities.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ILessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByCourseIdOrderByOrderIndexAsc(Long courseId);
}