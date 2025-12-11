package com.stoicron.stoicron_back.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.stoicron.stoicron_back.auth.model.AuthUser;

public interface AuthUserRepository extends MongoRepository<AuthUser, String> {
    AuthUser findByUsername(String username);
    AuthUser findByEmail(String email);
    
}
