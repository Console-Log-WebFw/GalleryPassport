/* PassportForm.jsx: 여권 발급 폼 - 이름과 사진을 입력하면 여권 번호가 만들어짐 */

import { useState } from "react";
import { usePassport } from "../../../context/PassportContext";
import { createPassportNumber, MAX_PHOTO_SIZE } from "../../../utils/passport";
import "./PassportForm.css";

const PassportForm = () => {
  const { dispatch } = usePassport();
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState(""); // 읽어 온 사진(문자열로 바꾼 것)
  const [error, setError] = useState("");

  /* 사진을 고르면 크기를 확인하고, 문자열로 읽어서 미리보기에 보여줌 */
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > MAX_PHOTO_SIZE) {
      setError("사진 크기는 500KB 이하만 가능합니다. 더 작은 사진을 골라주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  /* 발급 버튼: 이름이 비어 있으면 막고, 아니면 여권을 만든다. */
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("이름을 입력해주세요.");
      return;
    }
    dispatch({
      type: "ISSUE_PASSPORT",
      name: trimmed,
      photo,
      number: createPassportNumber(),
    });
  };

  return (
    <form className="passport-form" onSubmit={handleSubmit}>
      <h2>여권 발급</h2>
      <p className="passport-form-desc">이름과 사진을 입력하면 나만의 여권이 만들어져요.</p>

      <label className="passport-form-photo">
        {photo ? (
          <img src={photo} alt="내 사진 미리보기" />
        ) : (
          <span>사진 선택</span>
        )}
        <input type="file" accept="image/*" onChange={handlePhoto} aria-label="사진 선택" />
      </label>

      <label className="passport-form-field">
        이름
        <input
          type="text"
          value={name}
          maxLength={20}
          placeholder="여권에 적힐 이름"
          onChange={(e) => setName(e.target.value)}
        />
      </label>

      {error && <p className="passport-form-error" role="alert">{error}</p>}

      <button type="submit" className="passport-form-submit">여권 발급받기</button>
    </form>
  );
};

export default PassportForm;
