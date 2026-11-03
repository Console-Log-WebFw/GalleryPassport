/* NationalMuseumKoreaDoor.jsx: 국립중앙박물관 문 - 한옥 창호문 (나무 틀 + 격자 살 + 한지, 마우스를 올리면 미닫이처럼 열림)
   맨 바깥 "wall-door" 클래스는 클릭 판정에 쓰이므로 지우지 말 것 */

import "./NationalMuseumKoreaDoor.css";

const NationalMuseumKoreaDoor = ({ room }) => (
  <button
    type="button"
    className="wall-door nmk-door"
    aria-label={`${room.name}(으)로 이동`}
  >
    <span className="nmk-door-plaque">{room.name}</span>
    <span className="nmk-door-frame">
      <span className="nmk-door-light" aria-hidden="true" />
      <span className="nmk-door-panel nmk-door-panel--left" aria-hidden="true" />
      <span className="nmk-door-panel nmk-door-panel--right" aria-hidden="true" />
    </span>
    <span className="nmk-door-sill" aria-hidden="true" />
  </button>
);

export default NationalMuseumKoreaDoor;
