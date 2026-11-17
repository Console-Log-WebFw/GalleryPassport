/* StampArt.jsx: 도장 안에 들어가는 박물관 건물 선 그림 (색은 부모의 글자색을 따라감) */

/* 박물관 id별 그림. 갤러리 id(national-museum-korea)와 예전 id(nmk) 둘 다 받음 */
const ART = {
  louvre: (
    <>
      {/* 양쪽 건물과 지붕 */}
      <path d="M6 60V34h26v26M8 34l5-12h14l5 12" />
      <path d="M88 60V34h26v26M88 34l5-12h14l5 12" />
      {/* 가운데 뒤쪽 건물 */}
      <path d="M32 60V40h56v20M52 40c0-8 16-8 16 0" />
      {/* 창문 */}
      <path d="M13 42v8M20 42v8M99 42v8M106 42v8M40 46v8M48 46v8M72 46v8M80 46v8" />
      {/* 유리 피라미드 */}
      <path d="M60 14 38 60h44L60 14zM60 14v46M49 37h22M44 49h32M54 26l-8 34M66 26l8 34" />
      {/* 작은 피라미드 */}
      <path d="M26 60l7-9 7 9M80 60l7-9 7 9" />
      <path d="M2 60h116" />
    </>
  ),
  moma: (
    <>
      {/* 위쪽 계단식 건물 */}
      <path d="M30 18h40v8M14 26h92v34H14zM14 26l16-8" />
      {/* 유리창 격자 */}
      <path d="M14 38h92M14 50h92M29 26v34M44 26v34M59 26v34M74 26v34M89 26v34" />
      {/* 입구 */}
      <path d="M50 60V50h20v10" />
      <path d="M4 60h112" />
    </>
  ),
  "national-museum-korea": (
    <>
      {/* 맨 위 지붕과 장식 */}
      <path d="M60 4v6M38 24c10-2 18-8 22-14 4 6 12 12 22 14" />
      <path d="M44 24h32v10H44zM52 24v10M60 24v10M68 24v10" />
      {/* 아래 지붕 */}
      <path d="M26 38c14-2 26-8 34-16 8 8 20 14 34 16M26 38l-4 4M94 38l4 4M32 40h56" />
      <path d="M36 42h48v16H36zM48 42v16M60 42v16M72 42v16" />
      {/* 기단 */}
      <path d="M22 58h76M16 64h88" />
    </>
  ),
};
ART.nmk = ART["national-museum-korea"];

/* museumId: 박물관 id / className: 크기·색 지정용 */
const StampArt = ({ museumId, className = "" }) => (
  <svg
    className={"stamp-art " + className}
    viewBox="0 0 120 70"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {ART[museumId] || ART.louvre}
  </svg>
);

export default StampArt;
