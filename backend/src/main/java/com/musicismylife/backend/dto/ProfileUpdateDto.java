package com.musicismylife.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class ProfileUpdateDto {
    private String username; // 사용자 아이디 변경
    private String profileImageUrl; // 프로필 이미지
    private String bio; // 자기소개
}
