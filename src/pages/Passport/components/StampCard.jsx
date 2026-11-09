/* StampCard.jsx: 스탬프 한 장 - 다녀온 박물관이면 색이 있는 도장, 아직이면 흐린 빈 칸 */

import { formatDate } from "../../../utils/passport";
import "./StampCard.css";

/* museum: 박물관 정보, visitedAt: 방문 날짜(없으면 아직 방문 전) */
const StampCard = ({ museum, visitedAt }) => (
  <div className={`stamp stamp-${museum.color}` + (visitedAt ? " is-visited" : " is-empty")}>
    {visitedAt ? (
      <>
        <span className="stamp-flag" aria-hidden="true">{museum.flag}</span>
        <strong className="stamp-name">{museum.nameEn}</strong>
        <span className="stamp-country">{museum.countryEn}</span>
        <span className="stamp-date">{formatDate(visitedAt)}</span>
      </>
    ) : (
      <>
        <span className="stamp-lock" aria-hidden="true">?</span>
        <span className="stamp-country">{museum.name}</span>
        <span className="stamp-date">아직 방문 전</span>
      </>
    )}
  </div>
);

export default StampCard;
