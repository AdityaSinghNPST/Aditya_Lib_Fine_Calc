package com.library.Aditya_Lib_Fine_Calc.user.service;

import com.library.Aditya_Lib_Fine_Calc.user.model.Role;
import com.library.Aditya_Lib_Fine_Calc.user.model.User;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    // Storage service is responsible for reading and writing users.json.
    private final UserStorageService userStorageService;

    // Constructor injection.
    public UserService(UserStorageService userStorageService) {
        this.userStorageService = userStorageService;
    }

    // Return all users.
    public List<User> getAllUsers() {
        return userStorageService.getAllUsers();
    }

    // Find a user by ID.
    public User findUserById(Long id) {

        // Get all users from JSON.
        List<User> users = userStorageService.getAllUsers();

        // Search for the user with the requested ID.
        for (User user : users) {

            if (user.getId() != null && user.getId().equals(id)) {
                return user;
            }
        }

        // Return null when the user does not exist.
        return null;
    }

    // Find a user by email.
    public User findUserByEmail(String email) {

        // Get all users from JSON.
        List<User> users = userStorageService.getAllUsers();

        // Search through all users.
        for (User user : users) {

            // Compare emails without case sensitivity.
            if (user.getEmail() != null
                    && user.getEmail().equalsIgnoreCase(email)) {
                return user;
            }
        }

        // Return null when no matching user exists.
        return null;
    }

    // Create a new user.
    public User createUser(
            String name,
            String email,
            String password,
            Role role
    ) {

        // Get all existing users.
        List<User> users = userStorageService.getAllUsers();

        // Check whether the email is already registered.
        if (findUserByEmail(email) != null) {
            throw new IllegalArgumentException(
                    "A user with this email already exists."
            );
        }

        // Generate the next user ID.
        long nextId = 1;

        if (!users.isEmpty()) {

            // Find the highest existing ID.
            long maxId = 0;

            for (User user : users) {

                if (user.getId() != null && user.getId() > maxId) {
                    maxId = user.getId();
                }
            }

            nextId = maxId + 1;
        }

        // Create the new user.
        User newUser = new User(
                nextId,
                name,
                email,
                password,
                role
        );

        // Add the new user to the list.
        users.add(newUser);

        // Save the updated list back to users.json.
        userStorageService.saveAllUsers(users);

        // Return the newly created user.
        return newUser;
    }
}