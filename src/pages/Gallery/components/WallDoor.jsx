/* WallDoor.jsx: 옆 방으로 통하는 문 모양 - 벽 하나에 문만 서 있음 (누르면 이동은 GalleryRoom이 처리, 색은 interiors 폴더 CSS 변수) */

import "./WallDoor.css";

const WallDoor = ({ room }) => (
  <button type="button" className="wall-door" aria-label={`${room.name}(으)로 이동`}>
    <span className="wall-door-sign">
      {room.name} <span aria-hidden="true">→</span>
    </span>
    <span className="wall-door-frame">
      <span className="wall-door-light" aria-hidden="true" />
      <span className="wall-door-leaf" aria-hidden="true" />
    </span>
  </button>
);

export default WallDoor;
