/* roomLayout.js: 방 배치(map)로 옆 방과 통하는 문 방향을 찾고, 작품·문을 room-gallery 벽 순서에 맞게 배치하는 함수 */

/* 미니맵 방향: n(위) e(오른쪽) s(아래) w(왼쪽) - 3D 방에서도 처음 보는 정면이 n, 오른쪽 벽이 e */
const ONE_ROOM_DIRS = ["n", "e", "s", "w"];

/* 두 구간 [a1, a2), [b1, b2) 가 겹치는지 */
const overlaps = (a1, a2, b1, b2) => a1 < b2 && b1 < a2;

/* 이 방과 벽을 맞대고 있는 방 → [{ dir: "e", room }, ...] (한 방향에 문은 하나, 먼저 찾은 방) */
export const getDoors = (rooms, room) => {
  const { x, y, w, h } = room.map;
  const doors = {};
  rooms.forEach((other) => {
    if (other.id === room.id) return;
    const o = other.map;
    let dir = null;
    if (o.x === x + w && overlaps(y, y + h, o.y, o.y + o.h)) dir = "e";
    else if (o.x + o.w === x && overlaps(y, y + h, o.y, o.y + o.h)) dir = "w";
    else if (o.y === y + h && overlaps(x, x + w, o.x, o.x + o.w)) dir = "s";
    else if (o.y + o.h === y && overlaps(x, x + w, o.x, o.x + o.w)) dir = "n";
    if (dir && !doors[dir]) doors[dir] = other;
  });
  return Object.entries(doors).map(([dir, door]) => ({ dir, room: door }));
};

/*
 * 벽 count개를 넣었을 때 각 벽의 방향 (room-gallery helpers/parse.tsx 의 parseWalls 규칙과 같음)
 * - 4개 이하: 방 1칸 → n, e, s, w 순
 * - 5개 이상: 칸을 오른쪽(동쪽)으로 이어 붙인 복도 → 앞쪽 긴 벽들(n) → 끝 벽(e) → 뒤쪽 긴 벽들(s) → 시작 벽(w)
 */
export const getWallDirections = (count) => {
  const rooms = Math.ceil((count - 2) / 2) || 1;
  const dirs = [];
  let dir = "n";
  for (let i = 1; i <= count; i++) {
    if (rooms === 1) dir = ONE_ROOM_DIRS[i - 1];
    else if (i === rooms + 1) dir = "e";
    else if (i >= rooms + 2 && i < rooms * 2 + 2) dir = "s";
    else if (i === rooms * 2 + 2) dir = "w";
    dirs.push(dir);
  }
  return dirs;
};

/*
 * 벽 목록 만들기 → [{ type: "artwork" | "door" | "empty", dir, artwork?, door? }, ...] (room-gallery에 넣는 순서)
 * - 문은 옆 방 방향과 같은 방향의 벽에 문만 따로 둠 (작품 벽과 공유하지 않음)
 * - 그 방향 벽이 생길 때까지 벽 수를 늘리고, 남는 벽은 빈 벽
 */
export const buildWalls = (rooms, room) => {
  const doors = getDoors(rooms, room);
  const { artworks } = room;

  for (let count = artworks.length + doors.length; count < artworks.length + doors.length + 8; count++) {
    const dirs = getWallDirections(count);
    const walls = dirs.map((dir) => ({ type: "empty", dir }));

    /* 문: 같은 방향의 빈 벽 중 첫 번째 */
    const placed = doors.every(({ dir, room: door }) => {
      const wall = walls.find((w) => w.type === "empty" && w.dir === dir);
      if (!wall) return false;
      wall.type = "door";
      wall.door = door;
      return true;
    });
    if (!placed) continue;

    /* 작품: 남은 벽에 순서대로 */
    const free = walls.filter((w) => w.type === "empty");
    if (free.length < artworks.length) continue;
    artworks.forEach((artwork, i) => {
      free[i].type = "artwork";
      free[i].artwork = artwork;
    });
    return walls;
  }

  /* 여기까지 오는 경우는 없지만, 혹시 몰라 작품만 배치 */
  return artworks.map((artwork, i) => ({
    type: "artwork",
    dir: getWallDirections(artworks.length)[i],
    artwork,
  }));
};
