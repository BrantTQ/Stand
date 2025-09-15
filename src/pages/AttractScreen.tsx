import { motion } from "framer-motion";
import { useState, useCallback } from "react";

import ScreenSaver from "../components/ScreenSaver";

interface AttractScreenProps {
  onInteraction: () => void;
}

const AttractScreen = ({ onInteraction }: AttractScreenProps) => {
  // To suppress synthetic click events immediately after screensaver exit
  // (especially on touch devices), we track a timestamp until which clicks
  // should be ignored.
  const [suppressUntil, setSuppressUntil] = useState<number>(0);

  const handleScreensaverExit = useCallback(() => {
    // Suppress interactions for a brief moment (e.g. 400ms)
    setSuppressUntil(Date.now() + 400);
  }, []);

  const handleAttractClick = useCallback(() => {
    if (Date.now() < suppressUntil) {
      // Ignore the synthetic click immediately after screensaver exit
      return;
    }
    onInteraction();
  }, [onInteraction, suppressUntil]);

  return (
    <motion.div
      key="attract"
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.5 }}
      // style={{ backgroundImage }}
      className="absolute top-0 left-0 h-full w-full bg-cover bg-[#ffffff] bg-center"
    >
      {/* Full-screen screensaver overlay; intercepts events when visible */}
      <ScreenSaver
        idleMs={30000}
        videoSrc="/videos/living_conditions.mp4"
        onExit={handleScreensaverExit}
      />

      <div
        onClick={handleAttractClick}
        className="relative flex flex-col items-center justify-center h-screen w-full cursor-pointer backdrop-blur-xs"
      >
        <div className="flex items-center justify-center w-full">
          <div className="bg-[#0097b2] rounded-2xl px-12 py-10 shadow-xl border border-white/20 max-w-4xl w-full">
            <div className="w-full text-center text-[#fff]">
              <h1 className="text-7xl font-medium leading-tight bg-gradient-to-br from-white to-gray-400 mb-4 bg-clip-text font-mono">
          LIVING CONDITIONS
              </h1>
              <div className="flex justify-center m-2">
          <img
            src="/life_stages.png"
            alt="Living Conditions"
            className="h-40 w-40 items-center-safe justify-center"
          />
              </div>
              <h1 className="text-4xl font-extrabold font-sans">Life-Course Data Explorer</h1>
            </div>
            <div className="text-center mt-8 py-2 text-[#ffbbad]">
              <p className="animate-bounce text-xl font-medium">Touch anywhere to continue</p>
            </div>
          </div>
        </div>
        <div className="absolute 2xl:bottom-25 md:bottom-0 md:right-6">
          <img
            src="/info_sys.png"
            alt="Powered By LISER Information Systems"
            className="h-42 w-42 object-contain"
          />
        </div>
        <img src="/liser_logo.png" alt="LISER Logo" className=" absolute h-26 w-[230px] md:left-4 top-5" />
        {/* <div className="absolute inset-0 z-0">
          <Canvas>
            <Stars radius={70} count={7000} factor={4} fade speed={2} />
          </Canvas>
        </div> */}
      </div>
    </motion.div>
  );
};

export default AttractScreen;