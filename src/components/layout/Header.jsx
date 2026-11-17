/* Header.jsx: 모든 페이지 맨 위에 공통으로 보이는 헤더 (로고 + 메뉴) - 배경은 투명 */

import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import iconImg from "../../assets/icons/icon.png";
import { NAV_ITEMS } from "../../constants/menu";
import "./Header.css";

const Header = () => {
  const [scrolled, setScrolled] = useState(false); // 아래로 스크롤했는지 (글씨가 안 겹치게 배경을 살짝 입힘)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={"header" + (scrolled ? " is-scrolled" : "")}>
      <div className="header-inner">
        {/* 왼쪽: 로고 - 누르면 홈으로 */}
        <Link to="/" className="header-logo" aria-label="Gallery Passport 홈">
          <img src={iconImg} alt="" className="header-logo-img" />
          <span className="header-logo-text">Gallery Passport</span>
        </Link>

        {/* 가운데: 메뉴 */}
        <nav className="header-nav" aria-label="주 메뉴">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                "header-nav-link" + (isActive ? " is-active" : "")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* 오른쪽: 로고와 폭을 맞추기 위한 빈 칸 (메뉴를 가운데에 두기 위함) */}
        <div className="header-spacer" aria-hidden="true"></div>
      </div>
    </header>
  );
};

export default Header;
