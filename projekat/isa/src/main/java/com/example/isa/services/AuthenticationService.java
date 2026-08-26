package com.example.isa.services;

import com.example.isa.entities.User;
import com.example.isa.models.LogInUserModel;
import com.example.isa.models.RegisterUserModel;
import com.example.isa.repositories.IUserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(
            IUserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // REGISTRACIJA
    public User signup(RegisterUserModel input) {
        if (userRepository.existsByEmail(input.getEmail())) {
            throw new RuntimeException("Korisnik sa ovim email-om već postoji!");
        }

        User user = User.builder()
                .email(input.getEmail())
                .password(passwordEncoder.encode(input.getPassword()))
                .firstName(input.getFirstName())
                .lastName(input.getLastName())
                .contactNumber(input.getContactNumber())
                .role("ROLE_USER")
                .build();

        return userRepository.save(user);
    }

    // PRIJAVA
    public User authenticate(LogInUserModel input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.getEmail(),
                        input.getPassword()
                )
        );

        return findByEmail(input.getEmail());
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Korisnik nije pronađen za email: " + email));
    }
}