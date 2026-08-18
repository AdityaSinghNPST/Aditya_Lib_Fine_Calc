package com.library.Aditya_Lib_Fine_Calc.user.controller;

import com.library.Aditya_Lib_Fine_Calc.user.model.Role;
import com.library.Aditya_Lib_Fine_Calc.user.model.User;
import com.library.Aditya_Lib_Fine_Calc.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    // Service layer that contains user business logic.
    private final UserService userService;

    // Constructor injection.
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users.
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {

        List<User> users = userService.getAllUsers();

        return ResponseEntity.ok(users);
    }

    // Get one user by ID.
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {

        User user = userService.findUserById(id);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(user);
    }

    // Create a new user.
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {

        User user = userService.createUser(
                request.name(),
                request.email(),
                request.password(),
                request.role()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    // Request body used for creating a user.
    public record CreateUserRequest(
            String name,
            String email,
            String password,
            Role role
    ) {
    }
}