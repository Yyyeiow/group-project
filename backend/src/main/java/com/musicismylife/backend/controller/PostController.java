package com.musicismylife.backend.controller;

import com.musicismylife.backend.dto.PostRequestDto;
import com.musicismylife.backend.dto.PostResponseDto;
import com.musicismylife.backend.service.PostService;
import com.musicismylife.backend.service.SpotifyService;
import com.musicismylife.backend.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * 게시물 관련 API 컨트롤러
 * 
 * API 엔드포인트:
 * - POST /api/posts : 게시물 작성
 * - GET /api/posts : 게시물 목록 조회 (최신순)
 * - GET /api/posts/{postId} : 게시물 상세 조회
 * - PUT /api/posts/{postId} : 게시물 수정
 * - DELETE /api/posts/{postId} : 게시물 삭제
 * - GET /api/posts/search/tag : 태그로 게시물 검색
 * - GET /api/spotify/search : Spotify에서 노래 검색
 * - GET /api/spotify/track/{trackId} : Spotify 트랙 상세 정보
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;
    private final SpotifyService spotifyService;
    private final JwtUtil jwtUtil;
    /**
     * 게시물 작성
     * 
     * POST /api/posts
     * Headers: Authorization: Bearer {JWT_TOKEN}
     * 
     * 요청 예시:
     * {
     *   "description": "내 인생 최고의 노래",
     *   "content": "이 노래를 들으면...",
     *   "spotifyTrackId": "3n3Ppam7vgaVa1iaRUc9Lp",
     *   "imageUrls": ["http://example.com/image1.jpg", ...],
     *   "representImageUrl": "http://example.com/image1.jpg",
     *   "tags": ["힙합", "감성"]
     * }
     * 
     * @param requestDto 게시물 작성 요청
     * @param authorizationHeader JWT 토큰 (Authorization 헤더에서 자동으로 받음)
     * @return 생성된 게시물 정보
     */
    @PostMapping("/posts")
    public ResponseEntity<PostResponseDto> createPost(
            @RequestBody PostRequestDto requestDto,
            @RequestHeader("Authorization") String authorizationHeader) {
        
        try {
            // JWT 토큰에서 사용자 ID 추출
            String token = jwtUtil.extractToken(authorizationHeader);
            if (token == null || !jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
            
            Long userId = jwtUtil.getUserIdFromToken(token);
            
            // 게시물 생성
            PostResponseDto response = postService.createPost(requestDto, userId);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            log.error("게시물 작성 실패: " + e.getMessage());
            throw new RuntimeException("게시물 작성에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 게시물 목록 조회 (최신순, 페이징)
     * 
     * GET /api/posts?page=0&size=10
     * 
     * @param page 페이지 번호 (기본값: 0)
     * @param size 페이지 크기 (기본값: 10)
     * @return 게시물 목록
     */
    @GetMapping("/posts")
    public ResponseEntity<Page<PostResponseDto>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Page<PostResponseDto> posts = postService.getAllPosts(page, size);
            return ResponseEntity.ok(posts);
            
        } catch (Exception e) {
            log.error("게시물 목록 조회 실패: " + e.getMessage());
            throw new RuntimeException("게시물 목록 조회에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 게시물 상세 조회
     * 
     * GET /api/posts/1
     * 
     * @param postId 게시물 ID
     * @return 게시물 상세 정보
     */
    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostResponseDto> getPostById(@PathVariable Long postId) {
        
        try {
            PostResponseDto post = postService.getPostById(postId);
            return ResponseEntity.ok(post);
            
        } catch (Exception e) {
            log.error("게시물 조회 실패: " + e.getMessage());
            throw new RuntimeException("게시물 조회에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 게시물 수정
     * 
     * PUT /api/posts/1
     * 
     * @param postId 게시물 ID
     * @param requestDto 수정할 내용
     * @param authentication 로그인된 사용자 정보
     * @return 수정된 게시물 정보
     */
    @PutMapping("/posts/{postId}")
    public ResponseEntity<PostResponseDto> updatePost(
            @PathVariable Long postId,
            @RequestBody PostRequestDto requestDto,
            Authentication authentication) {
        
        try {
            String username = authentication.getName();
            PostResponseDto updated = postService.updatePost(postId, requestDto, username);
            return ResponseEntity.ok(updated);
            
        } catch (Exception e) {
            log.error("게시물 수정 실패: " + e.getMessage());
            throw new RuntimeException("게시물 수정에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 게시물 삭제
     * 
     * DELETE /api/posts/1
     * 
     * @param postId 게시물 ID
     * @param authentication 로그인된 사용자 정보
     * @return 삭제 성공 메시지
     */
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId,
            Authentication authentication) {
        
        try {
            String username = authentication.getName();
            postService.deletePost(postId, username);
            return ResponseEntity.ok("게시물이 삭제되었습니다.");
            
        } catch (Exception e) {
            log.error("게시물 삭제 실패: " + e.getMessage());
            throw new RuntimeException("게시물 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * 태그로 게시물 검색
     * 
     * GET /api/posts/search/tag?tag=힙합&page=0&size=10
     * 
     * @param tag 검색할 태그
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 해당 태그를 가진 게시물 목록
     */
    @GetMapping("/posts/search/tag")
    public ResponseEntity<Page<PostResponseDto>> getPostsByTag(
            @RequestParam String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Page<PostResponseDto> posts = postService.getPostsByTag(tag, page, size);
            return ResponseEntity.ok(posts);
            
        } catch (Exception e) {
            log.error("태그 검색 실패: " + e.getMessage());
            throw new RuntimeException("태그 검색에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * Spotify에서 노래 검색
     * 
     * GET /api/spotify/search?query=BTS Dynamite
     * 
     * @param query 검색어 (아티스트명, 곡명 등)
     * @return 검색 결과 리스트
     * 
     * 반환 예시:
     * [
     *   {
     *     "trackId": "3n3Ppam7vgaVa1iaRUc9Lp",
     *     "trackName": "Dynamite",
     *     "artistName": "BTS",
     *     "albumImageUrl": "https://..."
     *   }
     * ]
     */
    @GetMapping("/spotify/search")
    public ResponseEntity<List<Map<String, String>>> searchSpotifyTracks(
            @RequestParam String query) {
        
        try {
            List<Map<String, String>> tracks = spotifyService.searchTracks(query);
            return ResponseEntity.ok(tracks);
            
        } catch (Exception e) {
            log.error("Spotify 검색 실패: " + e.getMessage());
            throw new RuntimeException("Spotify 검색에 실패했습니다: " + e.getMessage());
        }
    }

    /**
     * Spotify 트랙 상세 정보 조회
     * 
     * GET /api/spotify/track/3n3Ppam7vgaVa1iaRUc9Lp
     * 
     * @param trackId Spotify 트랙 ID
     * @return 트랙 상세 정보 (앨범 커버, 아티스트, 제목 등)
     */
    @GetMapping("/spotify/track/{trackId}")
    public ResponseEntity<Map<String, String>> getSpotifyTrackDetails(
            @PathVariable String trackId) {
        
        try {
            Map<String, String> trackDetails = spotifyService.getTrackDetails(trackId);
            return ResponseEntity.ok(trackDetails);
            
        } catch (Exception e) {
            log.error("Spotify 트랙 조회 실패: " + e.getMessage());
            throw new RuntimeException("Spotify 트랙 조회에 실패했습니다: " + e.getMessage());
        }
    }
}
