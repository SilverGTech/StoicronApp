package com.stoicron.stoicron_back.auth.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "auth_users")
public class AuthUser {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String role;
    private Instant createdAt;
    private Instant updatedAt;
}
