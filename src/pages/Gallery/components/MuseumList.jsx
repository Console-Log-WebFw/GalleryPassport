/* MuseumList.jsx: 박물관 선택 화면 - 카드(대표 이미지 + 이름 + 위치 + 소개 + 전시실/작품 수)를 누르면 해당 전시관으로 이동 */

import { Link } from "react-router-dom";
import { MUSEUMS } from "../../../data/museums";
import { getArtworkImage } from "../../../utils/artworkImage";
import "./MuseumList.css";

/* 소개 글은 첫 문단만 카드에 보여줌 (빈 줄로 문단 구분) */
const getSummary = (text) => (text || "").split(/\n\s*\n/)[0].trim();

/* 전시 작품 수 (모든 방의 작품 합) */
const countArtworks = (museum) =>
  museum.rooms.reduce((sum, room) => sum + room.artworks.length, 0);

const MuseumList = () => (
  <section className="museum-list">
    <h1>갤러리 입장</h1>
    <p className="museum-list-lead">
      들어가고 싶은 박물관을 골라 전시실을 둘러보세요.
    </p>
    <ul className="museum-list-grid">
      {MUSEUMS.map((museum) => (
        <li key={museum.id}>
          <Link to={`/gallery/${museum.id}`} className="museum-list-card">
            <img src={getArtworkImage(museum.coverImage)} alt="" />
            <div className="museum-list-body">
              <strong className="museum-list-name">{museum.name}</strong>
              <span className="museum-list-name-en">{museum.nameEn}</span>
              <span className="museum-list-place">
                {museum.city}, {museum.country}
              </span>
              {museum.description && (
                <p className="museum-list-desc">
                  {getSummary(museum.description)}
                </p>
              )}
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
