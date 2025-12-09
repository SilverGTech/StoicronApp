package com.stoicron.stoicron_back.auth.service;

import java.time.Instant;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final AuthTokenService authTokenService;
    private final AuthenticationManager authenticationManager;

    public AuthUserService(AuthUserRepository authUserRepository, PasswordEncoder passwordEncoder,
            AuthTokenService authTokenService, AuthenticationManager authenticationManager) {
        this.authUserRepository = authUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.authTokenService = authTokenService;
        this.authenticationManager = authenticationManager;
    }

    public SessionDTO doLogin(String username, String password) throws NoUserException, InvalidUserInfoException {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(username, password));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        final AuthUser user = authUserRepository.findByUsername(username);
        if (user == null) {
            throw new NoUserException(Errors.INVALID_CREDENTIALS);
        }
        ;

        String token = authTokenService.generateToken(user);
        String refreshToken = authTokenService.generateRefreshToken(user);
        authTokenService.saveToken(user, token);

        SessionDTO session = new SessionDTO();
        session.setSessionToken(token);
        session.setRefreshToken(refreshToken);
        return session;
    }

    public SessionDTO registerUser(RegisterDTO registerDto) {
        AuthUser newUser = new AuthUser();
        newUser.setUsername(registerDto.getUsername());
        newUser.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        newUser.setEmail(registerDto.getEmail());
        newUser.setRole(Roles.USER.getRoleName());
        newUser.setCreatedAt(Instant.now());
        newUser.setUpdatedAt(null);
        newUser = authUserRepository.save(newUser);

        String token = authTokenService.generateToken(newUser);
        String refreshToken = authTokenService.generateRefreshToken(newUser);
        authTokenService.saveToken(newUser, token);

        SessionDTO session = new SessionDTO();
        session.setSessionToken(token);
        session.setRefreshToken(refreshToken);
        return session;

    }

}
