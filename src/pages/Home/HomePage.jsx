/* HomePage.jsx: 홈 페이지 컴포넌트 - 배경이 깔린 홈 화면 가운데에 지구본을, 왼쪽에 소개 문구를 보여줌 */

import { useState } from "react";
import "./HomePage.css";
import GlobeView from "./components/GlobeView";
import MuseumCard from "./components/MuseumCard";

/* 홈 화면 컴포넌트: 배경(home-bg) + 왼쪽 소개 문구 + 가운데 지구본 + 박물관을 누르면 카드 */
const HomePage = () => {
  const [selected, setSelected] = useState(null); // 지구본에서 클릭한 박물관 (null = 카드 닫힘)

  return (
    <section className="home">
      <div className="home-bg"></div>
      <div className="home-copy">
        <p className="home-copy-eyebrow">EXPLORE THE WORLD</p>
        <h1 className="home-copy-title">
          Gallery
          <br />
          Passport
        </h1>
        <p className="home-copy-desc">
          전 세계의 갤러리를 한 곳에서,
          <br />
          당신의 예술 여행이 시작됩니다.
        </p>
      </div>
      <GlobeView onSelect={setSelected} paused={!!selected} />
      {selected && (
        <MuseumCard museumId={selected.id} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default HomePage;
