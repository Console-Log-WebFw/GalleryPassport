/* useEscapeKey.js: ESC 키를 누르면 onEscape 실행 - 화면에서 사라질 때 이벤트도 해제 (모달 닫기용) */

import { useEffect } from "react";

const useEscapeKey = (onEscape) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onEscape();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);
};

export default useEscapeKey;
