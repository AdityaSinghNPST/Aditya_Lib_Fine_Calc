package com.library.Aditya_Lib_Fine_Calc.auth.service;

import com.library.Aditya_Lib_Fine_Calc.auth.dto.LoginRequest;
import com.library.Aditya_Lib_Fine_Calc.auth.dto.LoginResponse;
import com.library.Aditya_Lib_Fine_Calc.security.JwtService;
import com.library.Aditya_Lib_Fine_Calc.user.model.User;
import com.library.Aditya_Lib_Fine_Calc.user.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserService userService;

    private final JwtService jwtService;

    public AuthService(
            UserService userService,
            JwtService jwtService
    ) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // Authenticate a user and generate a JWT.
    public LoginResponse login(LoginRequest request) {

        // Find user using email.
        User user =
                userService.findUserByEmail(
                        request.email()
                );

        // User doesn't exist.
        if (user == null) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        // Check the password using BCrypt.
        boolean passwordMatches =
                userService.checkPassword(
                        request.password(),
                        user.getPassword()
                );

        // Password is incorrect.
        if (!passwordMatches) {

            throw new IllegalArgumentException(
                    "Invalid email or password"
            );
        }

        // Generate JWT.
        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole().name()
                );

        // Return login response.
        return new LoginResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}