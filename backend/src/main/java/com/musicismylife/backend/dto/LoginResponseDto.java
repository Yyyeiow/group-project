package com.musicismylife.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * 로그인 응답 DTO
 * 로그인 성공 시 사용자 정보와 JWT 토큰을 함께 반환합니다.
 */
@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDto {
    private Long id;
    private String username;
    private String email;
    private String token; // JWT 토큰
}
