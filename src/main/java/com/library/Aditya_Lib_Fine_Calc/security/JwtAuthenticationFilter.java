package com.library.Aditya_Lib_Fine_Calc.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Get the Authorization header.
        String authorizationHeader =
                request.getHeader("Authorization");

        // Continue if no token was provided.
        if (authorizationHeader == null
                || !authorizationHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);

            return;
        }

        // Remove "Bearer " from the token.
        String token =
                authorizationHeader.substring(7);

        try {

            // Check whether the JWT is valid.
            if (jwtService.isTokenValid(token)) {

                // Extract the email from the token.
                String email =
                        jwtService.extractEmail(token);

                // Extract the role from the token.
                String role =
                        jwtService.extractRole(token);

                // Convert the role into a Spring Security authority.
                SimpleGrantedAuthority authority =
                        new SimpleGrantedAuthority(
                                "ROLE_" + role
                        );

                // Create the authenticated user.
                Long userId =
                        jwtService.extractUserId(token);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                userId,
                                Collections.singletonList(authority)
                        );
                // Store the authenticated user in Spring Security.
                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception exception) {

            // Clear authentication if the token is invalid.
            SecurityContextHolder
                    .clearContext();
        }

        // Continue the request.
        filterChain.doFilter(request, response);
    }
}