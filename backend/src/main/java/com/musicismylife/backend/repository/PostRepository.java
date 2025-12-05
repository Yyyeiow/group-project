package com.musicismylife.backend.repository;

import com.musicismylife.backend.domain.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
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
    
    //?쒓렇濡?寃뚯떆臾?寃??(?섏씠吏?吏??
    Page<Post> findByTagsContaining(String tag, Pageable pageable);
}
