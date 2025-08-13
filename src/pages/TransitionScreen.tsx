import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type TransitionScreenProps = {
  onFinished: () => void;
  src?: string; // optional override; defaults to /videos/transition.mp4
  className?: string;
};

const TransitionScreen = ({ onFinished, src = "/videos/transition.mp4", className }: TransitionScreenProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const tryPlay = async () => {
      try {
        await v.play();
      } catch {
        // If autoplay fails, fade out to avoid a stuck state
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

  return (
    <AnimatePresence mode="wait">
    <motion.div
      key="transition"
      initial={{ opacity: 0 }}
      animate={{ opacity: isFadingOut ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onAnimationComplete={() => {
        if (isFadingOut) onFinished();
      }}
      className={`fixed inset-0 bg-black ${className ?? ""}`}
    >
      <video
        ref={videoRef}
        src={src}
        autoPlay
        // muted
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