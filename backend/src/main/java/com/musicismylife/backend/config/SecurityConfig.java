package com.musicismylife.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Spring Security 설정 클래스
 * 보안 관련 설정을 관리합니다.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * 비밀번호 암호화 Bean
     * 회원가입 시 비밀번호를 암호화해서 저장합니다.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * HTTP 보안 설정
     * 어떤 URL은 로그인 없이 접근 가능하고, 어떤 URL은 로그인이 필요한지 설정합니다.
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // REST API는 CSRF 비활성화
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll() // 로그인, 회원가입은 누구나 접근 가능
                .requestMatchers("/api/posts/**").permitAll() // 게시물 조회는 누구나 가능 (임시)
                .requestMatchers("/api/spotify/**").permitAll() // Spotify API는 누구나 접근 가능
                .requestMatchers("/api/upload/**").permitAll() // 파일 업로드는 누구나 가능 (임시)
                .requestMatchers("/uploads/**").permitAll() // 업로드된 파일 접근 허용
                .anyRequest().authenticated() // 나머지는 로그인 필요
            );
        
        return http.build();
    }

    /**
     * CORS 설정 (프론트엔드와 백엔드가 다른 포트에서 실행될 때 필요)
     * 프론트엔드(예: localhost:5173)에서 백엔드(localhost:8080)로 요청을 보낼 수 있게 허용
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // 프론트엔드 주소
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*")); // 모든 헤더 허용 (Authorization 포함)
        configuration.setExposedHeaders(Arrays.asList("*")); // 응답 헤더 노출
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // preflight 요청 캐시 시간
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
