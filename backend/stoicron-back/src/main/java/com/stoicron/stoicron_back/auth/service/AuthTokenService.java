package com.stoicron.stoicron_back.auth.service;

import java.time.Instant;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.stoicron.stoicron_back.auth.model.AuthToken;
import com.stoicron.stoicron_back.auth.model.AuthUser;
import com.stoicron.stoicron_back.auth.repository.AuthTokenRepository;

import lombok.Data;

@Service
@Data
public class AuthTokenService {
    @Value("${application.security.jwt.secret}")
    private String secretKey;
    @Value("${application.security.jwt.expiration-ms}")
    private Long jwtExpirationMs;
    @Value("${application.security.jwt.refresh-expiration-ms}")
    private Long refreshExpirationMs;

    private final AuthTokenRepository authTokenRepository;

    public AuthTokenService(AuthTokenRepository authTokenRepository) {
        this.authTokenRepository = authTokenRepository;
    }

    public String generateToken(final AuthUser user) {
        return buildToken(user, jwtExpirationMs);
    }

    public String generateRefreshToken(final AuthUser user) {
        return buildToken(user, refreshExpirationMs);
    }

    private String buildToken(final AuthUser user, final Long expirationMs) {
        return JWT.create().withSubject(user.getId()).withClaim("roles", user.getRole())
                .withPayload(Map.of("userId", user.getId()))
                .withExpiresAt(new java.util.Date(System.currentTimeMillis() + expirationMs))
                .sign(Algorithm.HMAC256(secretKey));
    }

    public void saveToken(AuthUser user, String token) {
        AuthToken authToken = new AuthToken();
        authToken.setUserId(user.getId());
        authToken.setToken(token);
        authToken.setTokenType("BEARER");
        authToken.setExpired(false);
        authToken.setRevoked(false);
        authToken.setCreatedAt(Instant.now());
        authTokenRepository.save(authToken);
    }

    public void revokeAllUserTokens(AuthUser user) {
        var validUserTokens = authTokenRepository.findByUserIdAndRevokedFalseAndExpiredFalse(user.getId());
        if (validUserTokens.isEmpty())
            return;
        for (var token : validUserTokens) {
            token.setRevoked(true);
            token.setExpired(true);
        }
        authTokenRepository.saveAll(validUserTokens);
    }

    public String extractUserId(String token) {
        return JWT.require(Algorithm.HMAC256(secretKey)).build().verify(token).getSubject();
    }

    public  boolean isTokenValid(String token, AuthUser user) {
        final String userId = extractUserId(token);
        return (userId.equals(user.getId())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return JWT.require(Algorithm.HMAC256(secretKey)).build().verify(token).getExpiresAt();
    }
}
