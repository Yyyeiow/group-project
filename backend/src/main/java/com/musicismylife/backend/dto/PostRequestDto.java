package main.java.com.musicismylife.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class PostRequestDto {
    // 프론트에서 보내는 필드명 그대로
    @NotBlank(message = "내용은 필수입니다")
    private String content;  // 본문 전체
    
    // Spotify 노래 정보 (song 객체에서 추출)
    @NotBlank(message = "Spotify 트랙 ID는 필수입니다")
    private String spotifyTrackId;
    
    @NotBlank(message = "노래 제목은 필수입니다")
    private String title;
    
    @NotBlank(message = "아티스트 이름은 필수입니다")
    private String artist;
    
    private String albumImageUrl;
    
    // 이미지 정보
    @NotNull
    @Size(min = 1, max = 3, message = "이미지는 1~3장 업로드 가능합니다")
    private List<String> imageUrls;
    
    private String representImageUrl;
    
    // 태그
    private List<String> tags;
}
