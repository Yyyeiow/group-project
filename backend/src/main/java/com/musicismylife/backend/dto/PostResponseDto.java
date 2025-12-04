package main.java.com.musicismylife.backend.dto;

import com.musicismylife.backend.domain.Post;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class PostResponseDto {
    
    private Long id;
    private String description; // 한 줄 요약(제목)
    private String artist;      // 아티스트 이름
    private String title;    // 트랙 이름

    // 게시물 내용
    private String content;
    private String authorUsername;
    private String spotifyTrackId;
    
    private String albumImageUrl;
    private List<String> imageUrls;
    private String representImageUrl;

    private List<String> tags;

    private boolean saved = false;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PostResponseDto(Post post) {
        this.id = post.getId();
        this.description = extractDescription(post.getContent()); // 본문에서 첫 50자 추출
        this.artist = post.getArtistName();
        this.title = post.getTrackName();
        
        // 게시물 내용
        this.content = post.getContent();
        this.authorUsername = post.getAuthor().getUsername();
        this.spotifyTrackId = post.getSpotifyTrackId();
        this.albumImageUrl = post.getAlbumImageUrl();
        this.imageUrls = post.getImageUrls();
        this.representImageUrl = post.getRepresentImageUrl();
        this.tags = post.getTags();
        this.createdAt = post.getCreatedAt();
    }
}
