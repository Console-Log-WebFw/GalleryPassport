/* PassportPage.jsx: 내 여권 화면 - 발급 전에는 발급 폼, 발급 후에는 여권(내 정보 + 스탬프) */

import { usePassport } from "../../context/PassportContext";
import { getLevel } from "../../constants/level";
import { formatDate } from "../../utils/passport";
import museums from "../../data/passportMuseums.json";
import PassportForm from "./components/PassportForm";
import StampCard from "./components/StampCard";
import "./PassportPage.css";

const PassportPage = () => {
  const { state } = usePassport();
  const { passport } = state;
  // 화면 테스트용 방문 기록입니다. 실제 기록이나 localStorage에는 저장하지 않습니다.
  // 테스트가 끝나면 아래 값을 state.visits로 바꾸세요.
  const visits = state.visits.length > 0
    ? state.visits
    : [{ museumId: "louvre", date: "2026-11-05" }];

  /* 발급 전: 발급 폼만 보여줌 */
  if (!passport) {
    return (
      <section className="passport-page">
        <PassportForm />
      </section>
    );
  }

  const total = museums.length; // 전체 박물관 수 (현재 3곳)
  const count = visits.length; // 방문한 박물관 수
  const visitDate = (id) => visits.find((v) => v.museumId === id)?.date;

  return (
    <section className="passport-page">
      <div className="passport-book">
        {/* 왼쪽 면: 내 정보 + 방문 현황 */}
        <div className="passport-left">
          <div className="passport-heading">
            <div className="passport-title">
              <span className="passport-title-icon" aria-hidden="true">🌐</span>
              Gallery Passport
            </div>
            <p className="passport-desc">전 세계의 갤러리를 여행하며,<br />나만의 여행 여권을 완성해보세요.</p>
          </div>

          <div className="passport-profile">
            {passport.photo ? (
              <img className="passport-photo" src={passport.photo} alt={`${passport.name} 사진`} />
            ) : (
              <div className="passport-photo passport-photo-empty" aria-hidden="true">👤</div>
            )}
            <div>
              <h1 className="passport-name">{passport.name}</h1>
              <div className="passport-number-label">PASSPORT NO.</div>
              <div className="passport-number">{passport.number}</div>
            </div>
          </div>

          <div className="passport-summary">
            <div>
              <div className="passport-label">방문한 갤러리</div>
              <div className="passport-count">
                {count} <span>/ {total}</span>
              </div>
            </div>
            <div className="passport-level-box">
              <div className="passport-label">여정 레벨</div>
              <div className="passport-level">{getLevel(count)}</div>
              <div className="passport-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={count}>
                <div className="passport-bar-fill" style={{ width: `${(count / total) * 100}%` }} />
              </div>
            </div>
          </div>

          <div className="passport-journey">
            <div className="passport-label">My Journey</div>
            {count === 0 ? (
              <p className="passport-empty">아직 방문한 갤러리가 없어요. 갤러리를 끝까지 둘러보면 기록이 쌓여요.</p>
            ) : (
              <ul>
                {visits.map((v) => {
                  const m = museums.find((x) => x.id === v.museumId);
                  return (
                    <li key={v.museumId}>
                      <span className="passport-journey-flag" aria-hidden="true">{m.flag}</span>
                      <span>
                        <strong>{m.name}</strong>
                        <small>{m.country} · {m.city} · {formatDate(v.date)}</small>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* 오른쪽 면: 스탬프 모음 */}
        <div className="passport-right">
          <div className="passport-stamps-head">
            <span>스탬프 컬렉션</span>
            <span>{count} / {total}</span>
          </div>
          <div className="passport-stamps">
            {museums.map((m) => (
              <StampCard key={m.id} museum={m} visitedAt={visitDate(m.id)} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PassportPage;
