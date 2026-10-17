"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion, useSpring } from "framer-motion";
import { assetUrl } from "@/lib/site";

export function PouchMascot() {
  const id = useId().replace(/:/g, "");
  const stage = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const x = useSpring(0, { stiffness: 100, damping: 10 });
  const y = useSpring(0, { stiffness: 100, damping: 10 });
  const gaze = useMotionTemplate`translate(${x}px, ${y}px)`;

  useEffect(() => {
    const pointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reducedMotion) {
      x.jump(0);
      y.jump(0);
      return;
    }
    let idleTimer: ReturnType<typeof setTimeout>;
    const reset = () => { x.set(0); y.set(0); };
    const pause = () => { clearTimeout(idleTimer); reset(); };
    let lastGlance = -1;
    const rest = () => {
      pause();
      if (document.hidden) return;
      idleTimer = setTimeout(() => {
        const glances = [[0, -7], [-7, -2], [7, -2]];
        // Alternate destinations so consecutive glances do not feel mechanical.
        lastGlance = lastGlance === -1 ? 0 : (lastGlance + 1 + Math.floor(Math.random() * 2)) % glances.length;
        const [nextX, nextY] = glances[lastGlance];
        x.set(nextX);
        y.set(nextY);
        idleTimer = setTimeout(rest, 2000 + Math.random() * 1000);
      }, 2200 + Math.random() * 1800);
    };
    const look = (event: PointerEvent) => {
      if (!pointer.matches || !stage.current || event.pointerType !== "mouse") return;
      const box = stage.current.getBoundingClientRect();
      clearTimeout(idleTimer);
      // Convert the pointer to artwork coordinates so the gaze scales with the face.
      const scale = 2172 / box.width;
      x.set(Math.max(-7, Math.min(7, (event.clientX - box.left - box.width / 2) * scale * .02)));
      y.set(Math.max(-7, Math.min(5, (event.clientY - box.top - box.height * .745) * scale * .02)));
      idleTimer = setTimeout(rest, 1800);
    };
    rest();
    window.addEventListener("pointermove", look, { passive: true });
    document.documentElement.addEventListener("pointerleave", rest);
    document.addEventListener("visibilitychange", rest);
    window.addEventListener("blur", pause);
    window.addEventListener("focus", rest);
    pointer.addEventListener("change", rest);
    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener("pointermove", look);
      document.documentElement.removeEventListener("pointerleave", rest);
      document.removeEventListener("visibilitychange", rest);
      window.removeEventListener("blur", pause);
      window.removeEventListener("focus", rest);
      pointer.removeEventListener("change", rest);
    };
  }, [reducedMotion, x, y]);

  return <div className="bottom-pouch">
    <div className="pouch-stage" ref={stage}>
      <Image src={assetUrl("/images/pouch-animation-base.png")} width={2172} height={724} sizes="(max-width: 600px) 240vw, 140vw" priority alt="EverySpend’s smiling pouch" />
      <svg className="pouch-face" viewBox="0 0 2172 724" aria-hidden="true">
        <defs>
          <clipPath id={`${id}-left`}><ellipse cx="914" cy="540" rx="48" ry="75" transform="rotate(35 914 540)" /></clipPath>
          <clipPath id={`${id}-right`}><ellipse cx="1256" cy="540" rx="48" ry="75" transform="rotate(-35 1256 540)" /></clipPath>
        </defs>
        {[{ side: "left", cx: 914, rotation: 35 }, { side: "right", cx: 1256, rotation: -35 }].map(({ side, cx, rotation }) => (
          <g key={side} className={`pouch-eye pouch-eye-${side}`}>
            <ellipse className="pouch-eye-white" cx={cx} cy="540" rx="48" ry="75" transform={`rotate(${rotation} ${cx} 540)`} fill="#f7f5f0" />
            <g clipPath={`url(#${id}-${side})`}>
              <motion.g className="pouch-pupil" style={{ transform: gaze }}>
                <ellipse cx={cx} cy="540" rx="32" ry="48" transform={`rotate(${rotation} ${cx} 540)`} fill="#302e29" />
                <circle cx={cx - 9} cy="522" r="12" fill="#fff" />
              </motion.g>
            </g>
          </g>
        ))}
      </svg>
    </div>
  </div>;
}
