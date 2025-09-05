import { useRef, useEffect, useState, useCallback } from "react";
import Lottie from "lottie-react";
import attractAnimation from "../assets/animations/loading.json";
import { motion } from "framer-motion";

interface AttractScreenProps {
  onInteraction: () => void;
}

const AttractScreen = ({ onInteraction }: AttractScreenProps) => {
  const lottieRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // NEW: screensaver state + idle timer
  const [showScreensaver, setShowScreensaver] = useState(false);
  const idleTimerRef = useRef<number | null>(null);

  const clearIdle = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const startIdleTimer = useCallback(() => {
    clearIdle();
    // only arm idle timer when not already in screensaver
    if (!showScreensaver) {
      idleTimerRef.current = window.setTimeout(() => {
        setShowScreensaver(true);
      }, 10000); // 10 seconds
    }
  }, [clearIdle, showScreensaver]);

  // Handle any user interaction
  const handleAnyInteraction = useCallback(() => {
    if (showScreensaver) {
      // Exit screensaver back to attract screen; do NOT enter the app yet
      if (videoRef.current) {
        try {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        } catch {
          // ignore
        }
      }
      setShowScreensaver(false);
      // restart idle timer for the attract screen
      startIdleTimer();
    } else {
      // Normal attract behavior: proceed into the app
      onInteraction();
    }
  }, [onInteraction, showScreensaver, startIdleTimer]);

  // Global listeners to reset idle or exit screensaver
  useEffect(() => {
    const onActivity = () => {
      if (showScreensaver) {
        // any activity exits screensaver
        handleAnyInteraction();
      } else {
        // while on attract, any activity resets idle timer
        startIdleTimer();
      }
    };
    const events = ["mousemove", "mousedown", "touchstart", "keydown"];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    // Start or restart timer on mount/update
    startIdleTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, onActivity));
      clearIdle();
    };
  }, [showScreensaver, startIdleTimer, handleAnyInteraction, clearIdle]);

  // Ensure video autoplay when entering screensaver mode
  useEffect(() => {
    if (showScreensaver && videoRef.current) {
      // Attempt autoplay; video is muted to satisfy autoplay policies
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          // Autoplay might fail on some platforms; ignore
        });
      }
    }
  }, [showScreensaver]);

  return (
    <motion.div
      key="attract"
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.5 }}
    >
      <div
        onClick={handleAnyInteraction}
        className="relative flex items-center justify-center h-screen w-full cursor-pointer"
      >
        {showScreensaver ? (
          // Screensaver: loop video full screen until user interacts
          <video
            ref={videoRef}
            src="/videos/living_conditions.mp4"
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            // Do not set autoPlay directly; we trigger play() in effect for reliability
            aria-label="Life stages screensaver"
          />
        ) : (
          // Original attract content
          <>
            <div className="text-center text-base">
              <div className="mb-6">
                <Lottie
                  lottieRef={lottieRef}
                  animationData={attractAnimation}
                  loop
                  style={{ width: 320, height: 320, margin: "0 auto" }}
                />
              </div>
              <h1 className="text-4xl font-bold mb-4">Life-Course Data Explorer</h1>
              <p className="text-xl opacity-90 max-w-md">
                Touch anywhere to explore Luxembourg&apos;s life-course data
              </p>
              <div className="mt-8 animate-bounce">
                <p className="text-lg">👆 Tap to continue</p>
              </div>
            </div>
            <div className="absolute bottom-6 right-6">
              <img
                src="/information_systems.png"
                alt="Powered By LISER Information Systems"
                className="h-24 w-full object-contain"
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AttractScreen;