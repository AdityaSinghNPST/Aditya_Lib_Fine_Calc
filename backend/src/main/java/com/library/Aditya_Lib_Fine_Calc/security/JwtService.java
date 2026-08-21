package com.library.Aditya_Lib_Fine_Calc.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private static final String SECRET_KEY = "AdityaLibrarySecretKeyForJwtAuthentication123456";


    private static final long EXPIRATION_TIME =
            1000 * 60 * 60 * 24;

    // Create the signing key.
    private SecretKey getSigningKey() {

        return Keys.hmacShaKeyFor(
                SECRET_KEY.getBytes(StandardCharsets.UTF_8)
        );
    }

    // Generate a JWT for a user.
    public String generateToken(
            Long userId,
            String email,
            String role
    ) {

        Date now = new Date();

        Date expiration =
                new Date(
                        now.getTime() + EXPIRATION_TIME
                );

        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigningKey())
                .compact();
    }

    // Extract the email from a token.
    public String extractEmail(String token) {

        return getClaims(token)
                .getSubject();
    }

    // Extract the user ID from a token.
    public Long extractUserId(String token) {

        return getClaims(token)
                .get("userId", Long.class);
    }

    // Extract the role from a token.
    public String extractRole(String token) {

        return getClaims(token)
                .get("role", String.class);
    }

    // Check whether the token is still valid.
    public boolean isTokenValid(String token) {

        try {

            getClaims(token);

            return true;

        } catch (Exception e) {

            return false;
        }
    }

    // Read all claims from the token.
    private Claims getClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}