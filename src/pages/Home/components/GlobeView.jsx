/* GlobeView.jsx: 3D 지구본 컴포넌트 - react-globe.gl로 지구본을 그리고, 화면 크기에 맞춰 크기를 바꾸고, 자동으로 회전시키고, 박물관 위치에 이미지 마커를 표시함 */

import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import homeMarkers from "../../../constants/homeMarkers";
import globeImg from "../../../assets/images/home/GalleryPassport1.png";

const HEADER_HEIGHT = 64; // Header.css의 --header-height와 같은 값
const GLOBE_ALTITUDE = 2.0; // 카메라 거리 (작을수록 지구본이 크게 보임)
const HIDE_RATIO = 0.8; // 지구 가장자리까지 각도의 몇 %부터 마커를 숨길지 (작을수록 일찍 숨김)

/* 영역 높이 중 지구본이 차지하는 비율 (카메라 거리와 기본 시야각 50° 기준) */
const SPHERE_RATIO =
  Math.tan(Math.asin(1 / (1 + GLOBE_ALTITUDE))) / Math.tan((25 * Math.PI) / 180);

/* 지구본이 그려지는 영역 크기: 헤더를 뺀 화면 전체 (마커가 잘리지 않게 넓게 잡음) */
const getSize = () => ({
  width: document.documentElement.clientWidth,
  height: window.innerHeight - HEADER_HEIGHT,
});

/* 마커 요소 만들기: 마커 이미지 + 아래 이름표(국기 포함), 클릭하면 onClick 실행 */
const createMarker = (museum, onClick) => {
  const box = document.createElement("div");
  box.style.position = "relative";
  box.style.cursor = "pointer";
  box.style.pointerEvents = "auto";
  box.style.transition = "opacity 0.3s";
  box.dataset.lat = museum.lat; // handleVisibility에서 숨길 시점을 계산할 때 사용
  box.dataset.lng = museum.lng;
  box.onclick = () => onClick(museum);

  const img = document.createElement("img");
  img.src = museum.markerImg;
  img.alt = museum.name;
  img.style.height = "90px";
  img.style.display = "block";
  img.style.filter = "drop-shadow(0 6px 8px rgba(0, 0, 0, 0.5))";
  box.appendChild(img);

  const label = document.createElement("div");
  Object.assign(label.style, {
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    marginTop: "4px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 10px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.25)",
    whiteSpace: "nowrap",
    width: "max-content", // 없으면 마커 폭에 갇혀 글자가 삐져나옴
  });
  label.innerHTML = `
    <img src="https://flagcdn.com/w40/${museum.countryCode}.png" alt="${museum.country}" style="width:20px;border-radius:2px;box-shadow:0 1px 3px rgba(0,0,0,0.3)" />
    <div style="text-align:left">
      <div style="font-size:12px;font-weight:700;color:#222">${museum.name}</div>
      <div style="font-size:10px;color:#777">${museum.country}</div>
    </div>`;
  box.appendChild(label);

  return box;
};

/* 지구 위 두 지점(위도·경도) 사이의 각도(°) */
const getAngle = (lat1, lng1, lat2, lng2) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const cos =
    Math.sin(rad(lat1)) * Math.sin(rad(lat2)) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lng2 - lng1));
  return (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI;
};

/* 지구본 컴포넌트: 크기 조절, 자동 회전, 마커 표시 */
const GlobeView = ({ onSelect, paused = false }) => {
  const [size, setSize] = useState(getSize());
  const globeRef = useRef();

  /* 창 크기가 바뀌면 영역 크기를 다시 계산 */
  useEffect(() => {
    const onResize = () => setSize(getSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* 처음 한 번: 자동 회전 켜기, 확대·축소 막기, 카메라 거리 맞추기 */
  useEffect(() => {
    const controls = globeRef.current.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.5;
    controls.enableZoom = false;
    globeRef.current.pointOfView({ altitude: GLOBE_ALTITUDE });
  }, []);

  /* 박물관 카드가 열려 있으면 회전 멈춤 */
  useEffect(() => {
    globeRef.current.controls().autoRotate = !paused;
  }, [paused]);

  /* 마커 클릭: 그 위치로 지구본을 돌리고 HomePage에 박물관을 알려줌 */
  const handleMarkerClick = (museum) => {
    globeRef.current.pointOfView(
      { lat: museum.lat, lng: museum.lng, altitude: GLOBE_ALTITUDE },
      1000,
    );
    onSelect?.(museum);
  };

  /* 카메라 중심에서 마커까지 각도가 한계를 넘으면 마커를 투명하게 (카메라가 움직일 때마다 호출됨) */
  const handleVisibility = (el, isVisible) => {
    let show = isVisible;
    if (globeRef.current) {
      const pov = globeRef.current.pointOfView();
      const horizon = (Math.acos(1 / (1 + pov.altitude)) * 180) / Math.PI;
      const angle = getAngle(pov.lat, pov.lng, Number(el.dataset.lat), Number(el.dataset.lng));
      show = show && angle < horizon * HIDE_RATIO;
    }
    el.style.opacity = show ? "1" : "0";
    el.style.pointerEvents = show ? "auto" : "none";
  };

  const shadowSize = size.height * SPHERE_RATIO;

  return (
    <div style={{ position: "relative", width: size.width, height: size.height }}>
      {/* 지구본 뒤 음영: 지구본과 같은 크기의 원 바깥으로 번지는 그림자 */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: shadowSize,
          height: shadowSize,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.35)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={globeImg}
          atmosphereColor="#ffffff"
          atmosphereAltitude={0.25}
          htmlElementsData={homeMarkers}
          htmlElement={(museum) => createMarker(museum, handleMarkerClick)}
          htmlElementVisibilityModifier={handleVisibility}
        />
      </div>
    </div>
  );
};

export default GlobeView;
