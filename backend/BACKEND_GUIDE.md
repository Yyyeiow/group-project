# 🎵 Music Is My Life - 백엔드 가이드 (초보자용)

## 📚 목차
1. [프로젝트 구조 이해하기](#1-프로젝트-구조-이해하기)
2. [생성된 파일들 설명](#2-생성된-파일들-설명)
3. [실행 준비하기](#3-실행-준비하기)
4. [API 사용법](#4-api-사용법)
5. [다음 단계](#5-다음-단계)

---

## 1. 프로젝트 구조 이해하기

### 백엔드는 레스토랑처럼 작동합니다:

```
손님 (프론트엔드)
    ↓
🙋 Controller (주문 받는 직원)
    ↓
👨‍🍳 Service (요리사 - 비즈니스 로직)
    ↓
🧊 Repository (냉장고 - 데이터베이스)
```

### 각 계층의 역할:

**1. Domain (도메인 모델)** - `backend/src/main/java/com/musicismylife/backend/domain/`
- `User.java`: 사용자 정보 (아이디, 이메일, 비밀번호)
- `Post.java`: 게시물 정보 (제목, 내용, 노래, 이미지, 태그)
- **역할**: 데이터베이스 테이블 구조를 정의

**2. DTO (Data Transfer Object)** - `backend/src/main/java/com/musicismylife/backend/dto/`
- `PostRequestDto.java`: 게시물 작성 요청 데이터
- `PostResponseDto.java`: 게시물 응답 데이터
- `LoginRequestDto.java`: 로그인 요청 데이터
- `SignupRequestDto.java`: 회원가입 요청 데이터
- `UserResponseDto.java`: 사용자 응답 데이터
- **역할**: 클라이언트와 서버 간 데이터 전송 형식

**3. Repository (리포지토리)** - `backend/src/main/java/com/musicismylife/backend/repository/`
- `PostRepository.java`: 게시물 데이터베이스 접근
- `UserRepository.java`: 사용자 데이터베이스 접근
- **역할**: 데이터베이스 CRUD 작업 (Create, Read, Update, Delete)

**4. Service (서비스)** - `backend/src/main/java/com/musicismylife/backend/service/` ⭐ **새로 추가!**
- `PostService.java`: 게시물 비즈니스 로직
- `UserService.java`: 사용자 비즈니스 로직
- `SpotifyService.java`: Spotify API 통신
- **역할**: 실제 기능 구현 (비즈니스 로직)

**5. Controller (컨트롤러)** - `backend/src/main/java/com/musicismylife/backend/controller/` ⭐ **새로 추가!**
- `PostController.java`: 게시물 API 엔드포인트
- `AuthController.java`: 로그인/회원가입 API 엔드포인트
- **역할**: 클라이언트 요청을 받아서 Service에 전달

**6. Config (설정)** - `backend/src/main/java/com/musicismylife/backend/config/` ⭐ **새로 추가!**
- `SpotifyConfig.java`: Spotify API 설정
- `SecurityConfig.java`: 보안 설정
- **역할**: 애플리케이션 전역 설정

---

## 2. 생성된 파일들 설명

### 🎵 SpotifyService.java
**목적**: Spotify API와 통신해서 노래 정보를 가져옵니다.

**주요 기능**:
```java
// 1. 노래 검색
searchTracks("BTS Dynamite") 
// → BTS Dynamite를 검색해서 결과 리스트 반환

// 2. 특정 트랙 정보 가져오기
getTrackDetails("3n3Ppam7vgaVa1iaRUc9Lp")
// → 트랙 ID로 상세 정보 반환 (앨범 커버, 아티스트, 제목 등)
```

**언제 사용?**: 프론트엔드에서 노래를 검색하거나, 게시물에 노래를 첨부할 때

---

### 📝 PostService.java
**목적**: 게시물과 관련된 모든 비즈니스 로직을 처리합니다.

**주요 기능**:
```java
// 1. 게시물 작성
createPost(requestDto, "사용자이름")

// 2. 게시물 목록 조회 (최신순)
getAllPosts(0, 10) // 첫 페이지, 10개씩

// 3. 게시물 상세 조회
getPostById(1) // ID가 1인 게시물

// 4. 게시물 수정
updatePost(1, requestDto, "사용자이름")

// 5. 게시물 삭제
deletePost(1, "사용자이름")

// 6. 태그로 검색
getPostsByTag("힙합", 0, 10)
```

**동작 원리**:
1. 클라이언트가 게시물 작성 요청
2. Spotify에서 트랙 정보 가져오기
3. 게시물 엔티티 생성
4. 데이터베이스에 저장
5. 결과를 DTO로 변환해서 반환

---

### 👤 UserService.java
**목적**: 사용자(회원가입, 로그인) 관련 로직을 처리합니다.

**주요 기능**:
```java
// 1. 회원가입
signup(signupDto)
// → 아이디 중복 확인 → 비밀번호 암호화 → 저장

// 2. 로그인
login(loginDto)
// → 사용자 찾기 → 비밀번호 확인

// 3. 사용자 정보 조회
getUserByUsername("john123")
```

**보안 처리**:
- 비밀번호는 BCrypt로 암호화되어 저장됩니다
- 평문 비밀번호는 절대 데이터베이스에 저장되지 않습니다

---

### 🌐 PostController.java
**목적**: 프론트엔드에서 호출할 수 있는 게시물 API를 제공합니다.

**API 엔드포인트**:

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/posts` | 게시물 작성 |
| GET | `/api/posts` | 게시물 목록 조회 (페이징) |
| GET | `/api/posts/{postId}` | 게시물 상세 조회 |
| PUT | `/api/posts/{postId}` | 게시물 수정 |
| DELETE | `/api/posts/{postId}` | 게시물 삭제 |
| GET | `/api/posts/search/tag` | 태그로 검색 |
| GET | `/api/spotify/search` | Spotify 노래 검색 |
| GET | `/api/spotify/track/{trackId}` | Spotify 트랙 정보 |

**예시 - 게시물 작성**:
```http
POST http://localhost:8080/api/posts
Content-Type: application/json

{
  "description": "내 인생 최고의 노래",
  "content": "이 노래를 들으면 힘이 나요...",
  "spotifyTrackId": "3n3Ppam7vgaVa1iaRUc9Lp",
  "imageUrls": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
  "representImageUrl": "http://example.com/image1.jpg",
  "tags": ["힙합", "감성", "추억"]
}
```

---

### 🔐 AuthController.java
**목적**: 로그인/회원가입 API를 제공합니다.

**API 엔드포인트**:

| Method | URL | 설명 |
|--------|-----|------|
| POST | `/api/auth/signup` | 회원가입 |
| POST | `/api/auth/login` | 로그인 |
| GET | `/api/auth/me` | 내 정보 조회 |

**예시 - 회원가입**:
```http
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "username": "john123",
  "email": "john@example.com",
  "password": "password123"
}
```

**예시 - 로그인**:
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "john123",
  "password": "password123"
}
```

---

### ⚙️ SpotifyConfig.java
**목적**: Spotify API 클라이언트 ID와 시크릿을 관리합니다.

**설정 방법**: `application.properties` 파일에 추가
```properties
spotify.client-id=여기에_클라이언트_ID_입력
spotify.client-secret=여기에_클라이언트_시크릿_입력
```

---

### 🛡️ SecurityConfig.java
**목적**: Spring Security 보안 설정을 관리합니다.

**주요 설정**:
1. **CORS 설정**: 프론트엔드(localhost:5173)에서 백엔드로 요청 허용
2. **인증 없이 접근 가능한 URL**:
   - `/api/auth/**` (회원가입, 로그인)
   - `/api/posts/**` (게시물 조회)
3. **비밀번호 암호화**: BCrypt 사용

---

## 3. 실행 준비하기

### 3.1 Spotify API 키 발급받기

1. [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)에 접속
2. 로그인 후 "Create app" 클릭
3. 앱 정보 입력:
   - **App name**: Music Is My Life
   - **App description**: Music sharing platform
   - **Redirect URIs**: http://localhost:8080/callback
4. **Client ID**와 **Client Secret** 복사

### 3.2 application.properties 수정

`backend/src/main/resources/application.properties` 파일을 열고:

```properties
# Spotify API 설정 (주석 제거하고 값 입력)
spotify.client-id=여기에_발급받은_클라이언트_ID
spotify.client-secret=여기에_발급받은_클라이언트_시크릿
```

### 3.3 데이터베이스 준비

MySQL이 실행 중이고 `musicismylife` 데이터베이스가 있는지 확인:

```sql
CREATE DATABASE IF NOT EXISTS musicismylife CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3.4 빌드 및 실행

**PowerShell에서 실행**:
```powershell
# 프로젝트 디렉토리로 이동
cd d:\YeonWoo\A_Study\Backend\MusicIsMyLife\group-project\backend

# Gradle 빌드 (의존성 다운로드)
.\gradlew.bat build

# Spring Boot 실행
.\gradlew.bat bootRun
```

**성공 메시지**:
```
Started BackendApplication in X.XXX seconds
```

브라우저에서 http://localhost:8080 접속해서 확인!

---

## 4. API 사용법

### 4.1 Postman 또는 Thunder Client로 테스트하기

#### 1️⃣ 회원가입
```http
POST http://localhost:8080/api/auth/signup
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "test1234"
}
```

**응답**:
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "createdAt": "2025-12-05T10:30:00"
}
```

#### 2️⃣ 로그인
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "test1234"
}
```

#### 3️⃣ Spotify에서 노래 검색
```http
GET http://localhost:8080/api/spotify/search?query=BTS Dynamite
```

**응답**:
```json
[
  {
    "trackId": "3n3Ppam7vgaVa1iaRUc9Lp",
    "trackName": "Dynamite",
    "artistName": "BTS",
    "albumImageUrl": "https://i.scdn.co/image/..."
  }
]
```

#### 4️⃣ 게시물 작성
```http
POST http://localhost:8080/api/posts
Content-Type: application/json

{
  "description": "내가 가장 좋아하는 노래",
  "content": "이 노래는 내 인생을 바꿨다...",
  "spotifyTrackId": "3n3Ppam7vgaVa1iaRUc9Lp",
  "imageUrls": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  "representImageUrl": "https://example.com/image1.jpg",
  "tags": ["팝", "댄스", "힐링"]
}
```

#### 5️⃣ 게시물 목록 조회
```http
GET http://localhost:8080/api/posts?page=0&size=10
```

**응답**:
```json
{
  "content": [
    {
      "id": 1,
      "description": "내가 가장 좋아하는 노래",
      "artist": "BTS",
      "title": "Dynamite",
      "albumImageUrl": "https://...",
      "representImageUrl": "https://...",
      "tags": ["팝", "댄스", "힐링"],
      "createdAt": "2025-12-05T10:45:00"
    }
  ],
  "totalElements": 1,
  "totalPages": 1,
  "number": 0,
  "size": 10
}
```

#### 6️⃣ 게시물 상세 조회
```http
GET http://localhost:8080/api/posts/1
```

---

## 5. 다음 단계

### ✅ 완료된 것:
1. ✅ Spotify API 연동
2. ✅ 게시물 CRUD (생성, 조회, 수정, 삭제)
3. ✅ 회원가입/로그인
4. ✅ 태그 검색
5. ✅ 페이징 (게시물 목록)

### ⏭️ 추가로 구현하면 좋은 것:

1. **JWT 토큰 기반 인증**
   - 현재는 간단한 로그인만 구현
   - JWT를 사용하면 로그인 상태를 유지할 수 있습니다

2. **이미지 업로드 기능**
   - 현재는 이미지 URL만 저장
   - AWS S3나 로컬 저장소에 이미지를 직접 업로드하는 기능 추가

3. **좋아요/댓글 기능**
   - 게시물에 좋아요와 댓글을 달 수 있게

4. **사용자 프로필**
   - 프로필 사진, 자기소개 등

5. **음악 재생 기능**
   - Spotify Web Playback SDK를 사용해서 웹에서 직접 재생

---

## 📖 용어 정리

| 용어 | 설명 | 예시 |
|------|------|------|
| **Entity** | 데이터베이스 테이블과 매핑되는 클래스 | `Post.java`, `User.java` |
| **DTO** | 클라이언트와 서버 간 데이터 전송 객체 | `PostRequestDto`, `PostResponseDto` |
| **Repository** | 데이터베이스 접근 인터페이스 | `PostRepository`, `UserRepository` |
| **Service** | 비즈니스 로직 처리 | `PostService`, `UserService` |
| **Controller** | API 엔드포인트 정의 | `PostController`, `AuthController` |
| **@RestController** | RESTful API 컨트롤러 어노테이션 | - |
| **@Service** | 서비스 클래스 어노테이션 | - |
| **@RequestMapping** | URL 경로 매핑 | `/api/posts` |
| **@GetMapping** | HTTP GET 요청 처리 | 조회 |
| **@PostMapping** | HTTP POST 요청 처리 | 생성 |
| **@PutMapping** | HTTP PUT 요청 처리 | 수정 |
| **@DeleteMapping** | HTTP DELETE 요청 처리 | 삭제 |
| **@Transactional** | 트랜잭션 처리 (데이터베이스 안전성) | - |

---

## 🔧 문제 해결

### 문제 1: "Spotify 인증 실패"
**원인**: `application.properties`에 Spotify API 키가 없거나 잘못됨
**해결**: 
1. Spotify Developer Dashboard에서 Client ID/Secret 확인
2. `application.properties`에 올바르게 입력했는지 확인

### 문제 2: "데이터베이스 연결 실패"
**원인**: MySQL이 실행 중이 아니거나 비밀번호가 틀림
**해결**:
1. MySQL이 실행 중인지 확인
2. `application.properties`의 `spring.datasource` 설정 확인

### 문제 3: "CORS 에러"
**원인**: 프론트엔드 주소가 `SecurityConfig`에 등록되지 않음
**해결**:
`SecurityConfig.java`에서 프론트엔드 주소 확인:
```java
configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
```

---

## 💡 핵심 개념 요약

### 백엔드 동작 흐름:
```
1. 클라이언트 요청
   ↓
2. Controller가 요청 받음
   ↓
3. Service에서 비즈니스 로직 처리
   ↓
4. Repository로 데이터베이스 접근
   ↓
5. 결과를 DTO로 변환
   ↓
6. Controller가 클라이언트에게 응답
```

### 예시: 게시물 작성 흐름
```
1. 프론트엔드에서 POST /api/posts 요청
   ↓
2. PostController.createPost() 실행
   ↓
3. PostService.createPost() 호출
   ↓
4. SpotifyService로 트랙 정보 가져오기
   ↓
5. Post 엔티티 생성
   ↓
6. PostRepository.save()로 저장
   ↓
7. PostResponseDto로 변환
   ↓
8. 프론트엔드에게 응답 반환
```

---

## 📞 추가 도움이 필요하면?

1. **코드가 동작하지 않을 때**: 콘솔 로그 확인
2. **API 테스트**: Postman이나 Thunder Client 사용
3. **데이터베이스 확인**: MySQL Workbench에서 데이터 직접 확인

---

**축하합니다! 🎉**
백엔드의 핵심 기능(Service, Controller)을 모두 구현했습니다!
이제 프론트엔드와 연결해서 실제 동작하는 사이트를 만들 수 있습니다.
