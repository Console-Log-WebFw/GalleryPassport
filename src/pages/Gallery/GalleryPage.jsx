/* GalleryPage.jsx: 갤러리 페이지 - /gallery 는 박물관 선택, /gallery/:museumId 는 room-gallery 전시관 */

import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RoomGallery } from "room-gallery"; // default import는 Vite에서 객체로 들어와서 이름으로 가져옴
import "room-gallery/build/RoomGallery.css";
import ArtworkModal from "../../components/common/ArtworkModal";
import { MUSEUMS, getMuseum } from "../../data/museums";
import { getArtworkImage } from "../../utils/artworkImage";
import "./GalleryPage.css";

/* room-gallery 기본 설정 - 박물관 JSON의 roomStyles / roomSettings 가 이 값을 덮어씀 */
const DEFAULT_ROOM_STYLES = {
  width: "100vw", // room-gallery는 % 단위를 못 씀
  height: "calc(100dvh - var(--header-height) - var(--gallery-top-height))",
  mobileWidth: "100vw",
  mobileHeight: "calc(100dvh - var(--header-height) - var(--gallery-top-height))",
};

const DEFAULT_ROOM_SETTINGS = {
  arrowNav: "icon",
  paginations: "number",
  darkMode: "light",
};

/* 박물관 선택 화면: 카드를 누르면 해당 전시관으로 이동 */
const MuseumList = () => (
  <section className="gallery-entry">
    <h1>갤러리 입장</h1>
    <ul className="gallery-entry-list">
      {MUSEUMS.map((museum) => (
        <li key={museum.id}>
          <Link to={`/gallery/${museum.id}`} className="gallery-entry-card">
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

/* 전시관 화면: room-gallery 3D 방 + 작품 상세 모달 */
const MuseumRoom = ({ museum }) => {
  const roomRef = useRef(null); // room-gallery 조작용 (getCurrentItem 등)
  const [modalIndex, setModalIndex] = useState(null); // 모달에 보여줄 작품 번호 (null = 닫힘)
  const { artworks } = museum;

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

  /* 지금 벽에 보이는 작품으로 모달 열기 */
  const openCurrentArtwork = () => {
    const current = roomRef.current?.getCurrentItem();
    setModalIndex(current?.index ?? 0);
  };

  /* 이전/다음: 처음과 끝이 이어지도록 */
  const moveModal = (step) =>
    setModalIndex((i) => (i + step + artworks.length) % artworks.length);

  return (
    <section className={`gallery gallery--${museum.id}`}>
      <div className="gallery-top">
        <Link to="/gallery" className="gallery-back">
          ← 갤러리 목록
        </Link>
        <h1 className="gallery-title">{museum.name}</h1>
        <button
          type="button"
          className="gallery-detail-btn"
          onClick={openCurrentArtwork}
        >
          작품 설명 보기
        </button>
      </div>

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
    </section>
  );
};

const GalleryPage = () => {
  const { museumId } = useParams();

  if (!museumId) return <MuseumList />;

  const museum = getMuseum(museumId);
  if (!museum) {
    return (
      <section className="gallery-entry">
        <h1>존재하지 않는 갤러리입니다</h1>
        <Link to="/gallery">갤러리 목록으로 돌아가기</Link>
      </section>
    );
  }

  /* key: 다른 박물관으로 바뀌면 전시관을 새로 그림 */
  return <MuseumRoom key={museum.id} museum={museum} />;
};

export default GalleryPage;
