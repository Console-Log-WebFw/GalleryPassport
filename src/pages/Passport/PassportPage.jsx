/* PassportPage.jsx: 내 여권 화면 - 발급 전에는 발급 폼, 발급 후에는 여권(내 정보 + 스탬프) */

import { useLocation, useNavigate } from "react-router-dom";
import { usePassport } from "../../context/PassportContext";
import { getLevel } from "../../constants/level";
import { formatDate } from "../../utils/passport";
import museums from "../../data/passportMuseums.json";
import { getMuseum } from "../../data/museums";
import iconImg from "../../assets/icons/icon.png";
import PassportForm from "./components/PassportForm";
import StampCard from "./components/StampCard";
import StampArt from "./components/StampArt";
import "./PassportPage.css";

/* 도장 가장자리를 손으로 찍은 듯 살짝 거칠게 만드는 효과 (StampCard.css 에서 id로 불러 씀) */
const StampFilter = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
    <filter id="stamp-rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.6" />
    </filter>
  </svg>
);

/* 여권 아래쪽 기계 판독 영역(MRZ) 장식 - 여권 번호로 만든 글자 줄 */
const mrz = (number) => {
  const pad = (s, n) => (s + "<".repeat(n)).slice(0, n);
  return [pad(`P<GPKR${number}`, 38), pad(`${number}0KOR`, 38)];
};

const PassportPage = () => {
  const { state } = usePassport();
  const { passport } = state;
  const navigate = useNavigate();
  const location = useLocation();

  /* 이전 화면이 있으면 그쪽으로, 주소를 바로 열어서 들어왔으면 홈으로 */
  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/"));

  const visits = state.visits; // 도장이 찍힌 박물관 (작품을 모두 본 박물관)

  const backButton = (
    <button type="button" className="passport-back" onClick={goBack}>
      <span aria-hidden="true">←</span> 이전 화면
    </button>
  );

  /* 발급 전: 발급 폼만 보여줌 */
  if (!passport) {
    return (
      <section className="passport-page">
        <div className="passport-wrap">
          {backButton}
          <PassportForm />
        </div>
      </section>
    );
  }

  const total = museums.length; // 전체 박물관 수 (현재 3곳)
  const count = visits.length; // 방문한 박물관 수
  const visitDate = (id) => visits.find((v) => v.museumId === id)?.date;

  /* 박물관별 작품 관람 진행도: 본 작품 수 / 전체 작품 수 */
  const progressOf = (id) => {
    const gallery = getMuseum(id);
    if (!gallery) return null;
    const ids = gallery.rooms.flatMap((room) => room.artworks.map((a) => a.id));
    const seen = (state.viewed?.[id] || []).filter((x) => ids.includes(x)).length;
    return { seen, total: ids.length };
  };
  const [mrz1, mrz2] = mrz(passport.number);

  return (
    <section className="passport-page">
      <StampFilter />
      <div className="passport-wrap">
        {backButton}
        <div className="passport-book">
          {/* 왼쪽 면: 내 정보 + 방문 현황 */}
          <div className="passport-left">
            <div className="passport-heading">
              <div className="passport-title">
                <img className="passport-title-icon" src={iconImg} alt="" />
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
                <div className="passport-number-label">NAME</div>
                <h1 className="passport-name">{passport.name}</h1>
                <div className="passport-number-label">PASSPORT NO.</div>
                <div className="passport-number">{passport.number}</div>
                <div className="passport-number-label passport-issued-label">DATE OF ISSUE</div>
                <div className="passport-issued">{formatDate(passport.issuedAt)}</div>
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
              <h2 className="passport-section-title">My Journey</h2>
              {count === 0 ? (
                <p className="passport-empty">아직 방문한 갤러리가 없어요. 갤러리를 끝까지 둘러보면 기록이 쌓여요.</p>
              ) : (
                <ul>
                  {visits.map((v) => {
                    const m = museums.find((x) => x.id === v.museumId);
                    if (!m) return null;
                    return (
                      <li key={v.museumId} className={`passport-journey-${m.color}`}>
                        <StampArt museumId={m.id} className="passport-journey-art" />
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

            {/* 여권 맨 아래 기계 판독 영역 (장식) */}
            <div className="passport-mrz" aria-hidden="true">
              <div>{mrz1}</div>
              <div>{mrz2}</div>
            </div>
          </div>

          {/* 오른쪽 면: 스탬프 모음 */}
          <div className="passport-right">
            <div className="passport-stamps-head">
              <h2 className="passport-section-title">스탬프 컬렉션</h2>
              <span className="passport-stamps-count">{count} / {total}</span>
            </div>
            <div className="passport-stamps">
              {museums.map((m) => (
                <StampCard key={m.id} museum={m} visitedAt={visitDate(m.id)} progress={progressOf(m.id)} />
              ))}
            </div>
            {/* 장식: 흐린 원형 도장 */}
            <div className="passport-seal" aria-hidden="true">
              <img src={iconImg} alt="" />
              <span>GALLERY PASSPORT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PassportPage;
