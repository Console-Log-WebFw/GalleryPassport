/* level.js: 방문한 갤러리 수에 따른 여정 레벨 */

/* 방문 수가 minVisits 이상이면 그 레벨 (아래에서 위로 가장 높은 것 적용) */
export const LEVELS = [
  { name: "Novice", minVisits: 0 },
  { name: "Explorer", minVisits: 2 },
  { name: "Master", minVisits: 3 },
];

/* 방문 수로 레벨 이름 구하기 */
export const getLevel = (visitCount) =>
  [...LEVELS].reverse().find((l) => visitCount >= l.minVisits).name;
