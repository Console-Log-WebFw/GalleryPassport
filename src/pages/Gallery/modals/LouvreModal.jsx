/* LouvreModal.jsx: 루브르 작품 모달 - 와인색 바탕 + 금색 장식, 왼쪽 금 액자 그림 | 오른쪽 설명, serif 글꼴
   직접 만든 구조 - 공통 동작(ESC 닫기, 문단 나누기, 이미지 주소)은 기본 모달과 같은 함수를 씀 */

import { createPortal } from "react-dom";
import useEscapeKey from "../../../hooks/useEscapeKey";
import { Paragraphs } from "../../../components/common/ArtworkModal";
import { getArtworkImage } from "../../../utils/artworkImage";
import "./LouvreModal.css";

const LouvreModal = ({ artwork, onClose, onPrev, onNext }) => {
  useEscapeKey(onClose); // ESC 키로 닫기

  if (!artwork) return null;

  /* 작품 정보 표 (값이 있는 것만) */
  const info = [
    ["Artiste", artwork.artist],
    ["Date", artwork.year],
    ["Matière", artwork.medium],
  ].filter(([, value]) => value);

  /* createPortal: 갤러리 안이 아니라 body 맨 위에 띄움 */
  return createPortal(
    <div className="louvre-modal-backdrop" onClick={onClose}>
      {/* 안쪽 클릭은 배경 클릭(닫기)으로 전달되지 않게 막음 */}
      <div
        className="louvre-modal"
        role="dialog"
        aria-modal="true"
        aria-label={artwork.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="louvre-modal-close"
          aria-label="닫기"
          onClick={onClose}
        >
          ×
        </button>

        <div className="louvre-modal-visual">
          <img src={getArtworkImage(artwork.image)} alt={artwork.title} />
        </div>

        <div className="louvre-modal-body">
          <p className="louvre-modal-ornament" aria-hidden="true">
            ✦
          </p>
          <h2 className="louvre-modal-title">{artwork.title}</h2>
          {artwork.titleEn && (
            <p className="louvre-modal-title-en">{artwork.titleEn}</p>
          )}

          {info.length > 0 && (
            <dl className="louvre-modal-info">
              {info.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <section className="louvre-modal-section">
            <h3>작품 설명</h3>
            <Paragraphs text={artwork.description} />
          </section>

          <section className="louvre-modal-section">
            <h3>도슨트</h3>
            <Paragraphs text={artwork.docent} />
          </section>

          {artwork.credit && (
            <p className="louvre-modal-credit">{artwork.credit}</p>
          )}
        </div>

        <div className="louvre-modal-nav">
          <button type="button" onClick={onPrev}>
            ‹ 이전 작품
          </button>
          <button type="button" onClick={onNext}>
            다음 작품 ›
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default LouvreModal;
