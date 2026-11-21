/* GalleryRoom.jsx: 전시실 하나 - room-gallery 3D 방(작품 벽 + 옆 방으로 가는 문 벽) + 작품 클릭 시 상세 모달 */

import { useEffect, useMemo, useRef, useState } from "react";
import { RoomGallery } from "room-gallery"; // default import는 Vite에서 객체로 들어와서 이름으로 가져옴
import "room-gallery/build/RoomGallery.css";
import { getArtworkImage } from "../../../utils/artworkImage";
import { buildWalls } from "../../../utils/roomLayout";
import { getGalleryDoor } from "../doors"; // 박물관별 문 (doors 폴더)
import { getArtworkModal } from "../modals"; // 박물관별 작품 모달 (modals 폴더)
import { usePassport } from "../../../context/PassportContext"; // 여권에 본 작품 기록
import "./GalleryRoom.css";

/* room-gallery 기본 설정 - 박물관 JSON의 roomStyles / roomSettings 가 이 값을 덮어씀 (벽·바닥·액자는 interiors 폴더 CSS) */
const ROOM_HEIGHT =
  "calc(100dvh - var(--header-height) - var(--gallery-top-height))";

/* 방 배율: 평소 / 확대 기본값·최대 - 실제 확대 배율은 화면·그림 크기에 맞춰 fitZoomScale 이 계산 */
const ROOM_SCALE = 1.1;
const ROOM_SCALE_ZOOM = 1.3;
const ROOM_SCALE_ZOOM_MAX = 4;
const ZOOM_BUTTON_GAP = 12; // 돋보기 버튼과 그림 위쪽 사이 간격(px)
const ZOOM_SIDE_MARGIN = 72; // 확대 시 그림 좌우에 남길 자리 (화살표 버튼)
const ZOOM_BOTTOM_MARGIN = 16;
const ZOOM_FRAME_PAD = 20; // 그림(img) 바깥 액자 두께 (배율 1 기준 px) - 확대해도 액자까지 화면에 들어오게

const DEFAULT_ROOM_STYLES = {
  width: "100vw", // room-gallery는 % 단위를 못 씀
  height: ROOM_HEIGHT,
  mobileWidth: "100vw",
  mobileHeight: ROOM_HEIGHT,
  scale: String(ROOM_SCALE),
  scaleZoom: String(ROOM_SCALE_ZOOM),
};

const DEFAULT_ROOM_SETTINGS = {
  arrowNav: "disabled", // room-gallery 화살표는 처음·끝 벽에서 한쪽만 나와서 끄고 직접 만든 화살표 사용
  keypressToNav: false, // 방향키도 직접 처리 (처음·끝이 이어지도록)
  paginations: "number",
  paginationsOnZoom: "show", // 확대 중에도 화살표가 번호 버튼을 눌러 이동하므로 남겨 두고 CSS로만 숨김
  darkMode: "light",
};

/* 벽 이동 방향: 1 = 오른쪽(다음), -1 = 왼쪽(이전), 0 = 번호·문 등으로 바로 이동(가까운 쪽으로 회전) */
const turnDegrees = (fromY, toY, dir) => {
  const steps = (((toY - fromY) % 4) + 4) % 4; // 오른쪽으로 몇 번 90도 돌아야 하는지 (0~3)
  if (steps === 0) return 0;
  if (dir > 0) return steps * 90;
  if (dir < 0) return -(4 - steps) * 90;
  return steps === 3 ? -90 : steps * 90;
};

/*
 * facing: 문으로 들어왔을 때 진행 방향 / fromRoomId: 이전 방 id (이 방으로 들어온 문을 바라보며 시작, 없으면 facing → 정면)
 * onDoor(room, dir): 문 클릭 / onFacingChange(dir): 바라보는 벽 방향이 바뀔 때 (미니맵 표시용)
 * onView(artworkId): 작품 상세를 열었을 때 (본 작품 수 세기용 - 여권이 없어도 이번 관람 동안 셈)
 */
const GalleryRoom = ({ museum, room, facing, fromRoomId, onDoor, onFacingChange, onView }) => {
  const roomRef = useRef(null); // room-gallery 조작용 (getCurrentItem 등)
  const wrapRef = useRef(null);
  const [modalIndex, setModalIndex] = useState(null); // 모달에 보여줄 작품 번호 (null = 닫힘)
  const { artworks } = room;
  const { viewArtwork } = usePassport(); // 작품을 열 때마다 여권에 기록 (다 보면 도장)
  const Door = getGalleryDoor(museum.id);
  const Modal = getArtworkModal(museum.id);

  /* 벽 목록 (작품 / 문 / 빈 벽) - 문 방향은 미니맵 배치(map)로 계산 */
  const walls = useMemo(() => buildWalls(museum.rooms, room), [museum, room]);

  /* 처음 바라볼 벽: 다른 방에서 왔으면 들어온 문(이전 방으로 가는 문), 그런 문이 없으면 진행 방향 벽, 아니면 정면(0)
     - 방이 바뀌면 key로 새로 만들어지므로 처음 한 번만 계산 */
  const [startIndex] = useState(() => {
    let index = fromRoomId
      ? walls.findIndex((wall) => wall.type === "door" && wall.door.id === fromRoomId)
      : -1;
    if (index < 0 && facing) index = walls.findIndex((wall) => wall.dir === facing);
    return Math.max(index, 0);
  });

  /* 처음 벽으로 돌아서는 동안 방을 숨기고 회전 애니메이션을 끔(is-snapping) → 처음부터 그 벽을 바라보는 것처럼 보임
     - .gallery-room 의 다른 클래스(zoom-btn-off 등)는 classList 로 붙이므로, React 가 className 을 다시 쓰지 않게 처음 값으로 고정 */
  const [roomClassName] = useState("gallery-room" + (startIndex > 0 ? " is-snapping" : ""));

  /*
   * 돋보기 버튼(확대 .room-zoom-btn / 축소 .room-exit-btn)을 정면 그림 바로 위에 둠 - 기본은 그림 위에 겹쳐 뜸
   * 두 버튼 모두 --room-button-zoom-position 을 top 으로 쓰므로 이 변수를 .gallery-room 에 지정
   */
  const placeZoomButton = () => {
    const wrap = wrapRef.current;
    const btn = wrap?.querySelector(".room-zoom-btn, .room-exit-btn");
    const body = wrap?.querySelector(".room-body");
    const target = wrap?.querySelector(
      ".room-wall.wall-active .item-image img, .room-wall.wall-active .wall-door",
    );
    if (!btn || !body || !target) return;

    /* 지금 그림 위쪽·오른쪽 (.room-body 기준 좌표) */
    const b = body.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    const imageTop = t.top - b.top;
    const imageRight = t.right - b.left;

    const top = imageTop - btn.offsetHeight - ZOOM_BUTTON_GAP;
    const side = top < 8; // 화면이 낮아 그림 위에 자리가 없으면 그림 오른쪽 위 옆에 붙임
    wrap.classList.toggle("zoom-btn-side", side);
    wrap.style.setProperty(
      "--room-button-zoom-position",
      `${side ? Math.max(8, imageTop) : top}px`,
    );
    wrap.style.setProperty("--zoom-btn-left", `${imageRight + ZOOM_BUTTON_GAP}px`);

    /* 확대/축소 애니메이션 중이 아니면 지금 그림에 맞는 확대 배율을 미리 계산 */
    if (!zoomTrackRef.current.until) fitZoomScale(btn.offsetHeight);
  };

  /*
   * 돋보기 확대를 정면 그림 크기에 맞춤: 그림(액자 포함)이 화면(.room-body)의 남는 자리에 꽉 차고 가운데 오도록
   * - 확대 배율 Z: 남는 자리(위: 돋보기 자리, 좌우: 화살표 자리, 아래: 작은 여백) ÷ 배율 1 기준 그림 크기
   * - 그림은 방 가운데보다 위에 있으므로(아래에 라벨), 확대할 때 방을 옮겨(translate) 그림을 남는 자리 가운데에 둠
   * - 지금 transform 행렬(배율 S, 이동 T)로 나눠 배율 1·이동 0 기준 위치로 바꿔서 계산 → 확대 중에 다른 그림으로 넘어가도 맞음
   * - CSS 가 --room-fit-zoom / --room-fit-x / --room-fit-y 로 확대 상태의 transform 을 만듦
   */
  const fitZoomScale = (btnHeight) => {
    const wrap = wrapRef.current;
    const body = wrap?.querySelector(".room-body");
    const wrapper = wrap?.querySelector(".room-wrapper");
    const img = wrap?.querySelector(".room-wall.wall-active .item-image img");
    if (!body || !wrapper || !img) return;

    const transform = getComputedStyle(wrapper).transform;
    const m = transform && transform !== "none" ? new DOMMatrixReadOnly(transform) : null;
    const S = m ? m.a : 1;
    const b = body.getBoundingClientRect();
    const w = wrapper.getBoundingClientRect();
    const t = img.getBoundingClientRect();
    if (!S || !t.width || !t.height) return;

    /* 방 가운데(확대 기준점)와, 이동 전 기준점 */
    const cx = w.left + w.width / 2;
    const cy = w.top + w.height / 2;
    const originX = cx - (m ? m.e : 0);
    const originY = cy - (m ? m.f : 0);

    /* 배율 1 기준: 그림(+액자) 크기, 기준점에서 그림 가운데까지 거리 */
    const imgW = t.width / S + ZOOM_FRAME_PAD * 2;
    const imgH = t.height / S + ZOOM_FRAME_PAD * 2;
    const dx = ((t.left + t.right) / 2 - cx) / S;
    const dy = ((t.top + t.bottom) / 2 - cy) / S;

    /* 그림이 들어갈 자리 */
    const top = b.top + btnHeight + ZOOM_BUTTON_GAP * 2;
    const bottom = b.bottom - ZOOM_BOTTOM_MARGIN;
    const side = Math.min(ZOOM_SIDE_MARGIN, b.width * 0.1); // 좁은 화면(휴대폰)에서는 좌우 자리를 화면 폭에 맞춰 줄임
    const left = b.left + side;
    const right = b.right - side;

    /* 화면에 들어가는 만큼만 확대 (좁은 화면에서는 평소 배율보다 작아지지만 않게) */
    const fit = Math.min((bottom - top) / imgH, (right - left) / imgW);
    const zoom = Math.min(ROOM_SCALE_ZOOM_MAX, Math.max(ROOM_SCALE, fit));
    if (!Number.isFinite(zoom)) return;

    /* 확대한 그림 가운데가 남는 자리 가운데에 오도록 이동 */
    const moveX = (left + right) / 2 - originX - zoom * dx;
    const moveY = (top + bottom) / 2 - originY - zoom * dy;
    wrap.style.setProperty("--room-fit-zoom", zoom.toFixed(3));
    wrap.style.setProperty("--room-fit-x", `${moveX.toFixed(1)}px`);
    wrap.style.setProperty("--room-fit-y", `${moveY.toFixed(1)}px`);
  };

  /* 이벤트·관찰자 안에서는 ref 로 최신 함수를 부름 */
  const placeZoomRef = useRef(placeZoomButton);
  placeZoomRef.current = placeZoomButton;

  /*
   * 확대/축소하는 동안(약 2초) 매 프레임 그림 위치를 재서 버튼이 그림과 같이 부드럽게 움직이게 함
   * - 확대 ↔ 축소 버튼이 서로 바뀌어 그려져도 위치는 계속 이어짐
   * - 방이 다 커지거나 작아지면(transitionend) 멈춤, 혹시 몰라 최대 3초
   */
  const zoomTrackRef = useRef({ frame: 0, until: 0 });
  const stopZoomTracking = () => {
    cancelAnimationFrame(zoomTrackRef.current.frame);
    zoomTrackRef.current.until = 0;
    wrapRef.current?.classList.remove("is-zoom-tracking");
    placeZoomRef.current();
  };
  const startZoomTracking = () => {
    const track = zoomTrackRef.current;
    cancelAnimationFrame(track.frame);
    track.until = performance.now() + 3000;
    wrapRef.current?.classList.add("is-zoom-tracking");
    const step = () => {
      placeZoomRef.current();
      if (performance.now() < track.until) track.frame = requestAnimationFrame(step);
      else stopZoomTracking();
    };
    step();
  };
  useEffect(() => () => cancelAnimationFrame(zoomTrackRef.current.frame), []);

  /* 정면 벽이 작품이 아니면(문·빈 벽) 돋보기를 숨기고, 확대 중이었으면 확대를 풂 */
  const syncZoomButtonVisible = () => {
    const wall = walls[roomRef.current?.getCurrentItem()?.index ?? 0];
    const off = wall?.type !== "artwork";
    wrapRef.current?.classList.toggle("zoom-btn-off", off);
    if (off && wrapRef.current?.querySelector(".room-gallery.room-zoom")) {
      roomRef.current?.setZoom(false);
    }
  };
  const startZoomTrackingRef = useRef(startZoomTracking);
  startZoomTrackingRef.current = startZoomTracking;
  const syncZoomButtonRef = useRef(syncZoomButtonVisible);
  syncZoomButtonRef.current = syncZoomButtonVisible;

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
    if (e.target.closest(".room-paginations, .gallery-room-arrow")) return; // 이동 버튼

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

  /*
   * 회전을 자연스럽게: room-gallery 는 벽 방향(y: 0 정면, 1 오른쪽, 2 뒤, 3 왼쪽)마다 고정 각도(y × 90도)로 돌려서
   * 왼쪽 벽 → 정면처럼 끝과 처음을 오갈 때 반대쪽으로 크게 돎
   * → 지금까지 돈 각도를 누적해서, 누른 방향(또는 가까운 쪽)으로 90도씩만 돌도록 .room-arena 회전을 덮어씀 (CSS !important)
   */
  const turnDirRef = useRef(0); // 다음 이동의 방향 (화살표·방향키가 정함)
  const arenaRef = useRef({ y: 0, deg: 0 }); // 지금 바라보는 벽 방향, 누적 회전 각도

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const observer = new MutationObserver((records) => {
      /* 확대/축소 시작 (.room-gallery 에 room-zoom 이 붙거나 떨어짐) → 돋보기가 그림을 따라 움직이게 */
      if (
        records.some(
          (r) => r.attributeName === "class" && r.target.classList?.contains("room-gallery"),
        )
      ) {
        startZoomTrackingRef.current();
      }
      if (
        !records.some(
          (r) => r.attributeName === "style" && r.target.classList?.contains("room-arena"),
        )
      ) {
        return;
      }
      syncZoomButtonRef.current(); // 문 벽이면 확대 버튼 숨김
      const pos = roomRef.current?.getCurrentItem()?.position;
      if (!pos) return;
      const arena = arenaRef.current;
      arena.deg += turnDegrees(arena.y, pos.y, turnDirRef.current);
      arena.y = pos.y;
      turnDirRef.current = 0;
      wrap.style.setProperty("--arena-deg", `${arena.deg}deg`);
      wrap.style.setProperty("--arena-x", `${(pos.x ?? 0) * -100}%`);
    });
    observer.observe(wrap, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });
    return () => observer.disconnect();
  }, []);

  /* 화살표·방향키: 옆 벽으로 (처음과 끝이 이어짐) - 특정 벽으로 가는 함수가 없어 번호 버튼을 대신 누름 */
  const turn = (dir) => {
    const current = roomRef.current?.getCurrentItem()?.index ?? 0;
    const next = (current + dir + walls.length) % walls.length;
    turnDirRef.current = dir;
    wrapRef.current?.querySelectorAll(".room-paginations button")[next]?.click();
  };

  /* 방향키 ←/→ 로 이동 (작품 모달이 열려 있으면 무시) */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalIndex !== null) return;
      if (e.key === "ArrowLeft") turn(-1);
      else if (e.key === "ArrowRight") turn(1);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  /* 처음 벽(startIndex)으로 돌아섬 - 특정 벽으로 가는 함수가 없어 번호 버튼을 대신 누름 (숨긴 채 애니메이션 없이) */
  useEffect(() => {
    let frame;
    const timer = setTimeout(() => {
      if (startIndex > 0) {
        wrapRef.current
          ?.querySelectorAll(".room-paginations button")
          [startIndex]?.click();
      }
      syncFacing();
      /* 돌아선 화면이 그려진 다음 프레임에 다시 보이게 + 돋보기 위치 맞춤 */
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          wrapRef.current?.classList.remove("is-snapping");
          syncZoomButtonRef.current();
          placeZoomRef.current();
        });
      });
    }, 100);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
    };
  }, []); // 방이 처음 그려질 때 한 번만 (방이 바뀌면 key로 새로 만들어짐)

  /* 벽 이동·확대가 끝났을 때, 방 크기가 바뀔 때(창 크기, 헤더가 올라갈 때) 돋보기 위치를 다시 맞춤 */
  const handleTransitionEnd = (e) => {
    const { classList } = e.target;
    if (e.propertyName !== "transform") return;
    if (classList?.contains("room-wrapper") && zoomTrackRef.current.until) {
      stopZoomTracking(); // 확대/축소가 끝남
    } else if (classList?.contains("room-wrapper") || classList?.contains("room-arena")) {
      placeZoomRef.current();
    }
  };
  useEffect(() => {
    const observer = new ResizeObserver(() => placeZoomRef.current());
    observer.observe(wrapRef.current);
    return () => observer.disconnect();
  }, []);

  /* 이전/다음: 이 방 안의 작품끼리 처음과 끝이 이어지도록 */
  const moveModal = (step) =>
    setModalIndex((i) => (i + step + artworks.length) % artworks.length);

  /* 작품 상세 모달이 열리거나 이전/다음으로 바뀔 때, 그 작품을 본 것으로 여권에 기록 */
  useEffect(() => {
    const artwork = modalIndex !== null ? artworks[modalIndex] : null;
    if (!artwork) return;
    viewArtwork(museum, artwork.id);
    onView?.(artwork.id);
  }, [modalIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={wrapRef}
      className={roomClassName}
      onClick={handleClick}
      onTransitionEnd={handleTransitionEnd}
      onAnimationEnd={() => placeZoomRef.current()} // 방 등장 효과(살짝 커지며 나타남)가 끝난 뒤 다시 잼
    >
      <RoomGallery
        ref={roomRef}
        items={items}
        styles={styles}
        settings={settings}
      />

      {/* 왼쪽/오른쪽 벽으로 돌기 - 어느 벽에서든 양쪽 모두 보임 */}
      <button
        type="button"
        className="gallery-room-arrow gallery-room-arrow--prev"
        aria-label="왼쪽 벽 보기"
        onClick={() => turn(-1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <button
        type="button"
        className="gallery-room-arrow gallery-room-arrow--next"
        aria-label="오른쪽 벽 보기"
        onClick={() => turn(1)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

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
