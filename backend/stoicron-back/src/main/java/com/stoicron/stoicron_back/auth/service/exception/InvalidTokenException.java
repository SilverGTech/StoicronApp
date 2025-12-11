package com.stoicron.stoicron_back.auth.service.exception;

public class InvalidTokenException extends Exception {
    public InvalidTokenException(String message) {
        super(message);
    }
    
}
