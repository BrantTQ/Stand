import lifeStages from '../data/lifeStages.json';

interface StageScreenProps {
  stageId: string;
}

const StageScreen = ({ stageId }: StageScreenProps) => {
  const stage = lifeStages.find((s) => s.id === stageId);

  if (!stage) {
    return <div>Stage not found</div>;
  }

  return (
    <div>
      <h1>{stage.title}</h1>
      <p>{stage.blurb}</p>
    </div>
  );
};

export default StageScreen;
