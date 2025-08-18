import lifeStages from '../data/lifeStages.json';
import blurbsData from '../data/blurbs.json';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import DomainButtons from '../components/DomainButtons'; // NEW

// Raw project shape from blurbs.json
type RawProject = {
  title: string;
  introduction: string;
  conclusion: string;
  image?: {
    src?: string;
    cite?: string;
  };
  qrCode?: string;
  author?: string;
};

// Raw domain container
type RawDomainEntry = {
  projects?: RawProject[];
};

// Raw stage entry (note: "domains" OR the accidental "domain" key)
type RawStageEntry = {
  stage: string; // e.g. "early", "school"
  domains?: Record<string, RawDomainEntry>;
  domain?: Record<string, RawDomainEntry>; // to tolerate the typo in current JSON for "school"
};

// Root raw structure
type RawBlurbsFile = Record<string, RawStageEntry>;

// Normalized project consumed by UI
type Project = {
  title: string;
  introduction: string;
  conclusion: string;
  image?: string;
  image_source?: string;
  qrCode?: string;
  author?: string;
};

type Blurb = {
  stage: string;   // life stage id (e.g. "early")
  domain: string;  // domain id (e.g. "family")
  projects?: Project[];
};

// Normalization (pure) – converts new nested structure into flat list
function normalizeBlurbs(raw: RawBlurbsFile): Blurb[] {
  const result: Blurb[] = [];
  Object.values(raw).forEach(stageEntry => {
    if (!stageEntry) return;
    const stageId = stageEntry.stage;
    const domainsObj = stageEntry.domains || stageEntry.domain || {};
    Object.entries(domainsObj).forEach(([domainKey, domainValue]) => {
      const projects: Project[] =
        (domainValue.projects || []).map(p => ({
          title: p.title,
          introduction: p.introduction,
            // Maintain existing UI field names
          conclusion: p.conclusion,
          image: p.image?.src,
          image_source: p.image?.cite,
          qrCode: p.qrCode,
          author: p.author
        }));
      result.push({
        stage: stageId,
        domain: domainKey,
        projects
      });
    });
  });
  return result;
}

interface DomainScreenProps {
  stageId: string;
  selectedDomain: string | null;
  onBack?: () => void;
  onSelectDomain?: (domainId: string) => void; // NEW
}

const DomainScreen = ({ stageId, selectedDomain, onBack, onSelectDomain }: DomainScreenProps) => {
  const stage = lifeStages.find((s) => s.id === stageId);

  // Memoize normalization so it is done once (or if JSON changes via HMR)
  const normalizedBlurbs: Blurb[] = useMemo(
    () => normalizeBlurbs(blurbsData as RawBlurbsFile),
    []
  );

  const [projectIndex, setProjectIndex] = useState(0);

  if (!stage) {
    return <div>Stage not found</div>;
  }

  // Select blurbs matching current stage + optional domain
  let matchingBlurbs: Blurb[] = normalizedBlurbs.filter(b => {
    if (b.stage !== stageId) return false;
    if (selectedDomain) return b.domain === selectedDomain;
    return true;
  });

  // If no match for both stage & specific domain (maybe domain not present for stage),
  // fallback to any blurb for that domain across stages.
  if (matchingBlurbs.length === 0 && selectedDomain) {
    matchingBlurbs = normalizedBlurbs.filter(b => b.domain === selectedDomain);
  }

  const activeBlurb = matchingBlurbs[0];
  const projects = activeBlurb?.projects ?? [];

  useEffect(() => {
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
    <div
      style={{ height: '100%' }}
      className="space-y-6"
    >
      {/* Domain switcher */}
      <div className="flex justify-center">
        <DomainButtons
          selectedDomain={selectedDomain}
          onSelect={(id) => onSelectDomain && onSelectDomain(id)}
          selectedStageId={stageId}
        />
      </div>

      {/* Header with project title and arrows */}
      <div className="flex items-center justify-between mb-2">
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
      <motion.div
        key={stageId + (selectedDomain || '')}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4 }}
        tabIndex={0}
        role="region"
        aria-label={`Stage: ${stage.title}`}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 h-view-80">
        <div className="p-4 rounded-xl bg-base-100 text-justify card w-full max-w-3xl bg-base-100 shadow-2xl">
          <div className='card-body'>
            <h3 className="card-title font-medium mb-2">Introduction</h3>
            <p className="text-left text-base-content/80 min-h-24">
              {currentProject?.introduction || '—'}
            </p>
          </div>
        </div>

        <div className="card p-4 w-full max-w-3xl bg-base-100 shadow-2xl rounded-xl flex items-center justify-center">
          <div className='card-body'>
            <figure>
              {currentProject?.image ? (
                <img
                  src={currentProject.image}
                  alt={currentProject.title}
                  className="object-contain"
                />
              ) : (
                <div className="text-base-content/50">No image</div>
              )}
            </figure>
            <p className="card-description font-small">
              Source: {currentProject?.image_source || '—'}
            </p>
          </div>
        </div>

        <div className="card p-4 w-full max-w-3xl bg-base-100 shadow-2xl p-4 rounded-xl bg-base-100 text-left">
          <div className='card-body'>
            <h3 className="card-title font-medium mb-2">Conclusion</h3>
            <p className="text-lg text-base-content/70 min-h-24">
              {currentProject?.conclusion || '—'}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 items-center mt-4">
        <div />
        {onBack && (
          <div className="justify-self-center">
            <button
              className="px-5 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2"
              onClick={onBack}
              aria-label="Go Home"
            >
              <img src="/home_button.svg" alt="Home" className="w-5 h-5" />
              <span>Restart</span>
            </button>
          </div>
        )}
        <div className="justify-self-end">
          {currentProject?.qrCode ? (
            <img
              src={currentProject.qrCode}
              alt="Project QR code"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DomainScreen;
