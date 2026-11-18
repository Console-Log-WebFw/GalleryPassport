/* GalleryHeader.jsx: 전시관 위쪽 공통 헤더 - 본 작품 수(왼쪽), 박물관 이름(한/영, 가운데), 현재 방 이름 + 메뉴 헤더 토글(오른쪽) */

import "./GalleryHeader.css";

/*
 * className: 박물관별 헤더 파일에서 "gallery-header--{id}" 를 넘겨 디자인을 따로 입힘
 * viewedCount / total: 이 박물관에서 본 작품 수 / 전체 작품 수
 * menuOpen / onToggleMenu: 공통 메뉴 헤더(로고·메뉴)가 내려와 있는지 / 토글 버튼을 눌렀을 때
 */
const GalleryHeader = ({
  museum,
  room,
  className = "",
  viewedCount = 0,
  total = 0,
  menuOpen = false,
  onToggleMenu,
}) => {
  const complete = total > 0 && viewedCount >= total;
  const percent = total > 0 ? Math.min(100, (viewedCount / total) * 100) : 0;

  return (
    <header className={`gallery-header ${className}`}>
      <div
        className={"gallery-header-count" + (complete ? " is-complete" : "")}
        title={`이 박물관 작품 ${total}점 중 ${viewedCount}점 관람`}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="gallery-header-count-num">
          <strong>{viewedCount}</strong> / {total}
        </span>
        <span className="gallery-header-count-bar" aria-hidden="true">
          <span style={{ width: `${percent}%` }} />
        </span>
      </div>

      <div className="gallery-header-title">
        <h1 className="gallery-header-name">{museum.name}</h1>
        {museum.nameEn && (
          <span className="gallery-header-name-en">{museum.nameEn}</span>
        )}
      </div>

      <div className="gallery-header-right">
        {room && <span className="gallery-header-room">{room.name}</span>}
        <button
          type="button"
          className={"gallery-header-menu" + (menuOpen ? " is-open" : "")}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          onClick={onToggleMenu}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default GalleryHeader;
