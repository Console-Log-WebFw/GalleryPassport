/* HomePage.jsx: 홈 페이지 컴포넌트 - 배경이 깔린 홈 화면 가운데에 지구본을 보여줌 */

import "./HomePage.css";
import GlobeView from "./components/GlobeView";

/* 홈 화면 컴포넌트: 배경(home-bg) + 가운데 지구본 (네비게이션은 이후 단계에서 추가) */
const HomePage = () => (
  <section className="home">
    <div className="home-bg"></div>
    <GlobeView />
  </section>
);

export default HomePage;
