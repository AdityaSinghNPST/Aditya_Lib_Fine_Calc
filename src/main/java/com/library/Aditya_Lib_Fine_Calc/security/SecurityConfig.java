package com.library.Aditya_Lib_Fine_Calc.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                // Disable CSRF because this is a REST API.
                .csrf(csrf -> csrf.disable())

                // Use JWT instead of HTTP sessions.
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // Anyone can access login.
                        .requestMatchers(
                                "/api/auth/login"
                        ).permitAll()

                        // Only Admin can manage users.
                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")

                        // Only Admin can manage settings.
                        .requestMatchers(
                                "/api/settings/**"
                        ).hasRole("ADMIN")

                        // Logged-in users can access books.
                        .requestMatchers(
                                "/api/books/**"
                        ).authenticated()

                        // Logged-in users can access borrowing APIs.
                        .requestMatchers(
                                "/api/borrowings/**"
                        ).authenticated()

                        // Logged-in users can access fines for now.
                        .requestMatchers(
                                "/api/fines/**"
                        ).authenticated()

                        // Everything else requires authentication.
                        .anyRequest().authenticated()
                )

                // Process JWT before Spring's authentication filter.
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}