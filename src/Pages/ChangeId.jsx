import { useState } from "react";
import "./ChangeId.css";

export default function ChangeId() {

  const [profileImg, setProfileImg] = useState(null);
  const [preview, setPreview] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file); 
      setPreview(URL.createObjectURL(file)); 
    }
  };

  
  const handleSubmit = () => {
    console.log("서버로 보낼 이미지 파일:", profileImg);
    alert("프로필 정보가 변경되었습니다!");
  };

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

      <button className="edit-submit-btn" onClick={handleSubmit}>
        변경 완료
      </button>
    </div>
  );
}