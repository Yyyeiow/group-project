package main.java.com.musicismylife.backend.domain;

import javax.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class Post {
    @Id
    @Generated(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;   // 게시물 한 줄 요약(제목)

    @Column(nullable = false, length = 10000)
    private String content; // 게시물 내용

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;   // 작성자

    // 스포티파이 트랙 정보 //
    @Column(nullable = false)
    private String spotifyTrackId;  // 스포티파이 트랙 ID

    @Column(nullable = false)
    private String trackName;   // 트랙 이름

    @Column(nullable = false)
    private String artistName;  // 아티스트 이름

    private String albumImageUrl;   // 앨범 이미지 URL

    // 사진 URL 리스트 //
    @ElementCollection
    private List<String> imageUrls = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // 생성 시간
    private LocalDateTime updatedAt;  // 수정 시간

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
