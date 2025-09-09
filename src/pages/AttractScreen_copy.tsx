import React, { useRef, useEffect, useState, useCallback } from "react";

import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";

interface AttractScreenProps {
  onInteraction: () => void;
}

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const AttractScreen = ({ onInteraction }: AttractScreenProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const color = useMotionValue(COLORS_TOP[0]);
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
      }, 5000); // 1 minute
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

  useEffect(() => {
  animate(color, COLORS_TOP, {
    ease: "easeInOut",
    duration: 10,
    repeat: Infinity,
    repeatType: "mirror",
  });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;


  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="relative grid min-h-screen min-w-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200"
    >
      <div
        onClick={handleAnyInteraction}
        className="relative flex flex-col items-center justify-center h-screen w-full cursor-pointer backdrop-blur-xs"
      >
        {showScreensaver ? (
          // Screensaver: loop video full screen until user interacts
          <>
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
          <div className="absolute w-full h bg-gradient-to-r via-slate-400 to-90%  bottom-0 right-0">
             <div className=" text-center mt-3 py-5 text-white bg-gradient-to-t from-blue-950 to-5% bg-opacity-10 p-2 ">


              <p className="text-2xl font-extrabold">
                Touch to START
              </p>

            </div>
            </div>
            </>
        ) : (
          // Original attract content
          <>
            <div className="w-full text-center text-white p-6 ">
              <h1 className="text-7xl font-bold mb-4 bg-clip-text font-mono ">LIVING CONDITIONS</h1>
              <div className="flex justify-center m-6">
                <img src="/life_stages.png" alt="Living Conditions" className="h-30 w-30 items-center-safe justify-center" />
              </div>
              <h1 className="text-5xl font-extrabold font-mono">Life-Course Data Explorer</h1>
            </div>
            <div className="text-center mt-10 py-5 text-white p-2 ">
              <p className="animate-bounce text-xl font-medium">
                Touch anywhere to explore Luxembourg&apos;s life-course data
              </p>
            </div>           
            <div className="absolute bottom-2 right-6">
              <img
                src="/information_systems.png"
                alt="Powered By LISER Information Systems"
                className="h-24 w-36 object-contain"
              />
            </div>
            <img
            src="/liserb_w.png"
            alt="LISER Logo"
            className=" absolute h-26 w-[230px] left-0 top-5"
            />
          </>
        )}
      </div>
    </motion.section>
    
  );
};

export default AttractScreen;