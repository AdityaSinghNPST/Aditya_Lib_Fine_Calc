package com.library.Aditya_Lib_Fine_Calc.user.model;

public class User {

    // Unique ID of the user/member.
    private Long id;

    // Name of the member.
    private String name;

    // Email used for login.
    private String email;

    // BCrypt hashed password.
    private String password;

    // Role of the account.
    private Role role;

    // Required by Jackson for JSON deserialization.
    public User() {
    }

    // Constructor used when creating a new user.
    public User(
            Long id,
            String name,
            String email,
            String password,
            Role role
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}