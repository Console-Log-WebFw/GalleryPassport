/* passport.js: 여권 발급에 쓰는 도구 모음 - 여권 번호, 날짜 표시, 사진 최대 크기 */

/* 여권 번호 만들기: GP + 발급 연도 + 3자리 숫자 (예: GP2026042) */
export const createPassportNumber = () => {
  const year = new Date().getFullYear();
  const serial = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
  return `GP${year}${serial}`;
};

/* 날짜를 2026.10.30 형태로 바꾸기 */
export const formatDate = (iso) => {
  const d = new Date(iso);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}.${mm}.${dd}`;
};

/* 사진 파일의 최대 크기: 500KB (localStorage 저장 공간이 작아서 제한함) */
export const MAX_PHOTO_SIZE = 500 * 1024;
