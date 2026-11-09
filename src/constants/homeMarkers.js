/* homeMarkers.js: 홈 화면 지구본에 표시할 마커(박물관) 데이터 - 이름, 나라, 나라 코드(countryCode, 국기용), 위도(lat), 경도(lng), 마커 이미지(markerImg) 배열 */

import louvreMarker from "../assets/images/home/louvre-marker.png";
import momaMarker from "../assets/images/home/moma-marker.png";
import nationalMuseumKoreaMarker from "../assets/images/home/national-museum-korea-marker.png";

const homeMarkers = [
  {
    id: "louvre",
    name: "루브르 박물관",
    country: "프랑스",
    countryCode: "fr",
    lat: 48.8603,
    lng: 2.3386,
    markerImg: louvreMarker,
  },
  {
    id: "moma",
    name: "뉴욕 현대미술관",
    country: "미국",
    countryCode: "us",
    lat: 40.7615,
    lng: -73.9783,
    markerImg: momaMarker,
  },
  {
    id: "national-museum-korea",
    name: "국립중앙박물관",
    country: "한국",
    countryCode: "kr",
    lat: 37.5239,
    lng: 126.9803,
    markerImg: nationalMuseumKoreaMarker,
  },
];

export default homeMarkers;
