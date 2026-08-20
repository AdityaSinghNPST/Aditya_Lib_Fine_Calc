package com.library.Aditya_Lib_Fine_Calc.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;
    }


    // =====================================================
    // SECURITY FILTER CHAIN
    // =====================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // Enable CORS.
                //
                // Spring will use the CorsConfigurationSource
                // from our separate CorsConfig class.
                .cors(cors -> {})

                // Disable CSRF for JWT REST API.
                .csrf(csrf -> csrf.disable())

                // JWT authentication is stateless.
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                // Authorization rules.
                .authorizeHttpRequests(auth -> auth

                        // -----------------------------------------
                        // Public login endpoint
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/auth/login"
                        ).permitAll()


                        // -----------------------------------------
                        // Allow CORS preflight requests
                        // -----------------------------------------

                        .requestMatchers(
                                org.springframework.http.HttpMethod.OPTIONS,
                                "/**"
                        ).permitAll()


                        // -----------------------------------------
                        // Admin-only endpoints
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/users/**"
                        ).hasRole("ADMIN")


                        .requestMatchers(
                                "/api/settings/**"
                        ).hasRole("ADMIN")


                        // -----------------------------------------
                        // Authenticated endpoints
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/books/**"
                        ).authenticated()


                        .requestMatchers(
                                "/api/borrowings/**"
                        ).authenticated()


                        .requestMatchers(
                                "/api/fines/**"
                        ).authenticated()


                        // -----------------------------------------
                        // Everything else
                        // -----------------------------------------

                        .anyRequest().authenticated()
                )


                // Add JWT filter before the standard
                // UsernamePasswordAuthenticationFilter.
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }
}