package com.musicismylife.backend.service;

import com.musicismylife.backend.domain.User;
import com.musicismylife.backend.dto.LoginRequestDto;
import com.musicismylife.backend.dto.SignupRequestDto;
import com.musicismylife.backend.dto.UserResponseDto;
import com.musicismylife.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 사용자 관련 비즈니스 로직을 처리하는 서비스
 * 
 * 이 서비스가 하는 일:
 * 1. 회원가입
 * 2. 로그인
 * 3. 사용자 정보 조회
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 회원가입
     * 
     * @param requestDto 회원가입 요청 데이터
     * @return 생성된 사용자 정보
     * 
     * 동작 순서:
     * 1. 아이디 중복 확인
     * 2. 이메일 중복 확인
     * 3. 비밀번호 암호화
     * 4. 사용자 엔티티 생성 및 저장
     */
    @Transactional
    public UserResponseDto signup(SignupRequestDto requestDto) {
        // 1. 아이디 중복 확인
        if (userRepository.existsByUsername(requestDto.getUsername())) {
            throw new RuntimeException("이미 사용중인 아이디입니다: " + requestDto.getUsername());
        }

        // 2. 이메일 중복 확인
        if (userRepository.existsByEmail(requestDto.getEmail())) {
            throw new RuntimeException("이미 사용중인 이메일입니다: " + requestDto.getEmail());
        }

        // 3. 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(requestDto.getPassword());

        // 4. 사용자 엔티티 생성
        User user = new User();
        user.setUsername(requestDto.getUsername());
        user.setEmail(requestDto.getEmail());
        user.setPassword(encodedPassword);

        // 5. 데이터베이스에 저장
        User savedUser = userRepository.save(user);
        
        log.info("회원가입 완료 - 사용자: {}", savedUser.getUsername());
        
        return new UserResponseDto(savedUser);
    }

    /**
     * 로그인
     * 
     * @param requestDto 로그인 요청 데이터
     * @return 로그인된 사용자 정보
     * 
     * 동작 순서:
     * 1. 아이디로 사용자 조회
     * 2. 비밀번호 일치 확인
     */
    public UserResponseDto login(LoginRequestDto requestDto) {
        // 1. 아이디로 사용자 조회
        User user = userRepository.findByUsername(requestDto.getUsername())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다."));

        // 2. 비밀번호 확인
        if (!passwordEncoder.matches(requestDto.getPassword(), user.getPassword())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        log.info("로그인 성공 - 사용자: {}", user.getUsername());
        
        return new UserResponseDto(user);
    }

    /**
     * 사용자 정보 조회
     * 
     * @param username 사용자 아이디
     * @return 사용자 정보
     */
    public UserResponseDto getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + username));
        
        return new UserResponseDto(user);
    }

    /**
     * 사용자 ID로 정보 조회
     * 
     * @param userId 사용자 ID
     * @return 사용자 정보
     */
    public UserResponseDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. ID: " + userId));
        
        return new UserResponseDto(user);
    }

    /**
     * 프로필 업데이트
     */
    @Transactional
    public UserResponseDto updateProfile(Long userId, com.musicismylife.backend.dto.ProfileUpdateDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        // username 변경 (중복 체크)
        if (updateDto.getUsername() != null && !updateDto.getUsername().equals(user.getUsername())) {
            if (userRepository.existsByUsername(updateDto.getUsername())) {
                throw new RuntimeException("이미 사용 중인 아이디입니다.");
            }
            user.setUsername(updateDto.getUsername());
        }

        // 프로필 이미지 업데이트
        if (updateDto.getProfileImageUrl() != null) {
            user.setProfileImageUrl(updateDto.getProfileImageUrl());
        }

        // 자기소개 업데이트
        if (updateDto.getBio() != null) {
            user.setBio(updateDto.getBio());
        }

        User updated = userRepository.save(user);
        log.info("프로필 업데이트 완료 - userId: {}", userId);

        return new UserResponseDto(updated);
    }
}
