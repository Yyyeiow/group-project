package com.musicismylife.backend.controller;

import com.musicismylife.backend.domain.Post;
import com.musicismylife.backend.domain.User;
import com.musicismylife.backend.repository.PostRepository;
import com.musicismylife.backend.repository.UserRepository;
import com.musicismylife.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 좋아요(북마크) API 컨트롤러
 */
@RestController
@RequestMapping("/api/likes")
@RequiredArgsConstructor
@Slf4j
public class LikeController {

    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final JwtUtil jwtUtil;

    /**
     * 좋아요 토글 (좋아요/좋아요 취소)
     * POST /api/likes/{postId}
     */
    @PostMapping("/{postId}")
    public ResponseEntity<?> toggleLike(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            // JWT에서 userId 추출
            String token = jwtUtil.extractToken(authorizationHeader);
            Long userId = jwtUtil.getUserIdFromToken(token);

            // 사용자 및 게시물 조회
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다."));

            boolean isLiked;
            if (user.getLikedPosts().contains(post)) {
                // 이미 좋아요한 경우 -> 취소
                user.getLikedPosts().remove(post);
                isLiked = false;
                log.info("좋아요 취소 - userId: {}, postId: {}", userId, postId);
            } else {
                // 좋아요 추가
                user.getLikedPosts().add(post);
                isLiked = true;
                log.info("좋아요 추가 - userId: {}, postId: {}", userId, postId);
            }

            userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("isLiked", isLiked);
            response.put("postId", postId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("좋아요 토글 실패: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 좋아요 상태 확인
     * GET /api/likes/{postId}
     */
    @GetMapping("/{postId}")
    public ResponseEntity<?> checkLikeStatus(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            String token = jwtUtil.extractToken(authorizationHeader);
            Long userId = jwtUtil.getUserIdFromToken(token);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다."));

            boolean isLiked = user.getLikedPosts().contains(post);

            Map<String, Object> response = new HashMap<>();
            response.put("isLiked", isLiked);
            response.put("postId", postId);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("좋아요 상태 확인 실패: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    /**
     * 사용자가 좋아요한 게시물 목록
     * GET /api/likes
     */
    @GetMapping
    public ResponseEntity<?> getLikedPosts(
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            String token = jwtUtil.extractToken(authorizationHeader);
            Long userId = jwtUtil.getUserIdFromToken(token);

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // Post 엔티티를 PostResponseDto로 변환
            java.util.List<com.musicismylife.backend.dto.PostResponseDto> likedPostsDtos = 
                user.getLikedPosts().stream()
                    .map(com.musicismylife.backend.dto.PostResponseDto::new)
                    .collect(java.util.stream.Collectors.toList());

            return ResponseEntity.ok(likedPostsDtos);

        } catch (Exception e) {
            log.error("좋아요한 게시물 조회 실패: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
