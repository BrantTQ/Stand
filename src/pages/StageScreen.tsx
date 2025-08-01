import lifeStages from '../data/lifeStages.json';
import blurbsData from '../data/blurbs.json';
import { motion } from 'framer-motion';

type Blurb = {
  stage: string;
  domain: string;
  title: string;
  text: string;
};

type Blurbs = Record<string, Blurb>;

const blurbs: Blurbs = blurbsData;

interface StageScreenProps {
  stageId: string;
  selectedDomain: string | null;
  onBack?: () => void; // Optional back handler
}

const StageScreen = ({ stageId, selectedDomain, onBack }: StageScreenProps) => {
  const stage = lifeStages.find((s) => s.id === stageId);

  if (!stage) {
    return <div>Stage not found</div>;
  }

  // Find the blurb for this stage and domain
  let blurbText = '';
  let blurbTitle = '';
  if (stage.blurbs && stage.blurbs.length > 0) {
    // Find the first blurb that matches the selected domain (if any)
    const blurbKey = stage.blurbs.find((key: string) => {
      const blurb = blurbs[key];
      if (!blurb) return false;
      if (selectedDomain) {
        return blurb.domain === selectedDomain;
      }
      return true; // If no domain selected, just take the first
    });
    if (blurbKey && blurbs[blurbKey]) {
      blurbText = blurbs[blurbKey].text;
      blurbTitle = blurbs[blurbKey].title;
    }
  }

  return (
    <motion.div
      key={stageId + (selectedDomain || "")}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(event, info) => {
        if (info.offset.x > 100 && onBack) {
          onBack();
        }
      }}
      tabIndex={0}
      role="region"
      aria-label={`Stage: ${stage.title}`}
      className="p-6"
    >
      {onBack && (
        <button
          className="mb-4 px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={onBack}
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
      <h1>{stage.title}</h1>
      {blurbTitle && <h2 className="text-xl font-semibold mb-2">{blurbTitle}</h2>}
      <p>{blurbText || 'No blurb available for this stage/domain.'}</p>
    </motion.div>
  );
};

export default StageScreen;
