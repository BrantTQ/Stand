import React, { useCallback, useEffect, useRef, useState } from "react";
import { trackScreensaverExit, trackScreensaverShown } from "../analytics";


interface ScreenSaverProps {
  idleMs?: number;           // time until the screensaver appears
  videoSrc?: string;         // path to the looping video
  className?: string;        // optional extra classes for the overlay
  onExit?: () => void;       // called after exiting the screensaver
}

const ScreenSaver: React.FC<ScreenSaverProps> = ({
  idleMs = 600000, // default: 10 seconds
  videoSrc = "/videos/living_conditions.mp4",
  className,
  onExit,
}) => {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [loading, setLoading] = useState(true);         // <-- added

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const armTimer = useCallback(() => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setVisible(true);
      trackScreensaverShown();
    }, idleMs);
  }, [idleMs, clearTimer]);

  const exitScreensaver = useCallback(() => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {
        // ignore
      }
    }
    setVisible(false);
    trackScreensaverExit();
    armTimer();
    onExit?.();
  }, [armTimer, onExit]);

  // Global activity: while not visible, reset the idle timer
  useEffect(() => {
    const onActivity = () => {
      if (!visible) {
        armTimer();
      }
    };
    const events = ["mousemove", "mousedown", "touchstart", "keydown"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    armTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      clearTimer();
    };
  }, [visible, armTimer, clearTimer]);

  // Autoplay video when screensaver shows
  useEffect(() => {
    if (visible && videoRef.current) {
      setLoading(true);                                 // reset when showing
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          // Ignore autoplay failures
        });
      }
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black ${className ?? ""}`}
      onClick={(e) => {
        e.stopPropagation();
        exitScreensaver();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        e.preventDefault();
        exitScreensaver();
      }}
      aria-label="Screensaver overlay"
    >
      <video
        ref={videoRef}
        src={videoSrc}
        className="h-full w-full object-cover"
        muted
        loop
        playsInline
        aria-label="Life stages screensaver"
        onLoadedData={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onCanPlayThrough={() => setLoading(false)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        preload="auto"
        poster=""
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
          <div className="flex flex-col items-center gap-4">
            <div className="h-14 w-14 animate-spin rounded-full border-4 border-teal-300 border-t-transparent" />
          </div>
        </div>
      )}
      <div className="absolute w-full 2xl:bottom-30 md:bottom-0 md:right-6 pointer-events-none">
        <div className="text-center bg-radial from-teal-500 to-50% mt-3 py-5 text-white p-2">
          <p className="text-2xl font-extrabold">Touch to START</p>
        </div>
      </div>
    </div>
  );
};

export default ScreenSaver;