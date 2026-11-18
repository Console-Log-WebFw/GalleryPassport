/* StampCard.jsx: 스탬프 한 장 - 다녀온 박물관이면 건물 그림이 있는 색 도장, 아직이면 흐린 빈 칸 */

import { formatDate } from "../../../utils/passport";
import StampArt from "./StampArt";
import "./StampCard.css";

/* museum: 박물관 정보, visitedAt: 방문 날짜(없으면 아직 방문 전), progress: { seen, total } 본 작품 수
   highlighted: 갤러리를 막 다 보고 넘어왔을 때 - 도장이 쾅 찍히듯 잠시 강조 */
const StampCard = ({ museum, visitedAt, progress, highlighted = false }) => (
  <div
    className={
      `stamp stamp-${museum.color}` +
      (visitedAt ? " is-visited" : " is-empty") +
      (highlighted ? " is-highlight" : "")
    }
  >
    {highlighted && <span className="stamp-new">NEW STAMP</span>}
    <div className="stamp-inner">
      <StampArt museumId={museum.id} />
      {visitedAt ? (
        <>
          <strong className="stamp-name">{museum.nameEn}</strong>
          <span className="stamp-country">{museum.countryEn}</span>
          <span className="stamp-date">{formatDate(visitedAt)}</span>
        </>
      ) : (
        <>
          <span className="stamp-name">{museum.name}</span>
          <span className="stamp-date">
            {progress && progress.total > 0
              ? `작품 ${progress.seen} / ${progress.total} 관람`
              : "아직 방문 전"}
          </span>
        </>
      )}
    </div>
  </div>
);

export default StampCard;
