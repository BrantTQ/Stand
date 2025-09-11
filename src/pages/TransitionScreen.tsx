import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TransitionScreenProps = {
  onFinished: () => void;
  src?: string; // optional override; defaults to /videos/transition.mp4
  className?: string;
  showSkip?: boolean; // show a Skip button (default true)
  skipLabel?: string; // custom label for skip button
  autoHideSkip?: boolean; // enable auto-hide behavior (default true)
  autoHideDelayMs?: number; // inactivity delay before hiding skip (default 2500 ms)
};

const TransitionScreen = ({
  onFinished,
  src = "/videos/transition.mp4",
  className,
  showSkip = true,
  skipLabel = "Skip",
  autoHideSkip = true,
  autoHideDelayMs = 2500,
}: TransitionScreenProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false); // prevent double-calls

  // Visibility state for skip button (independent from fade-out)
  const [skipVisible, setSkipVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

  // Clear any existing hide timer
  const clearHideTimer = () => {
    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };

  const scheduleHide = useCallback(() => {
    if (!autoHideSkip || !showSkip) return;
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setSkipVisible(false);
    }, autoHideDelayMs);
  }, [autoHideSkip, autoHideDelayMs, showSkip]);

  const showAndReschedule = useCallback(() => {
    if (!showSkip) return;
    setSkipVisible(true);
    scheduleHide();
  }, [scheduleHide, showSkip]);

  // Autoplay attempt & event listeners for video load/error
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        setIsFadingOut(true);
      }
    };

    const onLoaded = () => {
      tryPlay();
    };

    const onError = () => setIsFadingOut(true);

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("error", onError);
    return () => {
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("error", onError);
    };
  }, []);

  // Set up global interaction listeners to re-show skip button
  useEffect(() => {
    if (!autoHideSkip || !showSkip) return;

    const handlePointerMove = () => showAndReschedule();
    const handleKeyDown = () => showAndReschedule();
    const handleClick = () => showAndReschedule(); // taps / clicks

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    // Initial schedule
    scheduleHide();

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
      clearHideTimer();
    };
  }, [autoHideSkip, showSkip, scheduleHide, showAndReschedule]);

  const initiateSkip = () => {
    if (hasCompleted) return;
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch {}
    }
    setIsFadingOut(true);
  };

  const handleAnimationComplete = () => {
    if (isFadingOut && !hasCompleted) {
      setHasCompleted(true);
      onFinished();
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="transition"
        initial={{ opacity: 0 }}
        animate={{ opacity: isFadingOut ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onAnimationComplete={handleAnimationComplete}
        className={`fixed inset-0 bg-black ${className ?? ""}`}
      >
        {/* Skip Button */}
        {showSkip && !isFadingOut && skipVisible && (
          <div className="absolute top-4 right-4 z-20">
            <button
              type="button"
              onClick={initiateSkip}
              className="px-3 py-1 rounded-md bg-white/80 hover:bg-white text-gray-800 text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
              aria-label={`${skipLabel} transition video`}
            >
              {skipLabel}
            </button>
          </div>
        )}

        <video
          ref={videoRef}
          src={src}
          autoPlay
          playsInline
          controls={false}
          onEnded={() => setIsFadingOut(true)}
          className="w-full h-full object-cover"
          preload="auto"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionScreen;