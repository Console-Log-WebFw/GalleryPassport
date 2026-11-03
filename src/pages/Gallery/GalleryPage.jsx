/* GalleryPage.jsx: 갤러리 페이지 - /gallery 는 박물관 선택, /gallery/:museumId/:roomId? 는 전시관(헤더 + 방 + 미니맵) */

import { Link, useNavigate, useParams } from "react-router-dom";
import { getMuseum, getRoom } from "../../data/museums";
import MuseumList from "./components/MuseumList";
import GalleryRoom from "./components/GalleryRoom";
import GalleryMinimap from "./components/GalleryMinimap";
import { getGalleryHeader } from "./headers";
import "./GalleryPage.css";

const GalleryPage = () => {
  const { museumId, roomId } = useParams();
  const navigate = useNavigate();

  if (!museumId) return <MuseumList />;

  const museum = getMuseum(museumId);
  if (!museum) {
    return (
      <section className="gallery-missing">
        <h1>존재하지 않는 갤러리입니다</h1>
        <Link to="/gallery">갤러리 목록으로 돌아가기</Link>
      </section>
    );
  }

  const room = getRoom(museum, roomId); // roomId가 없거나 틀리면 첫 번째 방
  const Header = getGalleryHeader(museum.id); // 박물관별 헤더 (headers 폴더)

  return (
    <section className={`gallery gallery--${museum.id}`}>
      <Header museum={museum} room={room} />
      <div className="gallery-stage">
        {/* key: 방이 바뀌면 room-gallery를 새로 그림 */}
        <GalleryRoom key={room.id} museum={museum} room={room} />
        <GalleryMinimap
          rooms={museum.rooms}
          currentRoomId={room.id}
          onSelect={(id) => navigate(`/gallery/${museum.id}/${id}`)}
        />
      </div>
    </section>
  );
};

export default GalleryPage;
