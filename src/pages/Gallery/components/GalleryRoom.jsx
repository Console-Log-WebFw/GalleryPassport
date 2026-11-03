/* GalleryRoom.jsx: 전시실 하나 - room-gallery 3D 방 + 작품 클릭 시 상세 모달 */

import { useMemo, useRef, useState } from "react";
import { RoomGallery } from "room-gallery"; // default import는 Vite에서 객체로 들어와서 이름으로 가져옴
import "room-gallery/build/RoomGallery.css";
import ArtworkModal from "../../../components/common/ArtworkModal";
import { getArtworkImage } from "../../../utils/artworkImage";
import "./GalleryRoom.css";

/* room-gallery 기본 설정 - 박물관 JSON의 roomStyles / roomSettings 가 이 값을 덮어씀 */
const ROOM_HEIGHT =
  "calc(100dvh - var(--header-height) - var(--gallery-top-height))";

const DEFAULT_ROOM_STYLES = {
  width: "100vw", // room-gallery는 % 단위를 못 씀
  height: ROOM_HEIGHT,
  mobileWidth: "100vw",
  mobileHeight: ROOM_HEIGHT,
  lightBodyBackground: "#e6e6e6", // 벽 뒤 배경 (기본 흰색이면 벽 사이 틈이 흰 벽처럼 보임)
};

const DEFAULT_ROOM_SETTINGS = {
  arrowNav: "icon",
  paginations: "number",
  darkMode: "light",
};

const GalleryRoom = ({ museum, room }) => {
  const roomRef = useRef(null); // room-gallery 조작용 (getCurrentItem 등)
  const [modalIndex, setModalIndex] = useState(null); // 모달에 보여줄 작품 번호 (null = 닫힘)
  const { artworks } = room;

  /* useMemo: room-gallery는 items/styles/settings가 바뀌면 방을 새로 만들기 때문에 같은 값을 유지 */
  const items = useMemo(
    () =>
      artworks.map((a) => ({
        image: getArtworkImage(a.image),
        title: a.title,
        description: [a.artist, a.year].filter(Boolean).join(", "),
      })),
    [artworks],
  );
  const styles = useMemo(
    () => ({ ...DEFAULT_ROOM_STYLES, ...museum.roomStyles }),
    [museum],
  );
  const settings = useMemo(
    () => ({ ...DEFAULT_ROOM_SETTINGS, ...museum.roomSettings }),
    [museum],
  );

  /* 지금 정면 벽에 있는 작품 그림을 누르면 그 작품으로 모달 열기 (옆 벽은 room-gallery가 클릭을 막음) */
  const handleClick = (e) => {
    if (!e.target.closest(".room-item.item-active .item-image")) return;
    setModalIndex(roomRef.current?.getCurrentItem()?.index ?? 0);
  };

  /* 이전/다음: 이 방 안에서 처음과 끝이 이어지도록 */
  const moveModal = (step) =>
    setModalIndex((i) => (i + step + artworks.length) % artworks.length);

  return (
    <div className="gallery-room" onClick={handleClick}>
      <RoomGallery
        ref={roomRef}
        items={items}
        styles={styles}
        settings={settings}
      />

      {modalIndex !== null && (
        <ArtworkModal
          artwork={artworks[modalIndex]}
          onClose={() => setModalIndex(null)}
          onPrev={() => moveModal(-1)}
          onNext={() => moveModal(1)}
        />
      )}
    </div>
  );
};

export default GalleryRoom;
