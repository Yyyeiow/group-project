# 🎵 Music Is My Life - 백엔드 API 문서

## 📌 기본 정보

**Base URL:** `http://localhost:8080`

**Content-Type:** `application/json`

**인증 방식:** JWT Bearer Token

---

## 🔐 인증 API

### 1. 회원가입

**POST** `/api/auth/signup`

로그인하지 않아도 됩니다.

**요청 예시:**
```json
{
  "username": "yeonwoo",
  "email": "yeonwoo@example.com",
  "password": "password123"
}
```

**응답 예시 (성공 - 201 Created):**
```json
{
  "id": 1,
  "username": "yeonwoo",
  "email": "yeonwoo@example.com",
  "createdAt": "2025-12-05T20:53:03"
}
```

**에러 예시 (400 Bad Request):**
```json
{
  "message": "이미 존재하는 사용자 이름입니다."
}
```

---

### 2. 로그인

**POST** `/api/auth/login`

로그인하지 않아도 됩니다.

**요청 예시:**
```json
{
  "username": "yeonwoo",
  "password": "password123"
}
```

**응답 예시 (성공 - 200 OK):**
```json
{
  "id": 1,
  "username": "yeonwoo",
  "email": "yeonwoo@example.com",
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzMzNDA1NjMxLCJleHAiOjE3MzM0OTIwMzF9.xxxxx"
}
```

**⚠️ 중요:** 
- `token` 값을 로컬 스토리지에 저장하세요!
- 이후 모든 API 요청에 이 토큰을 포함해야 합니다.

**저장 방법 (React 예시):**
```javascript
// 로그인 성공 후
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
});

const data = await response.json();
localStorage.setItem('token', data.token); // 토큰 저장
```

---

### 3. 내 정보 조회 (JWT 필요)

**GET** `/api/auth/me`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 예시:**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:8080/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**응답 예시 (200 OK):**
```json
{
  "id": 1,
  "username": "yeonwoo",
  "email": "yeonwoo@example.com",
  "profileImageUrl": "/uploads/images/profile123.jpg",
  "bio": "음악을 사랑하는 사람입니다 🎵",
  "createdAt": "2025-12-05T20:53:03"
}
```

---

### 4. 프로필 수정 (JWT 필요)

**PUT** `/api/auth/profile`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**요청 예시:**
```json
{
  "username": "new_username",
  "profileImageUrl": "/uploads/images/profile123.jpg",
  "bio": "새로운 자기소개입니다"
}
```

**⚠️ 주의:**
- 모든 필드는 선택사항입니다 (변경하고 싶은 것만 보내세요)
- `username`은 다른 사용자와 중복될 수 없습니다
- `profileImageUrl`은 먼저 이미지를 업로드하고 받은 URL을 사용하세요

**응답 예시 (200 OK):**
```json
{
  "id": 1,
  "username": "new_username",
  "email": "yeonwoo@example.com",
  "profileImageUrl": "/uploads/images/profile123.jpg",
  "bio": "새로운 자기소개입니다",
  "createdAt": "2025-12-05T20:53:03"
}
```

**에러 예시 (400 Bad Request):**
```json
"이미 존재하는 사용자 이름입니다."
```

---

## 📤 이미지 업로드 API

### 5. 단일 이미지 업로드

**POST** `/api/upload/image`

**Content-Type:** `multipart/form-data`

로그인하지 않아도 됩니다.

**Form Data:**
- `file`: 이미지 파일 (jpg, png, gif, webp만 가능, 최대 10MB)

**React 예시:**
```javascript
const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:8080/api/upload/image', {
    method: 'POST',
    body: formData  // Content-Type은 자동 설정됨
  });
  
  const data = await response.json();
  console.log('업로드된 이미지 URL:', data.url);
  return data.url;
};

// 파일 input 사용 예시
<input type="file" accept="image/*" onChange={async (e) => {
  const file = e.target.files[0];
  const imageUrl = await uploadImage(file);
  setImageUrl(imageUrl); // 업로드된 URL 저장
}} />
```

**응답 예시 (성공 - 201 Created):**
```json
{
  "url": "http://localhost:8080/uploads/images/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg",
  "originalFilename": "my-photo.jpg",
  "size": "245678"
}
```

**에러 예시:**
```json
{
  "error": "이미지 파일만 업로드 가능합니다. (jpg, png, gif, webp)"
}
```

---

### 6. 여러 이미지 업로드 (최대 3개)

**POST** `/api/upload/images`

**Content-Type:** `multipart/form-data`

로그인하지 않아도 됩니다.

**Form Data:**
- `files`: 이미지 파일들 (최대 3개, 각각 최대 10MB)

**React 예시:**
```javascript
const uploadMultipleImages = async (files) => {
  const formData = new FormData();
  
  // 여러 파일 추가
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  
  const response = await fetch('http://localhost:8080/api/upload/images', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log('업로드된 이미지 URLs:', data.urls);
  return data.urls;
};

// 여러 파일 input 사용 예시
<input type="file" accept="image/*" multiple onChange={async (e) => {
  const files = Array.from(e.target.files);
  if (files.length > 3) {
    alert('최대 3개까지만 업로드 가능합니다!');
    return;
  }
  const imageUrls = await uploadMultipleImages(files);
  setImageUrls(imageUrls); // 업로드된 URL 목록 저장
}} />
```

**응답 예시 (성공 - 201 Created):**
```json
{
  "urls": [
    "http://localhost:8080/uploads/images/abc123.jpg",
    "http://localhost:8080/uploads/images/def456.jpg",
    "http://localhost:8080/uploads/images/ghi789.jpg"
  ],
  "count": 3
}
```

---

## 🎵 Spotify API

### 7. 노래 검색

**GET** `/api/spotify/search?query={검색어}`

로그인하지 않아도 됩니다.

**요청 예시:**
```
GET /api/spotify/search?query=BTS
```

**응답 예시 (200 OK):**
```json
[
  {
    "trackId": "72IwoG8tqvIWV10IHjpNNA",
    "trackName": "Dynamite",
    "artistName": "BTS",
    "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b273668914e625d75e5fe3f1da51"
  },
  {
    "trackId": "16LATbHXLu0gh8MCw1hUGl",
    "trackName": "봄날",
    "artistName": "BTS",
    "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b273e23a7fd165b24c517a66a69f"
  }
]
```

**React 예시:**
```javascript
const searchMusic = async (query) => {
  const response = await fetch(`http://localhost:8080/api/spotify/search?query=${query}`);
  const tracks = await response.json();
  setSearchResults(tracks); // 검색 결과 저장
};
```

---

### 8. 트랙 상세 정보

**GET** `/api/spotify/track/{trackId}`

로그인하지 않아도 됩니다.

**요청 예시:**
```
GET /api/spotify/track/72IwoG8tqvIWV10IHjpNNA
```

**응답 예시 (200 OK):**
```json
{
  "trackId": "72IwoG8tqvIWV10IHjpNNA",
  "trackName": "Dynamite",
  "artistName": "BTS",
  "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b273668914e625d75e5fe3f1da51",
  "previewUrl": "https://p.scdn.co/mp3-preview/xxxxx"
}
```

---

## 📝 게시물 API

### 9. 게시물 작성 ⭐ (JWT 필요)

**POST** `/api/posts`

**⚠️ 반드시 로그인 토큰이 필요합니다!**

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIi...
Content-Type: application/json
```

**요청 예시:**
```json
{
  "title": "내가 제일 좋아하는 노래",
  "description": "이 노래 들으면 기분이 좋아져요",
  "content": "BTS의 Dynamite는 정말 신나는 노래입니다! 아침에 일어나서 듣기 좋아요.",
  "spotifyTrackId": "72IwoG8tqvIWV10IHjpNNA",
  "imageUrls": ["https://example.com/image1.jpg"],
  "representImageUrl": "https://example.com/image1.jpg",
  "tags": ["BTS", "팝", "신나는노래"]
}
```

**React 예시:**
```javascript
const createPost = async (postData) => {
  const token = localStorage.getItem('token'); // 저장된 토큰 가져오기
  
  const response = await fetch('http://localhost:8080/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // 토큰 포함!
    },
    body: JSON.stringify(postData)
  });
  
  if (response.status === 401) {
    alert('로그인이 필요합니다!');
    return;
  }
  
  const createdPost = await response.json();
  console.log('게시물 생성 성공:', createdPost);
};
```

**응답 예시 (성공 - 201 Created):**
```json
{
  "id": 1,
  "description": "이 노래 들으면 기분이 좋아져요",
  "artist": "BTS",
  "title": "Dynamite",
  "content": "BTS의 Dynamite는 정말 신나는 노래입니다!",
  "authorUsername": "yeonwoo",
  "spotifyTrackId": "72IwoG8tqvIWV10IHjpNNA",
  "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b273...",
  "imageUrls": ["/uploads/images/abc123.jpg"],
  "representImageUrl": "/uploads/images/abc123.jpg",
  "tags": ["BTS", "팝", "신나는노래"],
  "createdAt": "2025-12-05T20:55:00",
  "updatedAt": "2025-12-05T20:55:00"
}
```

**에러 예시 (401 Unauthorized - 토큰 없음):**
```json
{
  "status": 401,
  "message": "인증이 필요합니다"
}
```

---

**⚠️ 중요: 이미지 업로드 흐름**
```javascript
// 1. 먼저 이미지 파일들을 업로드
const files = [...]; // 사용자가 선택한 이미지 파일들
const uploadedUrls = await uploadMultipleImages(files);

// 2. 업로드된 URL들을 게시물 작성 시 사용
const postData = {
  title: "제목",
  description: "요약",
  content: "본문",
  spotifyTrackId: "72IwoG8tqvIWV10IHjpNNA",
  imageUrls: uploadedUrls,  // 업로드된 URL 사용!
  representImageUrl: uploadedUrls[0],
  tags: ["태그1", "태그2"]
};

const token = localStorage.getItem('token');
await fetch('http://localhost:8080/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(postData)
});
```

---

### 10. 게시물 목록 조회

**GET** `/api/posts?page=0&size=10`

로그인하지 않아도 됩니다.

**쿼리 파라미터:**
- `page`: 페이지 번호 (0부터 시작)
- `size`: 한 페이지에 보여줄 게시물 수

**요청 예시:**
```
GET /api/posts?page=0&size=10
```

**응답 예시 (200 OK):**
```json
{
  "content": [
    {
      "id": 3,
      "description": "가장 최근에 작성됨",
      "artist": "BTS",
      "title": "Dynamite",
      "content": "본문 내용...",
      "authorUsername": "yeonwoo",
      "spotifyTrackId": "72IwoG8tqvIWV10IHjpNNA",
      "albumImageUrl": "https://...",
      "imageUrls": ["/uploads/images/..."],
      "representImageUrl": "/uploads/images/...",
      "tags": ["BTS", "팝"],
      "saved": false,
      "createdAt": "2025-12-05T20:55:00",
      "updatedAt": "2025-12-05T20:55:00"
    },
    {
      "id": 2,
      "description": "봄날 듣기 좋은 날",
      "artist": "BTS",
      "title": "봄날",
      "authorUsername": "yeonwoo",
      "albumImageUrl": "https://...",
      "representImageUrl": "/uploads/images/...",
      "tags": ["BTS", "발라드"],
      "saved": false,
      "createdAt": "2025-12-05T19:30:00",
      "updatedAt": "2025-12-05T19:30:00"
    }
  ],
  "totalElements": 25,
  "totalPages": 3,
  "number": 0,
  "size": 10
}
```

**React 예시:**
```javascript
const [posts, setPosts] = useState([]);
const [page, setPage] = useState(0);

const loadPosts = async () => {
  const response = await fetch(`http://localhost:8080/api/posts?page=${page}&size=10`);
  const data = await response.json();
  setPosts(data.content); // 게시물 배열
  setTotalPages(data.totalPages); // 전체 페이지 수
};
```

---

### 11. 게시물 상세 조회

**GET** `/api/posts/{postId}`

로그인하지 않아도 됩니다.

**요청 예시:**
```
GET /api/posts/1
```

**응답 예시 (200 OK):**
```json
{
  "id": 1,
  "description": "이 노래 들으면 기분이 좋아져요",
  "artist": "BTS",
  "title": "Dynamite",
  "content": "BTS의 Dynamite는 정말 신나는 노래입니다! 아침에 일어나서 듣기 좋아요.",
  "authorUsername": "yeonwoo",
  "spotifyTrackId": "72IwoG8tqvIWV10IHjpNNA",
  "albumImageUrl": "https://...",
  "imageUrls": ["/uploads/images/abc123.jpg"],
  "representImageUrl": "/uploads/images/abc123.jpg",
  "tags": ["BTS", "팝", "신나는노래"],
  "createdAt": "2025-12-05T20:55:00",
  "updatedAt": "2025-12-05T20:55:00"
}
```

---

### 12. 태그로 게시물 검색

**GET** `/api/posts/search/tag?tag={태그이름}&page=0&size=10`

로그인하지 않아도 됩니다.

**요청 예시:**
```
GET /api/posts/search/tag?tag=BTS&page=0&size=10
```

**응답:** 게시물 목록 조회와 동일한 형식

---

### 13. 아티스트명/곡명으로 게시물 검색

**GET** `/api/posts/search?keyword={검색어}&page=0&size=9`

로그인하지 않아도 됩니다.

**🔥 중요 업데이트:**
- **대소문자 구분 없이 검색됩니다!** (`sunmi`, `Sunmi`, `SUNMI` 모두 동일한 결과)
- 아티스트명과 곡명을 모두 검색합니다
- 한국어/영어 모두 검색 가능 (Spotify에서 제공하는 데이터 기준)

**요청 예시:**
```
GET /api/posts/search?keyword=sunmi&page=0&size=9
GET /api/posts/search?keyword=선미&page=0&size=9
GET /api/posts/search?keyword=dynamite&page=0&size=9
```

**응답 예시 (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "description": "선미 노래 최고!",
      "artist": "Sunmi",
      "title": "Gashina",
      "albumImageUrl": "https://...",
      "representImageUrl": "/uploads/images/xxx.jpg",
      "tags": ["케이팝", "선미"],
      "authorUsername": "yeonwoo",
      "createdAt": "2025-12-06T10:30:00"
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 9
  },
  "totalElements": 15,
  "totalPages": 2,
  "last": false
}
```

**프론트엔드 사용 예시:**
```javascript
// api.js에서
export const searchPosts = async (keyword, page = 0, size = 9) => {
  return apiRequest(`/api/posts/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`, {
    method: 'GET'
  });
};

// 컴포넌트에서
const handleSearch = async (keyword) => {
  const result = await searchPosts(keyword, 0, 9);
  setPosts(result.content);
  setTotalPages(result.totalPages);
};
```

---

### 14. 게시물 수정 (JWT 필요)

**PUT** `/api/posts/{postId}`

**본인이 작성한 게시물만 수정 가능합니다.**

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**요청 예시:**
```json
{
  "title": "수정된 제목",
  "description": "수정된 한 줄 요약",
  "content": "수정된 본문",
  "imageUrls": ["https://example.com/new-image.jpg"],
  "representImageUrl": "https://example.com/new-image.jpg",
  "tags": ["수정된태그"]
}
```

---

### 15. 게시물 삭제 (JWT 필요)

**DELETE** `/api/posts/{postId}`

**본인이 작성한 게시물만 삭제 가능합니다.**

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 예시:**
```
DELETE /api/posts/1
```

**응답 (204 No Content):** 본문 없음

---

## ❤️ 좋아요(북마크) API

### 16. 좋아요 토글 (JWT 필요)

**POST** `/api/likes/{postId}`

좋아요가 없으면 추가, 있으면 취소합니다.

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 예시:**
```
POST /api/likes/1
```

**응답 예시 (200 OK):**
```json
{
  "isLiked": true,
  "postId": 1
}
```

**프론트엔드 사용 예시:**
```javascript
const toggleLike = async (postId) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:8080/api/likes/${postId}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log(data.isLiked ? '좋아요 추가' : '좋아요 취소');
  return data.isLiked;
};
```

---

### 17. 좋아요 상태 확인 (JWT 필요)

**GET** `/api/likes/{postId}`

현재 사용자가 해당 게시물에 좋아요를 눌렀는지 확인합니다.

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**요청 예시:**
```
GET /api/likes/1
```

**응답 예시 (200 OK):**
```json
{
  "isLiked": true,
  "postId": 1
}
```

---

### 18. 내가 좋아요한 게시물 목록 (JWT 필요)

**GET** `/api/likes`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**응답 예시 (200 OK):**
```json
[
  {
    "id": 1,
    "description": "좋아요한 게시물",
    "artist": "Sunmi",
    "title": "Gashina",
    "albumImageUrl": "https://...",
    "representImageUrl": "/uploads/images/xxx.jpg",
    "tags": ["케이팝"],
    "authorUsername": "otheruser",
    "createdAt": "2025-12-06T10:30:00"
  }
]
```

**프론트엔드 사용 예시:**
```javascript
const getLikedPosts = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:8080/api/likes', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  const posts = await response.json();
  return posts;
};
```

---

### 19. 특정 사용자의 게시물 조회

**GET** `/api/posts/user/{userId}?page=0&size=10`

로그인하지 않아도 됩니다.

**요청 예시:**
```
GET /api/posts/user/1?page=0&size=10
```

**응답:** 게시물 목록 조회와 동일한 형식 (페이징 포함)

**프론트엔드 사용 예시:**
```javascript
const getUserPosts = async (userId, page = 0, size = 10) => {
  const response = await fetch(
    `http://localhost:8080/api/posts/user/${userId}?page=${page}&size=${size}`
  );
  return await response.json();
};
```

---

## 🚨 에러 코드 정리

| 상태 코드 | 의미 | 예시 상황 |
|---------|------|----------|
| 200 | 성공 | 조회, 수정 성공 |
| 201 | 생성 성공 | 회원가입, 게시물 작성 성공 |
| 204 | 성공 (본문 없음) | 삭제 성공 |
| 400 | 잘못된 요청 | 필수 필드 누락, 유효성 검증 실패 |
| 401 | 인증 필요 | 토큰 없음, 토큰 만료 |
| 403 | 권한 없음 | 다른 사람의 게시물 수정 시도 |
| 404 | 찾을 수 없음 | 존재하지 않는 게시물 조회 |
| 500 | 서버 에러 | 서버 내부 오류 |

---

## 💡 프론트엔드 체크리스트

### ✅ 필수 구현 사항

1. **로그인 토큰 관리**
   ```javascript
   // 로그인 성공 시
   localStorage.setItem('token', response.token);
   
   // API 호출 시
   headers: {
     'Authorization': `Bearer ${localStorage.getItem('token')}`
   }
   
   // 로그아웃 시
   localStorage.removeItem('token');
   ```

2. **401 에러 처리 (토큰 만료)**
   ```javascript
   if (response.status === 401) {
     alert('로그인이 만료되었습니다.');
     localStorage.removeItem('token');
     navigate('/login'); // 로그인 페이지로 이동
   }
   ```

3. **로딩 상태 표시**
   - API 호출 중에는 로딩 스피너 표시

4. **에러 메시지 표시**
   - 400, 500 에러 발생 시 사용자에게 알림

---

## 🔧 테스트 방법

### Thunder Client (VS Code 확장)

1. VS Code에서 Thunder Client 설치
2. New Request 클릭
3. 위의 API 문서대로 테스트

### 브라우저 콘솔 (간단 테스트)

```javascript
// 1. 회원가입
fetch('http://localhost:8080/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'test',
    email: 'test@test.com',
    password: 'test1234'
  })
}).then(res => res.json()).then(console.log);

// 2. 로그인
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'test',
    password: 'test1234'
  })
}).then(res => res.json()).then(data => {
  console.log('토큰:', data.token);
  localStorage.setItem('token', data.token);
});

// 3. 노래 검색
fetch('http://localhost:8080/api/spotify/search?query=BTS')
  .then(res => res.json())
  .then(console.log);
```

---

## ✅ 이미 구현된 프론트엔드 파일들

백엔드 연동이 **완료된** 파일들입니다. 참고해서 작업하세요!

### 📁 `src/api/api.js` (중앙 API 관리 파일)

**모든 백엔드 API를 한 곳에서 관리하는 파일입니다.**

주요 기능:
- JWT 토큰 자동 관리 (localStorage)
- 401 에러 시 자동 로그인 페이지 이동
- 모든 요청에 Authorization 헤더 자동 추가

**사용 가능한 함수들:**
```javascript
// 인증
import { signup, login, logout } from '../api/api';

// Spotify
import { searchMusic, getTrackDetails } from '../api/api';

// 이미지 업로드
import { uploadImages } from '../api/api';

// 게시물
import { getPosts, getPost, createPost, updatePost, deletePost, getPostsByTag } from '../api/api';
```

**사용 예시:**
```javascript
// 로그인
const data = await login('yeonwoo', 'password123');
// 자동으로 localStorage에 token 저장됨!

// 게시물 목록
const posts = await getPosts(0, 9); // 0페이지, 9개씩

// 게시물 작성 (자동으로 토큰 포함)
const newPost = await createPost({
  description: "한 줄 요약",
  content: "본문 내용",
  spotifyTrackId: "abc123",
  title: "노래 제목",
  artist: "아티스트",
  albumImageUrl: "https://...",
  representImageUrl: "/uploads/images/xxx.jpg",
  imageUrls: ["/uploads/images/xxx.jpg"],
  tags: ["힙합", "신나는"]
});
```

---

### 📁 `src/Pages/LoginPage.jsx` (로그인 페이지)

**완료된 기능:**
- ✅ username, password 입력
- ✅ 백엔드 `/api/auth/login` 연동
- ✅ JWT 토큰 localStorage 저장
- ✅ 로그인 성공 시 홈페이지 이동
- ✅ Enter 키 지원
- ✅ 로딩 상태 표시

**주요 코드:**
```javascript
const handleLogin = async () => {
  const data = await login(username, password);
  // 토큰은 api.js에서 자동 저장됨!
  navigate('/');
};
```

---

### 📁 `src/Pages/HomePage.jsx` (메인 페이지)

**완료된 기능:**
- ✅ 백엔드에서 게시물 목록 가져오기
- ✅ 페이지네이션 (한 페이지당 9개)
- ✅ 로딩 상태 표시
- ✅ 빈 화면 처리
- ✅ Spotify 앨범 커버 표시

**주요 코드:**
```javascript
const loadPosts = async () => {
  const data = await getPosts(currentPage - 1, itemsPerPage);
  const formattedPosts = data.content.map(post => ({
    id: post.id,
    description: post.description, // 한 줄 요약
    artist: post.artist,
    title: post.title,
    albumImageUrl: post.albumImageUrl, // Spotify 앨범 커버
    // ...
  }));
  setGridItems(formattedPosts);
};
```

**중요! 백엔드 응답 필드명:**
- `artist` (O) - `artistName` (X)
- `title` (O) - `trackName` (X)

---

### 📁 `src/components/HomepageCP/PostCard.jsx` (게시물 카드)

**완료된 기능:**
- ✅ Spotify 앨범 커버를 배경 이미지로 표시
- ✅ 한 줄 요약(description) 표시
- ✅ 클릭 시 상세 페이지 이동 준비 (아직 페이지 미구현)

**주요 코드:**
```javascript
// 앨범 커버를 배경으로 사용!
const imageUrl = post.albumImageUrl;

<div className="post-image" style={{
  backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}>
  <div className="post-description">{post.description}</div>
</div>
```

**주의사항:**
- `albumImageUrl`은 Spotify CDN URL이므로 `http://localhost:8080` 붙이면 안됨!
- `representImageUrl`은 백엔드 URL이므로 `http://localhost:8080` 필요

---

### 📁 `src/Pages/WritePage.jsx` (게시물 작성)

**완료된 기능:**
- ✅ 노래 검색 및 선택 (MusicSelector)
- ✅ 한 줄 요약 입력 (MemoryLineInput)
- ✅ 본문 내용 입력 (RichTextEditor)
- ✅ 이미지 업로드 및 대표 이미지 선택
- ✅ 태그 입력 (TagInput)
- ✅ 필수 항목 체크 (노래, 한 줄 요약, 대표 이미지)
- ✅ 순차 처리: 이미지 업로드 → 게시물 작성
- ✅ 성공 시 홈페이지 이동

**주요 코드:**
```javascript
const [memoryLine, setMemoryLine] = useState(""); // 한 줄 요약!

const handleSubmit = async () => {
  // 1. 이미지 업로드
  const uploadedUrls = await uploadImages(imageFiles);
  
  // 2. 게시물 데이터 구성
  const postData = {
    description: memoryLine, // 한 줄 요약 (카드에 표시!)
    content: content, // 본문 전체
    spotifyTrackId: selectedSong.id,
    title: selectedSong.title,
    artist: selectedSong.artist,
    albumImageUrl: selectedSong.albumArtUrl,
    representImageUrl: uploadedUrls[0],
    imageUrls: uploadedUrls,
    tags: tags // 배열 그대로!
  };
  
  // 3. 게시물 생성
  await createPost(postData);
  navigate('/');
};
```

**중요! 백엔드 필드명 매칭:**
```javascript
// 프론트 → 백엔드
description     // 한 줄 요약 (필수!)
content         // 본문 내용
spotifyTrackId  // Spotify 트랙 ID
title           // 노래 제목
artist          // 아티스트 이름
albumImageUrl   // 앨범 커버
representImageUrl // 대표 이미지
imageUrls       // 배열
tags            // 배열 ["힙합", "신나는"]
```

---

### 📁 `src/components/WritepageCP/MusicSelector.jsx` (음악 검색)

**완료된 기능:**
- ✅ Spotify API 실시간 검색
- ✅ 검색 결과를 카드 형태로 표시
- ✅ 선택한 노래 하이라이트

**주요 코드:**
```javascript
const handleMusicSearch = async () => {
  const data = await searchMusic(searchQuery);
  
  // 백엔드 → 프론트 데이터 변환
  const formattedResults = data.map(track => ({
    id: track.trackId,
    title: track.trackName,
    artist: track.artistName,
    albumArtUrl: track.albumImageUrl
  }));
  
  setSearchResults(formattedResults);
};
```

---

### 📁 `src/components/WritepageCP/MemoryLineInput.jsx` (한 줄 요약)

**완료된 기능:**
- ✅ 한 줄 요약 입력 필드
- ✅ WritePage와 state 연결

**사용법:**
```javascript
const [memoryLine, setMemoryLine] = useState("");

<MemoryLineInput memoryLine={memoryLine} setMemoryLine={setMemoryLine} />
```

---

## 🚨 주의사항

### 1. 필드명 불일치 주의! ⚠️

**백엔드 응답 (PostResponseDto) - 2025-12-06 업데이트:**
```json
{
  "id": 1,
  "description": "한 줄 요약",
  "artist": "NCT 127",           // ✅ 아티스트명 (artistName이 아님!)
  "title": "Fact Check",         // ✅ 곡명 (trackName이 아님!)
  "content": "본문 내용",
  "authorUsername": "yeonwoo",   // ✅ 작성자명 (authorName이 아님!)
  "spotifyTrackId": "...",
  "albumImageUrl": "https://...",
  "imageUrls": ["/uploads/..."],
  "representImageUrl": "/uploads/...",
  "tags": ["태그1"],
  "saved": false,
  "createdAt": "2025-12-06T...",
  "updatedAt": "2025-12-06T..."
}
```

**⚠️ 주의:** `authorId`는 응답에 포함되지 않습니다! 작성자 정보는 `authorUsername`만 제공됩니다.

### 2. 이미지 URL 처리

```javascript
// Spotify 앨범 커버 (외부 URL)
<img src={post.albumImageUrl} />  // http://localhost:8080 붙이면 안됨!

// 업로드한 이미지 (백엔드 URL)
<img src={`http://localhost:8080${post.representImageUrl}`} />
```

### 3. 태그는 배열로 전송!

```javascript
// ❌ 잘못된 방법
tags: tags.join(",")  // "힙합,신나는"

// ✅ 올바른 방법
tags: tags  // ["힙합", "신나는"]
```

### 4. description vs content

- `description`: 한 줄 요약 (카드에 표시되는 짧은 텍스트)
- `content`: 본문 전체 (상세 페이지에 표시될 긴 텍스트)

### 5. 검색 기능 개선 (2025-12-06 업데이트)

**✨ 대소문자 구분 없는 검색**
```javascript
// 다음 검색어들은 모두 같은 결과를 반환합니다
searchPosts("sunmi", 0, 9);    // ✅
searchPosts("Sunmi", 0, 9);    // ✅
searchPosts("SUNMI", 0, 9);    // ✅
```

**✨ 한글/영문 모두 지원**
- Spotify API에서 제공하는 데이터에 한글이 포함되어 있으면 한글 검색도 가능합니다
- 예: "선미", "방탄소년단", "아이유" 등

**✨ 검색 대상**
- 아티스트명 (`artistName`) 
- 곡명 (`trackName`)
- 두 필드를 OR 조건으로 검색합니다

---

## 📞 문의사항

백엔드 담당자에게 물어보세요! 😊

- API가 작동하지 않으면 서버가 실행 중인지 확인하세요
- CORS 에러가 나면 백엔드 설정을 확인해주세요
- 토큰 관련 문제는 JWT 토큰 형식을 확인해주세요
