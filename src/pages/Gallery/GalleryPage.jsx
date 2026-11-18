/* GalleryPage.jsx: 갤러리 페이지 - /gallery 는 박물관 선택, /gallery/:museumId/:roomId? 는 전시관(헤더 + 방 + 미니맵 + 뒤로가기 + 관람 완료 연출) */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getMuseum, getRoom } from "../../data/museums";
import MuseumList from "./components/MuseumList";
import GalleryRoom from "./components/GalleryRoom";
import GalleryMinimap from "./components/GalleryMinimap";
import GalleryComplete from "./components/GalleryComplete";
import { usePassport } from "../../context/PassportContext";
import { getGalleryHeader } from "./headers";
import "./interiors"; // 박물관별 벽·바닥·액자·문 디자인
import "./GalleryPage.css";

const FADE_MS = 450; // 문을 지날 때 화면이 어두워지는 시간 (GalleryPage.css 와 맞춤)
const HEADER_HIDE_MS = 800; // 전시관에 들어온 뒤 공통 헤더가 올라가기까지 시간

/* 박물관 전체 작품 수 */
const countArtworks = (museum) =>
  museum ? museum.rooms.reduce((sum, room) => sum + room.artworks.length, 0) : 0;

const GalleryPage = () => {
  const { museumId, roomId } = useParams();
  const { state } = useLocation(); // 다른 방에서 왔으면 { facing: 진행 방향, fromRoomId: 이전 방 }
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false); // 다른 방으로 넘어가는 중 (화면 어두워짐)
  const [facing, setFacing] = useState("n"); // 지금 바라보는 벽 방향 (미니맵 표시)
  const [menuOpen, setMenuOpen] = useState(true); // 공통 메뉴 헤더(로고·메뉴)가 내려와 있는지
  const [sessionViewed, setSessionViewed] = useState({}); // 이번 관람에서 연 작품 { 박물관 id: [작품 id] } - 여권 없이도 셈
  const [celebrating, setCelebrating] = useState(false); // "다 봤습니다" 연출 중
  const { state: passportState } = usePassport();
  const timerRef = useRef(null);

  const museum = museumId ? getMuseum(museumId) : null;
  const room = museum ? getRoom(museum, roomId) : null; // roomId가 없거나 틀리면 첫 번째 방

  /* 방 이동: 어두워짐 → 주소 변경 → 새 방에서 밝아짐 */
  const goToRoom = useCallback(
    (next, dir) => {
      if (!museum || next.id === room?.id) return;
      setLeaving(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        navigate(`/gallery/${museum.id}/${next.id}`, {
          state: { facing: dir, fromRoomId: room?.id },
        });
      }, FADE_MS);
    },
    [museum, room, navigate],
  );

  /*
   * 전시관 몰입 모드: 들어오고 잠시 뒤 공통 헤더(.header)가 위로 올라가고, 박물관 이름 줄의 토글 버튼으로 다시 내림
   * - 공통 헤더 파일(Header.jsx/css)은 건드리지 않고 <html> 클래스로만 조절 (스타일은 GalleryPage.css)
   * - 메뉴가 내려오면 박물관 이름 줄·미니맵도 같이 내려가 겹치지 않음
   * - 전시관을 떠나면 클래스를 지워 다른 페이지 헤더는 그대로
   */
  const inGallery = Boolean(museum);
  useEffect(() => {
    if (!inGallery) return;
    const { classList } = document.documentElement; // room-gallery 가 높이 변수를 <html> 에 달아서 같은 곳에 붙임
    classList.add("gallery-immersive");
    setMenuOpen(true);
    const hideTimer = setTimeout(() => setMenuOpen(false), HEADER_HIDE_MS);
    return () => {
      clearTimeout(hideTimer);
      classList.remove("gallery-immersive", "header-hidden");
    };
  }, [inGallery]);

  useEffect(() => {
    if (inGallery) document.documentElement.classList.toggle("header-hidden", !menuOpen);
  }, [inGallery, menuOpen]);

  /* 본 작품 수: 여권 기록 + 이번 관람에서 연 작품 (겹치는 건 한 번만) */
  const total = countArtworks(museum);
  const viewedCount = museum
    ? new Set([
        ...(passportState.viewed?.[museum.id] || []),
        ...(sessionViewed[museum.id] || []),
      ]).size
    : 0;

  const handleView = useCallback(
    (artworkId) => {
      if (!museum) return;
      setSessionViewed((prev) => {
        const seen = prev[museum.id] || [];
        return seen.includes(artworkId) ? prev : { ...prev, [museum.id]: [...seen, artworkId] };
      });
    },
    [museum],
  );

  /* 이번 관람 중에 마지막 작품을 본 순간에만 "다 봤습니다" 연출 (이미 다 본 박물관에 들어올 때는 안 뜸) */
  const prevCountRef = useRef({ museumId: null, count: 0 });
  useEffect(() => {
    const prev = prevCountRef.current;
    if (prev.museumId === museumId && prev.count < total && viewedCount >= total && total > 0) {
      setCelebrating(true);
    }
    prevCountRef.current = { museumId, count: viewedCount };
  }, [museumId, viewedCount, total]);

  /* 다른 박물관으로 가면 연출 닫기 */
  useEffect(() => setCelebrating(false), [museumId]);

  /* 새 방이 그려지면 다시 밝게 */
  useEffect(() => {
    setLeaving(false);
    return () => clearTimeout(timerRef.current);
  }, [room?.id]);

  if (!museumId) return <MuseumList />;

  if (!museum) {
    return (
      <section className="gallery-missing">
        <h1>존재하지 않는 갤러리입니다</h1>
        <Link to="/gallery">갤러리 목록으로 돌아가기</Link>
      </section>
    );
  }

  const Header = getGalleryHeader(museum.id); // 박물관별 헤더 (headers 폴더)

  return (
    <section className={`gallery gallery--${museum.id}`}>
      <Header
        museum={museum}
        room={room}
        viewedCount={viewedCount}
        total={total}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />
      <div className={"gallery-stage" + (leaving ? " is-leaving" : "")}>
        {/* key: 방이 바뀌면 room-gallery를 새로 그림 */}
        <GalleryRoom
          key={room.id}
          museum={museum}
          room={room}
          facing={state?.facing}
          fromRoomId={state?.fromRoomId}
          onDoor={goToRoom}
          onFacingChange={setFacing}
          onView={handleView}
        />
        <GalleryMinimap
          rooms={museum.rooms}
          currentRoomId={room.id}
          facing={facing}
          onSelect={(next) => goToRoom(next)}
        />

        {/* 왼쪽 아래 떠 있는 뒤로가기 - 방 클릭 처리(GalleryRoom)와 겹치지 않게 방 바깥에 둠 */}
        <Link to="/gallery" className="gallery-back-fab" aria-label="갤러리 목록으로">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5l-7 7 7 7" />
          </svg>
          <span>갤러리 목록</span>
        </Link>
      </div>

      {celebrating && (
        <GalleryComplete
          museum={museum}
          total={total}
          hasPassport={Boolean(passportState.passport)}
          onClose={() => setCelebrating(false)}
        />
      )}
    </section>
  );
};

export default GalleryPage;
