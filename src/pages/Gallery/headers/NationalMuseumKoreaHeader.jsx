/* NationalMuseumKoreaHeader.jsx: 국립중앙박물관 전시관 헤더 - 지금은 공통 헤더를 그대로 쓰고, 이 파일과 NationalMuseumKoreaHeader.css만 고쳐서 국립중앙박물관 전용 디자인으로 바꾸면 됨 */

import GalleryHeader from "./GalleryHeader";
import "./NationalMuseumKoreaHeader.css";

const NationalMuseumKoreaHeader = ({ museum, room }) => (
  <GalleryHeader museum={museum} room={room} className="gallery-header--national-museum-korea" />
);

export default NationalMuseumKoreaHeader;
