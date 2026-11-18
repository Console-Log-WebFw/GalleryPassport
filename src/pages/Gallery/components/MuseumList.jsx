/* MuseumList.jsx: 박물관 선택 화면 - 카드(대표 이미지 + 이름 + 위치 + 소개 + 전시실/작품 수)를 누르면 해당 전시관으로 이동 */

import { Link } from "react-router-dom";
import { MUSEUMS } from "../../../data/museums";
import { getArtworkImage } from "../../../utils/artworkImage";
import homeMarkers from "../../../constants/homeMarkers";
import iconImg from "../../../assets/icons/icon.png";
import "./MuseumList.css";

/* 카드 사진: 홈 화면 카드와 같은 {박물관}_modal 사진 (없으면 박물관 JSON 의 대표 작품) */
const getCardImage = (museum) =>
  homeMarkers.find((m) => m.id === museum.id)?.modalImg ||
  getArtworkImage(museum.coverImage);

/* 소개 글을 문단(빈 줄로 구분) 목록으로 */
const getParagraphs = (text) =>
  (text || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

/* 전시 작품 수 (모든 방의 작품 합) */
const countArtworks = (museum) =>
  museum.rooms.reduce((sum, room) => sum + room.artworks.length, 0);

/* 머리말 아래 요약: 박물관 수 · 작품 수 */
const SUMMARY = [
  { label: "Museums", value: MUSEUMS.length },
  { label: "Artworks", value: MUSEUMS.reduce((sum, m) => sum + countArtworks(m), 0) },
];

const MuseumList = () => (
  <section className="museum-list">
    {/* 머리말: 홈 화면 소개 문구와 같은 구성 (작은 한글 → 세리프 영문 제목 → 설명) */}
    <header className="museum-list-hero">
      <p className="museum-list-eyebrow">갤러리 입장</p>
      <h1 className="museum-list-title">Gallery Entry</h1>
      <div className="museum-list-divider" aria-hidden="true">
        <span />
        <img src={iconImg} alt="" />
        <span />
      </div>
      <p className="museum-list-lead">
        들어가고 싶은 박물관을 골라 전시실을 둘러보세요.
      </p>
      <ul className="museum-list-summary">
        {SUMMARY.map(({ label, value }) => (
          <li key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </header>
    <ul className="museum-list-grid">
      {MUSEUMS.map((museum) => (
        <li key={museum.id}>
          <Link to={`/gallery/${museum.id}`} className="museum-list-card">
            <img src={getCardImage(museum)} alt="" />
            <div className="museum-list-body">
              <strong className="museum-list-name">{museum.name}</strong>
              <span className="museum-list-name-en">{museum.nameEn}</span>
              <span className="museum-list-place">
                {museum.city}, {museum.country}
              </span>
              {getParagraphs(museum.description).map((p, i) => (
                <p key={i} className="museum-list-desc">
                  {p}
                </p>
              ))}
              <span className="museum-list-meta">
                전시실 {museum.rooms.length}개 · 작품 {countArtworks(museum)}점
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default MuseumList;
