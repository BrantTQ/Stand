import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TransitionScreenProps = {
  onFinished: () => void;
  src?: string;
  className?: string;
  showSkip?: boolean;
  skipLabel?: string;
  autoHideSkip?: boolean;
  autoHideDelayMs?: number;
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
  const [hasCompleted, setHasCompleted] = useState(false);
  const [loading, setLoading] = useState(true); // <-- added

  const [skipVisible, setSkipVisible] = useState(true);
  const hideTimerRef = useRef<number | null>(null);

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
      setLoading(false); // <-- hide loader
      tryPlay();
    };
    const onError = () => {
      setLoading(false);
      setIsFadingOut(true);
    };
    const onWaiting = () => setLoading(true); // buffering
    const onPlaying = () => setLoading(false);

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("error", onError);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("playing", onPlaying);

    return () => {
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("error", onError);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("playing", onPlaying);
    };
  }, []);

  // Set up global interaction listeners to re-show skip button
  useEffect(() => {
    if (!autoHideSkip || !showSkip) return;
    const handlePointerMove = () => showAndReschedule();
    const handleKeyDown = () => showAndReschedule();
    const handleClick = () => showAndReschedule();
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);
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
    videoRef.current?.pause();
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
        {showSkip && !isFadingOut && skipVisible && !loading && (   /* hide skip while loading */
          <div className="absolute top-4 right-4 z-30">
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
          poster=""
        />

        {loading && !isFadingOut && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 pointer-events-none">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-400 border-t-transparent" />
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionScreen;