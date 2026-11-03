/* NationalMuseumKoreaModal.jsx: 국립중앙박물관 작품 모달 - 한지 바탕, 큰 그림 위 / 설명 아래, 제목 옆 붉은 낙관, 명조 글꼴
   직접 만든 구조 - 공통 동작(ESC 닫기, 문단 나누기, 이미지 주소)은 기본 모달과 같은 함수를 씀 */

import { createPortal } from "react-dom";
import useEscapeKey from "../../../hooks/useEscapeKey";
import { Paragraphs } from "../../../components/common/ArtworkModal";
import { getArtworkImage } from "../../../utils/artworkImage";
import "./NationalMuseumKoreaModal.css";

const NationalMuseumKoreaModal = ({ artwork, onClose, onPrev, onNext }) => {
  useEscapeKey(onClose); // ESC 키로 닫기

  if (!artwork) return null;

  const info = [artwork.artist, artwork.year, artwork.medium].filter(Boolean); // 작가 · 시대 · 재질 한 줄

  /* createPortal: 갤러리 안이 아니라 body 맨 위에 띄움 */
  return createPortal(
    <div className="nmk-modal-backdrop" onClick={onClose}>
      {/* 안쪽 클릭은 배경 클릭(닫기)으로 전달되지 않게 막음 */}
      <div
        className="nmk-modal"
        role="dialog"
        aria-modal="true"
        aria-label={artwork.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="nmk-modal-close"
          aria-label="닫기"
          onClick={onClose}
        >
          ×
        </button>

        <div className="nmk-modal-visual">
          <img src={getArtworkImage(artwork.image)} alt={artwork.title} />
        </div>

        <div className="nmk-modal-body">
          <div className="nmk-modal-heading">
            <h2>{artwork.title}</h2>
            <span className="nmk-modal-seal" aria-hidden="true">
              國博
            </span>
          </div>
          {artwork.titleEn && (
            <p className="nmk-modal-title-en">{artwork.titleEn}</p>
          )}
          {info.length > 0 && <p className="nmk-modal-info">{info.join(" · ")}</p>}

          <section className="nmk-modal-section">
            <h3>작품 설명</h3>
            <Paragraphs text={artwork.description} />
          </section>

          <section className="nmk-modal-section">
            <h3>도슨트</h3>
            <Paragraphs text={artwork.docent} />
          </section>

          {artwork.credit && <p className="nmk-modal-credit">{artwork.credit}</p>}
        </div>

        <div className="nmk-modal-nav">
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

export default NationalMuseumKoreaModal;
