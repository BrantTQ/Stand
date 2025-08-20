import lifeStages from '../data/lifeStages.json';
import blurbsData from '../data/blurbs.json';
import { motion, AnimatePresence } from 'framer-motion'; // UPDATED: add AnimatePresence
import { useEffect, useMemo, useState, useRef } from 'react'; // UPDATED: ensure useRef imported
import DomainButtons from '../components/DomainButtons';
import ExpandableText from '../components/ExpandableText';

// Raw project shape from blurbs.json
type RawProject = {
  title: string;
  introduction: string;
  conclusion: string;
  image?: { src?: string; cite?: string };
  qrCode?: string;
  author?: string;
};

type RawDomainEntry = { projects?: RawProject[] };
type RawStageEntry = {
  stage: string;
  domains?: Record<string, RawDomainEntry>;
  domain?: Record<string, RawDomainEntry>;
};
type RawBlurbsFile = Record<string, RawStageEntry>;

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
  stage: string;
  domain: string;
  projects?: Project[];
};

function normalizeBlurbs(raw: RawBlurbsFile): Blurb[] {
  const result: Blurb[] = [];
  Object.values(raw).forEach(stageEntry => {
    if (!stageEntry) return;
    const stageId = stageEntry.stage;
    const domainsObj = stageEntry.domains || stageEntry.domain || {};
    Object.entries(domainsObj).forEach(([domainKey, domainValue]) => {
      const projects: Project[] = (domainValue.projects || []).map(p => ({
        title: p.title,
        introduction: p.introduction,
        conclusion: p.conclusion,
        image: p.image?.src,
        image_source: p.image?.cite,
        qrCode: p.qrCode,
        author: p.author
      }));
      result.push({ stage: stageId, domain: domainKey, projects });
    });
  });
  return result;
}

interface DomainScreenProps {
  stageId: string;
  selectedDomain: string | null;
  onBack?: () => void;
  onSelectDomain?: (domainId: string) => void;
}

const uniformParagraphClasses =
  'text-lg text-base-content mt-4 max-w-2xl leading-relaxed';

const DomainScreen = ({ stageId, selectedDomain, onBack, onSelectDomain }: DomainScreenProps) => {
  const stage = lifeStages.find(s => s.id === stageId);
  const normalizedBlurbs: Blurb[] = useMemo(
    () => normalizeBlurbs(blurbsData as RawBlurbsFile),
    []
  );
  const [projectIndex, setProjectIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false); // NEW
  const imageCloseBtnRef = useRef<HTMLButtonElement | null>(null); // NEW
  const lastFocusedRef = useRef<HTMLElement | null>(null); // NEW

  if (!stage) return <div>Stage not found</div>;

  let matchingBlurbs: Blurb[] = normalizedBlurbs.filter(b => {
    if (b.stage !== stageId) return false;
    if (selectedDomain) return b.domain === selectedDomain;
    return true;
  });

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
    setProjectIndex(prev => (prev - 1 + projects.length) % projects.length);
  };

  const goNext = () => {
    if (!hasProjects) return;
    setProjectIndex(prev => (prev + 1) % projects.length);
  };

  // Add effect for ESC + focus management (place near other effects):
  useEffect(() => {
    if (!showImageModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lastFocusedRef.current = document.activeElement as HTMLElement;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowImageModal(false);
      }
    };
    window.addEventListener('keydown', onKey);
    // focus close button after mount
    const rAF = requestAnimationFrame(() => {
      imageCloseBtnRef.current?.focus();
    });

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(rAF);
      lastFocusedRef.current?.focus?.();
    };
  }, [showImageModal]);

  return (
    <div style={{ height: '100%' }} className="space-y-6">
      {/* Domain switcher */}
      <div className="flex justify-center">
        <DomainButtons
          selectedDomain={selectedDomain}
            onSelect={(id) => onSelectDomain && onSelectDomain(id)}
          selectedStageId={stageId}
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold">
          {currentProject?.title || 'No content for this stage/domain'}
        </h2>
        {hasProjects && projects.length > 1 && (
          <div className="flex items-center gap-2">
            <button className="btn btn-sm" onClick={goPrev} aria-label="Previous project">←</button>
            <span className="text-sm text-base-content/70">
              {projectIndex + 1} / {projects.length}
            </span>
            <button className="btn btn-sm" onClick={goNext} aria-label="Next project">→</button>
          </div>
        )}
      </div>

      {/* Layout */}
      <motion.div
        key={stageId + (selectedDomain || '') + projectIndex}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.4 }}
        tabIndex={0}
        role="region"
        aria-label={`Stage: ${stage.title}`}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 h-view-80"
      >
        {/* Introduction */}
        <ExpandableText
          heading="Introduction"
          text={currentProject?.introduction}
          modalTitle={
            currentProject?.title
              ? `${currentProject.title} – Introduction`
              : 'Introduction'
          }
          paragraphClassName={uniformParagraphClasses}
        />

        {/* Image */}
        <div className="card p-4 w-full max-w-3xl bg-base-100 shadow-2xl rounded-xl flex items-center justify-center">
          <div className="card-body">
            <figure className="w-full flex flex-col items-center gap-3">
              {currentProject?.image ? (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setShowImageModal(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShowImageModal(true);
                    }
                  }}
                  className="cursor-zoom-in outline-none focus:ring-2 focus:ring-primary rounded-md"
                  aria-label="Open image in larger view"
                >
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="object-contain max-h-60 mx-auto transition-transform duration-200 hover:scale-[1.02]"
                  />
                </div>
              ) : (
                <div className="text-base-content/50">No image</div>
              )}
              <p className="card-description font-small text-center text-sm">
                Source: {currentProject?.image_source || '—'}
              </p>
              {currentProject?.image && (
                <button
                  type="button"
                  className="btn btn-xs btn-outline"
                  onClick={() => setShowImageModal(true)}
                  aria-label="Zoom image"
                >
                  Zoom
                </button>
              )}
            </figure>
          </div>
        </div>

        {/* Conclusion */}
        <ExpandableText
          heading="Conclusion"
          text={currentProject?.conclusion}
          modalTitle={
            currentProject?.title
              ? `${currentProject.title} – Conclusion`
              : 'Conclusion'
          }
          paragraphClassName={uniformParagraphClasses}
        />
      </motion.div>

      {/* Footer */}
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
          {currentProject?.qrCode && (
            <img
              src={currentProject.qrCode}
              alt="Project QR code"
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-contain"
            />
          )}
        </div>
      </div>

      {/* Image Zoom Modal */}
      <AnimatePresence>
        {showImageModal && currentProject?.image && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="image-zoom-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowImageModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Modal content */}
            <motion.div
              className="relative bg-base-100 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { type: 'spring', stiffness: 220, damping: 24 }
              }}
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.18 } }}
            >
              <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-base-300">
                <h3 id="image-zoom-title" className="font-semibold text-lg leading-snug">
                  {currentProject.title || 'Project Image'}
                </h3>
                <button
                  ref={imageCloseBtnRef}
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setShowImageModal(false)}
                  aria-label="Close image modal"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="relative">
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="mx-auto max-h-[70vh] object-contain"
                  />
                </div>
                <p className="mt-4 text-center text-sm text-base-content/70">
                  Source: {currentProject.image_source || '—'}
                </p>
              </div>
              <div className="px-5 py-3 border-t border-base-300 flex justify-end gap-2">
                
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowImageModal(false)}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DomainScreen;
