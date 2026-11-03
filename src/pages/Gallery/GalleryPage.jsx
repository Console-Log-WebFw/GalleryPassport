/* GalleryPage.jsx: 갤러리 페이지 - /gallery 는 박물관 선택, /gallery/:museumId/:roomId? 는 전시관(헤더 + 방 + 미니맵) */

import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { getMuseum, getRoom } from "../../data/museums";
import MuseumList from "./components/MuseumList";
import GalleryRoom from "./components/GalleryRoom";
import GalleryMinimap from "./components/GalleryMinimap";
import { getGalleryHeader } from "./headers";
import "./interiors"; // 박물관별 벽·바닥·액자·문 디자인
import "./GalleryPage.css";

const FADE_MS = 450; // 문을 지날 때 화면이 어두워지는 시간 (GalleryPage.css 와 맞춤)

const GalleryPage = () => {
  const { museumId, roomId } = useParams();
  const { state } = useLocation(); // 문으로 들어왔으면 { facing: 진행 방향 }
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false); // 다른 방으로 넘어가는 중 (화면 어두워짐)
  const [facing, setFacing] = useState("n"); // 지금 바라보는 벽 방향 (미니맵 표시)
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
        navigate(`/gallery/${museum.id}/${next.id}`, { state: { facing: dir } });
      }, FADE_MS);
    },
    [museum, room, navigate],
  );

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
      <Header museum={museum} room={room} />
      <div className={"gallery-stage" + (leaving ? " is-leaving" : "")}>
        {/* key: 방이 바뀌면 room-gallery를 새로 그림 */}
        <GalleryRoom
          key={room.id}
          museum={museum}
          room={room}
          facing={state?.facing}
          onDoor={goToRoom}
          onFacingChange={setFacing}
        />
        <GalleryMinimap
          rooms={museum.rooms}
          currentRoomId={room.id}
          facing={facing}
          onSelect={(next) => goToRoom(next)}
        />
      </div>
    </section>
  );
};

export default GalleryPage;
