package com.library.Aditya_Lib_Fine_Calc.user.service;

import com.library.Aditya_Lib_Fine_Calc.user.model.Role;
import com.library.Aditya_Lib_Fine_Calc.user.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserStorageService userStorageService;

    private final PasswordEncoder passwordEncoder;

    public UserService(
            UserStorageService userStorageService,
            PasswordEncoder passwordEncoder
    ) {
        this.userStorageService = userStorageService;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all users.
    public List<User> getAllUsers() {

        return userStorageService.getAllUsers();
    }

    // Find a user by ID.
    public User findUserById(Long id) {

        List<User> users =
                userStorageService.getAllUsers();

        for (User user : users) {

            if (user.getId() != null
                    && user.getId().equals(id)) {

                return user;
            }
        }

        return null;
    }

    // Find a user by email.
    public User findUserByEmail(String email) {

        List<User> users =
                userStorageService.getAllUsers();

        for (User user : users) {

            if (user.getEmail() != null
                    && user.getEmail().equalsIgnoreCase(email)) {

                return user;
            }
        }

        return null;
    }

    // Create a new user/member.
    public User createUser(
            String name,
            String email,
            String password,
            Role role
    ) {

        // Prevent duplicate email addresses.
        if (findUserByEmail(email) != null) {

            throw new IllegalArgumentException(
                    "A user with this email already exists"
            );
        }

        List<User> users =
                userStorageService.getAllUsers();

        // Generate the next user ID.
        long nextId = 1;

        for (User user : users) {

            if (user.getId() != null
                    && user.getId() >= nextId) {

                nextId = user.getId() + 1;
            }
        }

        // Hash the password before storing it.
        String encodedPassword =
                passwordEncoder.encode(password);

        // Create the user.
        User newUser = new User(
                nextId,
                name,
                email,
                encodedPassword,
                role
        );

        // Save the user.
        users.add(newUser);

        userStorageService.saveAllUsers(users);

        return newUser;
    }

    // Check whether a raw password matches the stored hash.
    public boolean checkPassword(
            String rawPassword,
            String encodedPassword
    ) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }
}