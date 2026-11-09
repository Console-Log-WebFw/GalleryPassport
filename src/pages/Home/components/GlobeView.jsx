/* GlobeView.jsx: 3D 지구본 컴포넌트 - react-globe.gl로 지구본을 그리고, 화면 크기에 맞춰 크기를 바꾸고, 자동으로 회전시키고, 박물관 위치에 이미지 마커를 표시함 */

import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";
import homeMarkers from "../../../constants/homeMarkers";
import globeImg from "../../../assets/images/home/GalleryPassport1.png";

const HEADER_HEIGHT = 64; // 헤더 높이 (Header.css의 --header-height와 같은 값)
const GLOBE_ALTITUDE = 2.0; // 카메라 거리 (기본 2.5, 작을수록 지구본이 크게 보임)

/* 크기 계산 함수: 헤더를 뺀 화면 전체(가로·세로)를 지구본이 그려지는 영역 크기로 반환 (마커가 지구본 밖으로 나가도 안 잘리게 넓게 잡음) */
const getSize = () => ({
  width: document.documentElement.clientWidth,
  height: window.innerHeight - HEADER_HEIGHT,
});

/* 마커 만들기 함수: 마커 이미지 + 아래 이름표(국기 포함)를 담은 HTML 요소(div)를 만들어 반환, 클릭하면 onClick 실행 */
const createMarker = (museum, onClick) => {
  const box = document.createElement("div"); // 마커 전체를 감싸는 상자 (이미지 중심이 lat/lng 위치)
  box.style.position = "relative"; // 국기·이름표를 이 상자 기준으로 배치하기 위함
  box.style.cursor = "pointer"; // 마우스를 올리면 손 모양
  box.style.pointerEvents = "auto"; // 클릭을 받을 수 있게 함
  box.style.transition = "opacity 0.3s"; // 나타나고 사라질 때 부드럽게
  box.dataset.lat = museum.lat; // 사라지는 시점 계산에 쓸 위치 (아래 handleVisibility에서 사용)
  box.dataset.lng = museum.lng;
  box.onclick = () => onClick(museum);

  const img = document.createElement("img"); // 마커 이미지
  img.src = museum.markerImg;
  img.alt = museum.name;
  img.style.height = "90px"; // 세로 크기 (모든 마커 동일, 가로는 이미지 비율대로)
  img.style.display = "block";
  img.style.filter = "drop-shadow(0 6px 8px rgba(0, 0, 0, 0.5))"; // 이미지 모양을 따라 아래 그림자
  box.appendChild(img);

  const label = document.createElement("div"); // 마커 아래 이름표 (국기 + 박물관 이름 + 나라)
  Object.assign(label.style, {
    position: "absolute", // 상자 크기에 영향을 주지 않도록 띄워서 배치
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
    width: "max-content", // 글자 길이만큼 이름표 폭을 늘림 (안 하면 마커 폭에 갇혀 글자가 삐져나옴)
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

/* 각도 계산 함수: 지구 위 두 지점(위도·경도) 사이의 각도를 도(°) 단위로 반환 */
const getAngle = (lat1, lng1, lat2, lng2) => {
  const rad = (deg) => (deg * Math.PI) / 180;
  const cos =
    Math.sin(rad(lat1)) * Math.sin(rad(lat2)) +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lng2 - lng1));
  return (Math.acos(Math.min(1, Math.max(-1, cos))) * 180) / Math.PI;
};

const HIDE_RATIO = 0.8; // 지구 가장자리(수평선)까지 각도의 몇 %부터 숨길지 (1이면 가장자리에서 숨김, 작을수록 일찍 숨김)

/* 지구본 컴포넌트: size 상태로 크기를 정하고, globeRef로 지구본을 직접 잡아 자동 회전을 켬 */
const GlobeView = ({ onSelect, paused = false }) => {
  const [size, setSize] = useState(getSize()); // 지구본 영역의 가로·세로 크기 (처음엔 현재 창 크기 기준)
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
    globeRef.current.pointOfView({ altitude: GLOBE_ALTITUDE }); // 카메라 거리를 위 값으로 설정
  }, []);

  /* 박물관 카드가 열려 있으면 자동 회전 멈춤, 닫히면 다시 회전 */
  useEffect(() => {
    globeRef.current.controls().autoRotate = !paused;
  }, [paused]);

  /* 마커 클릭: 그 위치로 지구본을 돌리고 HomePage에 클릭한 박물관을 알려줌 */
  const handleMarkerClick = (museum) => {
    globeRef.current.pointOfView(
      { lat: museum.lat, lng: museum.lng, altitude: GLOBE_ALTITUDE },
      1000,
    );
    onSelect?.(museum);
  };

  /* 마커 보이기/숨기기: 카메라가 바라보는 중심에서 마커까지 각도가 한계를 넘으면 투명하게 만듦 (카메라가 움직일 때마다 호출됨) */
  const handleVisibility = (el, isVisible) => {
    let show = isVisible; // 기본값: 지구 뒤쪽이 아니면 보임
    if (globeRef.current) {
      const pov = globeRef.current.pointOfView(); // 현재 카메라 위치 { lat, lng, altitude }
      const horizon = (Math.acos(1 / (1 + pov.altitude)) * 180) / Math.PI; // 지구 가장자리까지의 각도
      const angle = getAngle(pov.lat, pov.lng, Number(el.dataset.lat), Number(el.dataset.lng));
      show = show && angle < horizon * HIDE_RATIO;
    }
    el.style.opacity = show ? "1" : "0";
    el.style.pointerEvents = show ? "auto" : "none"; // 숨겨진 마커는 클릭도 안 되게
  };

  return (
    <Globe
      ref={globeRef}
      width={size.width}
      height={size.height}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl={globeImg}
      atmosphereColor="#ffffff" // 지구본 뒤에서 퍼지는 빛 색 (기본 lightskyblue)
      atmosphereAltitude={0.25} // 빛이 퍼지는 두께 (기본 0.15, 클수록 넓게 퍼짐)
      htmlElementsData={homeMarkers} // 마커로 표시할 배열 (lat, lng 속성을 위치로 사용)
      htmlElement={(museum) => createMarker(museum, handleMarkerClick)} // 마커 하나를 그리는 함수
      htmlElementVisibilityModifier={handleVisibility} // 마커를 보이게/숨기게 하는 함수
    />
  );
};

export default GlobeView;
