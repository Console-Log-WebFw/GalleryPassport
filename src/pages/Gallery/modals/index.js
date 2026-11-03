/* modals/index.js: 박물관 id → 작품 상세 모달 컴포넌트 - 목록에 없는 박물관은 기본 모달(components/common/ArtworkModal)을 씀 */

import ArtworkModal from "../../../components/common/ArtworkModal";
import NationalMuseumKoreaModal from "./NationalMuseumKoreaModal";
import MomaModal from "./MomaModal";
import LouvreModal from "./LouvreModal";

const MODALS = {
  "national-museum-korea": NationalMuseumKoreaModal,
  moma: MomaModal,
  louvre: LouvreModal,
};

export const getArtworkModal = (museumId) => MODALS[museumId] || ArtworkModal;
