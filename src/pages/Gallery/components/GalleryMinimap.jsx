/* GalleryMinimap.jsx: 박물관 평면도 미니맵 - 방·문 표시, 현재 위치와 바라보는 방향, 방을 누르면 그 방으로 이동 */

import { useState } from "react";
import { getDoors } from "../../../utils/roomLayout";
import "./GalleryMinimap.css";

const CELL = 56; // 격자 한 칸 크기 (px)
const PAD = 10; // 평면도 바깥 여백
const GAP = 3; // 방 사이 벽 두께의 절반
const DOOR = 14; // 문 폭

/* 바라보는 방향 → 부채꼴 회전 각도 (위=n 기준 시계 방향) */
const ANGLE = { n: 0, e: 90, s: 180, w: 270 };

/* 방 사각형 (격자 좌표 → px) */
const rectOf = ({ map }) => ({
  x: PAD + map.x * CELL + GAP,
  y: PAD + map.y * CELL + GAP,
  w: map.w * CELL - GAP * 2,
  h: map.h * CELL - GAP * 2,
});

/* 두 방 사이 문 위치: 맞닿은 벽 구간의 가운데 */
const doorRect = (a, b, dir) => {
  const ra = rectOf(a);
  const rb = rectOf(b);
  if (dir === "e" || dir === "w") {
    const top = Math.max(ra.y, rb.y);
    const bottom = Math.min(ra.y + ra.h, rb.y + rb.h);
    const x = dir === "e" ? ra.x + ra.w : rb.x + rb.w;
    return { x: x - 2, y: (top + bottom) / 2 - DOOR / 2, w: GAP * 2 + 4, h: DOOR };
  }
  const left = Math.max(ra.x, rb.x);
  const right = Math.min(ra.x + ra.w, rb.x + rb.w);
  const y = dir === "s" ? ra.y + ra.h : rb.y + rb.h;
  return { x: (left + right) / 2 - DOOR / 2, y: y - 2, w: DOOR, h: GAP * 2 + 4 };
};

const GalleryMinimap = ({ rooms, currentRoomId, facing = "n", onSelect }) => {
  const [open, setOpen] = useState(true); // 접기/펼치기

  const cols = Math.max(...rooms.map(({ map }) => map.x + map.w));
  const rowCount = Math.max(...rooms.map(({ map }) => map.y + map.h));
  const width = PAD * 2 + cols * CELL;
  const height = PAD * 2 + rowCount * CELL;

  /* 문 목록 (같은 문이 두 번 나오지 않게 e·s 방향만) */
  const doors = rooms.flatMap((room) =>
    getDoors(rooms, room)
      .filter(({ dir }) => dir === "e" || dir === "s")
      .map(({ dir, room: other }) => ({ key: `${room.id}-${other.id}`, ...doorRect(room, other, dir) })),
  );

  const current = rooms.find((room) => room.id === currentRoomId);

  return (
    <nav className={"gallery-minimap" + (open ? "" : " is-closed")} aria-label="전시실 미니맵">
      <div className="gallery-minimap-head">
        <span className="gallery-minimap-title">FLOOR MAP</span>
        <span className="gallery-minimap-compass" aria-label="위쪽이 북쪽">
          N
        </span>
        <button
          type="button"
          className="gallery-minimap-toggle"
          aria-expanded={open}
          aria-label={open ? "미니맵 접기" : "미니맵 펼치기"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"} />
          </svg>
        </button>
      </div>

      {open && (
        <svg
          className="gallery-minimap-plan"
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
        >
          {/* 방 */}
          {rooms.map((room) => {
            const r = rectOf(room);
            const isCurrent = room.id === currentRoomId;
            return (
              <g
                key={room.id}
                className={"gallery-minimap-room" + (isCurrent ? " is-current" : "")}
                role="button"
                tabIndex={isCurrent ? -1 : 0}
                aria-label={`${room.name}${isCurrent ? " (현재 위치)" : "(으)로 이동"}`}
                aria-current={isCurrent ? "location" : undefined}
                onClick={() => onSelect(room)}
                onKeyDown={(e) => e.key === "Enter" && onSelect(room)}
              >
                <rect x={r.x} y={r.y} width={r.w} height={r.h} rx="3" />
                <text x={r.x + r.w / 2} y={r.y + r.h - 7} textAnchor="middle">
                  {room.name}
                </text>
              </g>
            );
          })}

          {/* 문: 방 사이 벽에 뚫린 통로 */}
          {doors.map((d) => (
            <rect
              key={d.key}
              className="gallery-minimap-door"
              x={d.x}
              y={d.y}
              width={d.w}
              height={d.h}
              rx="1"
            />
          ))}

          {/* 현재 위치 + 바라보는 방향 */}
          {current && (() => {
            const r = rectOf(current);
            const cx = r.x + r.w / 2;
            const cy = r.y + r.h / 2 - 6;
            return (
              <g transform={`translate(${cx} ${cy})`} aria-hidden="true">
                <g className="gallery-minimap-view" style={{ transform: `rotate(${ANGLE[facing] ?? 0}deg)` }}>
                  <path d="M0 0 L-11 -18 A21 21 0 0 1 11 -18 Z" />
                </g>
                <circle className="gallery-minimap-me" r="4" />
              </g>
            );
          })()}
        </svg>
      )}
    </nav>
  );
};

export default GalleryMinimap;
