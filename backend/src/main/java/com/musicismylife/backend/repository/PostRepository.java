package main.java.com.musicismylife.backend.repository;

import com.musicismylife.backend.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    //최신순으로 모든 게시물 조회
    List<Post> findAllByOrderByCreatedAtDesc();

    //작성자별로 모든 게시물 조회
    List<Post> findByAuthorOrderByCreatedAtDesc(String author);

    //스포티파이 트랙 ID별로 모든 게시물 조회
    List<Post> findBySpotifyTrackIdOrderByCreatedAtDesc(String spotifyTrackId);
}
