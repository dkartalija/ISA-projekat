package com.example.isa.models;

import lombok.Data;

@Data
public class RegisterUserModel {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String contactNumber;
}