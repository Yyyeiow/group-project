package main.java.com.musicismylife.backend.repository;

import com.musicismylife.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    //아이디로 사용자 조회
    Optional<User> findByUsername(String username);
    
    //이메일로 사용자 조회
    Optional<User> findByEmail(String email);

    //아이디 중복 체크
    boolean existsByUsername(String username);

    //이메일 중복 체크
    boolean existsByEmail(String email);

}
