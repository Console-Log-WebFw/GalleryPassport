/* GalleryHeader.jsx: 전시관 위쪽 공통 헤더 - 목록으로 돌아가기, 박물관 이름(한/영), 현재 방 이름 */

import { Link } from "react-router-dom";
import "./GalleryHeader.css";

/* className: 박물관별 헤더 파일에서 "gallery-header--{id}" 를 넘겨 디자인을 따로 입힘 */
const GalleryHeader = ({ museum, room, className = "" }) => (
  <header className={`gallery-header ${className}`}>
    <Link to="/gallery" className="gallery-header-back" aria-label="갤러리 목록">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </Link>

    <div className="gallery-header-title">
      <h1 className="gallery-header-name">{museum.name}</h1>
      {museum.nameEn && (
        <span className="gallery-header-name-en">{museum.nameEn}</span>
      )}
    </div>

    {room && <span className="gallery-header-room">{room.name}</span>}
  </header>
);

export default GalleryHeader;
