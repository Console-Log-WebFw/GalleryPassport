/* doors/index.js: 박물관 id → 전시관 문 컴포넌트 - 목록에 없는 박물관은 기본 문(components/WallDoor)을 씀 */

import WallDoor from "../components/WallDoor";
import NationalMuseumKoreaDoor from "./NationalMuseumKoreaDoor";
import MomaDoor from "./MomaDoor";
import LouvreDoor from "./LouvreDoor";

const DOORS = {
  "national-museum-korea": NationalMuseumKoreaDoor,
  moma: MomaDoor,
  louvre: LouvreDoor,
};

export const getGalleryDoor = (museumId) => DOORS[museumId] || WallDoor;
