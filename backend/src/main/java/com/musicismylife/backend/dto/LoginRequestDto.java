package main.java.com.musicismylife.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequestDto {

    @NotBlank(message = "아이디를 입력해주세요")
    private String username; // 사용자 이름 또는 이메일

    @NotBlank(message = "비밀번호를 입력해주세요")
    private String password; // 비밀번호
}
