package com.musicismylife.backend.service;

import com.musicismylife.backend.domain.Post;
import com.musicismylife.backend.domain.User;
import com.musicismylife.backend.dto.PostRequestDto;
import com.musicismylife.backend.dto.PostResponseDto;
import com.musicismylife.backend.repository.PostRepository;
import com.musicismylife.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 게시물 관련 비즈니스 로직을 처리하는 서비스
 * 
 * 이 서비스가 하는 일:
 * 1. 게시물 작성
 * 2. 게시물 목록 조회 (최신순)
 * 3. 게시물 상세 조회
 * 4. 게시물 수정
 * 5. 게시물 삭제
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final SpotifyService spotifyService;

    /**
     * 게시물 작성
     * 
     * @param requestDto 게시물 작성 요청 데이터
     * @param userId 작성자 ID (JWT 토큰에서 추출)
     * @return 생성된 게시물 정보
     * 
     * 동작 순서:
     * 1. 작성자 정보 조회
     * 2. Spotify에서 트랙 정보 가져오기
     * 3. 게시물 엔티티 생성
     * 4. 데이터베이스에 저장
     */
    @Transactional
    public PostResponseDto createPost(PostRequestDto requestDto, Long userId) {
        // 1. 작성자 찾기
        User author = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: ID=" + userId));

        // 2. Spotify에서 트랙 정보 가져오기
        Map<String, String> trackDetails = spotifyService.getTrackDetails(requestDto.getSpotifyTrackId());

        // 3. 게시물 엔티티 생성
        Post post = new Post();
        post.setDescription(requestDto.getDescription()); // 한 줄 요약
        post.setContent(requestDto.getContent()); // 본문
        post.setAuthor(author); // 작성자
        
        // Spotify 트랙 정보
        post.setSpotifyTrackId(requestDto.getSpotifyTrackId());
        post.setTrackName(trackDetails.get("trackName"));
        post.setArtistName(trackDetails.get("artistName"));
        post.setAlbumImageUrl(trackDetails.get("albumImageUrl"));
        
        // 이미지 URL들
        post.setImageUrls(requestDto.getImageUrls());
        post.setRepresentImageUrl(requestDto.getRepresentImageUrl());
        
        // 태그
        post.setTags(requestDto.getTags());

        // 4. 데이터베이스에 저장
        Post savedPost = postRepository.save(post);
        
        log.info("게시물 작성 완료 - ID: {}, 작성자: {}", savedPost.getId(), author.getUsername());
        
        return new PostResponseDto(savedPost);
    }

    /**
     * 게시물 목록 조회 (최신순)
     * 
     * @param page 페이지 번호 (0부터 시작)
     * @param size 한 페이지당 게시물 수
     * @return 게시물 목록
     * 
     * 예: 첫 페이지 10개 조회 -> page=0, size=10
     */
    public Page<PostResponseDto> getAllPosts(int page, int size) {
        // 정렬 조건: createdAt 기준 내림차순 (최신순)
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        // 데이터베이스에서 게시물 조회
        Page<Post> posts = postRepository.findAll(pageable);
        
        // Post 엔티티 -> PostResponseDto로 변환
        return posts.map(PostResponseDto::new);
    }

    /**
     * 게시물 상세 조회
     * 
     * @param postId 게시물 ID
     * @return 게시물 상세 정보
     */
    public PostResponseDto getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다: " + postId));
        
        return new PostResponseDto(post);
    }

    /**
     * 게시물 수정
     * 
     * @param postId 게시물 ID
     * @param requestDto 수정할 내용
     * @param username 요청한 사용자 이름 (작성자인지 확인)
     * @return 수정된 게시물 정보
     */
    @Transactional
    public PostResponseDto updatePost(Long postId, PostRequestDto requestDto, String username) {
        // 게시물 찾기
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다: " + postId));
        
        // 작성자 본인인지 확인
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("게시물을 수정할 권한이 없습니다.");
        }

        // 게시물 내용 수정
        post.setDescription(requestDto.getDescription());
        post.setContent(requestDto.getContent());
        post.setImageUrls(requestDto.getImageUrls());
        post.setRepresentImageUrl(requestDto.getRepresentImageUrl());
        post.setTags(requestDto.getTags());

        // Spotify 트랙이 변경되었다면 새로운 정보 가져오기
        if (!post.getSpotifyTrackId().equals(requestDto.getSpotifyTrackId())) {
            Map<String, String> trackDetails = spotifyService.getTrackDetails(requestDto.getSpotifyTrackId());
            post.setSpotifyTrackId(requestDto.getSpotifyTrackId());
            post.setTrackName(trackDetails.get("trackName"));
            post.setArtistName(trackDetails.get("artistName"));
            post.setAlbumImageUrl(trackDetails.get("albumImageUrl"));
        }

        log.info("게시물 수정 완료 - ID: {}", postId);
        
        return new PostResponseDto(post);
    }

    /**
     * 게시물 삭제
     * 
     * @param postId 게시물 ID
     * @param username 요청한 사용자 이름 (작성자인지 확인)
     */
    @Transactional
    public void deletePost(Long postId, String username) {
        // 게시물 찾기
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다: " + postId));
        
        // 작성자 본인인지 확인
        if (!post.getAuthor().getUsername().equals(username)) {
            throw new RuntimeException("게시물을 삭제할 권한이 없습니다.");
        }

        // 삭제
        postRepository.delete(post);
        
        log.info("게시물 삭제 완료 - ID: {}", postId);
    }

    /**
     * 사용자가 작성한 게시물 조회
     */
    public Page<PostResponseDto> getPostsByUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByAuthor_IdOrderByCreatedAtDesc(userId, pageable);
        return posts.map(PostResponseDto::new);
    }

    /**
     * 태그로 게시물 검색
     * 
     * @param tag 검색할 태그
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 해당 태그를 가진 게시물 목록
     */
    public Page<PostResponseDto> getPostsByTag(String tag, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Post> posts = postRepository.findByTagsContaining(tag, pageable);
        return posts.map(PostResponseDto::new);
    }
    
    /**
     * 아티스트명 또는 곡명으로 게시물 검색
     * 
     * @param keyword 검색 키워드
     * @param page 페이지 번호
     * @param size 페이지 크기
     * @return 검색 결과 게시물 목록
     */
    public Page<PostResponseDto> searchPosts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postRepository.searchByKeyword(keyword, pageable);
        return posts.map(PostResponseDto::new);
    }
}
