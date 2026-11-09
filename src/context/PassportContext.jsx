/* PassportContext.jsx: 여권 상태를 모든 페이지에서 꺼내 쓸 수 있게 감싸주는 Context */

import { createContext, useContext, useEffect, useReducer } from "react";
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

  return (
    <PassportContext.Provider value={{ state, dispatch }}>
      {children}
    </PassportContext.Provider>
  );
};

/* 어느 컴포넌트에서든 const { state, dispatch } = usePassport() 로 사용 */
export const usePassport = () => useContext(PassportContext);
