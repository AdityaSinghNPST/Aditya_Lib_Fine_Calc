package com.library.Aditya_Lib_Fine_Calc.auth.controller;

import com.library.Aditya_Lib_Fine_Calc.auth.dto.LoginRequest;
import com.library.Aditya_Lib_Fine_Calc.auth.dto.LoginResponse;
import com.library.Aditya_Lib_Fine_Calc.auth.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Login endpoint.
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @RequestBody LoginRequest request
    ) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }
}