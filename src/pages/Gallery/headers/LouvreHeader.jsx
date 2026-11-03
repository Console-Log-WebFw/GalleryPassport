/* LouvreHeader.jsx: 루브르 전시관 헤더 - 지금은 공통 헤더를 그대로 쓰고, 이 파일과 LouvreHeader.css만 고쳐서 루브르 전용 디자인으로 바꾸면 됨 */

import GalleryHeader from "./GalleryHeader";
import "./LouvreHeader.css";

const LouvreHeader = ({ museum, room }) => (
  <GalleryHeader museum={museum} room={room} className="gallery-header--louvre" />
);

export default LouvreHeader;
