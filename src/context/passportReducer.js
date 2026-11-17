/* passportReducer.js: 여권 상태(발급 정보, 방문 기록)를 바꾸는 규칙 - useReducer에서 사용 */

export const initialState = {
  passport: null, // 발급 전에는 null, 발급 후 { name, photo, number, issuedAt }
  visits: [],     // 도장이 찍힌 박물관 기록 [{ museumId, date }]
  viewed: {},     // 박물관별로 본 작품 id 목록 { louvre: ["louvre-01", ...] }
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

    /* 작품 관람 기록: 여권을 발급받은 뒤에 본 작품만 기록하고,
       그 박물관의 작품(total개)을 모두 봤으면 도장(방문 기록)을 한 번 찍음 */
    case "VIEW_ARTWORK": {
      if (!state.passport) return state; // 여권 발급 전에는 기록하지 않음
      const seen = state.viewed[action.museumId] || [];
      if (seen.includes(action.artworkId)) return state; // 이미 본 작품
      const nextSeen = [...seen, action.artworkId];
      const complete = action.total > 0 && nextSeen.length >= action.total;
      const stamped = state.visits.some((v) => v.museumId === action.museumId);
      return {
        ...state,
        viewed: { ...state.viewed, [action.museumId]: nextSeen },
        visits:
          complete && !stamped
            ? [...state.visits, { museumId: action.museumId, date: new Date().toISOString() }]
            : state.visits,
      };
    }

    /* 여권 지우기: 처음 상태로 되돌림 */
    case "RESET_PASSPORT":
      return initialState;

    default:
      return state;
  }
};
