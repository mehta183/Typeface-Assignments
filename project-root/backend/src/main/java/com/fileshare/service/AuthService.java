package com.fileshare.service;

import com.fileshare.dto.request.LoginRequest;
import com.fileshare.dto.request.RegisterRequest;
import com.fileshare.dto.response.JwtResponse;
import com.fileshare.entity.User;
import com.fileshare.repository.UserRepository;
import com.fileshare.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) { throw new RuntimeException("Username already exists"); }
        if (userRepository.existsByEmail(request.getEmail())) { throw new RuntimeException("Email already exists"); }
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .enabled(true)
                .accountNonLocked(true)
                .build();
        user = userRepository.save(user);
        log.info("User registered successfully: {}", user.getUsername());
        String token = tokenProvider.generateTokenFromUsername(user.getUsername());
        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .expiresAt(LocalDateTime.ofInstant(tokenProvider.getExpirationDateFromToken(token).toInstant(), ZoneId.systemDefault()))
                .build();
    }

    @Transactional(readOnly = true)
    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        String token = tokenProvider.generateToken(authentication);
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));
        log.info("User logged in successfully: {}", user.getUsername());
        return JwtResponse.builder()
                .token(token)
                .type("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .expiresAt(LocalDateTime.ofInstant(tokenProvider.getExpirationDateFromToken(token).toInstant(), ZoneId.systemDefault()))
                .build();
    }
}
