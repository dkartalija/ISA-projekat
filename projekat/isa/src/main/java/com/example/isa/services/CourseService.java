package com.example.isa.services;

import com.example.isa.entities.Course;
import com.example.isa.repositories.ICourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final ICourseRepository courseRepository;

    public CourseService(ICourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kurs nije pronađen za ID: " + id));
    }

    public List<Course> getCoursesByCategoryId(Long categoryId) {
        return courseRepository.findByCategoryId(categoryId);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = getCourseById(id);

        if (courseDetails.getTitle() != null) {
            course.setTitle(courseDetails.getTitle());
        }
        if (courseDetails.getDescription() != null) {
            course.setDescription(courseDetails.getDescription());
        }
        if (courseDetails.getCategory() != null) {
            course.setCategory(courseDetails.getCategory());
        }

        return courseRepository.save(course);
    }
}