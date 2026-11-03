/* MuseumList.jsx: 박물관 선택 화면 - 카드를 누르면 해당 전시관으로 이동 */

import { Link } from "react-router-dom";
import { MUSEUMS } from "../../../data/museums";
import { getArtworkImage } from "../../../utils/artworkImage";
import "./MuseumList.css";

const MuseumList = () => (
  <section className="museum-list">
    <h1>갤러리 입장</h1>
    <ul className="museum-list-grid">
      {MUSEUMS.map((museum) => (
        <li key={museum.id}>
          <Link to={`/gallery/${museum.id}`} className="museum-list-card">
            <img src={getArtworkImage(museum.coverImage)} alt="" />
            <strong>{museum.name}</strong>
            <span>{museum.nameEn}</span>
            <span>
              {museum.city}, {museum.country}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default MuseumList;
