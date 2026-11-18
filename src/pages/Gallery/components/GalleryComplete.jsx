/* GalleryComplete.jsx: 박물관 작품을 모두 봤을 때 뜨는 축하 연출 - 색종이 대포·불꽃(canvas-confetti) + 빛줄기 뒤로 튀어 오르는 금빛 카드 */

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import useEscapeKey from "../../../hooks/useEscapeKey";
import "./GalleryComplete.css";

const COLORS = ["#f6d365", "#e8c25a", "#ffffff", "#ff7eb3", "#7afcff", "#b388ff", "#ff9a3c"];
const STREAM_MS = 2600; // 양옆에서 색종이를 계속 뿜는 시간
const FIREWORK_MS = 4200; // 불꽃이 터지는 시간

const GalleryComplete = ({ museum, total, hasPassport, onClose }) => {
  const canvasRef = useRef(null);
  useEscapeKey(onClose);

  useEffect(() => {
    const fire = confetti.create(canvasRef.current, { resize: true, useWorker: false } /* 워커는 canvas 를 한 번만 넘길 수 있어 StrictMode 이중 실행에서 오류 */);
    const opts = { colors: COLORS, disableForReducedMotion: true };
    const timers = [];
    let frame;

    /* 1) 처음: 양쪽 아래에서 대포처럼 + 가운데 금색 별 폭발 */
    fire({ ...opts, particleCount: 120, angle: 60, spread: 70, startVelocity: 70, origin: { x: 0, y: 0.95 } });
    fire({ ...opts, particleCount: 120, angle: 120, spread: 70, startVelocity: 70, origin: { x: 1, y: 0.95 } });
    timers.push(
      setTimeout(() => {
        fire({
          ...opts,
          particleCount: 80,
          spread: 360,
          startVelocity: 35,
          gravity: 0.6,
          scalar: 1.4,
          shapes: ["star"],
          colors: ["#ffd700", "#f6d365", "#fff3b0"],
          origin: { x: 0.5, y: 0.42 },
        });
      }, 350),
    );

    /* 2) 2.6초 동안 양옆에서 계속 흩뿌림 */
    const streamEnd = Date.now() + STREAM_MS;
    const stream = () => {
      fire({ ...opts, particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } });
      fire({ ...opts, particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } });
      if (Date.now() < streamEnd) frame = requestAnimationFrame(stream);
    };
    frame = requestAnimationFrame(stream);

    /* 3) 하늘 여기저기서 불꽃 */
    const fireworkEnd = Date.now() + FIREWORK_MS;
    const interval = setInterval(() => {
      const left = fireworkEnd - Date.now();
      if (left <= 0) return clearInterval(interval);
      const count = Math.round(60 * (left / FIREWORK_MS)) + 20;
      fire({
        ...opts,
        particleCount: count,
        spread: 360,
        startVelocity: 28,
        ticks: 70,
        gravity: 0.9,
        origin: { x: 0.1 + Math.random() * 0.8, y: 0.1 + Math.random() * 0.3 },
      });
    }, 420);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
      timers.forEach(clearTimeout);
      fire.reset();
    };
  }, []);

  return (
    <div className="gallery-complete" role="dialog" aria-modal="true" aria-labelledby="gallery-complete-title">
      <div className="gallery-complete-backdrop" onClick={onClose} />
      <div className="gallery-complete-rays" aria-hidden="true" />

      <div className="gallery-complete-card">
        <button type="button" className="gallery-complete-close" aria-label="닫기" onClick={onClose}>
          ×
        </button>
        <div className="gallery-complete-medal" aria-hidden="true">
          <span>🏆</span>
        </div>
        <p className="gallery-complete-kicker">{museum.nameEn || museum.name} · COMPLETE</p>
        <h2 id="gallery-complete-title" className="gallery-complete-title">
          모든 작품을 다 봤습니다!
        </h2>
        <p className="gallery-complete-museum">
          {museum.name}의 작품 <strong>{total}점</strong>을 모두 관람했어요.
        </p>
        <p className="gallery-complete-stamp">
          {hasPassport
            ? "🛂 여권에 도장이 찍혔어요"
            : "여권을 발급받으면 박물관 도장을 받을 수 있어요"}
        </p>
        <div className="gallery-complete-actions">
          <Link to="/passport" className="gallery-complete-btn gallery-complete-btn--primary">
            {hasPassport ? "여권 보러 가기" : "여권 발급하러 가기"}
          </Link>
          <button type="button" className="gallery-complete-btn" onClick={onClose}>
            계속 둘러보기
          </button>
        </div>
      </div>

      {/* 색종이·불꽃은 카드 위에 그림 (클릭은 통과) */}
      <canvas ref={canvasRef} className="gallery-complete-canvas" aria-hidden="true" />
    </div>
  );
};

export default GalleryComplete;
