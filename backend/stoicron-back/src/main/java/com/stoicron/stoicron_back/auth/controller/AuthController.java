package com.stoicron.stoicron_back.auth.controller;

import org.springframework.web.bind.annotation.RestController;

import com.stoicron.stoicron_back.auth.dto.LoginDTO;
import com.stoicron.stoicron_back.auth.dto.RegisterDTO;
import com.stoicron.stoicron_back.auth.dto.SessionDTO;
import com.stoicron.stoicron_back.auth.service.AuthUserService;
import com.stoicron.stoicron_back.auth.service.exception.InvalidTokenException;
import com.stoicron.stoicron_back.auth.service.exception.NoUserException;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthUserService authUserService;

    public AuthController(AuthUserService authUserService) {
        this.authUserService = authUserService;
    }

    @PostMapping("/login")
    public SessionDTO postLogin(@RequestBody final LoginDTO loginDto) throws Exception {
        return authUserService.doLogin(loginDto.getUsername(), loginDto.getPassword());
    }

    @PostMapping("/register")
    public ResponseEntity<SessionDTO> postRegister(@RequestBody final RegisterDTO registerDto) {
        SessionDTO session = authUserService.registerUser(registerDto);
        return ResponseEntity.ok(session);
    }

    @PostMapping("/refresh")
    public SessionDTO postMethodName(@RequestHeader(HttpHeaders.AUTHORIZATION) final String authHeader) throws NoUserException, InvalidTokenException {
        return authUserService.refreshToken(authHeader);
    }

}
