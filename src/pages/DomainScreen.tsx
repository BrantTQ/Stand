import lifeStages from '../data/lifeStages.json';
import blurbsData from '../data/blurbs.json';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState, useRef } from 'react';
import DomainButtons from '../components/DomainButtons';
import ExpandableText from '../components/ExpandableText';
import { trackProjectStart, trackProjectEnd } from '../analytics';

// Raw project shape from blurbs.json (updated to reflect new shapes)
type RawProject = {
  id?: string;  
  title?: string;
  introduction?: string;
  conclusion?: string;
  // some entries use an object { src, cite }, others may use a plain string
  image?: { src?: string; cite?: string } | string;
  qrCode?: string;
  // author can be a string or an array of strings
  author?: string | string[];
};

type RawDomainEntry = {
  projects?: RawProject[];
  // new: domain entries can include questions array
  questions?: string[];
};

type RawStageEntry = {
  stage: string;
  // some stage objects use `domains`, others use `domain`
  domains?: Record<string, RawDomainEntry>;
  domain?: Record<string, RawDomainEntry>;
};

type RawBlurbsFile = Record<string, RawStageEntry>;

// Normalized shapes used by the component
type Project = {
  id: string; // always present after normalization
  title?: string;
  introduction?: string;
  conclusion?: string;
  image?: string;
  image_source?: string;
  // normalize qrCode to an array (0..2 entries)
  qrCode?: string[];
  author?: string;
};

type Blurb = {
  stage: string;
  domain: string;
  projects?: Project[];
  // carry over domain-level question ids when present
  questions?: string[];
};

function normalizeBlurbs(raw: RawBlurbsFile): Blurb[] {
  const result: Blurb[] = [];
  Object.values(raw).forEach(stageEntry => {
    if (!stageEntry) return;
    const stageId = stageEntry.stage;
    const domainsObj = stageEntry.domains || stageEntry.domain || {};
    Object.entries(domainsObj).forEach(([domainKey, domainValue]) => {
      const projects: Project[] = (domainValue.projects || []).map((p, idx) => {
        const imageSrc = typeof p.image === 'string' ? p.image : p.image?.src;
        const imageSource = typeof p.image === 'object' ? p.image?.cite : undefined;
        const authorNormalized = Array.isArray(p.author) ? p.author.join(', ') : p.author;
        let qr: string[] | undefined;
        if (Array.isArray(p.qrCode)) {
          qr = p.qrCode.filter(Boolean).slice(0, 2);
        } else if (typeof p.qrCode === 'string' && p.qrCode.trim() !== '') {
          qr = [p.qrCode];
        } else {
          qr = undefined;
        }
        return {
          id: (p as any).id ?? `${stageId}:${domainKey}:${idx}`, // NEW: carry id or fallback
          title: p.title,
          introduction: p.introduction,
          conclusion: p.conclusion,
          image: imageSrc,
          image_source: imageSource,
          qrCode: qr,
          author: authorNormalized,
        };
      });
      result.push({
        stage: stageId,
        domain: domainKey,
        projects,
        questions: Array.isArray(domainValue.questions) ? domainValue.questions.slice() : undefined,
      });
    });
  });
  return result;
}

interface DomainScreenProps {
  stageId: string;
  selectedDomain: string | null;
  onBack?: () => void;
  onSelectDomain?: (domainId: string) => void;
  onExitToAttract?: () => void; // NEW: exit to attract screen
}

const uniformParagraphClasses =
  'text-[15px] text-slate-600 text-justify mt-1 md:mt-1 leading-relaxed px-3 md:px-3';

const DomainScreen = ({ stageId, selectedDomain, onBack, onSelectDomain, onExitToAttract }: DomainScreenProps) => {
  const stage = lifeStages.find(s => s.id === stageId);
  const normalizedBlurbs: Blurb[] = useMemo(
    () => normalizeBlurbs(blurbsData as unknown as RawBlurbsFile),
    []
  );

  const [projectIndex, setProjectIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
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
  const hasProjects = projects.length > 0;
  const currentProject: Project | undefined = hasProjects ? projects[projectIndex] : undefined;

  useEffect(() => {
    setProjectIndex(0);
  }, [stageId, selectedDomain, activeBlurb]);

  

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


  // NEW: per-project timing refs
  const projectEnterRef = useRef<number | null>(null);
  const lastProjectIdRef = useRef<string | null>(null);
   useEffect(() => {
    if (!hasProjects || !selectedDomain) return;

    const projId = currentProject?.id ?? `${stageId}:${selectedDomain}:${projectIndex}`;

    // If we were timing a different project, end it
    if (
      lastProjectIdRef.current &&
      lastProjectIdRef.current !== projId &&
      projectEnterRef.current !== null
    ) {
      const durationMs = Date.now() - projectEnterRef.current;
      trackProjectEnd(stageId, selectedDomain, lastProjectIdRef.current, durationMs);
      projectEnterRef.current = null;
      lastProjectIdRef.current = null;
    }

    // Start timing the current project if not already started
    if (projId && projectEnterRef.current === null) {
      projectEnterRef.current = Date.now();
      lastProjectIdRef.current = projId;
      trackProjectStart(stageId, selectedDomain, projId, projectIndex);
    }
  }, [stageId, selectedDomain, projectIndex, hasProjects, currentProject?.id]);

  // NEW: cleanup on unmount to close any open timing
  useEffect(() => {
    return () => {
      if (selectedDomain && lastProjectIdRef.current && projectEnterRef.current !== null) {
        const durationMs = Date.now() - projectEnterRef.current;
        trackProjectEnd(stageId, selectedDomain, lastProjectIdRef.current, durationMs);
      }
    };
  }, [stageId, selectedDomain]);
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* New grid: header (row1), domain buttons (row2), cards (row3), footer (row4) */}
      <div
        className="
          grid gap-3 flex-1 min-h-0
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
          <div className="flex flex-col px-3 lg:flex-row lg:items-center lg:justify-between mb-1">
            <h2 className="text-lg text-slate-800 md:text-xl font-semibold text-center lg:text-left px-4 lg:px-0">
              {currentProject?.title || 'No content for this stage/domain'}
            </h2>
            {onBack ? (
            <div className="col-span-1 grid grid-cols-3 mb-1">
              <div className="justify-self-start"/>
              <div/>
               
              
              <div className="flex justify-end items-center gap-2">
                {/* Restart: immediate return to stage selection (no confirm) */}
                <button
                  className="btn btn-sm px-3 py-1.5 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 flex items-center gap-2"
                  onClick={onBack}
                  aria-label="Go to stage selection"
                >
                  <img src="/home_button.svg" alt="Home" className="w-4 h-4" />
                  <span>Restart</span>
                </button>

                {/* Exit: ask for confirmation before going to attract screen */}
                <button
                  className="btn btn-sm px-3 py-1.5 rounded-full btn-error text-white text-sm font-medium focus:outline-none focus:ring-2 flex items-center gap-2"
                  onClick={() => setShowExitConfirm(true)}
                  aria-label="Exit to attract screen"
                  disabled={!onExitToAttract}
                >
                  ✕
                  <span>Exit</span>
                </button>
                </div>
            </div>
          ) : <div />}
          </div>
        </div>
        

        {/* Row 3: Content cards (3 columns on lg) */}
        <motion.div
          className="col-span-1 lg:col-span-3 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 min-h-0"
          drag={hasProjects && projects.length > 1 ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 28, mass: 0.9 }}
          whileDrag={{ scale: 0.995, cursor: 'grabbing' }}
          onDragEnd={(_e, info) => {
            const offsetX = info.offset.x;
            const velocityX = info.velocity.x;
            const swipePower = Math.abs(offsetX) * 0.35 + Math.abs(velocityX);
            if (swipePower > 120) {
              if (offsetX < 0) {
          goNext();
              } else {
          goPrev();
              }
            }
          }}
          aria-label="Swipe left or right to change project"
          style={{ touchAction: 'pan-y', willChange: 'transform' }}
        >
        <motion.div
          key={'intro-' + projectIndex + stageId + selectedDomain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col min-h-0 mb-1"
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
            cardClassName="flex flex-col"
            cardHeightClass="h-full"
          />
        </motion.div>

        <motion.div
          key={'image-' + projectIndex + stageId + selectedDomain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="flex flex-col min-h-auto mb-1"
        >
          <div className="card grid grid-cols-1 gap-1 border-1 border-base-300 w-full h-full bg-base-100 shadow-xl rounded-xl">
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
              className="cursor-zoom-in outline-none rounded-xl w-full border-base-300"
              aria-label="Open image in larger view"
            >
              <img
                src={currentProject.image}
                alt={currentProject.title}
                className="object-cover max-h-48 md:max-h-60 w-full min-h-56 border-base-300 transition-transform rounded-xl duration-200 hover:scale-[1.01]"
              />
            </div>
          ) : <div className="text-base-content/50">No image</div>}
          <div className="card-description p-2">
          <p className=" font-small text-center text-xs">
            {currentProject?.image_source ? <span>Source: {currentProject.image_source}</span> : ''}
          </p>
          </div>
          <div/>
          <div className="card-actions items-center justify-center">
          {currentProject?.image && (
            <button
              type="button"
              className="btn rounded-full btn-sm w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
              onClick={() => setShowImageModal(true)}
              aria-label="Zoom image"
            >View</button>
          )}
          </div>
  </div>
        </motion.div>

        <motion.div
          key={'concl-' + projectIndex + stageId + selectedDomain}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col min-h-0 mb-1"
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
        </motion.div>

        {/* Row 4: Footer controls */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-3 items-end">
            <div className="justify-self-start py-2 pl-2">
            {(() => {
              const author = currentProject?.author?.trim();
              if (!author) return null;
              const parts = author.split(/\s*(?:,|&|\band\b)\s*/i).filter(Boolean);
              const label = parts.length > 1 ? 'Authors' : 'Author';
              return (
              <div className="text-left text-xs md:text-sm text-base-content/70">
                <strong>{label}: </strong>
                <p className="text-left">{author}</p>
              </div>
              );
            })()}
            </div>
            <div className="flex items-center gap-0 justify-center mb-4 py-2 lg:mt-0">
            {hasProjects && projects.length > 1 ? (
              <>
              <button className="btn bg-transparent border-0 btn-xs md:btn-sm p-1" onClick={goPrev} aria-label="Previous project">
                <img src="/back.png" alt="Previous" className="w-12 h-12" />
              </button>
              <span className="text-xs md:text-sm text-base-content/70">
                {projectIndex + 1} / {projects.length}
              </span>
              <button className="btn bg-transparent border-0 btn-xs md:btn-sm p-1" onClick={goNext} aria-label="Next project">
               <img src="/next.png" alt="Next" className="w-12 h-12" />
              </button>
              </>
            ) : (
              <>
              <button className="btn btn-xs md:btn-sm invisible" aria-hidden>
                <img src="/back.png" alt="Previous" className="w-3 h-3" />
              </button>
              <span className="text-xs md:text-sm text-base-content/70 invisible">0 / 0</span>
              <button className="btn btn-xs md:btn-sm invisible" aria-hidden>
                <img src="/next.png" alt="Next" className="w-3 h-3" />
              </button>
              </>
            )}
            </div>
          <div className="justify-self-end flex items-center gap-2">
            {currentProject?.qrCode && (
              <span className="text-xs md:text-sm text-base-content/70">
                Scan QR Code for more info:
              </span>
            )}
            {currentProject?.qrCode?.map((code, i) => (
              <img
          key={i}
          src={code}
          alt={`Project QR code ${i + 1}`}
          className="w-16 h-16 md:w-20 md:h-20 object-contain"
              />
            ))}
          </div>
        </div>
      </div>

      {/* NEW: Exit confirmation modal (replaces previous restart modal) */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-confirm-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowExitConfirm(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="relative bg-base-100 rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 220, damping: 24 } }}
              exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.18 } }}
            >
              <div className="px-5 pt-4 pb-3 border-b border-base-300">
                <h3 id="exit-confirm-title" className="font-semibold text-lg">
                  Exit to attract screen?
                </h3>
                <p className="mt-1 text-sm text-base-content/70">
                  You’ll leave the current view and return to the attract screen.
                </p>
              </div>
              <div className="px-5 py-3 flex justify-end gap-2">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setShowExitConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-error text-white"
                  onClick={() => {
                    setShowExitConfirm(false);
                    onExitToAttract?.();
                  }}
                >
                  Yes, exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="flex-1 overflow-auto p-2">
                <img
                  src={currentProject?.image}
                  alt={currentProject?.title}
                  className="mx-auto max-h-[70vh] object-contain"
                />
                <p className="mt-2 text-center text-sm text-base-content/70">
                   {currentProject?.image_source ? <span>Source: {currentProject.image_source}</span> : ''}
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
                  className="btn btn-sm rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium"
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
