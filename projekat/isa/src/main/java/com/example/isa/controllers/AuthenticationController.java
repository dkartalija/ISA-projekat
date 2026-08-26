package com.example.isa.controllers;

import com.example.isa.entities.User;
import com.example.isa.models.LogInUserModel;
import com.example.isa.models.LoginResponse;
import com.example.isa.models.RegisterUserModel;
import com.example.isa.services.AuthenticationService;
import com.example.isa.services.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthenticationController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<User> register(@RequestBody RegisterUserModel registerUserDto) {
        User registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> authenticate(@RequestBody LogInUserModel loginUserDto) {
        User authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);

        LoginResponse loginResponse = LoginResponse.builder()
                .token(jwtToken)
                .expiresIn(jwtService.getExpirationTime())
                .role(authenticatedUser.getRole())
                .build();

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody Map<String, String> request) {
        String token = request.get("refreshToken");

        String userEmail = jwtService.extractUsername(token);
        User user = authenticationService.findByEmail(userEmail);

        String newToken = jwtService.generateToken(user);

        LoginResponse response = LoginResponse.builder()
                .token(newToken)
                .expiresIn(jwtService.getExpirationTime())
                .role(user.getRole())
                .build();

        return ResponseEntity.ok(response);
    }
}