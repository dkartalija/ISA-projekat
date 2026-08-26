package com.example.isa.services;

import com.example.isa.entities.Lesson;
import com.example.isa.repositories.ILessonRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LessonService {

    private final ILessonRepository lessonRepository;

    public LessonService(ILessonRepository lessonRepository) {
        this.lessonRepository = lessonRepository;
    }

    public List<Lesson> getLessonsByCourseId(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
    }

    public Lesson getLessonById(Long id) {
        return lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lekcija nije pronađena za ID: " + id));
    }

    public Lesson createLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }
}