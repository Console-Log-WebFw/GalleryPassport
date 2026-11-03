/* ArtworkModal.jsx: 작품 상세 모달(기본) - 큰 이미지 + 작품 정보·작품 설명·도슨트, 이전/다음 작품 이동
   박물관별 모달은 src/pages/Gallery/modals/ 에서 이 모달을 감싸거나(className) 직접 만듦 */

import { createPortal } from "react-dom";
import useEscapeKey from "../../hooks/useEscapeKey";
import { getArtworkImage } from "../../utils/artworkImage";
import "./ArtworkModal.css";

/* 설명 글: 빈 줄(줄바꿈 두 번)마다 문단으로 나눔, 비어 있으면 안내 문구 - 박물관별 모달에서도 사용 */
export const Paragraphs = ({ text }) => {
  const paragraphs = (text || "").split(/\n\s*\n/).filter((p) => p.trim());
  if (paragraphs.length === 0) {
    return <p className="artwork-modal-empty">설명 준비 중입니다.</p>;
  }
  return paragraphs.map((p, i) => <p key={i}>{p.trim()}</p>);
};

/* className: 박물관별 모달 파일에서 "artwork-modal--{id}" 를 넘겨 디자인을 따로 입힘 */
const ArtworkModal = ({ artwork, onClose, onPrev, onNext, className = "" }) => {
  useEscapeKey(onClose); // ESC 키로 닫기

  if (!artwork) return null;

  /* 작품 정보 표 (값이 있는 것만) */
  const info = [
    ["작가", artwork.artist],
    ["연도", artwork.year],
    ["재료", artwork.medium],
  ].filter(([, value]) => value);

  /* createPortal: 갤러리 안이 아니라 body 맨 위에 띄움 */
  return createPortal(
    <div className={`artwork-modal-backdrop ${className}`} onClick={onClose}>
      {/* 안쪽 클릭은 배경 클릭(닫기)으로 전달되지 않게 막음 */}
      <div
        className="artwork-modal"
        role="dialog"
        aria-modal="true"
        aria-label={artwork.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="artwork-modal-close"
          aria-label="닫기"
          onClick={onClose}
        >
          ×
        </button>

        <div className="artwork-modal-visual">
          <img
            className="artwork-modal-image"
            src={getArtworkImage(artwork.image)}
            alt={artwork.title}
          />
        </div>

        <div className="artwork-modal-body">
          <h2 className="artwork-modal-title">{artwork.title}</h2>
          {artwork.titleEn && (
            <p className="artwork-modal-title-en">{artwork.titleEn}</p>
          )}

          {info.length > 0 && (
            <dl className="artwork-modal-info">
              {info.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <section className="artwork-modal-section">
            <h3>작품 설명</h3>
            <Paragraphs text={artwork.description} />
          </section>

          <section className="artwork-modal-section">
            <h3>도슨트</h3>
            <Paragraphs text={artwork.docent} />
          </section>

          {artwork.credit && (
            <p className="artwork-modal-credit">{artwork.credit}</p>
          )}
        </div>

        <div className="artwork-modal-nav">
          <button type="button" onClick={onPrev}>
            ← 이전 작품
          </button>
          <button type="button" onClick={onNext}>
            다음 작품 →
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ArtworkModal;
