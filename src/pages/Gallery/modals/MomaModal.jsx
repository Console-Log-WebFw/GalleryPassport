/* MomaModal.jsx: MoMA 작품 모달 - 기본 모달 구조는 그대로 쓰고 MomaModal.css 로 모양만 바꿈 (흰 바탕, 굵은 산세리프, 각진 모서리) */

import ArtworkModal from "../../../components/common/ArtworkModal";
import "./MomaModal.css";

const MomaModal = (props) => (
  <ArtworkModal {...props} className="artwork-modal--moma" />
);

export default MomaModal;
