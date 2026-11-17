/* PassportContext.jsx: 여권 상태를 모든 페이지에서 꺼내 쓸 수 있게 감싸주는 Context */

import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { passportReducer, initialState } from "./passportReducer";
import { loadState, saveState } from "../utils/storage";

const PassportContext = createContext(null);

/* Provider: 앱 전체를 감싸서 state와 dispatch를 내려줌 */
export const PassportProvider = ({ children }) => {
  const [state, dispatch] = useReducer(passportReducer, initialState, loadState);

  /* 상태가 바뀔 때마다 localStorage에 저장 */
  useEffect(() => {
    saveState(state);
  }, [state]);

  /* 갤러리에서 작품을 열 때 부르는 함수: viewArtwork(박물관, 작품 id)
     박물관의 전체 작품 수를 세어서 리듀서에 넘김 (다 보면 도장이 찍힘) */
  const viewArtwork = useCallback((museum, artworkId) => {
    const total = museum.rooms.reduce((sum, room) => sum + room.artworks.length, 0);
    dispatch({ type: "VIEW_ARTWORK", museumId: museum.id, artworkId, total });
  }, []);

  return (
    <PassportContext.Provider value={{ state, dispatch, viewArtwork }}>
      {children}
    </PassportContext.Provider>
  );
};

/* 어느 컴포넌트에서든 const { state, dispatch } = usePassport() 로 사용 */
export const usePassport = () => useContext(PassportContext);
