/* MomaDoor.jsx: MoMA 문 - 문짝 없는 미니멀 개구부 (벽에 뚫린 사각 통로 + 안쪽 빛, 위에 산세리프 표지)
   맨 바깥 "wall-door" 클래스는 클릭 판정에 쓰이므로 지우지 말 것 */

import "./MomaDoor.css";

const MomaDoor = ({ room }) => (
  <button
    type="button"
    className="wall-door moma-door"
    aria-label={`${room.name}(으)로 이동`}
  >
    <span className="moma-door-label">
      <span className="moma-door-arrow" aria-hidden="true">→</span>
      {room.name}
    </span>
    <span className="moma-door-opening">
      <span className="moma-door-glow" aria-hidden="true" />
    </span>
  </button>
);

export default MomaDoor;
