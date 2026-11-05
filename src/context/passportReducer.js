/* passportReducer.js: 여권 상태(발급 정보, 방문 기록)를 바꾸는 규칙 - useReducer에서 사용 */

export const initialState = {
  passport: null, // 발급 전에는 null, 발급 후 { name, photo, number, issuedAt }
  visits: [],     // 방문한 박물관 기록 [{ museumId, date }]
};

export const passportReducer = (state, action) => {
  switch (action.type) {
    /* 여권 발급: 이름, 사진, 여권 번호를 저장 */
    case "ISSUE_PASSPORT":
      return {
        ...state,
        passport: {
          name: action.name,
          photo: action.photo,
          number: action.number,
          issuedAt: new Date().toISOString(),
        },
      };

    /* 방문 기록 추가: 같은 박물관은 한 번만 (갤러리를 다 돌아봤을 때 호출) */
    case "ADD_VISIT":
      if (state.visits.some((v) => v.museumId === action.museumId)) return state;
      return {
        ...state,
        visits: [
          ...state.visits,
          { museumId: action.museumId, date: new Date().toISOString() },
        ],
      };

    /* 여권 지우기: 처음 상태로 되돌림 */
    case "RESET_PASSPORT":
      return initialState;

    default:
      return state;
  }
};
