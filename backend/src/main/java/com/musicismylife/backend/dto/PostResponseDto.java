package com.musicismylife.backend.dto;

import com.musicismylife.backend.domain.Post;
import lombok.Getter;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class PostResponseDto {
    
    private Long id;
    private String description; // ??繞???븐슜????類쏄콬)
    private String artist;      // ?熬곥굥堉???덈콦 ???藥?
    private String title;    // ?筌뤾퍔?????藥?

    // ?롪퍓???삳닱???怨몃뮔
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
        this.description = post.getDescription(); // 게시물의 한 줄 요약 필드 사용!
        this.artist = post.getArtistName();
        this.title = post.getTrackName();
        
        // ?롪퍓???삳닱???怨몃뮔
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
