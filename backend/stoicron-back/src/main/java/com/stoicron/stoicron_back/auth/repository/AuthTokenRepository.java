package com.stoicron.stoicron_back.auth.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.stoicron.stoicron_back.auth.model.AuthToken;

public interface AuthTokenRepository extends MongoRepository<AuthToken, String> {
    List<AuthToken> findByUserIdAndRevokedFalseAndExpiredFalse(String userId);
}
