/* artworkImage.js: JSON에 적은 작품 이미지 파일명을 실제 이미지 주소로 바꿔주는 함수 */

import placeholder from "../assets/images/artworks/placeholder.svg";

/* artworks 폴더 안의 이미지를 전부 미리 찾아둠 - 키 예시: "../assets/images/artworks/louvre/mona-lisa.jpg" */
const images = import.meta.glob(
  "../assets/images/artworks/**/*.{png,jpg,jpeg,webp}",
  { eager: true, import: "default" },
);

/* "louvre/mona-lisa.jpg" → 이미지 주소 (비어 있거나 파일이 없으면 회색 액자 이미지) */
export const getArtworkImage = (fileName) =>
  (fileName && images[`../assets/images/artworks/${fileName}`]) || placeholder;
