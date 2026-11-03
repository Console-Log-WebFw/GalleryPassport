/* GlobeView.jsx: 3D 지구본 컴포넌트 - react-globe.gl로 지구본을 그리고, 화면 크기에 맞춰 크기를 바꾸고, 자동으로 회전시키고, 박물관 위치에 마커를 표시함 */

import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import homeMuseums from "../../../data/homeMuseums";
import globeImg from "../../../assets/images/home/GalleryPassport1.png";

const HEADER_HEIGHT = 80; // 헤더 높이 (Header.css의 --header-height와 같은 값)

/* 크기 계산 함수: 헤더를 뺀 화면의 가로·세로 중 작은 쪽의 95%를 지구본 크기로 반환 */
const getSize = () =>
  Math.round(
    Math.min(window.innerWidth, window.innerHeight - HEADER_HEIGHT) * 0.95,
  );

/* 지구본 컴포넌트: size 상태로 크기를 정하고, globeRef로 지구본을 직접 잡아 자동 회전을 켬 */
const GlobeView = ({ onSelect, paused = false }) => {
  const [size, setSize] = useState(getSize()); // 지구본 한 변의 길이 (처음엔 현재 창 크기 기준)
  const globeRef = useRef(); // 지구본 객체를 직접 가리키는 참조

  /* 창 크기가 바뀔 때마다 setSize로 상태를 바꿈 → 컴포넌트가 다시 그려짐 */
  useEffect(() => {
    const onResize = () => setSize(getSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize); // 화면에서 사라질 때 정리
  }, []);

  /* 처음 화면에 그려진 뒤 한 번: 자동 회전을 켜고, 카메라를 지구본에 가깝게 당김 */
  useEffect(() => {
    const controls = globeRef.current.controls();
    controls.autoRotate = true; // 자동 회전 켜기
    controls.autoRotateSpeed = 1.5; // 회전 속도 (기본 2.0)
    globeRef.current.pointOfView({ altitude: 2.0 }); // 카메라 거리 (기본 2.5, 작을수록 크게 보임)
  }, []);

  /* 박물관 카드가 열려 있으면 자동 회전 멈춤, 닫히면 다시 회전 */
  useEffect(() => {
    globeRef.current.controls().autoRotate = !paused;
  }, [paused]);

  /* 마커 클릭: 그 위치로 지구본을 돌리고 HomePage에 클릭한 박물관을 알려줌 */
  const handlePointClick = (museum) => {
    globeRef.current.pointOfView(
      { lat: museum.lat, lng: museum.lng, altitude: 2.0 },
      1000,
    );
    onSelect?.(museum);
  };

  return (
    <Globe
      ref={globeRef}
      width={size}
      height={size}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={globeImg}
      pointsData={homeMuseums}
      pointColor={() => "#ff4d4d"}
      pointAltitude={0.05}
      pointRadius={0.6}
      pointLabel="name" // 마우스를 올리면 박물관 이름 표시
      onPointClick={handlePointClick}
    />
  );
};

export default GlobeView;
