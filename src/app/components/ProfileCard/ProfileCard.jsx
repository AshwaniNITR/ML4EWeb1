/*
  Installed from https://reactbits.dev/default/
*/
"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import "./ProfileCard.css";

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, p = 3) => parseFloat(v.toFixed(p));
const adjust = (v, a, b, c, d) => round(c + ((d - c) * (v - a)) / (b - a));
const easeInOutCubic = (x) =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ProfileCardComponent = ({
  avatarUrl,
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = "",
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,
  miniAvatarUrl,
  name = "Javi A. Torres",
  title = "Software Engineer",
  handle = "javicodes",
  status = "Online",
  linkedinUrl,
  email,
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
  zoom = 1,
  disableAura = false, // keep tilt, but swap hover rainbow → static cyan glow
}) => {
  const wrapRef = useRef(null);
  const cardRef = useRef(null);

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;
    let rafId = null;

    const updateCardTransform = (x, y, card, wrap) => {
      const w = card.clientWidth,
        h = card.clientHeight;
      const px = clamp((100 / w) * x);
      const py = clamp((100 / h) * y);
      const cx = px - 50,
        cy = py - 50;
      const props = {
        "--pointer-x": `${px}%`,
        "--pointer-y": `${py}%`,
        "--background-x": `${adjust(px, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(py, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(py - 50, px - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${py / 100}`,
        "--pointer-from-left": `${px / 100}`,
        "--rotate-x": `${round(-(cx / 5))}deg`,
        "--rotate-y": `${round(cy / 4)}deg`,
      };
      Object.entries(props).forEach(([k, v]) => wrap.style.setProperty(k, v));
    };

    const createSmoothAnimation = (dur, sx, sy, card, wrap) => {
      const t0 = performance.now();
      const tx = wrap.clientWidth / 2,
        ty = wrap.clientHeight / 2;
      const loop = (t) => {
        const e = t - t0;
        const p = clamp(e / dur);
        const ep = easeInOutCubic(p);
        const cx = adjust(ep, 0, 1, sx, tx);
        const cy = adjust(ep, 0, 1, sy, ty);
        updateCardTransform(cx, cy, card, wrap);
        if (p < 1) rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      },
    };
  }, [enableTilt]);

  const handlePointerMove = useCallback(
    (e) => {
      const c = cardRef.current,
        w = wrapRef.current;
      if (!c || !w || !animationHandlers) return;
      const r = c.getBoundingClientRect();
      animationHandlers.updateCardTransform(e.clientX - r.left, e.clientY - r.top, c, w);
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const c = cardRef.current,
      w = wrapRef.current;
    if (!c || !w || !animationHandlers) return;
    animationHandlers.cancelAnimation();
    w.classList.add("active");
    c.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (e) => {
      const c = cardRef.current,
        w = wrapRef.current;
      if (!c || !w || !animationHandlers) return;
      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        e.offsetX,
        e.offsetY,
        c,
        w
      );
      w.classList.remove("active");
      c.classList.remove("active");
    },
    [animationHandlers]
  );

  const handleDeviceOrientation = useCallback(
    (e) => {
      const c = cardRef.current,
        w = wrapRef.current;
      if (!c || !w || !animationHandlers) return;
      const { beta, gamma } = e;
      if (!beta || !gamma) return;
      animationHandlers.updateCardTransform(
        c.clientHeight / 2 + gamma * mobileTiltSensitivity,
        c.clientWidth / 2 +
          (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        c,
        w
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );

  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;
    const c = cardRef.current,
      w = wrapRef.current;
    if (!c || !w) return;

    const move = handlePointerMove;
    const enter = handlePointerEnter;
    const leave = handlePointerLeave;
    const orient = handleDeviceOrientation;

    c.addEventListener("pointerenter", enter);
    c.addEventListener("pointermove", move);
    c.addEventListener("pointerleave", leave);
    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== "https:") return;
      if (typeof window.DeviceMotionEvent?.requestPermission === "function") {
        window.DeviceMotionEvent.requestPermission().then((s) => {
          if (s === "granted")
            window.addEventListener("deviceorientation", orient);
        });
      } else {
        window.addEventListener("deviceorientation", orient);
      }
    };
    c.addEventListener("click", handleClick);

    const ix = w.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const iy = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    animationHandlers.updateCardTransform(ix, iy, c, w);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      ix,
      iy,
      c,
      w
    );

    return () => {
      c.removeEventListener("pointerenter", enter);
      c.removeEventListener("pointermove", move);
      c.removeEventListener("pointerleave", leave);
      window.removeEventListener("deviceorientation", orient);
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    enableMobileTilt,
    animationHandlers,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    handleDeviceOrientation,
  ]);

  const cardStyle = useMemo(
    () => ({
      "--icon": iconUrl ? `url(${iconUrl})` : "none",
      "--grain": grainUrl ? `url(${grainUrl})` : "none",
      "--behind-gradient": showBehindGradient
        ? behindGradient ?? DEFAULT_BEHIND_GRADIENT
        : "none",
      "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
    }),
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const emailHref =
    email && (email.startsWith("mailto:") ? email : `mailto:${email}`);

  const avatarTransform = `translateX(-50%) scale(${zoom || 1})`;

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className} ${
        disableAura ? "cyan-hover" : ""
      }`.trim()}
      style={cardStyle}
    >
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />

          <div className="pc-content pc-avatar-content">
            <img
              className="avatar"
              src={avatarUrl}
              alt={`${name || "User"} avatar`}
              loading="lazy"
              style={{ transform: avatarTransform }}
            />

            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img
                      src={miniAvatarUrl || avatarUrl}
                      alt={`${name || "User"} mini avatar`}
                      loading="lazy"
                    />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    {status && <div className="pc-status">{status}</div>}
                  </div>
                </div>

                {(linkedinUrl || emailHref) && (
                  <div className="pc-socials" style={{ pointerEvents: "auto" }}>
                    {linkedinUrl && (
                      <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${name} LinkedIn`}
                        className="pc-social-link"
                      >
                        <FaLinkedin size={18} />
                      </a>
                    )}
                    {emailHref && (
                      <a
                        href={emailHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Email ${name}`}
                        className="pc-social-link"
                      >
                        <FaEnvelope size={18} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default React.memo(ProfileCardComponent);