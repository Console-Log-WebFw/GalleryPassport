/* headers/index.js: 박물관 id → 전시관 헤더 컴포넌트 - 목록에 없는 박물관은 공통 헤더를 씀 */

import GalleryHeader from "./GalleryHeader";
import NationalMuseumKoreaHeader from "./NationalMuseumKoreaHeader";
import MomaHeader from "./MomaHeader";
import LouvreHeader from "./LouvreHeader";

const HEADERS = {
  "national-museum-korea": NationalMuseumKoreaHeader,
  moma: MomaHeader,
  louvre: LouvreHeader,
};

export const getGalleryHeader = (museumId) => HEADERS[museumId] || GalleryHeader;
