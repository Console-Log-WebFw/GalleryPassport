/* MuseumCard.jsx: 지구본에서 박물관을 눌렀을 때 뜨는 카드 - 왼쪽에 박물관 사진, 오른쪽에 이름/소개/관련 사이트 + 방문하기 버튼으로 갤러리 입장 */

import { Link } from "react-router-dom";
import { getMuseum } from "../../../data/museums";
import homeMarkers from "../../../constants/homeMarkers";
import useEscapeKey from "../../../hooks/useEscapeKey";
import "./MuseumCard.css";

/* museumId: homeMarkers.js 의 id (갤러리 JSON 의 id 와 같아야 연결됨) */
const MuseumCard = ({ museumId, onClose }) => {
  useEscapeKey(onClose); // ESC 키로 닫기

  const museum = getMuseum(museumId);
  const marker = homeMarkers.find((m) => m.id === museumId); // 카드 사진·국기 정보
  if (!museum) return null;

  return (
    /* 바깥 어두운 배경: 누르면 닫힘 */
    <div className="museum-card-backdrop" onClick={onClose}>
      {/* 카드 본체: 안쪽을 눌러도 닫히지 않게 이벤트를 막음 */}
      <aside
        className="museum-card"
        role="dialog"
        aria-label={museum.name}
        onClick={(e) => e.stopPropagation()}
        style={{
          "--card-accent": marker?.theme?.accent, // 박물관마다 다른 색을 CSS 변수로 넘김
          "--card-accent-hover": marker?.theme?.accentHover,
          "--card-bg": marker?.theme?.bg,
        }}
      >
        <button
          type="button"
          className="museum-card-close"
          aria-label="닫기"
          onClick={onClose}
        >
          ×
        </button>

        {/* 왼쪽: 박물관 사진 + 위치 배지 */}
        <div className="museum-card-photo">
          {marker?.modalImg && <img src={marker.modalImg} alt={museum.name} />}
          <span className="museum-card-badge">
            {marker?.countryCode && (
              <img
                src={`https://flagcdn.com/w40/${marker.countryCode}.png`}
                alt=""
                className="museum-card-flag"
              />
            )}
            {museum.city}, {marker?.country ?? museum.country}
          </span>
        </div>

        {/* 오른쪽: 이름, 소개, 방문하기 */}
        <div className="museum-card-body">
          <h2 className="museum-card-name">{museum.name}</h2>
          <p className="museum-card-name-en">{museum.nameEn}</p>
          <p className="museum-card-desc">
            {museum.description || "소개 준비 중입니다."}
          </p>

          {/* 관련 사이트: 새 탭으로 열림 */}
          {marker?.links?.length > 0 && (
            <div className="museum-card-links">
              {marker.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="museum-card-link"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          )}

          <Link to={`/gallery/${museum.id}`} className="museum-card-visit">
            {marker?.shortName ?? museum.name} 갤러리 입장하기 →
          </Link>
        </div>
      </aside>
    </div>
  );
};

export default MuseumCard;
