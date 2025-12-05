package com.musicismylife.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * JWT 토큰 생성 및 검증 유틸리티
 * 
 * JWT(JSON Web Token)란?
 * - 로그인하면 서버가 발급하는 "증명서"
 * - 이 증명서를 가지고 있으면 "나 로그인한 사용자야!"라고 증명할 수 있음
 * - 증명서 안에는 사용자 ID가 들어있음
 */
@Component
public class JwtUtil {

    // JWT 서명에 사용할 비밀 키 (application.properties에서 가져옴)
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    
    // 토큰 유효 시간 (24시간)
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    /**
     * JWT 토큰 생성
     * 
     * @param userId 사용자 ID
     * @return JWT 토큰 문자열
     * 
     * 예시: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjk..."
     */
    public String generateToken(Long userId) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_TIME);

        return Jwts.builder()
                .setSubject(userId.toString()) // 토큰 안에 사용자 ID 저장
                .setIssuedAt(now) // 발급 시간
                .setExpiration(expiration) // 만료 시간
                .signWith(key) // 서명
                .compact();
    }

    /**
     * JWT 토큰에서 사용자 ID 추출
     * 
     * @param token JWT 토큰
     * @return 사용자 ID
     */
    public Long getUserIdFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    /**
     * JWT 토큰 유효성 검증
     * 
     * @param token JWT 토큰
     * @return 유효하면 true, 아니면 false
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Authorization 헤더에서 토큰 추출
     * 
     * Authorization 헤더 형식: "Bearer eyJhbGciOiJIUzI1NiJ9..."
     * "Bearer " 부분을 제거하고 토큰만 반환
     */
    public String extractToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);
        }
        return null;
    }
}
