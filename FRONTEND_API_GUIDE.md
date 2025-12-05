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

## 📤 이미지 업로드 API

### 3. 단일 이미지 업로드

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

### 4. 여러 이미지 업로드 (최대 3개)

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

### 5. 노래 검색

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

### 6. 트랙 상세 정보

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

### 7. 게시물 작성 ⭐ (JWT 필요)

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
  "title": "내가 제일 좋아하는 노래",
  "description": "이 노래 들으면 기분이 좋아져요",
  "content": "BTS의 Dynamite는 정말 신나는 노래입니다!",
  "spotifyTrackId": "72IwoG8tqvIWV10IHjpNNA",
  "trackName": "Dynamite",
  "artistName": "BTS",
  "albumImageUrl": "https://i.scdn.co/image/ab67616d0000b273...",
  "imageUrls": ["https://example.com/image1.jpg"],
  "representImageUrl": "https://example.com/image1.jpg",
  "tags": ["BTS", "팝", "신나는노래"],
  "authorId": 1,
  "authorName": "yeonwoo",
  "createdAt": "2025-12-05T20:55:00"
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

### 8. 게시물 목록 조회

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
      "title": "최신 게시물",
      "description": "가장 최근에 작성됨",
      "trackName": "Dynamite",
      "artistName": "BTS",
      "albumImageUrl": "https://...",
      "representImageUrl": "https://...",
      "authorName": "yeonwoo",
      "tags": ["BTS", "팝"],
      "createdAt": "2025-12-05T20:55:00"
    },
### 9. 게시물 상세 조회

**GET** `/api/posts/{postId}`
      "trackName": "봄날",
      "artistName": "BTS",
      ...
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

### 7. 게시물 상세 조회

**GET** `/api/posts/{postId}`
### 10. 태그로 게시물 검색

**GET** `/api/posts/search/tag?tag={태그이름}&page=0&size=10`
**요청 예시:**
```
GET /api/posts/1
```

**응답 예시 (200 OK):**
```json
{
  "id": 1,
  "title": "내가 제일 좋아하는 노래",
  "description": "이 노래 들으면 기분이 좋아져요",
  "content": "BTS의 Dynamite는 정말 신나는 노래입니다! 아침에 일어나서 듣기 좋아요.",
  "spotifyTrackId": "72IwoG8tqvIWV10IHjpNNA",
  "trackName": "Dynamite",
  "artistName": "BTS",
  "albumImageUrl": "https://...",
  "imageUrls": ["https://example.com/image1.jpg"],
  "representImageUrl": "https://example.com/image1.jpg",
  "tags": ["BTS", "팝", "신나는노래"],
  "authorId": 1,
  "authorName": "yeonwoo",
  "createdAt": "2025-12-05T20:55:00"
}
```

---

### 8. 태그로 게시물 검색

**GET** `/api/posts/search/tag?tag={태그이름}&page=0&size=10`

로그인하지 않아도 됩니다.

**요청 예시:**
```
GET /api/posts/search/tag?tag=BTS&page=0&size=10
```

**응답:** 게시물 목록 조회와 동일한 형식

---

### 11. 게시물 수정 (JWT 필요)

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

### 12. 게시물 삭제 (JWT 필요)

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

## 📞 문의사항

백엔드 담당자에게 물어보세요! 😊

- API가 작동하지 않으면 서버가 실행 중인지 확인하세요
- CORS 에러가 나면 백엔드 설정을 확인해주세요
- 토큰 관련 문제는 JWT 토큰 형식을 확인해주세요
