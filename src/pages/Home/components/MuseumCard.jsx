/* MuseumCard.jsx: 지구본에서 박물관을 눌렀을 때 뜨는 카드 - 이름/소개 + 방문하기 버튼으로 갤러리 입장 */

import { Link } from "react-router-dom";
import { getMuseum } from "../../../data/museums";
import "./MuseumCard.css";

/* museumId: homeMarkers.js 의 id (갤러리 JSON 의 id 와 같아야 연결됨) */
const MuseumCard = ({ museumId, onClose }) => {
  const museum = getMuseum(museumId);
  if (!museum) return null;

  return (
    <aside className="museum-card" aria-label={museum.name}>
      <button
        type="button"
        className="museum-card-close"
        aria-label="닫기"
        onClick={onClose}
      >
        ×
      </button>

      <p className="museum-card-place">
        {museum.city}, {museum.country}
      </p>
      <h2 className="museum-card-name">{museum.name}</h2>
      <p className="museum-card-name-en">{museum.nameEn}</p>
      <p className="museum-card-desc">
        {museum.description || "소개 준비 중입니다."}
      </p>

      <Link to={`/gallery/${museum.id}`} className="museum-card-visit">
        방문하기
      </Link>
    </aside>
  );
};

export default MuseumCard;
