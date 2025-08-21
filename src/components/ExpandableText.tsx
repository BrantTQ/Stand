import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ExpandableTextProps {
  heading: string;
  text?: string;
  emptyPlaceholder?: string;
  cardClassName?: string;
  paragraphClassName?: string;
  modalTitle?: string;
  readMoreLabel?: string;
  closeLabel?: string;
  /** CSS variable name controlling collapsed max height (ignored if collapsedLines used) */
  maxHeightVarName?: string;
  /** Collapse by a number of lines instead of pixel height (applies a line clamp) */
  collapsedLines?: number;
  /** If true, expansion/modal is disabled */
  disableExpand?: boolean;
  /** Custom id root (for accessibility / focus management) */
  idBase?: string;
  /** Add a specific card height utility (defaults to h-150) */
  cardHeightClass?: string;
}

const focusableSelector = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]'
].join(',');

const ExpandableText = ({
  heading,
  text,
  emptyPlaceholder = '—',
  cardClassName = 'h-full flex flex-col',
  paragraphClassName = '',
  modalTitle,
  readMoreLabel = 'Read more',
  closeLabel = 'Close',
  maxHeightVarName = '--expandable-text-max-height',
  collapsedLines,
  disableExpand = false,
  idBase,
  cardHeightClass = 'h-full'
}: ExpandableTextProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const paraRef = useRef<HTMLParagraphElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const baseId = idBase || heading.replace(/\s+/g, '-').toLowerCase();

  const content = (text && text.trim().length > 0) ? text : emptyPlaceholder;

  /** Measure overflow (works for either max-height or line clamp) */
  const measure = useCallback(() => {
    if (!paraRef.current) return;
    const el = paraRef.current;

    // If using line clamp, we can approximate overflow by comparing scrollHeight vs clientHeight.
    if (collapsedLines) {
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
      return;
    }

    const computed = getComputedStyle(el);
    const maxH = parseFloat(computed.maxHeight || '0');
    if (!maxH || computed.maxHeight === 'none') {
      // Fall back to natural overflow test
      setIsOverflowing(el.scrollHeight > el.clientHeight + 1);
    } else {
      setIsOverflowing(el.scrollHeight - 1 > maxH);
    }
  }, [collapsedLines]);

  useLayoutEffect(() => {
    measure();
  }, [text, measure, collapsedLines]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver(() => measure());
    resizeObserver.observe(containerRef.current);
    if (paraRef.current) resizeObserver.observe(paraRef.current);
    return () => resizeObserver.disconnect();
  }, [measure]);

  // Close modal when text changes
  useEffect(() => {
    setShowModal(false);
  }, [text]);

  const openModal = () => {
    if (disableExpand) return;
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // Body scroll lock & focus management
  useEffect(() => {
    if (showModal) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Focus first focusable inside modal after mount
      const timer = requestAnimationFrame(() => {
        if (modalRef.current) {
          const focusables = modalRef.current.querySelectorAll<HTMLElement>(focusableSelector);
            focusables[0]?.focus();
        }
      });

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeModal();
        } else if (e.key === 'Tab') {
          if (!modalRef.current) return;
          const focusables = Array.from(
            modalRef.current.querySelectorAll<HTMLElement>(focusableSelector)
          ).filter(el => el.offsetParent !== null);
          if (focusables.length === 0) {
            e.preventDefault();
            return;
          }
          const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
          let nextIndex = currentIndex;
          if (e.shiftKey) {
            nextIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
          } else {
            nextIndex = currentIndex === focusables.length - 1 ? 0 : currentIndex + 1;
          }
          if (currentIndex === -1) {
            focusables[0].focus();
            e.preventDefault();
            return;
          }
          focusables[nextIndex].focus();
          e.preventDefault();
        }
      };

      window.addEventListener('keydown', onKeyDown);
      return () => {
        cancelAnimationFrame(timer);
        document.body.style.overflow = prevOverflow;
        window.removeEventListener('keydown', onKeyDown);
        // Restore focus
        lastFocusedRef.current?.focus?.();
      };
    }
  }, [showModal]);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative p-2 rounded-xl card w-full max-w-3xl bg-base-100 shadow-2xl ${cardHeightClass} ${cardClassName}`}
        id={`${baseId}-card`}
      >
        <div className="card-body p-2 h-full flex flex-col">
          <h3 className="card-title font-medium mb-1">{heading}</h3>
          <div className="relative flex-1">
            <p
              ref={paraRef}
              id={`${baseId}-paragraph`}
              className={`overflow-hidden pr-1 ${
                isOverflowing && !disableExpand ? 'pb-2' : ''
              } ${paragraphClassName} ${
                collapsedLines
                  ? 'line-clamp-[var(--expandable-line-clamp)]'
                  : ''
              }`}
              style={{
                ...(collapsedLines
                  ? {
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: String(collapsedLines)
                    }
                  : {
                      maxHeight: `var(${maxHeightVarName})`
                    })
              }}
            >
              {content}
            </p>
            {isOverflowing && !disableExpand && (
              <>
                <div
                  className="pointer-events-none absolute mb-1 left-0 right-0 bg-gradient-to-t from-base-100 to-transparent"
                  style={{
                    height: 'var(--expandable-fade-height)',
                    bottom: '2.25rem'
                  }}
                />
                <div className="absolute right-0 bottom-0">
                  <button
                    type="button"
                    onClick={openModal}
                    className="btn rounded-full btn-xs btn-outline"
                    aria-haspopup="dialog"
                    aria-controls={`${baseId}-modal`}
                    aria-label={`Expand full ${heading.toLowerCase()}`}
                  >
                    {readMoreLabel}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && !disableExpand && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${baseId}-modal-title`}
            id={`${baseId}-modal`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={closeModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Modal box */}
            <motion.div
              ref={modalRef}
              className="relative bg-base-100 rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] flex flex-col outline-none"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { type: 'spring', stiffness: 210, damping: 22 }
              }}
              exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.18 } }}
            >
              <div className="px-6 pt-5 pb-3 border-b border-base-300 flex items-start justify-between gap-4">
                <h3
                  id={`${baseId}-modal-title`}
                  className="font-semibold text-lg leading-snug"
                >
                  {modalTitle || heading}
                </h3>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-sm btn-ghost"
                  aria-label={closeLabel}
                >
                  ✕
                </button>
              </div>
              <div className="px-6 py-4 overflow-y-auto">
                <div className="prose max-w-none whitespace-pre-line text-justify">
                  {content}
                </div>
              </div>
              <div className="px-6 py-4 border-t border-base-300 flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn rounded-full btn-primary btn-sm"
                >
                  {closeLabel}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ExpandableText;