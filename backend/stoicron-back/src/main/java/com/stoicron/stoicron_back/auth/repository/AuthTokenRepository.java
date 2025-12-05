package com.stoicron.stoicron_back.auth.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.stoicron.stoicron_back.auth.model.AuthToken;

public interface AuthTokenRepository extends MongoRepository<AuthToken, String> {
    
}
