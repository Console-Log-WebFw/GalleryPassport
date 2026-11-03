/* GalleryMinimap.jsx: 박물관 방 배치 미니맵 - 방 칸을 누르면 그 방으로 이동, 지금 있는 방은 강조 + 점 표시 */

import "./GalleryMinimap.css";

const GalleryMinimap = ({ rooms, currentRoomId, onSelect }) => {
  /* 격자 크기: 방들의 map(x, y, w, h) 중 가장 오른쪽/아래 끝 */
  const cols = Math.max(...rooms.map(({ map }) => map.x + map.w));
  const rowCount = Math.max(...rooms.map(({ map }) => map.y + map.h));

  return (
    <nav className="gallery-minimap" aria-label="전시실 미니맵">
      <p className="gallery-minimap-title">MAP</p>
      <div
        className="gallery-minimap-grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rowCount}, 1fr)`,
        }}
      >
        {rooms.map((room) => {
          const isCurrent = room.id === currentRoomId;
          return (
            <button
              key={room.id}
              type="button"
              className={
                "gallery-minimap-room" + (isCurrent ? " is-current" : "")
              }
              style={{
                gridColumn: `${room.map.x + 1} / span ${room.map.w}`,
                gridRow: `${room.map.y + 1} / span ${room.map.h}`,
              }}
              aria-current={isCurrent ? "location" : undefined}
              onClick={() => onSelect(room.id)}
            >
              {isCurrent && (
                <span className="gallery-minimap-dot" aria-hidden="true" />
              )}
              <span className="gallery-minimap-name">{room.name}</span>
              <span className="gallery-minimap-count">
                {room.artworks.length}점
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default GalleryMinimap;
