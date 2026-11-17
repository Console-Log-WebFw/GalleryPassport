/* homeMarkers.js: 홈 화면 지구본에 표시할 마커(박물관) 데이터 - 이름, 버튼용 짧은 이름(shortName), 나라, 나라 코드(countryCode, 국기용), 위도(lat), 경도(lng), 마커 이미지(markerImg), 카드 사진(modalImg), 관련 사이트(links), 카드 색(theme) 배열 */

import louvreMarker from "../assets/images/home/louvre-marker.png";
import momaMarker from "../assets/images/home/moma-marker.png";
import nationalMuseumKoreaMarker from "../assets/images/home/national-museum-korea-marker.png";
import louvreModal from "../assets/images/home/louvru_modal.jpeg";
import momaModal from "../assets/images/home/moma_modal.webp";
import nationalMuseumKoreaModal from "../assets/images/home/national-museum-korea_modal.jpeg";

const homeMarkers = [
  {
    id: "louvre",
    name: "루브르 박물관",
    shortName: "루브르",
    country: "프랑스",
    countryCode: "fr",
    lat: 48.8603,
    lng: 2.3386,
    markerImg: louvreMarker,
    modalImg: louvreModal,
    links: [{ label: "루브르 공식 홈페이지", url: "https://www.louvre.fr" }],
    theme: { accent: "#1f4a8a", accentHover: "#173a6e", bg: "#eef3fa" }, // 진한 파랑
  },
  {
    id: "moma",
    name: "뉴욕 현대미술관",
    shortName: "MoMA",
    country: "미국",
    countryCode: "us",
    lat: 40.7615,
    lng: -73.9783,
    markerImg: momaMarker,
    modalImg: momaModal,
    links: [{ label: "MoMA 공식 홈페이지", url: "https://www.moma.org" }],
    theme: { accent: "#1f4d3a", accentHover: "#173b2c", bg: "#fbf8f4" }, // 진한 초록 (기존 색)
  },
  {
    id: "national-museum-korea",
    name: "국립중앙박물관",
    shortName: "국립중앙박물관",
    country: "한국",
    countryCode: "kr",
    lat: 37.5239,
    lng: 126.9803,
    markerImg: nationalMuseumKoreaMarker,
    modalImg: nationalMuseumKoreaModal,
    links: [{ label: "국립중앙박물관 공식 홈페이지", url: "https://www.museum.go.kr" }],
    theme: { accent: "#9c7a4d", accentHover: "#85673f", bg: "#f5ecdc" }, // 베이지색
  },
];

export default homeMarkers;
