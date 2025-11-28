import { useState } from "react";
import "./Change.css";

export default function Change() {
  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    setProfileImg(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="edit-container">
      {/* 상단 헤더 */}
      <div className="edit-header">
        <h2>프로필 편집</h2>
      </div>

      {/* 프로필 이미지 */}
      <div className="edit-profile">
        <label htmlFor="profileImg">
          {preview ? (
            <img src={preview} className="edit-profile-img" />
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

      {/* 편집 섹션 */}
      <div className="edit-section">
        <div className="edit-row">
          <label>이름</label>
          <input type="text" placeholder="이름 입력" />
        </div>

        <div className="edit-row">
          <label>사용자 이름</label>
          <input type="text" placeholder="아이디 입력" />
        </div>

        <div className="edit-row">
          <label>소개</label>
          <input type="text" placeholder="자기소개 입력" />
        </div>
      </div>

      {/* 버튼 */}
      <button className="edit-submit-btn">변경 완료</button>
    </div>
  );
}
