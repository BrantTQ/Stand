import lifeStages from '../data/lifeStages.json';
import blurbsData from '../data/blurbs.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState, useRef } from 'react';
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
  'text-sm md:text-sm text-base-content text-justify mt-1 md:mt-1 leading-relaxed';

const DomainScreen = ({ stageId, selectedDomain, onBack, onSelectDomain }: DomainScreenProps) => {
  const stage = lifeStages.find(s => s.id === stageId);
  const normalizedBlurbs: Blurb[] = useMemo(
    () => normalizeBlurbs(blurbsData as RawBlurbsFile),
    []
  );

  const [projectIndex, setProjectIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const imageCloseBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  if (!stage) return <div>Stage not found</div>;

  // Select blurbs
  let matchingBlurbs = normalizedBlurbs.filter(b => {
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

  // Image modal accessibility
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
    const rAF = requestAnimationFrame(() => imageCloseBtnRef.current?.focus());
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      cancelAnimationFrame(rAF);
      lastFocusedRef.current?.focus?.();
    };
  }, [showImageModal]);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* New grid: header (row1), domain buttons (row2), cards (row3), footer (row4) */}
      <div
        className="
          grid gap-3 md:gap-4 flex-1 min-h-0
          grid-cols-1
          lg:grid-cols-3
          grid-rows-[auto_auto_1fr_auto]
        "
      >
        
        {/* Row 1: Horizontal Domain Buttons (spans all columns) */}
        <div className="col-span-1 lg:col-span-3">
          <DomainButtons
            selectedDomain={selectedDomain}
            onSelect={id => onSelectDomain && onSelectDomain(id)}
            selectedStageId={stageId}
            size="xs"
            orientation="row"
            className="justify-start"
          />
        </div>

        {/* Row 2: Header (spans all columns) */}
        <div className="col-span-1 lg:col-span-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-1">
            <h2 className="text-lg md:text-xl font-semibold text-center lg:text-left px-2 lg:px-0">
              {currentProject?.title || 'No content for this stage/domain'}
            </h2>
            {hasProjects && projects.length > 1 && (
              <div className="flex items-center gap-2 justify-center mt-2 lg:mt-0">
                <button className="btn btn-xs md:btn-sm" onClick={goPrev} aria-label="Previous project">
                  ←
                </button>
                <span className="text-xs md:text-sm text-base-content/70">
                  {projectIndex + 1} / {projects.length}
                </span>
                <button className="btn btn-xs md:btn-sm" onClick={goNext} aria-label="Next project">
                  →
                </button>
              </div>
            )}
          </div>
        </div>
        

        {/* Row 3: Content cards (3 columns on lg) */}
        <motion.div
          key={'intro-' + projectIndex + stageId + selectedDomain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col min-h-0"
        >
          <ExpandableText
            heading="Introduction"
            text={currentProject?.introduction}
            modalTitle={
              currentProject?.title
                ? `${currentProject.title} – Introduction`
                : 'Introduction'
            }
            paragraphClassName={uniformParagraphClasses}
            cardClassName="h-full flex flex-col"
            cardHeightClass="h-full"
          />
        </motion.div>

        <motion.div
          key={'image-' + projectIndex + stageId + selectedDomain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-col min-h-0"
        >
          <div className="card p-1 md:p-2 w-full h-full bg-base-100 shadow-2xl rounded-xl flex flex-col">
            <div className="card-body p-1 md:p-2 flex-1 flex flex-col items-center justify-center min-h-0">
              <figure className="w-full flex flex-col items-center gap-2 flex-1 justify-center">
                {currentProject?.image ? (
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => setShowImageModal(true)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault(); setShowImageModal(true);
                      }
                    }}
                    className="cursor-zoom-in outline-none focus:ring-2 focus:ring-primary rounded-md"
                    aria-label="Open image in larger view"
                  >
                    <img
                      src={currentProject.image}
                      alt={currentProject.title}
                      className="object-contain max-h-48 md:max-h-56 mx-auto transition-transform duration-200 hover:scale-[1.03]"
                    />
                  </div>
                ) : <div className="text-base-content/50">No image</div>}
                <p className="card-description font-small text-center text-[11px] md:text-xs">
                  Source: {currentProject?.image_source || '—'}
                </p>
                {currentProject?.image && (
                  <button
                    type="button"
                    className="btn rounded-full btn-xs btn-outline"
                    onClick={() => setShowImageModal(true)}
                    aria-label="Zoom image"
                  >Zoom</button>
                )}
              </figure>
            </div>
          </div>
        </motion.div>

        <motion.div
          key={'concl-' + projectIndex + stageId + selectedDomain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col min-h-0"
        >
          <ExpandableText
            heading="Conclusion"
            text={currentProject?.conclusion}
            modalTitle={
              currentProject?.title
                ? `${currentProject.title} – Conclusion`
                : 'Conclusion'
            }
            paragraphClassName={uniformParagraphClasses}
            cardClassName="h-full flex flex-col"
            cardHeightClass="h-full"
          />
        </motion.div>

        {/* Row 4: Footer controls (Restart + QR) */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-3 items-end mt-1">
          <div className="justify-start" />
          {onBack ? (
            <div className="col-span-1 grid grid-cols-3 mb-4">
              <div className="justify-self-start"/>
              <div className="flex justify-center items-center gap-2">
              <button
                className="btn btn-sm px-3 py-1.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 flex items-center gap-2"
                onClick={onBack}
                aria-label="Go Home"
              >
                <img src="/home_button.svg" alt="Home" className="w-4 h-4" />
                <span>Restart</span>
              </button>
              </div>
              <div />
            </div>
          ) : <div />}
          
            <div className="justify-self-end">
            {currentProject?.qrCode && (
              <img
                src={currentProject.qrCode}
                alt="Project QR code"
                className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            )}
          </div>
        </div>
      </div>

      {/* Image Zoom Modal (unchanged) */}
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
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowImageModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-base-100 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } }}
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.18 } }}
            >
              <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-base-300">
                <h3 id="image-zoom-title" className="font-semibold text-lg leading-snug">
                  {currentProject?.title || 'Project Image'}
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
                <img
                  src={currentProject?.image}
                  alt={currentProject?.title}
                  className="mx-auto max-h-[70vh] object-contain"
                />
                <p className="mt-4 text-center text-sm text-base-content/70">
                  Source: {currentProject?.image_source || '—'}
                </p>
              </div>
              <div className="px-5 py-3 border-t border-base-300 flex justify-end gap-2">
                {/* <button
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => window.open(currentProject?.image, '_blank', 'noopener')}
                >
                  Open original
                </button> */}
                <button
                  type="button"
                  className="btn rounded-full btn-sm btn-primary"
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
