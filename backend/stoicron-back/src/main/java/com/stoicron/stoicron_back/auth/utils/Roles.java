package com.stoicron.stoicron_back.auth.utils;

public enum Roles {
    USER("USER"),
    ADMIN("ADMIN");

    private final String roleName;

    Roles(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleName() {
        return roleName;
    }
}