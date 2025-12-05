package com.stoicron.stoicron_back.auth.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "auth_tokens")
public class AuthToken {
    @Id
    private String id;
    private String userId;
    private String token;
    private String tokenType;
    private boolean revoked;
    private boolean expired;
    private Instant createdAt;
}
