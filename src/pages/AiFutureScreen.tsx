import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface AiFutureScreenProps {
  src?: string; // path to the video
  onBack: () => void; // go back to stage select
}

const AiFutureScreen: React.FC<AiFutureScreenProps> = ({ src = "/videos/ai_future.mp4", onBack }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(true);            // <-- added

  const handleReplay = useCallback(() => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
        setEnded(false);
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    setEnded(false);
    setLoading(true);                                      // reset loader on src change
  }, [src]);

  return (
    <motion.div
      key="ai-future"
      className="relative h-full w-full flex items-center justify-center bg-base-200"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative w-full h-full max-w-6xl">
        <div className="aspect-video w-full h-full rounded-xl overflow-hidden shadow-2xl">
          <video
            ref={videoRef}
            src={src}
            className="h-full w-full object-contain bg-black"
            controls
            playsInline
            autoPlay
            onLoadedData={() => setLoading(false)}         // <-- hide when enough data
            onCanPlay={() => setLoading(false)}
            onCanPlayThrough={() => setLoading(false)}
            onWaiting={() => setLoading(true)}             // buffering
            onPlaying={() => setLoading(false)}
            onEnded={() => setEnded(true)}
            preload="auto"
            poster=""
          />
        </div>

        {loading && !ended && (                            // <-- loader overlay
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-teal-400 border-t-transparent" />
            </div>
          </div>
        )}

        {ended && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-white/10">
              <div className="text-center space-y-4">
                <h2 className="text-white text-2xl md:text-3xl font-semibold">Playback finished</h2>
                <div className="flex gap-3 justify-center">
                  <button className="btn btn-primary" onClick={handleReplay}>
                    Replay
                  </button>
                  <button className="btn" onClick={onBack}>
                    Back to stages
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AiFutureScreen;