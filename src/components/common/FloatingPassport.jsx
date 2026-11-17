/* FloatingPassport.jsx: 플로팅 여권 - 화면 오른쪽 아래에 떠 있는 여권 버튼, 누르면 작은 여권(내 정보 + 방문 현황 + 스탬프)이 펼쳐져서 갤러리를 보면서 바로 확인 가능 */

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePassport } from "../../context/PassportContext";
import { getLevel } from "../../constants/level";
import { formatDate } from "../../utils/passport";
import museums from "../../data/passportMuseums.json";
import useEscapeKey from "../../hooks/useEscapeKey";
import iconImg from "../../assets/icons/icon.png";
import "./FloatingPassport.css";

/* 플로팅 여권 컴포넌트: open 상태에 따라 작은 여권을 펼치거나 접음 */
const FloatingPassport = () => {
  const [open, setOpen] = useState(false); // 작은 여권이 펼쳐져 있는지
  const { state } = usePassport();
  const { passport, visits } = state;
  const { pathname } = useLocation();

  useEscapeKey(() => setOpen(false)); // ESC 키로 접기

  /* 내 여권 페이지에서는 이미 큰 여권이 보이므로 숨김 */
  if (pathname === "/passport") return null;

  const total = museums.length; // 전체 박물관 수
  const count = visits.length; // 방문한 박물관 수
  const visitDate = (id) => visits.find((v) => v.museumId === id)?.date;

  return (
    <div className="fp">
      {open && (
        <section className="fp-panel" role="dialog" aria-label="내 여권">
          <header className="fp-head">
            <strong>My Passport</strong>
            <button type="button" className="fp-close" aria-label="접기" onClick={() => setOpen(false)}>
              ×
            </button>
          </header>

          {/* 발급 전: 발급 안내 */}
          {!passport ? (
            <div className="fp-empty">
              <p>아직 여권이 없어요.</p>
              <Link to="/passport" className="fp-link" onClick={() => setOpen(false)}>
                여권 발급하기 →
              </Link>
            </div>
          ) : (
            <>
              {/* 내 정보 */}
              <div className="fp-profile">
                {passport.photo ? (
                  <img className="fp-photo" src={passport.photo} alt={`${passport.name} 사진`} />
                ) : (
                  <div className="fp-photo fp-photo-empty" aria-hidden="true">👤</div>
                )}
                <div>
                  <div className="fp-name">{passport.name}</div>
                  <div className="fp-number">{passport.number}</div>
                </div>
              </div>

              {/* 방문 현황 + 레벨 */}
              <div className="fp-summary">
                <span>
                  방문 <strong>{count}</strong> / {total}
                </span>
                <span className="fp-level">{getLevel(count)}</span>
              </div>
              <div className="fp-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count}>
                <div className="fp-bar-fill" style={{ width: `${(count / total) * 100}%` }} />
              </div>

              {/* 스탬프 목록 */}
              <ul className="fp-stamps">
                {museums.map((m) => {
                  const date = visitDate(m.id);
                  return (
                    <li key={m.id} className={`fp-stamp fp-stamp-${m.color}` + (date ? " is-visited" : "")}>
                      <span className="fp-stamp-flag" aria-hidden="true">{date ? m.flag : "?"}</span>
                      <span>
                        <strong>{m.name}</strong>
                        <small>{date ? formatDate(date) : "아직 방문 전"}</small>
                      </span>
                    </li>
                  );
                })}
              </ul>

              <Link to="/passport" className="fp-link" onClick={() => setOpen(false)}>
                여권 전체 보기 →
              </Link>
            </>
          )}
        </section>
      )}

      {/* 떠 있는 여권 버튼 */}
      <button
        type="button"
        className={"fp-button" + (open ? " is-open" : "")} /* 펼쳐져 있으면 is-open 효과 */
        aria-label={open ? "내 여권 접기" : "내 여권 펼치기"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <img src={iconImg} alt="" className="fp-button-img" />
      </button>
    </div>
  );
};

export default FloatingPassport;
