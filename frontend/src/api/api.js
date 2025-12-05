/**
 * 백엔드 API와 통신하는 파일
 * 
 * 이 파일이 하는 일:
 * - 백엔드 서버에 HTTP 요청을 보냄
 * - 응답을 받아서 프론트엔드에 전달
 * 
 * 왜 이렇게 만들어?
 * - 모든 API 주소를 한 곳에서 관리할 수 있음
 * - 나중에 백엔드 주소가 바뀌면 여기만 수정하면 됨!
 */

// 백엔드 서버 주소
const API_BASE_URL = 'http://localhost:8080';

/**
 * API 요청을 보내는 기본 함수
 * 
 * @param {string} endpoint - API 경로 (예: '/api/auth/login')
 * @param {object} options - fetch 옵션 (method, headers, body 등)
 * @returns {Promise} - 응답 데이터
 */
const apiRequest = async (endpoint, options = {}) => {
  // 1. 전체 URL 만들기
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 2. 기본 헤더 설정
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // 3. 토큰이 있으면 Authorization 헤더에 추가
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    // 4. 백엔드에 요청 보내기
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 5. 응답 상태 코드 확인
    if (response.status === 401) {
      // 토큰 만료 또는 인증 실패
      localStorage.removeItem('token');
      alert('로그인이 필요합니다!');
      window.location.href = '/login';
      return null;
    }

    if (!response.ok) {
      // 에러 발생
      console.error('API 에러 응답:', {
        status: response.status,
        statusText: response.statusText,
        url: url
      });
      const errorData = await response.json().catch(() => ({ message: '요청에 실패했습니다.' }));
      console.error('에러 데이터:', errorData);
      throw new Error(errorData.message || `요청에 실패했습니다. (${response.status})`);
    }

    // 6. 성공! 데이터 반환
    const text = await response.text();
    return text ? JSON.parse(text) : {}; // 빈 응답 처리

  } catch (error) {
    console.error('API 요청 에러:', error);
    throw error;
  }
};

// ===========================
// 🔐 인증 관련 API
// ===========================

/**
 * 회원가입
 * 
 * @param {object} userData - { username, email, password }
 * @returns {Promise} - 생성된 사용자 정보
 */
export const signup = async (userData) => {
  return apiRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * 로그인
 * 
 * @param {object} credentials - { username, password }
 * @returns {Promise} - { id, username, email, token }
 */
export const login = async (credentials) => {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  
  // 로그인 성공하면 토큰 저장!
  if (data && data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
  }
  
  return data;
};

/**
 * 로그아웃
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  window.location.href = '/login';
};

// ===========================
// 🔍 게시물 검색 API
// ===========================

/**
 * 게시물 검색 (아티스트명 또는 곡명)
 * 
 * @param {string} keyword - 검색 키워드
 * @param {number} page - 페이지 번호 (기본값: 0)
 * @param {number} size - 페이지 크기 (기본값: 9)
 * @returns {Promise} - 검색 결과 게시물 목록
 */
export const searchPosts = async (keyword, page = 0, size = 9) => {
  return apiRequest(`/api/posts/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`);
};

// ===========================
// 🎵 Spotify API
// ===========================

/**
 * 노래 검색
 * 
 * @param {string} query - 검색어 (예: "아이유")
 * @returns {Promise} - 노래 목록 [{ trackId, trackName, artistName, albumImageUrl }, ...]
 */
export const searchMusic = async (query) => {
  return apiRequest(`/api/spotify/search?query=${encodeURIComponent(query)}`);
};

/**
 * 트랙 상세 정보
 * 
 * @param {string} trackId - Spotify 트랙 ID
 * @returns {Promise} - 트랙 정보 { trackId, trackName, artistName, albumImageUrl, previewUrl }
 */
export const getTrackDetails = async (trackId) => {
  return apiRequest(`/api/spotify/track/${trackId}`);
};

// ===========================
// 📤 이미지 업로드 API
// ===========================

/**
 * 이미지 파일 업로드
 * 
 * @param {File[]} files - 이미지 파일 배열 (최대 3개)
 * @returns {Promise} - { urls: [...], count: 3 }
 */
export const uploadImages = async (files) => {
  const formData = new FormData();
  
  // 파일들을 FormData에 추가
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }

  // 이미지 업로드는 JSON이 아니라 FormData를 보내야 함!
  const response = await fetch(`${API_BASE_URL}/api/upload/images`, {
    method: 'POST',
    body: formData, // Content-Type은 자동으로 설정됨
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: '이미지 업로드에 실패했습니다.' }));
    throw new Error(errorData.error || '이미지 업로드에 실패했습니다.');
  }

  // 백엔드 응답: { urls: [...], count: N }
  const result = await response.json();
  return result.urls; // URL 배열만 반환
};

// ===========================
// 📝 게시물 API
// ===========================

/**
 * 게시물 목록 조회
 * 
 * @param {number} page - 페이지 번호 (0부터 시작)
 * @param {number} size - 한 페이지에 보여줄 개수
 * @returns {Promise} - { content: [...], totalElements, totalPages, number, size }
 */
export const getPosts = async (page = 0, size = 9) => {
  return apiRequest(`/api/posts?page=${page}&size=${size}`);
};

/**
 * 게시물 상세 조회
 * 
 * @param {number} postId - 게시물 ID
 * @returns {Promise} - 게시물 정보
 */
export const getPost = async (postId) => {
  return apiRequest(`/api/posts/${postId}`);
};

/**
 * 게시물 작성
 * 
 * @param {object} postData - 게시물 데이터
 * @returns {Promise} - 생성된 게시물 정보
 */
export const createPost = async (postData) => {
  return apiRequest('/api/posts', {
    method: 'POST',
    body: JSON.stringify(postData),
  });
};

/**
 * 게시물 수정
 * 
 * @param {number} postId - 게시물 ID
 * @param {object} postData - 수정할 데이터
 * @returns {Promise} - 수정된 게시물 정보
 */
export const updatePost = async (postId, postData) => {
  return apiRequest(`/api/posts/${postId}`, {
    method: 'PUT',
    body: JSON.stringify(postData),
  });
};

/**
 * 게시물 삭제
 * 
 * @param {number} postId - 게시물 ID
 * @returns {Promise}
 */
export const deletePost = async (postId) => {
  return apiRequest(`/api/posts/${postId}`, {
    method: 'DELETE',
  });
};

/**
 * 사용자가 작성한 게시물 조회
 * 
 * @param {number} userId - 사용자 ID
 * @param {number} page - 페이지 번호
 * @param {number} size - 한 페이지 크기
 * @returns {Promise} - 게시물 목록
 */
export const getPostsByUser = async (userId, page = 0, size = 9) => {
  return apiRequest(`/api/posts/user/${userId}?page=${page}&size=${size}`);
};

/**
 * 태그로 게시물 검색
 * 
 * @param {string} tag - 태그 이름
 * @param {number} page - 페이지 번호
 * @param {number} size - 한 페이지 크기
 * @returns {Promise} - 게시물 목록
 */
export const getPostsByTag = async (tag, page = 0, size = 9) => {
  return apiRequest(`/api/posts/search/tag?tag=${encodeURIComponent(tag)}&page=${page}&size=${size}`);
};

// ===========================
// ❤️ 좋아요(북마크) API
// ===========================

/**
 * 좋아요 토글 (추가/취소)
 * 
 * @param {number} postId - 게시물 ID
 * @returns {Promise} - { isLiked, postId }
 */
export const toggleLike = async (postId) => {
  return apiRequest(`/api/likes/${postId}`, {
    method: 'POST',
  });
};

/**
 * 좋아요 상태 확인
 * 
 * @param {number} postId - 게시물 ID
 * @returns {Promise} - { isLiked, postId }
 */
export const checkLikeStatus = async (postId) => {
  return apiRequest(`/api/likes/${postId}`);
};

/**
 * 좋아요한 게시물 목록
 * 
 * @returns {Promise} - 좋아요한 게시물 목록
 */
export const getLikedPosts = async () => {
  return apiRequest('/api/likes');
};

// ===========================
// 👤 프로필 API
// ===========================

/**
 * 내 정보 조회
 * 
 * @returns {Promise} - { id, username, email, profileImageUrl, bio }
 */
export const getMyInfo = async () => {
  return apiRequest('/api/auth/me');
};

/**
 * 프로필 업데이트
 * 
 * @param {object} profileData - { username, profileImageUrl, bio }
 * @returns {Promise} - 업데이트된 사용자 정보
 */
export const updateProfile = async (profileData) => {
  return apiRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};
