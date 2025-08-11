import lifeStages from '../data/lifeStages.json';
import blurbsData from '../data/blurbs.json';
import { motion } from 'framer-motion';
import GraphPanel from '../components/GraphPanel';
import { useEffect, useState } from 'react';

type Project = {
  project: string;
  title: string;
  introduction: string;
  conclusion: string;
  image?: string;
};

type Blurb = {
  stage: string;
  domain: string;
  // Made projects optional because the JSON entries do not include it
  projects?: Project[];
};

type Blurbs = Record<string, Blurb>;

const blurbs: Blurbs = blurbsData as Blurbs;

interface StageScreenProps {
  stageId: string;
  selectedDomain: string | null;
  onBack?: () => void; // Optional back handler
}

const DomainScreen = ({ stageId, selectedDomain, onBack }: StageScreenProps) => {
  const stage = lifeStages.find((s) => s.id === stageId);

  const [projectIndex, setProjectIndex] = useState(0);

  if (!stage) {
    return <div>Stage not found</div>;
  }

  // Collect blurbs matching this stage and (optionally) selected domain
  let matchingBlurbs: Blurb[] = Object.values(blurbs).filter((b) => {
    if (b.stage !== stageId) return false;
    if (selectedDomain) return b.domain === selectedDomain;
    return true;
  });

  // Fallback: if none match current stage, try by domain only so something shows
  if (matchingBlurbs.length === 0 && selectedDomain) {
    matchingBlurbs = Object.values(blurbs).filter((b) => b.domain === selectedDomain);
  }

  const activeBlurb = matchingBlurbs[0];
  const projects = activeBlurb?.projects ?? [];

  useEffect(() => {
    // Reset to first project when stage/domain changes
    setProjectIndex(0);
  }, [stageId, selectedDomain, activeBlurb]);

  const hasProjects = projects.length > 0;
  const currentProject: Project | undefined = hasProjects ? projects[projectIndex] : undefined;

  const goPrev = () => {
    if (!hasProjects) return;
    setProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goNext = () => {
    if (!hasProjects) return;
    setProjectIndex((prev) => (prev + 1) % projects.length);
  };

  return (
    <motion.div
      key={stageId + (selectedDomain || "")}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.4 }}
      tabIndex={0}
      role="region"
      aria-label={`Stage: ${stage.title}`}
      style={{height: '100%'}}
    >

      {/* Header with project title and arrows */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          {currentProject?.title || 'No content for this stage/domain'}
        </h2>
        {hasProjects && projects.length > 1 && (
          <div className="flex items-center gap-2">
            <button className="btn btn-sm" onClick={goPrev} aria-label="Previous project">←</button>
            <span className="text-sm text-base-content/70">{projectIndex + 1} / {projects.length}</span>
            <button className="btn btn-sm" onClick={goNext} aria-label="Next project">→</button>
          </div>
        )}
      </div>

      {/* Three-column layout: introduction | image | conclusion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Introduction */}
        <div className="p-4 rounded-xl border border-base-300 bg-base-100 text-left">
          <h3 className="font-medium mb-2">Introduction</h3>
          <p className="text-base-content/80 min-h-24">
            {currentProject?.introduction || '—'}
          </p>
        </div>

        {/* Image */}
        <div className="p-4 rounded-xl border border-base-300 bg-base-100 flex items-center justify-center">
          {currentProject?.image ? (
            <img
              src={currentProject.image}
              alt={currentProject.title}
              className="max-h-56 object-contain"
            />
          ) : (
            <div className="text-base-content/50">No image</div>
          )}
        </div>

        {/* Conclusion */}
        <div className="p-4 rounded-xl border border-base-300 bg-base-100 text-left">
          <h3 className="font-medium mb-2">Conclusion</h3>
          <p className="text-base-content/70 min-h-24">
            {currentProject?.conclusion || '—'}
          </p>
        </div>
      </div>

      {/* Graph under the main three columns */}
      {/* <div className="mt-6" onPointerDown={(e) => e.stopPropagation()}>
        <GraphPanel selectedDomain={selectedDomain} stageId={stageId} />
      </div> */}

      {/* Back button at the bottom */}
  <div className="">
        {onBack && (
        <button
          className="mt-6 px-3 py-1 rounded bg-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={onBack}
          aria-label="Go back"
        >
          ← Back
        </button>
      )}
      </div>
      
    </motion.div>
  );
};

export default DomainScreen;
