/* Layout.jsx: 모든 페이지의 공통 틀 - 맨 위에 헤더, 그 아래에 현재 페이지(Outlet), 오른쪽 아래에 플로팅 여권을 보여줌 */

import { Outlet } from "react-router-dom";
import Header from "./Header";
import FloatingPassport from "../common/FloatingPassport";

const Layout = () => (
  <>
    <Header />
    {/* Outlet: 주소에 맞는 페이지가 이 자리에 들어옴 */}
    <main>
      <Outlet />
    </main>
    {/* 플로팅 여권: 어느 페이지에서나 오른쪽 아래에 떠 있음 */}
    <FloatingPassport />
  </>
);

export default Layout;
