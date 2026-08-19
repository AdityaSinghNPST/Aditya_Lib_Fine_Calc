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

    // =========================================================
    // GET ALL USERS
    // =========================================================

    public List<User> getAllUsers() {

        return userStorageService.getAllUsers();
    }

    // =========================================================
    // FIND USER BY ID
    // =========================================================

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

    // =========================================================
    // FIND USER BY EMAIL
    // =========================================================

    public User findUserByEmail(String email) {

        if (email == null) {
            return null;
        }

        List<User> users =
                userStorageService.getAllUsers();

        for (User user : users) {

            if (user.getEmail() != null
                    && user.getEmail()
                    .equalsIgnoreCase(email.trim())) {

                return user;
            }
        }

        return null;
    }

    // =========================================================
    // CREATE USER
    // =========================================================

    public User createUser(
            String name,
            String email,
            String password,
            Role role
    ) {

        // Validate the input.
        validateUserData(
                name,
                email,
                password,
                role
        );

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

                nextId =
                        user.getId() + 1;
            }
        }

        // Hash the password before storing it.
        String encodedPassword =
                passwordEncoder.encode(password);

        // Create the user.
        User newUser =
                new User(
                        nextId,
                        name.trim(),
                        email.trim(),
                        encodedPassword,
                        role
                );

        // Add the user.
        users.add(newUser);

        // Save users.
        userStorageService.saveAllUsers(users);

        return newUser;
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    public User updateUser(
            Long id,
            String name,
            String email,
            String password,
            Role role
    ) {

        // Find the existing user.
        User existingUser =
                findUserById(id);

        if (existingUser == null) {

            return null;
        }

        // Validate name.
        if (name == null
                || name.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Name cannot be empty"
            );
        }

        // Validate email.
        validateEmail(email);

        // Role is required.
        if (role == null) {

            throw new IllegalArgumentException(
                    "Role is required"
            );
        }

        // Check whether another user already
        // uses this email.
        User userWithSameEmail =
                findUserByEmail(email);

        if (userWithSameEmail != null
                && !userWithSameEmail
                .getId()
                .equals(id)) {

            throw new IllegalArgumentException(
                    "A user with this email already exists"
            );
        }

        // Update name.
        existingUser.setName(
                name.trim()
        );

        // Update email.
        existingUser.setEmail(
                email.trim()
        );

        // Update role.
        existingUser.setRole(role);

        // Password is optional during update.
        //
        // If password is provided, replace it.
        // If password is empty/null, keep the old password.
        if (password != null
                && !password.trim().isEmpty()) {

            validatePassword(password);

            existingUser.setPassword(
                    passwordEncoder.encode(password)
            );
        }

        // Save updated users.
        List<User> users =
                userStorageService.getAllUsers();

        for (int i = 0;
             i < users.size();
             i++) {

            if (users.get(i).getId()
                    .equals(id)) {

                users.set(
                        i,
                        existingUser
                );

                break;
            }
        }

        userStorageService.saveAllUsers(users);

        return existingUser;
    }

    // =========================================================
    // DELETE USER
    // =========================================================

    public boolean deleteUser(Long id) {

        List<User> users =
                userStorageService.getAllUsers();

        boolean removed =
                users.removeIf(
                        user ->
                                user.getId() != null
                                        && user.getId()
                                        .equals(id)
                );

        if (!removed) {

            return false;
        }

        userStorageService.saveAllUsers(users);

        return true;
    }

    // =========================================================
    // PASSWORD CHECK
    // =========================================================

    public boolean checkPassword(
            String rawPassword,
            String encodedPassword
    ) {

        return passwordEncoder.matches(
                rawPassword,
                encodedPassword
        );
    }

    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateUserData(
            String name,
            String email,
            String password,
            Role role
    ) {

        // Validate name.
        if (name == null
                || name.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Name cannot be empty"
            );
        }

        // Validate email.
        validateEmail(email);

        // Validate password.
        validatePassword(password);

        // Validate role.
        if (role == null) {

            throw new IllegalArgumentException(
                    "Role is required"
            );
        }
    }

    // Validate email format.
    private void validateEmail(String email) {

        if (email == null
                || email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email cannot be empty"
            );
        }

        String emailRegex =
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";

        if (!email.trim().matches(emailRegex)) {

            throw new IllegalArgumentException(
                    "Invalid email format"
            );
        }
    }

    // Validate password.
    private void validatePassword(String password) {

        if (password == null
                || password.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Password cannot be empty"
            );
        }

        if (password.length() < 6) {

            throw new IllegalArgumentException(
                    "Password must contain at least 6 characters"
            );
        }
    }
}