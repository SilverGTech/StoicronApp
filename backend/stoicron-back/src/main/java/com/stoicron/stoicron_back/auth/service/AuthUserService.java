package com.stoicron.stoicron_back.auth.service;

import java.time.Instant;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.stoicron.stoicron_back.auth.dto.RegisterDTO;
import com.stoicron.stoicron_back.auth.dto.SessionDTO;
import com.stoicron.stoicron_back.auth.model.AuthUser;
import com.stoicron.stoicron_back.auth.repository.AuthUserRepository;
import com.stoicron.stoicron_back.auth.service.exception.InvalidUserInfoException;
import com.stoicron.stoicron_back.auth.service.exception.NoUserException;
import com.stoicron.stoicron_back.auth.utils.Errors;
import com.stoicron.stoicron_back.auth.utils.Roles;

import lombok.extern.log4j.Log4j2;

@Log4j2
@Service
public class AuthUserService {

    private final AuthUserRepository authUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthUserService(AuthUserRepository authUserRepository, PasswordEncoder passwordEncoder) {
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public SessionDTO doLogin(String username, String password) throws NoUserException, InvalidUserInfoException {
        AuthUser user = authUserRepository.findByUsername(username);
        if (user == null) {
            throw new NoUserException(Errors.USER_NOT_FOUND);
        }
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidUserInfoException(Errors.INVALID_CREDENTIALS);
        }
        SessionDTO session = new SessionDTO();
        session.setSessionToken("");
        session.setSessionExpirationToken("");
        return session;
    }

    public AuthUser registerUser(RegisterDTO registerDto) {
        registerDto.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        AuthUser newUser = new AuthUser();
        newUser.setUsername(registerDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        newUser.setEmail(registerDto.getEmail());
        newUser.setRole(Roles.USER.getRoleName());
        newUser.setCreatedAt(Instant.now());
        newUser.setUpdatedAt(null);

        newUser = authUserRepository.save(newUser);

        newUser.setPassword(null);
        return newUser;
    }
    
    
}
