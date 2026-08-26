package com.example.isa.controllers;

import com.example.isa.entities.Lesson;
import com.example.isa.services.LessonService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
@CrossOrigin(origins = "*")
public class LessonController {

    private final LessonService lessonService;

    public LessonController(LessonService lessonService) {
        this.lessonService = lessonService;
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Lesson>> getByCourseId(@PathVariable Long courseId) {
        return ResponseEntity.ok(lessonService.getLessonsByCourseId(courseId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getById(@PathVariable Long id) {
        return ResponseEntity.ok(lessonService.getLessonById(id));
    }

    @PostMapping
    public ResponseEntity<Lesson> create(@RequestBody Lesson lesson) {
        return ResponseEntity.ok(lessonService.createLesson(lesson));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.noContent().build();
    }
}