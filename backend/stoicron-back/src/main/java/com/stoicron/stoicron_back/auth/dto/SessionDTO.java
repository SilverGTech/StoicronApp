package com.stoicron.stoicron_back.auth.dto;

import lombok.Data;

@Data
public class SessionDTO {
    private String sessionExpirationToken;
    private String sessionToken;
}
