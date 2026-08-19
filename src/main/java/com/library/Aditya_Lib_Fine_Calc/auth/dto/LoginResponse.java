package com.library.Aditya_Lib_Fine_Calc.auth.dto;

public record LoginResponse(
        String token,
        Long userId,
        String name,
        String email,
        String role
) {
}