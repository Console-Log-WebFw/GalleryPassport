# 🖼️ 갤러리 개발 가이드 (팀원용)

갤러리 틀(라우팅, room-gallery 연결, 작품 상세 모달)은 만들어져 있습니다.
**JSON 채우기 · 이미지 넣기 · CSS 디자인**만 하면 화면에 바로 반영됩니다.

---

## 1. 화면 구조

| 주소 | 화면 |
|---|---|
| `/gallery` | 박물관 선택 (카드 3개) |
| `/gallery/national-museum-korea` | 국립중앙박물관 전시관 |
| `/gallery/moma` | MoMA 전시관 |
| `/gallery/louvre` | 루브르 전시관 |

- 전시관: room-gallery 3D 방에 작품 9개가 벽에 걸림 (화살표 버튼 / 방향키 / 스와이프 / 아래 번호로 이동)
- 오른쪽 위 **작품 설명 보기** → 지금 보고 있는 작품의 상세 모달 (이전/다음, ESC·배경 클릭으로 닫기)

## 2. 관련 파일

```
src/
├─ data/museums/
│  ├─ national-museum-korea.json   # 국립중앙박물관 정보 + 작품 9개
│  ├─ moma.json                    # MoMA
│  ├─ louvre.json                  # 루브르
│  └─ index.js                     # 위 3개를 모아 MUSEUMS, getMuseum(id) 로 내보냄
├─ assets/images/artworks/
│  ├─ placeholder.svg              # 이미지가 없을 때 대신 나오는 회색 액자
│  ├─ national-museum-korea/       # 각 박물관 작품 이미지
│  ├─ moma/
│  └─ louvre/
├─ utils/artworkImage.js           # 이미지 파일명 → 실제 주소 변환
├─ components/common/ArtworkModal.jsx / .css   # 작품 상세 모달
└─ pages/Gallery/GalleryPage.jsx / .css        # 박물관 선택 + 전시관
```

> **자기 박물관 JSON 파일만 고치면** 다른 사람과 충돌이 나지 않습니다.

## 3. 작품 데이터 채우기 (JSON)

`src/data/museums/{박물관}.json`

```json
{
  "id": "louvre",
  "name": "루브르 박물관",
  "nameEn": "Musée du Louvre",
  "country": "France",
  "city": "Paris",
  "description": "",
  "coverImage": "louvre/cover.jpg",
  "roomStyles": {},
  "roomSettings": {},
  "artworks": [
    {
      "id": "louvre-01",
      "title": "모나리자",
      "titleEn": "Mona Lisa",
      "artist": "레오나르도 다빈치",
      "year": "1503–1519",
      "medium": "패널에 유채",
      "description": "작품 설명",
      "docent": "도슨트 설명",
      "image": "louvre/mona-lisa.jpg",
      "credit": "출처: Wikimedia Commons (Public Domain)"
    }
  ]
}
```

### 박물관 필드

| 필드 | 설명 | 어디에 보이나 |
|---|---|---|
| `id` | 주소에 쓰이는 이름. **바꾸지 말 것** | `/gallery/{id}` |
| `name` / `nameEn` | 박물관 이름 | 선택 카드, 전시관 제목 |
| `country` / `city` | 나라 / 도시 | 선택 카드 |
| `description` | 박물관 소개 | (아직 화면에 없음 — 필요하면 추가) |
| `coverImage` | 선택 카드 이미지 파일명 | 선택 카드 |
| `roomStyles` / `roomSettings` | 3D 방 디자인 (아래 5번) | 전시관 |
| `artworks` | 작품 목록 (9개) | 전시관, 모달 |

### 작품 필드

| 필드 | 설명 | 어디에 보이나 |
|---|---|---|
| `id` | `{박물관id}-01` 형식. 겹치지 않게 | (내부용) |
| `title` | 작품 제목 | 벽 아래 + 모달 |
| `titleEn` | 영문 제목 | 모달 |
| `artist` / `year` | 작가 / 연도 | 벽 아래 + 모달 |
| `medium` | 재료·기법 | 모달 |
| `description` | 작품 설명 | 모달 |
| `docent` | 도슨트 설명 | 모달 "도슨트" 칸 |
| `image` | 이미지 파일명 (아래 4번) | 벽 + 모달 |
| `credit` | 출처·저작권 표기 | 모달 맨 아래 |

- 비어 있는(`""`) 필드는 모달에서 자동으로 숨겨집니다.
- 작품 순서 = 배열 순서 = 벽에 걸리는 순서.
- JSON은 마지막 항목 뒤에 쉼표(`,`)가 있으면 에러가 납니다.

## 4. 작품 이미지 넣기

1. 이미지를 `src/assets/images/artworks/{박물관id}/` 에 넣기
   예) `src/assets/images/artworks/louvre/mona-lisa.jpg`
2. JSON의 `image`에 **박물관 폴더부터 파일명까지** 적기
   예) `"image": "louvre/mona-lisa.jpg"`

- 지원 형식: `png`, `jpg`, `jpeg`, `webp`
- 파일명이 틀리거나 비어 있으면 `placeholder.svg`(이미지 준비 중)가 대신 나옵니다.
- 파일명은 **영문 소문자 + 하이픈** 권장 (한글·공백은 피하기)
- 용량이 큰 원본은 1~2MB 이하로 줄여서 넣기
- 저작권: 공개 도메인 작품 우선, 그 외는 `credit`에 출처 + 학습용 표기 (라이브러리 가이드 5번 참고)

## 5. 디자인 바꾸기

### 5-1. 3D 방 (room-gallery) — JSON에서

`roomStyles`: 벽·바닥·글자 등 색/크기 ([room-gallery README](../node_modules/room-gallery/README.md)의 *StylesVariables* 목록)

```json
"roomStyles": {
  "lightWallBackground": "#f3ede4",
  "lightFloorBackground": "#6b4f3a",
  "lightTextColor": "#333"
}
```

`roomSettings`: 동작 옵션 (README의 *RoomGallery Settings* 목록)

```json
"roomSettings": {
  "darkMode": "dark",
  "paginations": "title"
}
```

- 기본값은 `GalleryPage.jsx`의 `DEFAULT_ROOM_STYLES` / `DEFAULT_ROOM_SETTINGS`에 있고, JSON 값이 덮어씁니다.
- ⚠️ `width` / `height`는 `%` 단위를 쓸 수 없습니다 (`px`, `vw`, `dvh` 등 사용).
- ⚠️ room-gallery는 스타일을 페이지 전체(`:root`)에 저장합니다. 한 박물관에서만 색을 바꾸면 다른 박물관으로 이동해도 그 색이 남을 수 있으니, **바꾸는 값은 세 박물관 모두에 적어 주세요.**

### 5-2. 전시관 화면 — CSS에서

`src/pages/Gallery/GalleryPage.css` 맨 아래에 박물관별 칸이 비어 있습니다.

```css
.gallery--louvre {
  background: #1d1a16;
}
.gallery--louvre .gallery-title {
  font-family: serif;
}
```

### 5-3. 작품 상세 모달

`src/components/common/ArtworkModal.css` — 지금은 최소한의 스타일만 있습니다.

## 6. 박물관 추가하기

1. `src/data/museums/새박물관.json` 만들기 (기존 파일 복사 후 `id` 변경)
2. `src/data/museums/index.js`에 import 한 줄 + `MUSEUMS` 배열에 추가
3. `src/assets/images/artworks/새박물관/` 폴더 만들기

## 7. 알아둘 점

- 모달이 열려 있어도 방향키(←/→)는 뒤의 3D 방을 움직입니다 (room-gallery가 키 입력을 직접 받음). 모달 안에서는 버튼으로 이동하세요.
- `room-gallery`는 `import { RoomGallery } from "room-gallery"`로 가져와야 합니다 (`import RoomGallery from` 형태는 Vite에서 에러).
- room-gallery 공개 베타는 개발·테스트용으로만 무료입니다 (README "Licensing Update"). 수업 프로젝트 용도로 사용.
