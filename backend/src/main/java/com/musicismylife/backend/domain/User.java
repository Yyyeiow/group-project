package com.musicismylife.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 사용자 이름

    @Column(nullable = false, unique = true, length = 100)
    private String email;    // 이메일

    @Column(nullable = false)
    private String password; // 비밀번호

    // 프로필 정보
    private String profileImageUrl; // 프로필 이미지
    
    @Column(length = 500)
    private String bio; // 자기소개

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;  // 생성 시간

    // 좋아요한 게시물
    @ManyToMany
    @JoinTable(
        name = "user_liked_posts",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private java.util.Set<Post> likedPosts = new java.util.HashSet<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
