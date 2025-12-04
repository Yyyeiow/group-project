package main.java.com.musicismylife.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class SignupRequestDto {
    
    @NotBlank(message = "아이디는 필수입니다")
    @Size(min = 4, max = 20, message = "사용자 아이디는 4자 이상 20자 이하로 입력해주세요")
    private String username;

    @NotBlank(message = "이메일을 입력해주세요")
    @Email(message = "유효한 이메일 주소를 입력해주세요")
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요")
    @Size(min = 6, message = "비밀번호는 6자 이상 입력해주세요")
    private String password;
}
