interface AttractScreenProps {
  onInteraction: () => void;
}

const AttractScreen = ({ onInteraction }: AttractScreenProps) => {
  return (
    <div 
      onClick={onInteraction} 
      className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-500 to-purple-600 cursor-pointer"
    >
      <div className="text-center text-white">
        <div className="animate-pulse text-8xl mb-6">🎯</div>
        <h1 className="text-4xl font-bold mb-4">Life-Course Data Explorer</h1>
        <p className="text-xl opacity-90 max-w-md">Touch anywhere to explore Luxembourg's life-course data</p>
        <div className="mt-8 animate-bounce">
          <p className="text-lg">👆 Tap to continue</p>
        </div>
      </div>
    </div>
  );
};

export default AttractScreen;