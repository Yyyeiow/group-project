package com.musicismylife.backend.controller;

import com.musicismylife.backend.dto.LoginRequestDto;
import com.musicismylife.backend.dto.LoginResponseDto;
import com.musicismylife.backend.dto.SignupRequestDto;
import com.musicismylife.backend.dto.UserResponseDto;
import com.musicismylife.backend.service.UserService;
import com.musicismylife.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 인증 관련 API 컨트롤러
 * 
 * API 엔드포인트:
 * - POST /api/auth/signup : 회원가입
 * - POST /api/auth/login : 로그인
 * - GET /api/auth/me : 내 정보 조회 (로그인 필요)
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * 회원가입
     * 
     * POST /api/auth/signup
     * 
     * 요청 예시:
     * {
     *   "username": "john123",
     *   "email": "john@example.com",
     *   "password": "password123"
     * }
     * 
     * @param requestDto 회원가입 요청
     * @return 생성된 사용자 정보
     */
    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> signup(@RequestBody SignupRequestDto requestDto) {
        
        try {
            // 회원가입 처리
            UserResponseDto response = userService.signup(requestDto);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (RuntimeException e) {
            log.error("회원가입 실패: " + e.getMessage());
            throw e;
        }
    }

    /**
     * 로그인
     * 
     * POST /api/auth/login
     * 
     * 요청 예시:
     * {
     *   "username": "john123",
     *   "password": "password123"
     * }
     * 
     * 응답 예시:
     * {
     *   "id": 1,
     *   "username": "john123",
     *   "email": "john@example.com",
     *   "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNjk..."
     * }
     * 
     * @param requestDto 로그인 요청
     * @return 사용자 정보와 JWT 토큰
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody LoginRequestDto requestDto) {
        
        try {
            // 로그인 처리 (비밀번호 검증)
            UserResponseDto user = userService.login(requestDto);
            
            // JWT 토큰 생성
            String token = jwtUtil.generateToken(user.getId());
            
            // 사용자 정보 + 토큰 반환
            LoginResponseDto response = new LoginResponseDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                token
            );
            
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("로그인 실패: " + e.getMessage());
            throw e;
        }
    }

    /**
     * 내 정보 조회 (로그인 필요)
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = jwtUtil.extractToken(authorizationHeader);
            Long userId = jwtUtil.getUserIdFromToken(token);
            
            UserResponseDto user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
            
        } catch (Exception e) {
            log.error("내 정보 조회 실패: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }
    }
    
    /**
     * 프로필 업데이트
     * PUT /api/auth/profile
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody com.musicismylife.backend.dto.ProfileUpdateDto updateDto
    ) {
        try {
            String token = jwtUtil.extractToken(authorizationHeader);
            Long userId = jwtUtil.getUserIdFromToken(token);
            
            UserResponseDto updated = userService.updateProfile(userId, updateDto);
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            log.error("프로필 업데이트 실패: " + e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
