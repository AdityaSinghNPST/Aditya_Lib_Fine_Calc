package com.library.Aditya_Lib_Fine_Calc.user.controller;

import com.library.Aditya_Lib_Fine_Calc.user.dto.UserResponse;
import com.library.Aditya_Lib_Fine_Calc.user.model.Role;
import com.library.Aditya_Lib_Fine_Calc.user.model.User;
import com.library.Aditya_Lib_Fine_Calc.user.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // Service layer containing user business logic.
    private final UserService userService;

    // Constructor injection.
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        // Get all users from the service.
        List<UserResponse> responses =
                userService.getAllUsers()
                        .stream()
                        .map(UserResponse::fromUser)
                        .collect(Collectors.toList());

        // Return the safe user response list.
        return ResponseEntity.ok(responses);
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id
    ) {

        // Find the user.
        User user =
                userService.findUserById(id);

        // User does not exist.
        if (user == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // Convert User to UserResponse.
        return ResponseEntity.ok(
                UserResponse.fromUser(user)
        );
    }

    // =========================================================
    // CREATE USER
    // =========================================================

    @PostMapping
    public ResponseEntity<UserResponse> createUser(
            @RequestBody CreateUserRequest request
    ) {

        // Create the user through the service.
        User user =
                userService.createUser(
                        request.name(),
                        request.email(),
                        request.password(),
                        request.role()
                );

        // Return 201 Created.
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        UserResponse.fromUser(user)
                );
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {

        // Update the existing user.
        User user =
                userService.updateUser(
                        id,
                        request.name(),
                        request.email(),
                        request.password(),
                        request.role()
                );

        // User does not exist.
        if (user == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // Return updated user without password.
        return ResponseEntity.ok(
                UserResponse.fromUser(user)
        );
    }

    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id
    ) {

        // Delete the user.
        boolean deleted =
                userService.deleteUser(id);

        // User does not exist.
        if (!deleted) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        // Successfully deleted.
        return ResponseEntity
                .noContent()
                .build();
    }

    // =========================================================
    // CREATE USER REQUEST
    // =========================================================

    public record CreateUserRequest(
            String name,
            String email,
            String password,
            Role role
    ) {
    }

    // =========================================================
    // UPDATE USER REQUEST
    // =========================================================

    public record UpdateUserRequest(
            String name,
            String email,
            String password,
            Role role
    ) {
    }
}