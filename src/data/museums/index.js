/* museums/index.js: 박물관별 JSON을 모아 목록과 찾기 함수를 내보냄 - 박물관 추가 시 import 한 줄 + 배열에 한 칸 추가 */

import nationalMuseumKorea from "./national-museum-korea.json";
import moma from "./moma.json";
import louvre from "./louvre.json";

/* 갤러리 입장 화면에 보이는 순서 */
export const MUSEUMS = [nationalMuseumKorea, moma, louvre];

/* id로 박물관 하나 찾기 (없으면 undefined) */
export const getMuseum = (id) => MUSEUMS.find((museum) => museum.id === id);

/* 박물관 안에서 id로 방 하나 찾기 (id가 없거나 틀리면 첫 번째 방) */
export const getRoom = (museum, roomId) =>
  museum.rooms.find((room) => room.id === roomId) || museum.rooms[0];
