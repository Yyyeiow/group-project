package main.java.com.musicismylife.backend.dto;

import com.musicismylife.backend.domain.User;
import lombok.Getter;
import java.time.LocalDateTime;

@Getter
public class UserResponseDto {
    
    private Long id;
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public UserResponseDto(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }
}
