import { useRef } from "react";
import Lottie from "lottie-react";
import attractAnimation from "../assets/animations/sandy_loading.json";
import { motion } from "framer-motion";

interface AttractScreenProps {
  onInteraction: () => void;
}

const AttractScreen = ({ onInteraction }: AttractScreenProps) => {
  const lottieRef = useRef(null);

  return (
    <motion.div
                key="attract"
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 0.5 }}
              >
    <div
      onClick={onInteraction}
      className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer"
    >
      <div className="text-center text-white">
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
          Touch anywhere to explore Luxembourg's life-course data
        </p>
        <div className="mt-8 animate-bounce">
          <p className="text-lg">👆 Tap to continue</p>
        </div>
      </div>
    </div>
    </motion.div>
  );
};

export default AttractScreen;