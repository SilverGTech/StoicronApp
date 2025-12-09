package com.stoicron.stoicron_back.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.stoicron.stoicron_back.auth.model.AuthUser;
import com.stoicron.stoicron_back.auth.repository.AuthUserRepository;
import com.stoicron.stoicron_back.config.exception.NoUserFoundException;
import com.stoicron.stoicron_back.config.utils.Errors;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@Log4j2
public class SecurityConfig {

    private final AuthUserRepository authUserRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            final AuthUser user = authUserRepository.findByUsername(username);
            if (user == null) {
                throw new RuntimeException(new NoUserFoundException(Errors.NO_USER_FOUND));
            }
            return org.springframework.security.core.userdetails.User.builder().username(user.getUsername())
                    .password(user.getPassword()).build();
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService uds) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(uds);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(
                        authorize -> authorize.requestMatchers("/auth/**").permitAll().anyRequest().authenticated())
                .exceptionHandling(
                        exception -> exception.authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\":\"" + authException.getMessage() + "\"}");
                        }));
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
