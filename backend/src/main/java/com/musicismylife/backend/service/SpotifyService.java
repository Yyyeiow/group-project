package com.musicismylife.backend.service;

import com.musicismylife.backend.config.SpotifyConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.core5.http.ParseException;
import org.springframework.stereotype.Service;
import se.michaelthelin.spotify.SpotifyApi;
import se.michaelthelin.spotify.exceptions.SpotifyWebApiException;
import se.michaelthelin.spotify.model_objects.credentials.ClientCredentials;
import se.michaelthelin.spotify.model_objects.specification.Track;
import se.michaelthelin.spotify.requests.authorization.client_credentials.ClientCredentialsRequest;
import se.michaelthelin.spotify.requests.data.search.simplified.SearchTracksRequest;
import se.michaelthelin.spotify.requests.data.tracks.GetTrackRequest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Spotify API와 통신하는 서비스
 * 
 * 이 서비스가 하는 일:
 * 1. Spotify에 로그인 (Access Token 받기)
 * 2. 노래 검색하기
 * 3. 특정 트랙의 상세 정보 가져오기
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SpotifyService {

    private final SpotifyConfig spotifyConfig;
    private SpotifyApi spotifyApi;
    private String accessToken;

    /**
     * Spotify API 초기화 및 인증
     * Spotify에 로그인해서 Access Token을 받아옵니다.
     * (Access Token = Spotify API를 사용할 수 있는 열쇠)
     */
    private void authenticateSpotify() {
        try {
            // Spotify API 클라이언트 생성
            spotifyApi = new SpotifyApi.Builder()
                    .setClientId(spotifyConfig.getClientId())
                    .setClientSecret(spotifyConfig.getClientSecret())
                    .build();

            // Access Token 요청
            ClientCredentialsRequest clientCredentialsRequest = spotifyApi.clientCredentials().build();
            ClientCredentials clientCredentials = clientCredentialsRequest.execute();

            // Access Token 저장
            accessToken = clientCredentials.getAccessToken();
            spotifyApi.setAccessToken(accessToken);

            log.info("Spotify 인증 성공!");
        } catch (IOException | SpotifyWebApiException | ParseException e) {
            log.error("Spotify 인증 실패: " + e.getMessage());
            throw new RuntimeException("Spotify 인증에 실패했습니다.", e);
        }
    }

    /**
     * 노래 검색하기
     * 
     * @param query 검색어 (예: "BTS Dynamite")
     * @return 검색 결과 리스트 (최대 10개)
     * 
     * 각 결과에는:
     * - trackId: Spotify 트랙 ID
     * - trackName: 노래 제목
     * - artistName: 아티스트 이름
     * - albumImageUrl: 앨범 커버 이미지 URL
     */
    public List<Map<String, String>> searchTracks(String query) {
        // Spotify 인증이 안 되어 있으면 먼저 인증
        if (spotifyApi == null || accessToken == null) {
            authenticateSpotify();
        }

        try {
            // Spotify API로 검색 요청
            SearchTracksRequest searchTracksRequest = spotifyApi.searchTracks(query)
                    .limit(10) // 최대 10개 결과
                    .build();

            // 검색 실행
            var result = searchTracksRequest.execute();
            Track[] tracks = result.getItems();

            // 결과를 Map 리스트로 변환 (프론트엔드에서 사용하기 쉽게)
            List<Map<String, String>> trackList = new ArrayList<>();
            for (Track track : tracks) {
                Map<String, String> trackInfo = new HashMap<>();
                trackInfo.put("trackId", track.getId());
                trackInfo.put("trackName", track.getName());
                trackInfo.put("artistName", track.getArtists()[0].getName());
                
                // 앨범 이미지 URL (가장 큰 이미지 선택)
                if (track.getAlbum().getImages().length > 0) {
                    trackInfo.put("albumImageUrl", track.getAlbum().getImages()[0].getUrl());
                }
                
                trackList.add(trackInfo);
            }

            return trackList;

        } catch (IOException | SpotifyWebApiException | ParseException e) {
            log.error("트랙 검색 실패: " + e.getMessage());
            throw new RuntimeException("트랙 검색에 실패했습니다.", e);
        }
    }

    /**
     * 특정 트랙의 상세 정보 가져오기
     * 
     * @param trackId Spotify 트랙 ID
     * @return 트랙 상세 정보
     * 
     * 반환값:
     * - trackId: Spotify 트랙 ID
     * - trackName: 노래 제목
     * - artistName: 아티스트 이름
     * - albumImageUrl: 앨범 커버 이미지 URL
     * - previewUrl: 미리듣기 URL (30초 샘플, 없을 수도 있음)
     */
    public Map<String, String> getTrackDetails(String trackId) {
        // Spotify 인증이 안 되어 있으면 먼저 인증
        if (spotifyApi == null || accessToken == null) {
            authenticateSpotify();
        }

        try {
            // Spotify API로 트랙 정보 요청
            GetTrackRequest getTrackRequest = spotifyApi.getTrack(trackId).build();
            Track track = getTrackRequest.execute();

            // 결과를 Map으로 변환
            Map<String, String> trackInfo = new HashMap<>();
            trackInfo.put("trackId", track.getId());
            trackInfo.put("trackName", track.getName());
            trackInfo.put("artistName", track.getArtists()[0].getName());
            
            // 앨범 이미지 URL
            if (track.getAlbum().getImages().length > 0) {
                trackInfo.put("albumImageUrl", track.getAlbum().getImages()[0].getUrl());
            }
            
            // 미리듣기 URL (있는 경우)
            if (track.getPreviewUrl() != null) {
                trackInfo.put("previewUrl", track.getPreviewUrl());
            }

            return trackInfo;

        } catch (IOException | SpotifyWebApiException | ParseException e) {
            log.error("트랙 정보 조회 실패: " + e.getMessage());
            throw new RuntimeException("트랙 정보 조회에 실패했습니다.", e);
        }
    }
}
