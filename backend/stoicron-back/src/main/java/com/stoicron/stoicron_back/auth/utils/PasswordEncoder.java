package com.stoicron.stoicron_back.auth.utils;

public class PasswordEncoder {

    /* TODO: Implement a secure password encoding mechanism */
    public static String encode(String password) {
        // Simple encoding logic (for demonstration purposes only)
        return Integer.toHexString(password.hashCode());
    }

    public static boolean matches(String rawPassword, String encodedPassword) {
        return encode(rawPassword).equals(encodedPassword);
    }
    
}
