package com.musicismylife.backend.repository;

import com.musicismylife.backend.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    //理쒖떊?쒖쑝濡?紐⑤뱺 寃뚯떆臾?議고쉶
    List<Post> findAllByOrderByCreatedAtDesc();

    //?묒꽦?먮퀎濡?紐⑤뱺 寃뚯떆臾?議고쉶
    List<Post> findByAuthorOrderByCreatedAtDesc(com.musicismylife.backend.domain.User author);

    //?ㅽ룷?고뙆???몃옓 ID蹂꾨줈 紐⑤뱺 寃뚯떆臾?議고쉶
    List<Post> findBySpotifyTrackIdOrderByCreatedAtDesc(String spotifyTrackId);
    
    // 태그로 게시물 검색 (페이징 지원)
    Page<Post> findByTagsContaining(String tag, Pageable pageable);
    
    // 사용자 ID로 게시물 조회 (페이징 지원)
    Page<Post> findByAuthor_IdOrderByCreatedAtDesc(Long authorId, Pageable pageable);
    
    // 아티스트명 또는 곡명으로 검색 (대소문자 구분 없이, 페이징 지원)
    @Query("SELECT p FROM Post p WHERE " +
           "LOWER(p.artistName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.trackName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY p.createdAt DESC")
    Page<Post> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
}
