package com.musicismylife.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class PostRequestDto {
    // Post summary (title shown on cards)
    @NotBlank(message = "Description is required")
    private String description;

    // Full post content
    @NotBlank(message = "Content is required")
    private String content;

    // Spotify track info
    @NotBlank(message = "Spotify track ID is required")
    private String spotifyTrackId;

    @NotBlank(message = "Track title is required")
    private String title;

    @NotBlank(message = "Artist name is required")
    private String artist;

    private String albumImageUrl;

    // Image information
    @NotNull
    @Size(min = 1, max = 3, message = "Upload between 1 and 3 images")
    private List<String> imageUrls;

    private String representImageUrl;

    // Tags
    private List<String> tags;
}
