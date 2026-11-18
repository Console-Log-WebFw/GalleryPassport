/* MomaDoor.jsx: MoMA 문 - 얇은 검은 철제 테두리의 높은 개구부 + 그 너머로 보이는 옆 전시실(원근감 있는 방, 작은 작품들)
   위에는 전시실 번호를 크게 쓴 산세리프 표지. 맨 바깥 "wall-door" 클래스는 클릭 판정에 쓰이므로 지우지 말 것 */

import "./MomaDoor.css";

const MomaDoor = ({ room }) => {
  const number = room.name.match(/\d+/)?.[0]; // "2전시실" → "2" (표지의 큰 번호)

  return (
    <button
      type="button"
      className="wall-door moma-door"
      aria-label={`${room.name}(으)로 이동`}
    >
      {/* 표지: 큰 번호 | GALLERY + 전시실 이름 | 화살표 블록 */}
      <span className="moma-door-sign">
        {number && <span className="moma-door-number">{number.padStart(2, "0")}</span>}
        <span className="moma-door-text">
          <span className="moma-door-eyebrow">Gallery</span>
          {room.name}
        </span>
        <span className="moma-door-arrow" aria-hidden="true">→</span>
      </span>

      {/* 개구부: 안쪽에 옆 방을 원근으로 그림 (천장·좌우 벽·안쪽 벽·바닥) */}
      <span className="moma-door-opening">
        <span className="moma-door-room" aria-hidden="true">
          <span className="moma-door-face moma-door-ceil" />
          <span className="moma-door-face moma-door-left" />
          <span className="moma-door-face moma-door-right" />
          <span className="moma-door-face moma-door-floor" />
          <span className="moma-door-back">
            <span className="moma-door-art moma-door-art--a" />
            <span className="moma-door-art moma-door-art--b" />
          </span>
          <span className="moma-door-side-art" />
        </span>
        <span className="moma-door-glow" aria-hidden="true" />
      </span>
    </button>
  );
};

export default MomaDoor;
