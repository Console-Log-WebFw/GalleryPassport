# 🖼️ 갤러리 개발 가이드 (팀원용)

갤러리 틀(라우팅, room-gallery 3D 방, 방·문·미니맵, 작품 상세 모달, 지구본 연결)은 만들어져 있습니다.
각 박물관 담당자는 **JSON(작품·방 정보) · 이미지 · 자기 박물관 파일(인테리어·헤더·문·모달)** 만 고치면 됩니다.

- 처음이라면: **0번 표에서 할 작업을 찾고 → 2번의 해당 따라 하기**를 보세요.
- 결과가 이상하면: **5번 문제 해결표**를 보세요.

---

## 0. 내가 할 작업 찾기

| 하고 싶은 일 | 고칠 파일 | 전용/공용 | 따라 하기 |
|---|---|---|---|
| 작품 한 점 등록 | `src/data/museums/{박물관}.json` + 이미지 | 전용 | [2-1](#2-1-작품-한-점-등록하기) |
| 작품 설명·도슨트 쓰기 | `src/data/museums/{박물관}.json` | 전용 | [2-2](#2-2-작품-설명도슨트-쓰기) |
| 방 추가·삭제, 작품을 다른 방으로 옮기기 | `src/data/museums/{박물관}.json` | 전용 | [2-3](#2-3-방-추가삭제-작품-옮기기) |
| 방 배치(평면도) 바꾸기 | `src/data/museums/{박물관}.json` 의 `map` | 전용 | [2-4](#2-4-방-배치평면도-바꾸기) |
| 벽·바닥·천장 바꾸기 | `src/pages/Gallery/interiors/{박물관}Interior.css` | 전용 | [2-5](#2-5-인테리어-바꾸기-벽바닥천장) |
| 액자·문 색 바꾸기 | `src/pages/Gallery/interiors/{박물관}Interior.css` | 전용 | [2-6](#2-6-액자문-색-바꾸기) |
| 전시관 위 헤더 바꾸기 | `src/pages/Gallery/headers/{박물관}Header.jsx / .css` | 전용 | [2-7](#2-7-헤더-바꾸기) |
| 문 모양 바꾸기 | `src/pages/Gallery/doors/{박물관}Door.jsx / .css` | 전용 | [2-9](#2-9-문-모양-바꾸기) |
| 작품 상세 모달 모양 바꾸기 | `src/pages/Gallery/modals/{박물관}Modal.jsx / .css` | 전용 | [2-10](#2-10-작품-상세-모달-모양-바꾸기) |
| 박물관 소개·표지 이미지 | `src/data/museums/{박물관}.json` | 전용 | [3-1](#3-1-박물관-필드) |
| 새 박물관 추가 | 여러 파일 | 공용 포함 | [2-8](#2-8-새-박물관-추가하기) |

> **전용** 파일은 자기 박물관에만 적용되고 다른 사람과 충돌하지 않습니다.
> **공용** 파일(아래 4-3 목록)은 세 박물관 모두에 적용됩니다. 고치기 전에 팀에 알려 주세요.
> 갤러리마다 무엇을 다르게 할 수 있고 무엇을 공유하는지는 **[4번](#4-갤러리별-설정--공유-설정)** 에 정리되어 있습니다.

### 확인하는 방법 (모든 작업 공통)
```bash
npm run dev
```
- 브라우저에서 `http://localhost:5173/gallery/{박물관id}` (예: `/gallery/louvre`, 특정 방은 `/gallery/moma/room-2`)
- 파일을 저장하면 화면이 자동으로 바뀝니다. 안 바뀌면 새로고침.
- 박물관 id: `national-museum-korea` / `moma` / `louvre`

---

## 1. 화면 구조

| 주소 | 화면 |
|---|---|
| `/` | 홈 지구본 — 박물관 마커 클릭 → 카드 → **방문하기**로 갤러리 입장 |
| `/gallery` | 박물관 선택 (카드 3개) |
| `/gallery/{박물관id}` | 그 박물관의 첫 번째 방 |
| `/gallery/{박물관id}/{방id}` | 특정 방 |

전시관 화면:
- **위**: 박물관별 헤더 (목록으로, 박물관 이름, 현재 방 이름)
- **가운데**: room-gallery 3D 방. 화살표 버튼 / 방향키(←→) / 스와이프 / 아래 번호 버튼으로 **벽을 하나씩** 돌아봄. 벽마다 작품 하나, 또는 옆 방으로 가는 문 하나, 또는 빈 벽
- **오른쪽 위**: 미니맵 — 평면도, 방 사이 문, 현재 위치와 바라보는 방향, 다른 방 클릭 시 이동
- **정면 작품 클릭** → 작품 상세 모달 (이전/다음은 같은 방 안의 작품끼리)
- **정면 문 클릭** → 화면이 어두워지며 옆 방으로 이동, 걸어온 방향의 벽을 보며 시작 (지나온 문은 등 뒤)
- 클릭은 **지금 바라보는 정면 벽**만 됩니다. 옆 벽은 화살표로 돌아선 뒤 클릭.

---

## 2. 작업별 따라 하기

### 2-1. 작품 한 점 등록하기

1. **이미지 넣기** — `src/assets/images/artworks/{박물관id}/` 폴더에 파일 복사
   예) `src/assets/images/artworks/louvre/mona-lisa.jpg`
2. **JSON 열기** — `src/data/museums/louvre.json`에서 작품을 걸 방의 `"artworks": [ ... ]` 찾기
3. **작품 항목 채우기** — 이미 있는 자리표시 항목(`"title": "작품 제목 1"` 등)을 고치거나, 항목 하나를 통째로 복사해 붙여넣고 값 수정
   ```json
   {
     "id": "louvre-01",
     "title": "모나리자",
     "titleEn": "Mona Lisa",
     "artist": "레오나르도 다빈치",
     "year": "1503–1519",
     "medium": "포플러 패널에 유채",
     "description": "작품 설명 첫 문단.\n\n두 번째 문단.",
     "docent": "도슨트 설명",
     "image": "louvre/mona-lisa.jpg",
     "credit": "출처: Wikimedia Commons (Public Domain)"
   }
   ```
4. **확인** — `/gallery/louvre` 에서 해당 벽 그림 → 클릭해서 모달 내용 확인

**규칙**
- `id`는 `{박물관id}-번호` 형식, 박물관 안에서 겹치지 않게 (새로 추가하면 `louvre-10`, `louvre-11` …)
- `image`는 **박물관 폴더 이름부터** 적기 (`"mona-lisa.jpg"` ❌ → `"louvre/mona-lisa.jpg"` ⭕)
- 모르는 값은 지우지 말고 `""`(빈 값)으로 두기 — 빈 값은 화면에서 자동으로 숨거나 "설명 준비 중"으로 나옴
- 항목 사이에는 쉼표 `,`, **마지막 항목 뒤에는 쉼표 없음**

**이미지 권장**
| 항목 | 권장 |
|---|---|
| 형식 | `jpg`, `png`, `webp` (`jpeg` 도 됨). **확장자는 소문자로** — `.JPG`, `.PNG` 는 인식되지 않음 |
| 크기 | 긴 변 1600~2000px, 파일 1~2MB 이하 |
| 파일명 | 영문 소문자 + 하이픈 (`starry-night.jpg`). 한글·공백 피하기 |
| 비율 | 가로·세로 모두 가능. 액자 높이는 벽에 맞고 너비는 그림 비율을 따라감 |
| 저작권 | 공개 도메인 우선, 그 외는 `credit`에 출처 + 학습용 표기 (라이브러리 가이드 5번) |

- 이미지 경로가 틀리거나 비어 있으면 "이미지 준비 중" 그림(`placeholder.svg`)이 대신 나옵니다.

### 2-2. 작품 설명·도슨트 쓰기

모달 오른쪽(좁은 화면은 아래)에 **작품 정보 → 작품 설명 → 도슨트 → 출처** 순서로 나옵니다.

| 필드 | 모달에서 | 비어 있으면 |
|---|---|---|
| `title` / `titleEn` | 제목 / 영문 제목 | 영문 제목 숨김 |
| `artist` / `year` / `medium` | 작가·연도·재료 표 | 그 줄 숨김 |
| `description` | "작품 설명" 칸 | "설명 준비 중입니다." |
| `docent` | "도슨트" 칸 | "설명 준비 중입니다." |
| `credit` | 맨 아래 작은 글씨 | 숨김 |

- 벽 그림 아래에는 `title`과 `artist, year`만 나옵니다.
- **문단 나누기**: 줄을 두 번 바꾸는 `\n\n` 을 넣습니다. JSON 안에서는 실제 엔터를 칠 수 없습니다.
  ```json
  "description": "첫 문단입니다.\n\n두 번째 문단입니다."
  ```
- **큰따옴표**를 글 안에 쓰려면 `\"` 로 적습니다. (작은따옴표 `'` 는 그대로 써도 됨)
  ```json
  "docent": "작가는 \"빛\"을 이렇게 표현했습니다."
  ```
- 설명이 길어도 됩니다. 넓은 화면에서는 설명 칸만 스크롤됩니다.

### 2-3. 방 추가·삭제, 작품 옮기기

방은 JSON의 `"rooms": [ ... ]` 배열에 하나씩 있습니다.
```json
{
  "id": "room-4",
  "name": "4전시실",
  "map": { "x": 3, "y": 0, "w": 1, "h": 1 },
  "artworks": []
}
```
- **방 추가**: 기존 방 항목을 복사해 `id`(박물관 안에서 겹치지 않게), `name`, `map`(2-4) 수정. `artworks`는 비워 둬도 됨
- **방 삭제**: 항목을 통째로 지우기. 그 방의 작품은 다른 방으로 먼저 옮기기
- **작품 옮기기**: 작품 항목 `{ ... }`을 잘라서 다른 방의 `artworks` 배열에 붙여넣기 (작품 `id`는 그대로)
- **작품 순서**: 배열 순서 = 벽에 걸리는 순서 (단, 문이 낀 벽은 건너뜀 → 3-3)
- 배열의 **첫 번째 방**이 그 박물관에 들어왔을 때 처음 보이는 방입니다.
- 방 `id`를 바꾸면 예전 주소(`/gallery/moma/room-2`)로 들어온 사람은 첫 번째 방으로 갑니다.
- 한 방의 작품 수 제한은 없습니다. 작품 + 문 + 빈 벽이 5개 이상이면 방이 **긴 복도**가 됩니다 (3-3).

### 2-4. 방 배치(평면도) 바꾸기

각 방의 `map`이 평면도 격자에서의 위치·크기입니다. **칸 단위, 0부터, 위쪽이 북쪽**.

| 값 | 뜻 |
|---|---|
| `x` / `y` | 왼쪽에서 / 위에서 몇 번째 칸에서 시작 |
| `w` / `h` | 가로 / 세로로 몇 칸 차지 |

**예시 3가지**
```
가로 일렬 (국립중앙박물관)        ㄱ자 (MoMA)                      세로 일렬
1: x0 y0 w1 h1                  1: x0 y0 w1 h1                   1: x0 y0 w1 h1
2: x1 y0 w1 h1                  2: x0 y1 w2 h1                   2: x0 y1 w1 h1
3: x2 y0 w1 h1                                                   3: x0 y2 w1 h1
┌───┬───┬───┐                   ┌───┐                            ┌───┐
│ 1 │ 2 │ 3 │                   │ 1 │                            │ 1 │
└───┴───┴───┘                   ├───┴───┐                        ├───┤
                                │   2   │                        │ 2 │
                                └───────┘                        ├───┤
                                                                 │ 3 │
                                                                 └───┘
```

- **문은 자동**으로 생깁니다: 벽을 맞대고 있는 두 방 사이에 양쪽 방 모두 문이 생김 (3-3)
- **떨어진 방**(맞닿지 않은 방)은 문이 없어서 미니맵 클릭으로만 갈 수 있습니다.
- **한 벽에 이웃 방은 하나만**: 한 방향에 맞닿은 방이 둘이면 문은 하나만 생깁니다(먼저 찾은 방). 예) 큰 방 오른쪽에 작은 방 두 개를 위아래로 붙이면 한쪽은 문이 없음
- **방끼리 겹치지 않게** 두세요. 겹치면 미니맵에서 겹쳐 그려지고 문도 안 생깁니다.
- 미니맵 크기는 방 배치에 맞춰 자동으로 정해집니다.

### 2-5. 인테리어 바꾸기 (벽·바닥·천장)

파일: `src/pages/Gallery/interiors/{박물관}Interior.css` (`NationalMuseumKoreaInterior.css`, `MomaInterior.css`, `LouvreInterior.css`)
**CSS 변수 값만** 바꾸면 그 박물관의 모든 방에 적용됩니다.

| 변수 | 뜻 |
|---|---|
| `--room-light-wall-background` | 벽 |
| `--room-light-floor-background` | 바닥 |
| `--room-light-ceil-background` | 천장 |
| `--room-light-body-background` | 벽 뒤 배경 — **벽과 비슷한 색으로** |
| `--room-light-wall-shadow` | 벽 모서리 그림자 |
| `--room-light-text-color` | 벽 그림 아래 제목 글자색 (어두운 벽이면 밝게) |

**① 단색**
```css
.gallery--louvre {
  --room-light-wall-background: #6e2228;
  --room-light-body-background: #6e2228;
}
```
**② 그라데이션** — 위아래 방향(`180deg`)으로 하면 벽이 이어지는 복도형에서도 경계가 안 보임
```css
  --room-light-wall-background: linear-gradient(180deg, #742630 0%, #5c1b23 100%);
```
**③ 이미지(벽지·마루 텍스처)** — 이미지를 `src/assets/images/interiors/{박물관id}/`에 넣고 (폴더 없으면 만들기)
```css
  --room-light-wall-background: #6e2228 url("../../../assets/images/interiors/louvre/damask.png") repeat;
  --room-light-floor-background: url("../../../assets/images/interiors/louvre/parquet.jpg") repeat;
```
- 경로는 interiors 폴더 기준이라 `../../../assets/...` 로 시작합니다.
- 이음새 없이 **반복되는(타일형) 이미지**를 쓰세요. 한 장짜리 큰 그림은 벽마다 잘려 보입니다.
- ⚠️ 벽을 바꾸면 `--room-light-body-background`도 벽과 비슷한 색으로 맞추세요. 화면 배율 등에 따라 벽 일부가 덜 그려질 때 이 색이 보입니다.

### 2-6. 액자·문 색 바꾸기

같은 `interiors/{박물관}Interior.css` 파일에 있습니다.

| 변수 | 뜻 |
|---|---|
| `--frame-color` / `--frame-width` | 액자 테두리 색 / 두께 |
| `--frame-border-image` | 테두리를 그라데이션으로 (안 쓰면 `none`) |
| `--frame-mat-color` / `--frame-mat-size` | 그림과 테두리 사이 여백(매트) 색 / 두께 (없애려면 `0px`) |
| `--frame-shadow` | 액자 그림자 |
| `--door-frame-color` / `--door-leaf-color` / `--door-knob-color` | 문틀 / 문짝 / 손잡이 |
| `--door-passage` | 열린 문 너머로 보이는 옆 방 빛 |
| `--door-sign-background` / `--door-sign-color` | 문 위 안내판 배경 / 글자 |

**액자 조합 예시** (현재 세 박물관 값)
```css
/* 얇은 검정, 매트 없음 (MoMA) */
--frame-color: #111; --frame-width: 4px; --frame-mat-size: 0px; --frame-border-image: none;

/* 나무 + 얇은 매트 (국립중앙박물관) */
--frame-color: #5b4330; --frame-width: 10px; --frame-mat-color: #f8f3ea; --frame-mat-size: 18px;

/* 금색 + 넓은 매트 (루브르) */
--frame-width: 18px; --frame-mat-color: #f5eedf; --frame-mat-size: 26px;
--frame-border-image: linear-gradient(135deg, #a8792a, #f3d98a 30%, #b8892f 55%, #e8c96a 80%, #9a6e22) 1;
```
- `--frame-border-image`를 쓰면 `--frame-color`는 무시됩니다. 끝의 ` 1` 을 빼먹으면 테두리가 안 나옵니다.
- `--door-*` 변수는 **기본 문**(`components/WallDoor`)에만 적용됩니다. 지금 세 박물관은 각자 전용 문을 쓰므로, 문 색·모양은 [2-9](#2-9-문-모양-바꾸기)의 문 파일에서 바꾸세요.

### 2-7. 헤더 바꾸기

파일: `src/pages/Gallery/headers/{박물관}Header.jsx / .css`
- **색·폰트만**: 자기 박물관 `.css`의 빈 칸 채우기
  ```css
  .gallery-header--moma {
    background: #111;
    color: #fff;
  }
  .gallery-header--moma .gallery-header-name {
    font-family: "Helvetica Neue", sans-serif;
  }
  ```
- **구조까지**: `{박물관}Header.jsx`에서 `GalleryHeader`를 쓰지 말고 직접 JSX 작성 (받는 값: `museum`, `room`)
- 헤더 높이는 `GalleryPage.css`의 `--gallery-top-height`(44px, **공용**) — 바꾸면 3D 방 높이가 자동으로 맞춰짐

### 2-8. 새 박물관 추가하기

1. `src/data/museums/새박물관.json` — 기존 파일 복사 후 `id`, 이름, 방, 작품 수정
2. `src/data/museums/index.js` — import 한 줄 + `MUSEUMS` 배열에 추가 (배열 순서 = 갤러리 입장 화면 순서)
3. `src/assets/images/artworks/새박물관id/` 폴더 만들고 이미지 넣기
4. `src/pages/Gallery/interiors/` — `새박물관Interior.css` 만들기(기존 파일 복사 후 `.gallery--새박물관id`로 이름 변경) + `interiors/index.js`에 import 한 줄. 안 하면 room-gallery 기본 흰 벽
5. (선택) 전용 헤더: `headers/`에 파일 만들고 `headers/index.js`의 `HEADERS`에 등록. 안 하면 공통 헤더
6. (선택) 전용 문: `doors/`에 파일 만들고 `doors/index.js`의 `DOORS`에 등록. 안 하면 기본 문(`components/WallDoor`)
7. (선택) 전용 모달: `modals/`에 파일 만들고 `modals/index.js`의 `MODALS`에 등록. 안 하면 기본 모달(`components/common/ArtworkModal`)
8. (선택) 지구본: `src/data/homeMuseums.js`에 **같은 `id`**로 위치(lat/lng) 추가

### 2-9. 문 모양 바꾸기

파일: `src/pages/Gallery/doors/{박물관}Door.jsx / .css`

| 박물관 | 지금 모양 |
|---|---|
| 국립중앙박물관 | 한옥 창호문 — 나무 틀 + 격자 살 + 한지, 마우스를 올리면 미닫이처럼 양옆으로 열림, 나무 현판 |
| MoMA | 문짝 없는 사각 통로 — 틀 없이 벽을 잘라낸 모양, 안쪽 빛, 검정 산세리프 표지 |
| 루브르 | 아치형 양문 — 금색 몰딩, 금 테두리 장식 판, 마우스를 올리면 양쪽으로 열림, 금색 명판 |

- **색·크기만**: 자기 `.css`의 값 수정
- **모양 자체**: 자기 `.jsx`의 구조를 자유롭게 바꾸고 `.css` 작성. 받는 값은 `room` 하나(가는 방, 안내판에 `room.name`)
- ⚠️ **맨 바깥 요소에 `wall-door` 클래스를 꼭 남기세요.** 클릭으로 옆 방에 가는 판정이 이 영역으로 이루어집니다. 지우면 문이 눌리지 않습니다.
  ```jsx
  <button type="button" className="wall-door moma-door" aria-label={`${room.name}(으)로 이동`}>
  ```
- 문 높이·바닥 맞춤은 기본 문 CSS(`.wall-door`)가 해 줍니다. 문 비율은 자기 CSS에서 `aspect-ratio`로 조절 (예: `.louvre-door { aspect-ratio: 1 / 1.6; }`)
- 마우스 올림 효과는 **정면 벽**에서만 보입니다 (옆 벽은 room-gallery 구조상 마우스 인식이 안 됨).
- 기본 문을 감싸서 색만 바꾸는 방법도 됩니다: `<WallDoor room={room} className="my-door" />` + CSS

### 2-10. 작품 상세 모달 모양 바꾸기

파일: `src/pages/Gallery/modals/{박물관}Modal.jsx / .css`

| 박물관 | 방식 | 지금 모양 |
|---|---|---|
| 국립중앙박물관 | 구조까지 직접 | 한지 바탕, 그림 위 / 설명 아래, 제목 옆 붉은 낙관, 명조 글꼴 |
| MoMA | 기본 모달 + CSS | 흰 바탕, 굵은 산세리프, 각진 모서리, 검정 이전/다음 띠 |
| 루브르 | 구조까지 직접 | 와인색 바탕 + 금색 테두리, 왼쪽 금 액자 그림 / 오른쪽 설명, serif 글꼴 |

**방법 1. 모양(CSS)만 바꾸기** — `MomaModal.jsx`처럼 기본 모달에 이름표(className)만 붙임
```jsx
const MomaModal = (props) => <ArtworkModal {...props} className="artwork-modal--moma" />;
```
그리고 `MomaModal.css`에서 `.artwork-modal--moma .artwork-modal-title { ... }` 처럼 기본 모달의 클래스를 덮어씁니다. 기본 모달의 클래스 이름은 `src/components/common/ArtworkModal.jsx`에서 확인.

**방법 2. 구조까지 바꾸기** — `NationalMuseumKoreaModal.jsx`, `LouvreModal.jsx`처럼 직접 JSX 작성
- 받는 값: `artwork`(작품 정보), `onClose`, `onPrev`, `onNext`
- 꼭 넣을 것 (기존 파일 복사해서 시작하면 다 들어 있음):
  - `useEscapeKey(onClose)` — ESC로 닫기 (`src/hooks/useEscapeKey.js`)
  - `createPortal(..., document.body)` — 화면 맨 위에 띄우기
  - 배경 클릭 시 `onClose`, 안쪽 클릭은 `e.stopPropagation()`
  - 닫기 버튼, 이전/다음 버튼
- 설명 문단은 `<Paragraphs text={artwork.description} />` (`components/common/ArtworkModal`에서 import) — 빈 줄 문단 나누기와 "설명 준비 중입니다." 처리를 해 줌
- 이미지는 `getArtworkImage(artwork.image)` (`src/utils/artworkImage.js`)
- 좁은 화면(`@media (max-width: 720px)`)에서 세로로 쌓이게 CSS를 꼭 확인

---

## 3. 참고

### 3-1. 박물관 필드

| 필드 | 설명 | 어디에 보이나 |
|---|---|---|
| `id` | 주소에 쓰이는 이름. **바꾸지 말 것** (`homeMuseums.js`의 id와 같아야 함) | `/gallery/{id}` |
| `name` / `nameEn` | 박물관 이름 | 선택 카드, 전시관 헤더, 지구본 카드 |
| `country` / `city` | 나라 / 도시 | 선택 카드, 지구본 카드 |
| `description` | 박물관 소개 | 지구본 카드 (비면 "소개 준비 중입니다.") |
| `coverImage` | 선택 카드 이미지. 작품 이미지와 같이 `artworks/` 폴더 기준 (예: `"moma/cover.jpg"`) | 선택 카드 |
| `roomStyles` | room-gallery 크기 옵션 (보통 비워 둠, **색은 넣지 말 것** → 2-5) | 전시관 |
| `roomSettings` | room-gallery 동작 옵션 (3-4) | 전시관 |
| `rooms` | 방 목록 (2-3) | 전시관, 미니맵 |

### 3-2. 관련 파일

```
src/
├─ data/
│  ├─ museums/
│  │  ├─ national-museum-korea.json   # [전용] 국립중앙박물관 정보 + 방 + 작품
│  │  ├─ moma.json                    # [전용]
│  │  ├─ louvre.json                  # [전용]
│  │  └─ index.js                     # [공용] MUSEUMS, getMuseum(id), getRoom(museum, roomId)
│  └─ homeMuseums.js                  # [공용] 홈 지구본 마커 위치 (lat/lng)
├─ assets/images/
│  ├─ artworks/
│  │  ├─ placeholder.svg              # 이미지가 없을 때 대신 나오는 "이미지 준비 중" 그림
│  │  └─ {박물관id}/                  # [전용] 작품·표지 이미지
│  └─ interiors/{박물관id}/           # [전용] 벽지·바닥 텍스처 (필요할 때 만들기)
├─ utils/
│  ├─ artworkImage.js                 # [공용] 이미지 파일명 → 실제 주소
│  └─ roomLayout.js                   # [공용] 방 배치 → 문 방향, 작품·문을 벽에 배치
├─ hooks/useEscapeKey.js              # [공용] ESC로 닫기 (모달용)
├─ components/common/ArtworkModal.jsx / .css   # [공용] 기본 작품 상세 모달 + Paragraphs(문단 나누기)
└─ pages/
   ├─ Home/components/
   │  ├─ GlobeView.jsx                # [공용] 지구본
   │  └─ MuseumCard.jsx / .css        # [공용] 지구본 위 박물관 카드
   └─ Gallery/
      ├─ GalleryPage.jsx / .css       # [공용] 목록/전시관 분기, 방 이동 연출 (.css 맨 아래 박물관별 칸은 전용)
      ├─ components/                  # [공용] MuseumList, GalleryRoom, WallDoor(기본 문), GalleryMinimap
      ├─ interiors/{박물관}Interior.css  # [전용] 벽·바닥·천장·액자 색 (index.js 는 공용)
      ├─ headers/{박물관}Header.jsx / .css  # [전용] 전시관 헤더 (GalleryHeader, index.js 는 공용)
      ├─ doors/{박물관}Door.jsx / .css      # [전용] 문 모양 (index.js 는 공용)
      └─ modals/{박물관}Modal.jsx / .css    # [전용] 작품 상세 모달 모양 (index.js 는 공용)
```

### 3-3. 작품과 문이 벽에 걸리는 규칙

room-gallery는 받은 순서대로 벽을 채웁니다.
- **벽 4개 이하** → 방 1칸: 1번 = 처음 보는 정면(북), 2번 = 오른쪽(동), 3번 = 뒤(남), 4번 = 왼쪽(서)
- **벽 5개 이상** → 오른쪽(동쪽)으로 칸을 이어 붙인 긴 복도: 앞쪽 긴 벽(북) 여러 개 → 오른쪽 끝 벽(동) → 뒤쪽 긴 벽(남) 여러 개 → 왼쪽 끝 벽(서)

배치 순서:
1. 이웃 방마다 **문 전용 벽**이 하나씩 생기고, 미니맵과 같은 방향의 벽 자리에 들어갑니다.
2. 남은 벽에 **작품이 `artworks` 배열 순서대로** 들어갑니다.
3. 그 방향 벽이 생기도록 필요하면 **빈 벽**이 추가됩니다.

그래서 작품은 문이 차지한 벽을 건너뛰어 걸리고, 아래 번호 수가 작품 수보다 많을 수 있습니다. **작품을 특정 벽(예: 반드시 북쪽 벽)에 고정하는 기능은 없습니다.** 원하는 벽에 걸리게 하려면 배열 순서를 바꿔 보세요.

**지금 실제 배치** (번호 = 화면 아래 번호 버튼)

| 박물관 / 방 | 벽 배치 |
|---|---|
| 국립중앙 1전시실 | 1 북: 작품01 · 2 동: 문→2전시실 · 3 남: 작품02 · 4 서: 작품03 |
| 국립중앙 2전시실 | 1 북: 작품04 · 2 북: 작품05 · 3 동: 문→3전시실 · 4 남: 작품06 · 5 남: 빈 벽 · 6 서: 문→1전시실 |
| 국립중앙 3전시실 | 1 북: 작품07 · 2 동: 작품08 · 3 남: 작품09 · 4 서: 문→2전시실 |
| MoMA 1전시실 | 1 북: 작품01 · 2 북: 작품02 · 3 동: 작품03 · 4 남: 문→2전시실 · 5 남: 작품04 |
| MoMA 2전시실 | 1 북: 문→1전시실 · 2 북: 작품05 · 3 동: 작품06 · 4 남: 작품07 · 5 남: 작품08 · 6 서: 작품09 |
| 루브르 1전시실 | 1~4 북: 작품01~04 · 5 동: 작품05 · 6~9 남: 작품06~09 |

- 국립중앙 2전시실은 작품 3점이지만 문 2개(동·서)가 들어갈 서쪽 벽이 필요해서 6칸 복도가 됐습니다.
- 계산 코드: `src/utils/roomLayout.js` (`getDoors`, `buildWalls`)

### 3-4. room-gallery 동작 옵션 (`roomSettings`) — 바꾸면 안 되는 것

`roomSettings`는 [room-gallery README](../node_modules/room-gallery/README.md)의 *RoomGallery Settings* 옵션을 받습니다. 기본값은 `components/GalleryRoom.jsx`의 `DEFAULT_ROOM_SETTINGS`.

| 옵션 | 바꾸면 |
|---|---|
| `darkMode: "dark"` 또는 `"auto"` | ❌ room-gallery가 어두운 모드용 변수를 써서 **인테리어 CSS(2-5, 2-6)가 적용되지 않음** |
| `paginations: "disabled"` | ❌ 아래 번호 버튼이 없어져 **문으로 들어갔을 때 걸어온 방향으로 돌아서는 기능이 멈춤** (번호 버튼을 눌러 회전시키는 방식) |
| `allOnOneWall: true` | ❌ 모든 작품이 한쪽 벽에만 걸려 **문 방향이 미니맵과 안 맞음** |
| `arrowNav`, `paginations: "title"` 등 표시 방식 | ⭕ 바꿔도 됨 |
| `keypressToNav`, `swipeToNav` 끄기 | ⭕ 가능 (미니맵 방향 표시는 클릭·방향키 기준이라 스와이프만 쓰면 늦게 바뀔 수 있음) |

### 3-5. 미니맵 디자인 (공용)

`src/pages/Gallery/components/GalleryMinimap.css` — 세 박물관 공용
- 강조색: `.gallery-minimap`의 `--minimap-accent`
- 방: `.gallery-minimap-room rect`, 현재 방: `.is-current`
- 문(통로): `.gallery-minimap-door`
- 현재 위치 점: `.gallery-minimap-me`, 바라보는 방향 부채꼴: `.gallery-minimap-view path`

---

## 4. 갤러리별 설정 · 공유 설정

> **갤러리별** = 그 박물관 파일만 고치면 그 박물관에만 적용, 다른 담당자와 충돌 없음
> **공유** = 세 박물관(+ 앞으로 추가될 박물관)이 함께 쓰는 파일·값. 고치면 모두 바뀌므로 **팀에 먼저 알리기**

### 4-1. 한눈에 보기

| 항목 | 갤러리마다 다르게? | 어디서 바꾸나 |
|---|---|---|
| 박물관 이름·나라·도시·소개·표지 이미지 | ⭕ | `data/museums/{id}.json` (3-1) |
| 방 개수·이름·배치(평면도) | ⭕ | `data/museums/{id}.json` 의 `rooms`, `map` (2-3, 2-4) |
| 작품·작품 정보·설명·도슨트 | ⭕ | `data/museums/{id}.json` 의 `artworks` (2-1, 2-2) |
| 작품 이미지 | ⭕ | `assets/images/artworks/{id}/` (2-1) |
| 벽·바닥·천장·벽 뒤 배경·벽 그림자 | ⭕ | `interiors/{박물관}Interior.css` (2-5) |
| 액자 (테두리·매트·그림자) | ⭕ 박물관 단위 | `interiors/{박물관}Interior.css` (2-6) |
| 벽 그림 아래 제목 글자색 | ⭕ | `interiors/…` 의 `--room-light-text-color` |
| 문 모양·색·마우스 올림 효과 | ⭕ 박물관 단위 | `doors/{박물관}Door.jsx / .css` (2-9) |
| 작품 상세 모달 모양 | ⭕ | `modals/{박물관}Modal.jsx / .css` (2-10) |
| 전시관 헤더 모양 | ⭕ | `headers/{박물관}Header.jsx / .css` (2-7) |
| 전시관 화면 전체(배경 등) | ⭕ | `GalleryPage.css` 맨 아래 `.gallery--{id}` 칸 |
| room-gallery 화살표·번호 버튼 색 | ⭕ | `interiors/…` 에 `--room-light-button-background`, `--room-light-button-color`, `--room-light-button-current-background`, `--room-light-button-current-color`, `--room-light-icon-color` 추가 |
| room-gallery 표시 방식 (화살표 모양, 번호→제목 등) | ⭕ 일부만 | `data/museums/{id}.json` 의 `roomSettings` — 바꾸면 안 되는 옵션 있음 (3-4) |
| 미니맵 강조색 | △ 색만 | `interiors/…` 에 `.gallery--{id} .gallery-minimap { --minimap-accent: … }` |
| 미니맵 패널 색 | △ 색만 | `interiors/…` 에 `.gallery--{id} .gallery-minimap { background: … }` |
| 방 이동 때 어두워지는 색 | △ 색만 | `interiors/…` 에 `.gallery--{id} .gallery-stage::after { background: … }` |
| 미니맵 모양·크기·위치, 문 표시 방식 | ❌ 공유 | `components/GalleryMinimap.*` |
| 방 이동 연출 시간·동작 | ❌ 공유 | `GalleryPage.jsx` `FADE_MS` + `GalleryPage.css` |
| 문이 생기는 규칙, 작품·문이 걸리는 벽 순서 | ❌ 공유 | `utils/roomLayout.js` (3-3) |
| 작품·문 클릭 판정, 들어온 방향 바라보기 | ❌ 공유 | `components/GalleryRoom.jsx` |
| 3D 방 크기 (가로·세로) | ❌ 공유 | `components/GalleryRoom.jsx` `DEFAULT_ROOM_STYLES` (JSON `roomStyles`로 바꾸면 다른 박물관에도 남음 → 쓰지 말 것) |
| 전시관 헤더 높이 (44px) | ❌ 공유 | `GalleryPage.css` `--gallery-top-height` |
| 박물관 선택 화면(`/gallery`) 카드 모양 | ❌ 공유 | `components/MuseumList.*` |
| 홈 지구본 카드 모양 | ❌ 공유 | `pages/Home/components/MuseumCard.*` |
| 지구본 마커 위치 | ⭕ 값만 | `data/homeMuseums.js` — 세 박물관이 **한 파일**에 있음, 자기 줄만 고치기 |
| 이미지 형식 규칙, 이미지 없을 때 그림 | ❌ 공유 | `utils/artworkImage.js`, `artworks/placeholder.svg` |

- △ 항목은 공유 컴포넌트의 **색만** 자기 interiors 파일에서 `.gallery--{id}` 를 붙여 덮어쓰는 방법입니다. 공유 파일은 건드리지 않으므로 충돌하지 않습니다.
  ```css
  /* LouvreInterior.css 맨 아래에 추가 */
  .gallery--louvre .gallery-minimap {
    --minimap-accent: #e8c96a;
    background: rgba(46, 14, 19, 0.8);
  }
  .gallery--louvre .gallery-stage::after {
    background: #1a0508; /* 방 이동 때 검정 대신 짙은 와인색으로 */
  }
  ```
- 작품 모달은 화면 맨 위(body)에 따로 그려져서 `.gallery--{id}` 안에 있지 않습니다. 그래서 interiors CSS로는 바뀌지 않고, 모달은 `modals/` 파일에서만 바꿉니다.

### 4-2. 갤러리 전용 파일 (박물관별)

| 종류 | 국립중앙박물관 | MoMA | 루브르 |
|---|---|---|---|
| 데이터 | `src/data/museums/national-museum-korea.json` | `…/moma.json` | `…/louvre.json` |
| 작품 이미지 | `src/assets/images/artworks/national-museum-korea/` | `…/artworks/moma/` | `…/artworks/louvre/` |
| 인테리어 | `src/pages/Gallery/interiors/NationalMuseumKoreaInterior.css` | `…/MomaInterior.css` | `…/LouvreInterior.css` |
| 헤더 | `src/pages/Gallery/headers/NationalMuseumKoreaHeader.jsx / .css` | `…/MomaHeader.jsx / .css` | `…/LouvreHeader.jsx / .css` |
| 문 | `src/pages/Gallery/doors/NationalMuseumKoreaDoor.jsx / .css` | `…/MomaDoor.jsx / .css` | `…/LouvreDoor.jsx / .css` |
| 작품 모달 | `src/pages/Gallery/modals/NationalMuseumKoreaModal.jsx / .css` | `…/MomaModal.jsx / .css` | `…/LouvreModal.jsx / .css` |
| 전시관 전체 CSS 칸 | `GalleryPage.css` 의 `.gallery--national-museum-korea` | `.gallery--moma` | `.gallery--louvre` |
| 텍스처 이미지 (필요할 때 만들기) | `src/assets/images/interiors/national-museum-korea/` | `…/interiors/moma/` | `…/interiors/louvre/` |
| 지구본 위치 (공유 파일 안의 자기 줄) | `src/data/homeMuseums.js` 의 `national-museum-korea` 항목 | `moma` 항목 | `louvre` 항목 |

- `GalleryPage.css`, `homeMuseums.js` 는 파일 자체는 공유입니다. **자기 칸·자기 줄만** 고치세요.

### 4-3. 공유 파일 (고치면 모든 박물관이 바뀜 → 팀에 알리기)

**데이터 · 등록부**
| 파일 | 하는 일 | 고칠 때 주의 |
|---|---|---|
| `src/data/museums/index.js` | 박물관 목록과 순서(`MUSEUMS`), `getMuseum`, `getRoom` | 순서 = 갤러리 입장 화면 순서 |
| `src/pages/Gallery/interiors/index.js` | 인테리어 CSS 불러오기 | 새 박물관 추가 때만 한 줄 추가 |
| `src/pages/Gallery/headers/index.js` | 박물관 id → 헤더 (`HEADERS`) | 〃 |
| `src/pages/Gallery/doors/index.js` | 박물관 id → 문 (`DOORS`) | 〃 |
| `src/pages/Gallery/modals/index.js` | 박물관 id → 모달 (`MODALS`) | 〃 |

**전시관 동작**
| 파일 | 하는 일 | 고칠 때 주의 |
|---|---|---|
| `src/pages/Gallery/GalleryPage.jsx` | 목록/전시관 분기, 방 이동(어두워짐), 바라보는 방향 전달 | `FADE_MS`(450ms)는 `GalleryPage.css`의 `0.45s`와 같이 바꾸기 |
| `src/pages/Gallery/components/GalleryRoom.jsx` | room-gallery 연결, 작품·문 클릭 판정, 들어온 방향 바라보기, 기본 설정(`DEFAULT_ROOM_STYLES`, `DEFAULT_ROOM_SETTINGS`) | 문 클릭은 `.wall-door` 클래스로 찾음 (2-9) |
| `src/utils/roomLayout.js` | 문이 생기는 규칙, 작품·문·빈 벽 순서 | 바꾸면 모든 방의 벽 배치가 달라짐 (3-3 표) |
| `src/utils/artworkImage.js` | 이미지 파일명 → 주소, 없으면 placeholder | 확장자 목록(소문자 `png/jpg/jpeg/webp`) |
| `src/hooks/useEscapeKey.js` | ESC로 닫기 | 세 모달이 모두 씀 |

**공통 모양 (박물관 파일들의 바탕)**
| 파일 | 하는 일 | 고칠 때 주의 |
|---|---|---|
| `src/pages/Gallery/GalleryPage.css` | `--gallery-top-height`(44px), 방 이동 연출 | 박물관별 칸(맨 아래)은 전용 |
| `src/pages/Gallery/components/GalleryRoom.css` | room-gallery 겹침 순서, 벽 이음새 대응, **액자 규칙**(값은 interiors 변수) | 액자 변수 이름을 바꾸면 세 interiors 파일도 고쳐야 함 |
| `src/pages/Gallery/components/WallDoor.jsx / .css` | 기본 문 + **모든 문의 `.wall-door` 공통 규칙**(높이·바닥 맞춤) | `.wall-door` 규칙을 바꾸면 세 박물관 문 위치가 모두 바뀜 |
| `src/components/common/ArtworkModal.jsx / .css` | 기본 모달 + `Paragraphs`(문단 나누기) | **MoMA 모달의 바탕** — 클래스 이름을 바꾸면 `MomaModal.css`도 고쳐야 함. `Paragraphs`는 세 모달이 씀 |
| `src/pages/Gallery/headers/GalleryHeader.jsx / .css` | 기본 헤더 | **세 박물관 헤더의 바탕** — 지금 세 헤더 모두 이것을 감싸서 씀 |
| `src/pages/Gallery/components/GalleryMinimap.jsx / .css` | 미니맵 | 색은 박물관별 덮어쓰기 가능 (4-1 △) |
| `src/pages/Gallery/components/MuseumList.jsx / .css` | `/gallery` 박물관 선택 카드 | |

**사이트 공통 (갤러리 밖)**
| 파일 | 하는 일 | 고칠 때 주의 |
|---|---|---|
| `src/components/layout/Header.css` | 사이트 맨 위 헤더, `--header-height`(80px) | 바꾸면 `GlobeView.jsx`의 `HEADER_HEIGHT`(80)도 같이. 3D 방 높이는 자동으로 맞춰짐 |
| `src/pages/Home/components/GlobeView.jsx`, `MuseumCard.jsx / .css` | 홈 지구본, 박물관 카드 | 홈 담당자 파일 |
| `src/data/homeMuseums.js` | 지구본 마커 위치 | 자기 박물관 줄만, `id`는 박물관 JSON과 같게 |

**공유 설정 값 모음**
| 설정 | 지금 값 | 위치 |
|---|---|---|
| 사이트 헤더 높이 | `80px` | `Header.css` `--header-height` (+ `GlobeView.jsx` `HEADER_HEIGHT`) |
| 전시관 헤더 높이 | `44px` | `GalleryPage.css` `--gallery-top-height` |
| 3D 방 크기 | 가로 `100vw`, 세로 `화면 높이 − 80px − 44px` | `GalleryRoom.jsx` `DEFAULT_ROOM_STYLES` |
| room-gallery 기본 동작 | `arrowNav: "icon"`, `paginations: "number"`, `darkMode: "light"` | `GalleryRoom.jsx` `DEFAULT_ROOM_SETTINGS` (박물관 JSON `roomSettings`가 덮어씀) |
| 방 이동 어두워지는 시간 | `450ms` | `GalleryPage.jsx` `FADE_MS` + `GalleryPage.css` `0.45s` |
| 미니맵 칸 크기 | `56px` | `GalleryMinimap.jsx` `CELL` |
| 미니맵 강조색 기본값 | `#e2bf74` | `GalleryMinimap.css` `--minimap-accent` |
| 이미지 확장자 | `png`, `jpg`, `jpeg`, `webp` (소문자만) | `artworkImage.js` |
| 모달 좁은 화면 기준 | `720px` | 각 모달 CSS `@media (max-width: 720px)` (박물관별로 따로 있음) |

### 4-4. 지금 구조로 할 수 없는 것
- **방마다 다른 인테리어·문 모양** — 인테리어·문은 박물관 단위(`.gallery--{id}`, `doors/`)로만 적용
- **작품마다 다른 액자** — 액자도 박물관 단위
- **작품을 특정 벽에 고정** — 배열 순서와 문 위치로 정해짐 (3-3)
- **한 벽에 작품 여러 점** — 벽 하나에 작품 하나
- **박물관마다 다른 미니맵 모양** — 색만 가능 (4-1 △)
- **박물관마다 다른 3D 방 크기·헤더 높이** — 공유 설정

필요하면 팀에 먼저 이야기해 주세요. 공유 코드를 바꿔야 합니다.

---

## 5. 문제 해결

| 증상 | 원인 | 해결 |
|---|---|---|
| 갤러리 화면이 하얗게 나오거나 개발 서버에 빨간 에러 | JSON 문법 오류 (쉼표 빠짐/남음, 따옴표 짝 안 맞음, 글 안의 `"`) | 에러 메시지의 줄 번호 확인. 마지막 항목 뒤 쉼표, 글 안 `"` → `\"` |
| 작품이 "이미지 준비 중"으로 나옴 | `image` 경로 틀림, 박물관 폴더 이름 빠짐, 확장자가 대문자(`.JPG`) | `"louvre/mona-lisa.jpg"` 처럼 폴더부터, 파일 확장자를 소문자로 바꾸기 |
| 문이 안 생김 | 두 방 `map`이 맞닿아 있지 않음, 겹침, 한 방향에 이웃이 둘 | 2-4 예시처럼 칸이 딱 붙게 |
| 작품이 생각한 벽에 안 걸림 | 문이 그 벽을 차지 | 3-3 표 확인, 배열 순서 조정 |
| 인테리어 색이 안 바뀜 | 선택자 이름이 `.gallery--{박물관id}`와 다름, `interiors/index.js`에 import 안 함, `roomSettings.darkMode` 변경 | 선택자·import 확인, darkMode는 기본값 유지 |
| 금색 테두리가 안 나옴 | `--frame-border-image` 끝의 ` 1` 빠짐 | `linear-gradient(...) 1` |
| 벽 사이에 무늬 없는 판이 보임 | 화면 배율 등으로 벽 일부가 덜 그려짐 | `--room-light-body-background`를 벽색과 맞추기. 그래도 보이면 화면 배율, 방, 번호와 함께 공유 |
| 옆 벽의 작품·문이 클릭 안 됨 | 정면 벽만 클릭됨 | 화살표로 돌아선 뒤 클릭 |
| 정면 문을 눌러도 이동이 안 됨 | 문 파일 맨 바깥에서 `wall-door` 클래스가 빠짐 | `className="wall-door ..."` 다시 넣기 (2-9) |
| 모달 ESC·배경 클릭으로 안 닫힘 | 직접 만든 모달에 `useEscapeKey`·배경 `onClick` 빠짐 | 2-10 "꼭 넣을 것" 확인 |
| 모달 열린 채 방향키를 누르면 뒤 방이 움직임 | room-gallery가 키 입력을 직접 받음 | 모달 안에서는 이전/다음 버튼 사용 |
| 지구본 카드가 안 뜸 | `homeMuseums.js` id와 박물관 JSON id가 다름 | 두 id를 똑같이 |

---

## 6. 개발자 메모 (공용 코드 수정 시)

- `room-gallery`는 `import { RoomGallery } from "room-gallery"`로 가져와야 합니다 (`import RoomGallery from` 형태는 Vite에서 에러).
- room-gallery 기본 `z-index`가 1000이라 미니맵·헤더 메뉴를 덮어서 `GalleryRoom.css`에서 1로 낮춤.
- room-gallery의 왼쪽·오른쪽 벽은 거의 90도로 돌아가 있어 브라우저가 그 위의 클릭을 못 잡습니다. 그래서 `GalleryRoom.jsx`가 **누른 위치가 정면 벽의 그림/문 영역 안인지**로 판단합니다. 같은 이유로 옆 벽 문은 마우스를 올려도 문이 더 열리는 효과가 안 나옵니다.
- `roomStyles`로 넘긴 값은 room-gallery가 페이지 전체(`:root`)에 저장해서 다른 박물관으로 가도 남습니다. 색은 interiors CSS에서만 다루세요.
- 벽 이음새 대응: `GalleryRoom.css`에서 room-gallery의 `will-change`를 끔 + 벽 뒤 배경을 벽색과 맞춤.
- room-gallery 공개 베타는 개발·테스트용으로만 무료입니다 (README "Licensing Update"). 수업 프로젝트 용도로 사용.
