# 🖼️ 갤러리 개발 가이드 (팀원용)

갤러리 틀(라우팅, room-gallery 연결, 방·미니맵, 작품 상세 모달, 지구본 연결)은 만들어져 있습니다.
**JSON 채우기 · 이미지 넣기 · CSS 디자인**만 하면 화면에 바로 반영됩니다.

---

## 1. 화면 구조

| 주소 | 화면 |
|---|---|
| `/` | 홈 지구본 — 박물관 마커 클릭 → 카드 → **방문하기**로 갤러리 입장 |
| `/gallery` | 박물관 선택 (카드 3개) |
| `/gallery/{박물관id}` | 그 박물관의 첫 번째 방 |
| `/gallery/{박물관id}/{방id}` | 특정 방 (예: `/gallery/moma/room-2`) |

전시관 화면 구성:
- **위**: 박물관별 헤더 (목록으로 돌아가기, 박물관 이름, 현재 방 이름)
- **가운데**: room-gallery 3D 방 — 화살표 버튼 / 방향키 / 스와이프 / 아래 번호로 벽 이동
  - 벽에는 **작품** 또는 옆 방으로 가는 **문**이 걸립니다 (아래 4번)
- **오른쪽 위**: 미니맵 — 평면도, 문, 현재 위치와 바라보는 방향, 다른 방 클릭 시 이동, 접기
- **정면 작품 그림 클릭** → 작품 상세 모달 (이전/다음은 같은 방 안에서, ESC·배경 클릭으로 닫기)
- **정면 문 클릭** → 화면이 어두워지며 옆 방으로 이동, 진행 방향 벽을 바라보며 시작 (지나온 문은 등 뒤)
  - 클릭은 지금 바라보는 정면 벽만 됩니다. 옆 벽의 작품·문은 화살표로 돌아선 뒤 클릭하세요.

## 2. 관련 파일

```
src/
├─ data/
│  ├─ museums/
│  │  ├─ national-museum-korea.json   # 국립중앙박물관 정보 + 방 + 작품
│  │  ├─ moma.json
│  │  ├─ louvre.json
│  │  └─ index.js                     # MUSEUMS, getMuseum(id), getRoom(museum, roomId)
│  └─ homeMuseums.js                  # 홈 지구본 마커 위치 (lat/lng)
├─ assets/images/artworks/
│  ├─ placeholder.svg                 # 이미지가 없을 때 대신 나오는 회색 액자
│  ├─ national-museum-korea/          # 각 박물관 작품 이미지
│  ├─ moma/
│  └─ louvre/
├─ utils/
│  ├─ artworkImage.js                 # 이미지 파일명 → 실제 주소 변환
│  └─ roomLayout.js                   # 방 배치(map) → 문 방향 계산, 작품·문을 벽에 배치
├─ components/common/ArtworkModal.jsx / .css   # 작품 상세 모달
└─ pages/
   ├─ Home/components/
   │  ├─ GlobeView.jsx                # 지구본 (마커 클릭 → onSelect)
   │  └─ MuseumCard.jsx / .css        # 지구본 위 박물관 카드
   └─ Gallery/
      ├─ GalleryPage.jsx / .css       # 목록 / 전시관 분기 + 박물관별 전시관 CSS 자리
      ├─ components/
      │  ├─ MuseumList.jsx / .css     # 박물관 선택 카드
      │  ├─ GalleryRoom.jsx / .css    # room-gallery 방 1개 + 작품·문 클릭 + 액자 스타일
      │  ├─ WallDoor.jsx / .css       # 옆 방으로 가는 문 모양
      │  └─ GalleryMinimap.jsx / .css # 미니맵 (SVG 평면도)
      ├─ interiors/                   # 박물관별 인테리어 (벽·바닥·천장·액자·문 색)
      │  ├─ index.js
      │  ├─ NationalMuseumKoreaInterior.css
      │  ├─ MomaInterior.css
      │  └─ LouvreInterior.css
      └─ headers/
         ├─ index.js                  # 박물관 id → 헤더 선택
         ├─ GalleryHeader.jsx / .css  # 공통 기본 헤더
         ├─ NationalMuseumKoreaHeader.jsx / .css
         ├─ MomaHeader.jsx / .css
         └─ LouvreHeader.jsx / .css
```

> **자기 박물관 JSON · 헤더 · 인테리어 파일만 고치면** 다른 사람과 충돌이 나지 않습니다.

## 3. 박물관 · 방 · 작품 데이터 (JSON)

`src/data/museums/{박물관}.json`

```json
{
  "id": "moma",
  "name": "뉴욕 현대미술관",
  "nameEn": "The Museum of Modern Art (MoMA)",
  "country": "USA",
  "city": "New York",
  "description": "박물관 소개 (홈 지구본 카드에 표시)",
  "coverImage": "moma/cover.jpg",
  "roomStyles": {},
  "roomSettings": {},
  "rooms": [
    {
      "id": "room-1",
      "name": "1전시실",
      "map": { "x": 0, "y": 0, "w": 1, "h": 1 },
      "artworks": [
        {
          "id": "moma-01",
          "title": "별이 빛나는 밤",
          "titleEn": "The Starry Night",
          "artist": "빈센트 반 고흐",
          "year": "1889",
          "medium": "캔버스에 유채",
          "description": "작품 설명",
          "docent": "도슨트 설명",
          "image": "moma/starry-night.jpg",
          "credit": "출처: Wikimedia Commons (Public Domain)"
        }
      ]
    }
  ]
}
```

### 박물관 필드

| 필드 | 설명 | 어디에 보이나 |
|---|---|---|
| `id` | 주소에 쓰이는 이름. **바꾸지 말 것** (homeMuseums.js 의 id 와 같아야 함) | `/gallery/{id}` |
| `name` / `nameEn` | 박물관 이름 | 선택 카드, 전시관 헤더, 지구본 카드 |
| `country` / `city` | 나라 / 도시 | 선택 카드, 지구본 카드 |
| `description` | 박물관 소개 | 지구본 카드 (비면 "소개 준비 중입니다.") |
| `coverImage` | 선택 카드 이미지 파일명 | 선택 카드 |
| `roomStyles` / `roomSettings` | 3D 방 디자인 (아래 6번) | 전시관 |
| `rooms` | 방 목록 (아래) | 전시관, 미니맵 |

### 방 필드 (`rooms[]`)

| 필드 | 설명 |
|---|---|
| `id` | 주소에 쓰임 (`/gallery/moma/room-2`). 박물관 안에서 겹치지 않게 |
| `name` | 헤더 칩, 미니맵에 표시되는 이름 |
| `map` | 미니맵에서의 위치·크기 (아래 4번) |
| `artworks` | 이 방에 걸리는 작품 목록. 순서 = 벽에 걸리는 순서 |

- room-gallery 방 하나는 **벽 4면**입니다. 작품 + 문이 **4개 이하**면 방 1칸, 5개 이상이면 오른쪽(동쪽)으로 칸을 이어 붙인 긴 복도가 됩니다(루브르 예시). 작품 수 제한은 없습니다.
- 지금 예시 구성: 국립중앙박물관 3방×3점(가로 일렬) / MoMA 2방(4점+5점, ㄱ자) / 루브르 1방 9점(긴 복도).

### 작품 필드 (`rooms[].artworks[]`)

| 필드 | 설명 | 어디에 보이나 |
|---|---|---|
| `id` | `{박물관id}-01` 형식. 겹치지 않게 | (내부용) |
| `title` | 작품 제목 | 벽 아래 + 모달 |
| `titleEn` | 영문 제목 | 모달 |
| `artist` / `year` | 작가 / 연도 | 벽 아래 + 모달 |
| `medium` | 재료·기법 | 모달 |
| `description` | 작품 설명 | 모달 "작품 설명" 칸 |
| `docent` | 도슨트 설명 | 모달 "도슨트" 칸 |
| `image` | 이미지 파일명 (아래 5번) | 벽 + 모달 |
| `credit` | 출처·저작권 표기 | 모달 맨 아래 |

- 모달은 넓은 화면에서 **왼쪽 이미지 | 오른쪽 설명** 2단이고, 설명이 길면 오른쪽만 스크롤됩니다.
- `description` / `docent`는 **빈 줄(줄바꿈 두 번 `\n\n`)로 문단**을 나눌 수 있습니다.
  ```json
  "description": "첫 번째 문단입니다.\n\n두 번째 문단입니다."
  ```
- `description` / `docent`가 비어 있으면 "설명 준비 중입니다."가 표시되고, 작가·연도·재료·출처는 비어 있으면 숨겨집니다.
- JSON은 마지막 항목 뒤에 쉼표(`,`)가 있으면 에러가 납니다.

## 4. 미니맵 (방 배치) · 문

각 방의 `map`이 미니맵 격자에서의 칸 위치입니다. 칸 단위이고 0부터 셉니다. **위쪽이 북쪽(n)** 입니다.

| 값 | 뜻 |
|---|---|
| `x` / `y` | 왼쪽에서 / 위에서 몇 번째 칸에서 시작하는지 |
| `w` / `h` | 가로 / 세로로 몇 칸을 차지하는지 |

예) MoMA의 ㄱ자 배치
```
room-1: { "x": 0, "y": 0, "w": 1, "h": 1 }    ┌───┐
room-2: { "x": 0, "y": 1, "w": 2, "h": 1 }    │ 1 │
                                              ├───┴───┐
                                              │   2   │
                                              └───────┘
```
- 격자 크기는 방들 중 가장 오른쪽·아래 끝에 맞춰 자동으로 정해집니다.

### 문은 자동으로 생깁니다
- `map`에서 **벽을 맞대고 있는 방끼리** 문이 생깁니다. 위 예시에서는 1전시실의 아래(남쪽) 벽과 2전시실의 위(북쪽) 벽에 서로 통하는 문이 생깁니다.
- 문은 작품과 벽을 같이 쓰지 않고 **문만 있는 벽**이 따로 추가되며, 미니맵과 같은 방향의 벽에 놓입니다. 3D 방에서는 처음 보는 정면이 북쪽, 오른쪽 벽이 동쪽입니다.
- 복도형 방에서는 앞쪽 긴 벽이 북쪽, 끝 벽(오른쪽 끝)이 동쪽, 뒤쪽 긴 벽이 남쪽, 시작 벽(왼쪽 끝)이 서쪽입니다.
- 필요한 방향의 벽을 만들려고 **빈 벽**이 끼어들 수 있습니다 (그래서 아래 번호 수가 작품 수보다 많을 수 있음).
- 한 방향에 맞닿은 방이 둘이면 문은 하나만 생깁니다(먼저 찾은 방). 배치할 때 한 벽에는 이웃 방 하나만 오도록 해 주세요.
- 계산 코드: `src/utils/roomLayout.js` (`getDoors`, `buildWalls`)

### 미니맵 디자인
`src/pages/Gallery/components/GalleryMinimap.css`
- 강조색: `.gallery-minimap`의 `--minimap-accent`
- 방: `.gallery-minimap-room rect`, 현재 방: `.is-current`
- 문(통로): `.gallery-minimap-door`
- 현재 위치 점: `.gallery-minimap-me`, 바라보는 방향 부채꼴: `.gallery-minimap-view path`

## 5. 작품 이미지 넣기

1. 이미지를 `src/assets/images/artworks/{박물관id}/` 에 넣기
   예) `src/assets/images/artworks/louvre/mona-lisa.jpg`
2. JSON의 `image`에 **박물관 폴더부터 파일명까지** 적기
   예) `"image": "louvre/mona-lisa.jpg"`

- 지원 형식: `png`, `jpg`, `jpeg`, `webp`
- 파일명이 틀리거나 비어 있으면 `placeholder.svg`(이미지 준비 중)가 대신 나옵니다.
- 파일명은 **영문 소문자 + 하이픈** 권장 (한글·공백은 피하기)
- 용량이 큰 원본은 1~2MB 이하로 줄여서 넣기
- 저작권: 공개 도메인 작품 우선, 그 외는 `credit`에 출처 + 학습용 표기 (라이브러리 가이드 5번 참고)

## 6. 디자인 바꾸기

### 6-1. 전시관 헤더 — 박물관별 파일

`src/pages/Gallery/headers/` 에 박물관마다 파일이 따로 있습니다.

- **색·폰트만 바꿀 때**: `MomaHeader.css` 같은 자기 박물관 CSS의 빈 칸을 채우기
  ```css
  .gallery-header--moma {
    background: #111;
    color: #fff;
  }
  .gallery-header--moma .gallery-header-name {
    font-family: "Helvetica Neue", sans-serif;
  }
  ```
- **구조까지 바꿀 때**: `MomaHeader.jsx`에서 `GalleryHeader`를 쓰지 말고 직접 JSX를 작성 (props: `museum`, `room`)
- 헤더 높이는 `GalleryPage.css`의 `--gallery-top-height`(44px) — 바꾸면 3D 방 높이도 자동으로 맞춰집니다.
- 새 박물관은 `headers/index.js`에 등록하지 않으면 공통 헤더(`GalleryHeader`)를 씁니다.

### 6-2. 인테리어 (벽 · 바닥 · 천장 · 액자 · 문) — 박물관별 CSS

`src/pages/Gallery/interiors/{박물관}Interior.css` 에 **CSS 변수 값만** 적혀 있습니다. 값만 바꾸면 그 박물관에만 적용됩니다.

| 변수 | 뜻 |
|---|---|
| `--room-light-wall-background` | 벽 (색, 그라데이션, `url()` 이미지 가능) |
| `--room-light-floor-background` | 바닥 |
| `--room-light-ceil-background` | 천장 |
| `--room-light-body-background` | 벽 뒤 배경 — **벽과 비슷한 색으로** (아래 ⚠️) |
| `--room-light-wall-shadow` | 벽 모서리 그림자 |
| `--room-light-text-color` | 작품 아래 제목 글자색 |
| `--frame-color` / `--frame-width` | 액자 테두리 색 / 두께 |
| `--frame-border-image` | 테두리를 그라데이션으로 (예: 루브르 금색). 안 쓰면 `none` |
| `--frame-mat-color` / `--frame-mat-size` | 그림과 테두리 사이 여백(매트) 색 / 두께 |
| `--frame-shadow` | 액자 그림자 |
| `--door-frame-color` / `--door-leaf-color` / `--door-knob-color` | 문틀 / 문짝 / 손잡이 |
| `--door-passage` | 열린 문 너머로 보이는 옆 방 빛 |
| `--door-sign-background` / `--door-sign-color` | 문 위 안내판 |

예) 벽지 이미지 쓰기 — 이미지를 `src/assets/images/interiors/louvre/` 에 넣고:
```css
.gallery--louvre {
  --room-light-wall-background: #6e2228 url("../../../assets/images/interiors/louvre/damask.png") repeat;
}
```
- 무늬는 **위아래 방향 그라데이션이나 반복 무늬**가 좋습니다. 벽이 여러 칸 이어지는 복도형에서 칸 경계가 티 나지 않습니다.
- ⚠️ 벽을 바꾸면 `--room-light-body-background`도 벽과 비슷하게 맞춰 주세요. 벽 뒤 배경이라, 화면에 따라 벽 일부가 덜 그려질 때 이 색이 보입니다.
- 새 박물관은 `interiors/`에 파일을 만들고 `interiors/index.js`에 import 한 줄 추가.

### 6-3. 3D 방 동작 — JSON에서

`roomSettings`: 동작 옵션 ([room-gallery README](../node_modules/room-gallery/README.md)의 *RoomGallery Settings* 목록)

```json
"roomSettings": {
  "darkMode": "dark",
  "paginations": "title"
}
```

- 기본값은 `components/GalleryRoom.jsx`의 `DEFAULT_ROOM_STYLES` / `DEFAULT_ROOM_SETTINGS`에 있고, JSON `roomStyles` / `roomSettings` 값이 덮어씁니다.
- **색·재질은 `roomStyles`가 아니라 6-2의 인테리어 CSS에서** 바꿔 주세요. room-gallery는 `roomStyles` 값을 페이지 전체(`:root`)에 저장해서, 다른 박물관으로 이동해도 남을 수 있습니다.
- ⚠️ `width` / `height`는 `%` 단위를 쓸 수 없습니다 (`px`, `vw`, `dvh` 등 사용).

### 6-4. 전시관 화면 전체 — CSS에서

`src/pages/Gallery/GalleryPage.css` 맨 아래 박물관별 칸 (`.gallery--louvre` 등). 방 이동 연출(어두워짐)도 이 파일에 있습니다.

### 6-5. 작품 상세 모달 / 지구본 카드

- 모달: `src/components/common/ArtworkModal.css`
- 지구본 카드: `src/pages/Home/components/MuseumCard.css`

## 7. 박물관 추가하기

1. `src/data/museums/새박물관.json` 만들기 (기존 파일 복사 후 `id` 변경)
2. `src/data/museums/index.js`에 import 한 줄 + `MUSEUMS` 배열에 추가
3. `src/assets/images/artworks/새박물관/` 폴더 만들기
4. 지구본에 표시하려면 `src/data/homeMuseums.js`에 같은 `id`로 위치(lat/lng) 추가
5. (선택) 전용 헤더: `headers/`에 파일 만들고 `headers/index.js`에 등록
6. 인테리어: `interiors/`에 `새박물관Interior.css` 만들고 `interiors/index.js`에 import (없으면 room-gallery 기본 흰 벽)

## 8. 알아둘 점

- 지구본 마커와 갤러리는 **id로 연결**됩니다. `homeMuseums.js`의 `id`와 박물관 JSON의 `id`가 다르면 카드가 뜨지 않습니다.
- 모달이 열려 있어도 방향키(←/→)는 뒤의 3D 방을 움직입니다 (room-gallery가 키 입력을 직접 받음). 모달 안에서는 버튼으로 이동하세요.
- `room-gallery`는 `import { RoomGallery } from "room-gallery"`로 가져와야 합니다 (`import RoomGallery from` 형태는 Vite에서 에러).
- room-gallery 기본 `z-index`가 1000이라 미니맵·헤더 메뉴를 덮어서 `GalleryRoom.css`에서 1로 낮춰 두었습니다.
- room-gallery의 왼쪽·오른쪽 벽은 90도로 돌아가 있어 브라우저가 그 벽 위 요소의 클릭을 못 잡습니다. 그래서 작품·문 클릭은 `GalleryRoom.jsx`가 **누른 위치가 정면 벽의 그림/문 영역 안인지**로 판단합니다. 같은 이유로 옆 벽 문에는 마우스를 올렸을 때 문이 열리는 효과가 안 나올 수 있습니다.
- 벽 이음새: room-gallery가 벽마다 따로 그리게 하는 설정(`will-change`)을 `GalleryRoom.css`에서 꺼 두었고, 벽 뒤 배경을 벽색과 맞춰 두었습니다. 그래도 이음새가 보이면 브라우저 화면 배율, 방, 몇 번 작품 위치였는지와 함께 알려 주세요.
- room-gallery 공개 베타는 개발·테스트용으로만 무료입니다 (README "Licensing Update"). 수업 프로젝트 용도로 사용.
