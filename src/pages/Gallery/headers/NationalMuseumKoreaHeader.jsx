/* NationalMuseumKoreaHeader.jsx: 국립중앙박물관 전시관 헤더 - 공통 헤더에 한지색 바탕·갈색 테두리 디자인(NationalMuseumKoreaHeader.css)을 입혀 씀 */

import GalleryHeader from "./GalleryHeader";
import "./NationalMuseumKoreaHeader.css";

const NationalMuseumKoreaHeader = (props) => (
  <GalleryHeader {...props} className="gallery-header--national-museum-korea" />
);

export default NationalMuseumKoreaHeader;
