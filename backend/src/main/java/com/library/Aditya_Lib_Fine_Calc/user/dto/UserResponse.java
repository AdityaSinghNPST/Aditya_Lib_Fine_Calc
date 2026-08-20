package com.library.Aditya_Lib_Fine_Calc.user.dto;

import com.library.Aditya_Lib_Fine_Calc.user.model.Role;
import com.library.Aditya_Lib_Fine_Calc.user.model.User;

public record UserResponse(
        Long id,
        String name,
        String email,
        Role role
) {

    // Convert User model into safe API response.
    public static UserResponse fromUser(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}