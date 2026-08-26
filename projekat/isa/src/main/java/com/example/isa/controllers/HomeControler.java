package com.example.isa.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeControler {

    @GetMapping("/")
    public String home() {
        return "Backend radi! Dobrodošli na API Akademije pčelarstva.";
    }
}