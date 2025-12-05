package com.musicismylife.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import lombok.Getter;

/**
 * Spotify API 설정 클래스
 * application.properties에서 Spotify 클라이언트 ID와 시크릿을 읽어옵니다.
 */
@Configuration
@Getter
public class SpotifyConfig {
    
    // application.properties에서 spotify.client-id 값을 가져옴
    @Value("${spotify.client-id}")
    private String clientId;
    
    // application.properties에서 spotify.client-secret 값을 가져옴
    @Value("${spotify.client-secret}")
    private String clientSecret;
}
