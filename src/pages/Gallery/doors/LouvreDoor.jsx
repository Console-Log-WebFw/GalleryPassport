/* LouvreDoor.jsx: 루브르 문 - 아치형 양문 (금색 몰딩, 마우스를 올리면 두 문짝이 양쪽으로 열림, 위에 금색 명판)
   맨 바깥 "wall-door" 클래스는 클릭 판정에 쓰이므로 지우지 말 것 */

import "./LouvreDoor.css";

const LouvreDoor = ({ room }) => (
  <button
    type="button"
    className="wall-door louvre-door"
    aria-label={`${room.name}(으)로 이동`}
  >
    <span className="louvre-door-plaque">{room.name}</span>
    <span className="louvre-door-arch">
      <span className="louvre-door-light" aria-hidden="true" />
      <span className="louvre-door-leaf louvre-door-leaf--left" aria-hidden="true" />
      <span className="louvre-door-leaf louvre-door-leaf--right" aria-hidden="true" />
    </span>
  </button>
);

export default LouvreDoor;
