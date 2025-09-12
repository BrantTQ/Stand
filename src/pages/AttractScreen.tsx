import { useMotionValue, motion, animate } from "framer-motion";
import { useEffect } from "react";
import ScreenSaver from "../components/ScreenSaver";

interface AttractScreenProps {
  onInteraction: () => void;
}

const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const AttractScreen = ({ onInteraction }: AttractScreenProps) => {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  // const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.div
      key="attract"
      exit={{ opacity: 0, scale: 1.5 }}
      transition={{ duration: 0.5 }}
      // style={{ backgroundImage }}
      className="absolute top-0 left-0 h-full w-full bg-cover bg-black bg-center"
    >
      {/* Full-screen screensaver overlay; intercepts events when visible */}
      <ScreenSaver idleMs={30000} videoSrc="/videos/living_conditions.mp4" />

      <div
        onClick={onInteraction}
        className="relative flex flex-col items-center justify-center h-screen w-full cursor-pointer backdrop-blur-xs"
      >
        <div className="w-full text-center text-white p-6 ">
          <h1 className="text-7xl font-medium leading-tight bg-gradient-to-br from-white to-gray-400 mb-4 bg-clip-text font-mono ">
            LIVING CONDITIONS
          </h1>
          <div className="flex justify-center m-6">
            <img
              src="/life_stages.png"
              alt="Living Conditions"
              className="h-40 w-40 items-center-safe justify-center"
            />
          </div>
          <h1 className="text-4xl font-extrabold font-sans">Life-Course Data Explorer</h1>
        </div>
        <div className="text-center mt-10 py-5 text-white p-2 ">
          <p className="animate-bounce text-xl font-medium">Touch anywhere to continue</p>
        </div>
        <div className="absolute 2xl:bottom-25 md:bottom-0 md:right-6">
          <img
            src="/information_systems.png"
            alt="Powered By LISER Information Systems"
            className="h-40 w-40 object-contain"
          />
        </div>
        <img src="/liserb_w.png" alt="LISER Logo" className=" absolute h-26 w-[230px] md:left-0 top-5" />
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