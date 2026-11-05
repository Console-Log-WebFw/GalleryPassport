/* storage.js: 여권 기록을 localStorage에 저장하고 불러오기 (새로고침해도 기록 유지) */

const KEY = "gallery-passport";

/* 저장된 기록 불러오기: 없거나 깨져 있으면 기본값을 돌려줌 */
export const loadState = (fallback) => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    return saved ? { ...fallback, ...saved } : fallback;
  } catch {
    return fallback;
  }
};

/* 기록 저장하기: 저장 공간이 없거나 막혀 있어도 화면은 계속 동작하게 함 */
export const saveState = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* 저장 실패는 무시 */
  }
};
