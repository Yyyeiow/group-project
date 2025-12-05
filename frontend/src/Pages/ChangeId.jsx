import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ChangeId.css";
import { getMyInfo, updateProfile, uploadImages } from "../api/api";

export default function ChangeId() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userData = await getMyInfo();
      setUser(userData);
      setUsername(userData.username);
      setBio(userData.bio || "");
      setPreview(userData.profileImageUrl || "");
      setLoading(false);
    } catch (error) {
      console.error("프로필 로딩 실패:", error);
      alert("로그인이 필요합니다!");
      navigate("/login");
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file); 
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async () => {
    try {
      let profileImageUrl = user.profileImageUrl;
      
      // 새 이미지가 있으면 업로드
      if (profileImg) {
        console.log("이미지 업로드 중...");
        const urls = await uploadImages([profileImg]);
        profileImageUrl = urls[0];
        console.log("업로드된 이미지 URL:", profileImageUrl);
      }

      const profileData = {
        username,
        bio,
        profileImageUrl
      };
      
      console.log("전송할 프로필 데이터:", profileData);

      // 프로필 업데이트
      const result = await updateProfile(profileData);
      console.log("프로필 업데이트 성공:", result);

      alert("프로필 정보가 변경되었습니다!");
      
      // 로그인 상태 변경 이벤트 발생 (Header 업데이트)
      window.dispatchEvent(new Event('loginStatusChanged'));
      
      navigate("/"); // 홈으로 이동
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다. 콘솔을 확인해주세요.");
    }
  };

  if (loading) {
    return <div className="edit-container">로딩 중...</div>;
  }

  return (
    <div className="edit-container">
      <div className="edit-header">
        <h2>프로필 편집</h2>
      </div>

      <div className="edit-profile">
        <label htmlFor="profileImg">
          {preview ? (
            <img src={preview} className="edit-profile-img" alt="프로필 미리보기" />
          ) : (
            <div className="edit-profile-placeholder"></div>
          )}
        </label>
        <input
          type="file"
          id="profileImg"
          accept="image/*"
          onChange={handleImage}
          style={{ display: "none" }}
        />
        <p className="edit-change-photo">사진 수정</p>
      </div>

      <div className="edit-section">
        <div className="edit-row">
          <label>이메일</label>
          <input type="text" value={user?.email || ""} disabled />
        </div>

        <div className="edit-row">
          <label>사용자 이름</label>
          <input 
            type="text" 
            placeholder="아이디 입력" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="edit-row">
          <label>소개</label>
          <textarea 
            placeholder="자기소개 입력" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <button className="edit-submit-btn" onClick={handleSubmit}>
        변경 완료
      </button>
    </div>
  );
}