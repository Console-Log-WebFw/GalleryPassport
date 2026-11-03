/* GalleryRoom.jsx: 전시실 하나 - room-gallery 3D 방(작품 벽 + 옆 방으로 가는 문 벽) + 작품 클릭 시 상세 모달 */

import { useEffect, useMemo, useRef, useState } from "react";
import { RoomGallery } from "room-gallery"; // default import는 Vite에서 객체로 들어와서 이름으로 가져옴
import "room-gallery/build/RoomGallery.css";
import { getArtworkImage } from "../../../utils/artworkImage";
import { buildWalls } from "../../../utils/roomLayout";
import { getGalleryDoor } from "../doors"; // 박물관별 문 (doors 폴더)
import { getArtworkModal } from "../modals"; // 박물관별 작품 모달 (modals 폴더)
import "./GalleryRoom.css";

/* room-gallery 기본 설정 - 박물관 JSON의 roomStyles / roomSettings 가 이 값을 덮어씀 (벽·바닥·액자는 interiors 폴더 CSS) */
const ROOM_HEIGHT =
  "calc(100dvh - var(--header-height) - var(--gallery-top-height))";

const DEFAULT_ROOM_STYLES = {
  width: "100vw", // room-gallery는 % 단위를 못 씀
  height: ROOM_HEIGHT,
  mobileWidth: "100vw",
  mobileHeight: ROOM_HEIGHT,
};

const DEFAULT_ROOM_SETTINGS = {
  arrowNav: "icon",
  paginations: "number",
  darkMode: "light",
};

/*
 * facing: 처음 바라볼 벽 방향 (문으로 들어왔을 때 진행 방향, 없으면 정면)
 * onDoor(room, dir): 문 클릭 / onFacingChange(dir): 바라보는 벽 방향이 바뀔 때 (미니맵 표시용)
 */
const GalleryRoom = ({ museum, room, facing, onDoor, onFacingChange }) => {
  const roomRef = useRef(null); // room-gallery 조작용 (getCurrentItem 등)
  const wrapRef = useRef(null);
  const [modalIndex, setModalIndex] = useState(null); // 모달에 보여줄 작품 번호 (null = 닫힘)
  const { artworks } = room;
  const Door = getGalleryDoor(museum.id);
  const Modal = getArtworkModal(museum.id);

  /* 벽 목록 (작품 / 문 / 빈 벽) - 문 방향은 미니맵 배치(map)로 계산 */
  const walls = useMemo(() => buildWalls(museum.rooms, room), [museum, room]);

  /* useMemo: room-gallery는 items/styles/settings가 바뀌면 방을 새로 만들기 때문에 같은 값을 유지 */
  const items = useMemo(
    () =>
      walls.map((wall) => {
        if (wall.type === "artwork") {
          const a = wall.artwork;
          return {
            image: getArtworkImage(a.image),
            title: a.title,
            description: [a.artist, a.year].filter(Boolean).join(", "),
          };
        }
        if (wall.type === "door") {
          return { title: wall.door.name, element: <Door room={wall.door} /> };
        }
        return { title: "", element: <div className="wall-empty" /> };
      }),
    [walls, Door],
  );
  const styles = useMemo(
    () => ({ ...DEFAULT_ROOM_STYLES, ...museum.roomStyles }),
    [museum],
  );
  const settings = useMemo(
    () => ({ ...DEFAULT_ROOM_SETTINGS, ...museum.roomSettings }),
    [museum],
  );

  /* 지금 정면 벽 (room-gallery는 이동 이벤트를 이동 전에 줘서 직접 읽음) */
  const getCurrentWall = () => walls[roomRef.current?.getCurrentItem()?.index ?? 0];

  /* 바라보는 벽 방향을 미니맵에 알림 - 클릭·방향키 직후 room-gallery가 다시 그려진 뒤 읽음 */
  const syncFacing = () =>
    setTimeout(() => onFacingChange?.(getCurrentWall()?.dir ?? "n"), 50);

  /*
   * 정면 벽 클릭: 작품 그림 → 상세 모달, 문 → 옆 방으로 이동
   * room-gallery의 왼쪽·오른쪽 벽(e, w)은 90도로 돌아가 있어 브라우저가 클릭을 못 잡으므로,
   * 대상 요소 대신 "누른 위치가 정면 벽의 그림/문 영역 안인지"로 판단
   */
  const handleClick = (e) => {
    syncFacing();
    if (e.target.closest(".room-paginations, .room-prev, .room-next")) return; // room-gallery 이동 버튼

    const wall = getCurrentWall();
    const active = wrapRef.current?.querySelector(".room-wall.wall-active");
    const isInside = (el) => {
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    };

    if (wall?.type === "door") {
      const door = active?.querySelector(".wall-door");
      if (e.target.closest(".wall-door") || isInside(door)) onDoor(wall.door, wall.dir);
    } else if (wall?.type === "artwork") {
      if (isInside(active?.querySelector(".item-image img"))) {
        setModalIndex(artworks.indexOf(wall.artwork));
      }
    }
  };

  /* 방향키로 이동해도 바라보는 방향 갱신 */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") syncFacing();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  /* 문으로 들어왔으면 진행 방향 벽을 바라보도록 돌아섬 - 특정 벽으로 가는 함수가 없어 번호 버튼을 대신 누름 */
  useEffect(() => {
    const index = facing ? walls.findIndex((wall) => wall.dir === facing) : -1;
    const timer = setTimeout(() => {
      if (index > 0) {
        wrapRef.current
          ?.querySelectorAll(".room-paginations button")
          [index]?.click();
      }
      syncFacing();
    }, 100);
    return () => clearTimeout(timer);
  }, []); // 방이 처음 그려질 때 한 번만 (방이 바뀌면 key로 새로 만들어짐)

  /* 이전/다음: 이 방 안의 작품끼리 처음과 끝이 이어지도록 */
  const moveModal = (step) =>
    setModalIndex((i) => (i + step + artworks.length) % artworks.length);

  return (
    <div ref={wrapRef} className="gallery-room" onClick={handleClick}>
      <RoomGallery
        ref={roomRef}
        items={items}
        styles={styles}
        settings={settings}
      />

      {modalIndex !== null && (
        <Modal
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
