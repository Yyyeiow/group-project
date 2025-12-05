package com.musicismylife.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginRequestDto {

    @NotBlank(message = "?袁⑹뵠?遺? ??낆젾??곻폒?紐꾩뒄")
    private String username; // ???????已??癒?뮉 ??李??

    @NotBlank(message = "??쑬?甕곕뜇?뉒몴???낆젾??곻폒?紐꾩뒄")
    private String password; // ??쑬?甕곕뜇??
}

