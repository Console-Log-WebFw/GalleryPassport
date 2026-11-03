/* HomePage.jsx: 홈 페이지 컴포넌트 - 배경이 깔린 홈 화면 가운데에 지구본을 보여줌 */

import { useState } from "react";
import "./HomePage.css";
import GlobeView from "./components/GlobeView";
import MuseumCard from "./components/MuseumCard";

/* 홈 화면 컴포넌트: 배경(home-bg) + 가운데 지구본 + 박물관을 누르면 카드 */
const HomePage = () => {
  const [selected, setSelected] = useState(null); // 지구본에서 클릭한 박물관 (null = 카드 닫힘)

  return (
    <section className="home">
      <div className="home-bg"></div>
      <GlobeView onSelect={setSelected} paused={!!selected} />
      {selected && (
        <MuseumCard museumId={selected.id} onClose={() => setSelected(null)} />
      )}
    </section>
  );
};

export default HomePage;
