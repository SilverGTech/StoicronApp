package com.stoicron.stoicron_back.config;

import java.io.IOException;

import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.mongodb.lang.NonNull;
import com.stoicron.stoicron_back.auth.model.AuthToken;
import com.stoicron.stoicron_back.auth.model.AuthUser;
import com.stoicron.stoicron_back.auth.repository.AuthTokenRepository;
import com.stoicron.stoicron_back.auth.repository.AuthUserRepository;
import com.stoicron.stoicron_back.auth.service.AuthTokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {


    private final AuthTokenService authTokenService;
    private final UserDetailsService userDetailsService;
    private final AuthTokenRepository authTokenRepository;
    private final AuthUserRepository authUserRepository;


    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request, 
        @NonNull HttpServletResponse response, 
        @NonNull FilterChain filterChain)
            throws ServletException, IOException {

                if(request.getServletPath().contains("/auth")) {
                    filterChain.doFilter(request, response);
                    return;
                }
                final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
                if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                    filterChain.doFilter(request, response);
                    return;

                }
                
                final String jwt = authHeader.substring(7);
                final String userId = authTokenService.extractUserId(jwt);

                if ( userId == null || SecurityContextHolder.getContext().getAuthentication() != null) {
                    filterChain.doFilter(request, response);
                    return;
                }

                final AuthToken authToken = authTokenRepository.findByToken(jwt);
                if (authToken == null || authToken.isExpired() || authToken.isRevoked()) {
                    filterChain.doFilter(request, response);
                    return;
                }

                final var userDetails = userDetailsService.loadUserByUsername(
                    authUserRepository.findById(userId).orElseThrow().getUsername()
                );

                AuthUser user = authUserRepository.findByUsername(userDetails.getUsername());
                if (user == null) {
                    filterChain.doFilter(request, response);
                    return;
                }

                final boolean isTokenValid = authTokenService.isTokenValid(jwt, user);
                if (!isTokenValid) {
                    filterChain.doFilter(request, response);
                    return;
                }

                final var sessionAuth = new  UsernamePasswordAuthenticationToken(userDetails, 
                    null, userDetails.getAuthorities());
                sessionAuth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(sessionAuth);

                filterChain.doFilter(request, response);
            }
    
}
