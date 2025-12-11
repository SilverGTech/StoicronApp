package com.stoicron.stoicron_back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.stoicron.stoicron_back.auth.model.AuthToken;
import com.stoicron.stoicron_back.auth.repository.AuthTokenRepository;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class JwtConfig {

    private final JwtAuthFilter jwtAuthFilter;

    final AuthenticationProvider authenticationProvider;
    private final AuthTokenRepository authTokenRepository;

    @Bean
    public SecurityFilterChain jwtSecurityFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/auth/**").csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(
                        authorize -> authorize.requestMatchers("/auth/**").permitAll().anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class).logout(logout -> logout
                        .logoutUrl("/auth/logout").addLogoutHandler((request, response, authentication) -> {
                            final var authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
                            logout(authHeader);
                        }).logoutSuccessHandler((request, response, authentication) -> {
                            SecurityContextHolder.clearContext();
                        }));
        return http.build();
    }

    private void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return;
        }
        final String jwt = authHeader.substring(7);
        final AuthToken authToken = authTokenRepository.findByToken(jwt);
        authToken.setRevoked(true);
        authToken.setExpired(true);
        authTokenRepository.save(authToken);

    }

}
