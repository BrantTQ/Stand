import lifeStages from '../data/lifeStages.json';

interface StageNavProps {
  setCurrentStage: (stageId: string) => void;
}

const StageNav = ({ setCurrentStage }: StageNavProps) => {
  return (
    <nav className="flex justify-center p-4">
      {lifeStages.map((stage) => (
        <button
          key={stage.id}
          onClick={() => setCurrentStage(stage.id)}
          className="flex flex-col items-center p-2 m-2 transition-transform transform hover:scale-110"
        >
          <span className="text-4xl">{stage.icon}</span>
          <span className="text-sm">{stage.title}</span>
        </button>
      ))}
    </nav>
  );
};

export default StageNav;
