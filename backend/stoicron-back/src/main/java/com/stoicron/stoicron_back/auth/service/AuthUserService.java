package com.stoicron.stoicron_back.auth.service;

import org.springframework.stereotype.Service;

import com.stoicron.stoicron_back.auth.dto.SessionDTO;
import com.stoicron.stoicron_back.auth.model.AuthUser;
import com.stoicron.stoicron_back.auth.repository.AuthUserRepository;
import com.stoicron.stoicron_back.auth.service.exception.InvalidUserInfoException;
import com.stoicron.stoicron_back.auth.service.exception.NoUserException;

@Service
public class AuthUserService {

    private final AuthUserRepository authUserRepository;

    public AuthUserService(AuthUserRepository authUserRepository) {
        this.authUserRepository = authUserRepository;
    }

    /* TODO: implement login logic */
    public SessionDTO doLogin(String username, String password) throws NoUserException, InvalidUserInfoException {
        AuthUser user = authUserRepository.findByUsername(username);
        if(user == null){
            throw new NoUserException("User not found");
        }
        if (!user.getPassword().equals(password)) {
            throw new InvalidUserInfoException("Invalid password");
        }
        SessionDTO session = new SessionDTO();
        session.setSessionToken("");
        session.setSessionExpirationToken("");
        return session;
    }
    
    
}
