/* ArtworkModal.jsx: 작품 상세 모달 - 큰 이미지 + 작품 설명/도슨트, 이전/다음 작품 이동 */

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { getArtworkImage } from "../../utils/artworkImage";
import "./ArtworkModal.css";

const ArtworkModal = ({ artwork, onClose, onPrev, onNext }) => {
  /* ESC 키로 닫기 - 모달이 사라지면 이벤트도 해제 */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!artwork) return null;

  const info = [artwork.artist, artwork.year, artwork.medium].filter(Boolean);

  /* createPortal: 갤러리 안이 아니라 body 맨 위에 띄움 */
  return createPortal(
    <div className="artwork-modal-backdrop" onClick={onClose}>
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

        <img
          className="artwork-modal-image"
          src={getArtworkImage(artwork.image)}
          alt={artwork.title}
        />

        <div className="artwork-modal-body">
          <h2 className="artwork-modal-title">{artwork.title}</h2>
          {artwork.titleEn && (
            <p className="artwork-modal-title-en">{artwork.titleEn}</p>
          )}
          {info.length > 0 && (
            <p className="artwork-modal-info">{info.join(" · ")}</p>
          )}
          {artwork.description && (
            <p className="artwork-modal-desc">{artwork.description}</p>
          )}
          {artwork.docent && (
            <div className="artwork-modal-docent">
              <h3>도슨트</h3>
              <p>{artwork.docent}</p>
            </div>
          )}
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
