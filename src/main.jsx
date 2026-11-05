/* main.jsx: 시작 파일 - index.html의 root 칸에 앱(App)을 그림 */

import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { PassportProvider } from "./context/PassportContext";
import "./styles/global.css";

/* root 칸에 앱을 그리는 시작 파일 */
const root = createRoot(document.getElementById("root"));
root.render(
  /* StrictMode: 개발 중 실수를 미리 알려주는 검사용 (화면엔 영향 없음) */
  <React.StrictMode>
    {/* BrowserRouter: 주소에 따라 화면을 바꿀 수 있게 해줌 */}
    <BrowserRouter>
      {/* PassportProvider: 어느 페이지에서나 여권 상태를 꺼내 쓸 수 있게 감쌈 */}
      <PassportProvider>
        <App />
      </PassportProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
