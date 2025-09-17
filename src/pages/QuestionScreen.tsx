import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import questionsData from "../data/questions.json";
import blurbsData from "../data/blurbs.json";
import { swapCard } from "../assets/animations/variants";
import { trackQuestionAnswered } from "../analytics"; // <-- added

interface QuestionScreenProps {
  currentStageId: string;
  selectedDomain: string;
  onSelectDomain: (domainId: string) => void; 
  onBack: () => void;
  onNext?: () => void;
}

type QuestionFromMap = {
  question: string;
  choices: string[];
  answer: string;
};

type Question = {
  id: string;
  Title: string;
  description?: string;
  choices: string[];
  answer: string;
};


const triggerConfetti = async () => {
  try {
    // Prefer dynamic import of npm package (tree-shake friendly)
    const { default: confetti } = await import("canvas-confetti");
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      ticks: 250
    });
  } catch {
    // Fallback to global (if you include a CDN <script> that exposes window.confetti)
    const anyWin = window as any;
    if (typeof anyWin.confetti === "function") {
      anyWin.confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        ticks: 250
      });
    }
  }
};

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  currentStageId,
  selectedDomain,
  // onSelectDomain,
  // onBack,
  onNext,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNavRef = useRef(false); // added: prevent double navigation when no questions

  
  const questionsMap = questionsData as Record<string, QuestionFromMap>;

  // Read question ids for the current stage + domain from blurbs.json
  const domainQuestionIds: string[] = React.useMemo(() => {
    try {
      const stage = (blurbsData as Record<string, any>)[currentStageId];
      const domain = stage?.domains?.[selectedDomain];
      const q = domain?.questions;
      if (Array.isArray(q) && q.length > 0) return q;
    } catch {
      // fall through to empty
    }
    return [];
  }, [currentStageId, selectedDomain]);

  // Randomly select one question id if there are multiple for the domain
  const selectedQuestionId = React.useMemo(() => {
    if (!domainQuestionIds || domainQuestionIds.length === 0) return undefined;
    if (domainQuestionIds.length === 1) return domainQuestionIds[0];
    const idx = Math.floor(Math.random() * domainQuestionIds.length);
    return domainQuestionIds[idx];
  }, [selectedDomain, currentStageId, domainQuestionIds]);

  // Build the Question object used by the component
  const question: Question | undefined = React.useMemo(() => {
    if (!selectedQuestionId) return undefined;
    const q = questionsMap[selectedQuestionId];
    if (!q) return undefined;
    return {
      id: selectedQuestionId,
      Title: q.question,
      description: undefined,
      choices: q.choices,
      answer: q.answer,
    };
  }, [selectedQuestionId, questionsMap]);

  // Reset selected choice/feedback when the question changes
  useEffect(() => {
    setSelectedChoice(null);
    setFeedback(null);
    setIsProcessing(false);
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [question?.id]);

  // added: Auto-navigate to DomainScreen if there are no questions for this domain,
  // or the selected question id is invalid for some reason.
  useEffect(() => {
    if (autoNavRef.current) return;
    const noQuestions = !domainQuestionIds || domainQuestionIds.length === 0;
    const invalidSelection = selectedQuestionId && !questionsMap[selectedQuestionId];
    if (noQuestions || invalidSelection) {
      autoNavRef.current = true;
      onNext?.();
    }
  }, [domainQuestionIds, selectedQuestionId, questionsMap, onNext]);

  // Limit to 4 choices but always include the correct answer
  const displayedChoices: string[] = React.useMemo(() => {
    if (!question) return [];
    const source = Array.from(new Set(question.choices)); // de-dupe defensively
    let subset = source.slice(0, 4);
    if (!subset.includes(question.answer) && source.includes(question.answer)) {
      // Replace last one to guarantee the correct answer is present
      if (subset.length < 4) {
        subset.push(question.answer);
      } else {
        subset[subset.length - 1] = question.answer;
      }
    }
    // Optional: stable order; skip shuffling for now
    return subset.slice(0, 4);
  }, [question]);


  const handleChoiceClick = (choice: string) => {
    if (!question || isProcessing) return;
    setIsProcessing(true);
    setSelectedChoice(choice);

    const correct = choice === question.answer;

    // --- NEW: analytics event ---
    try {
      const selectedOptionIndex = displayedChoices.findIndex(c => c === choice);
      trackQuestionAnswered({
        stageId: currentStageId,
        domainId: selectedDomain,
        questionId: question.id,
        correct,
        selectedOptionIndex: selectedOptionIndex >= 0 ? selectedOptionIndex : undefined,
        totalOptions: displayedChoices.length
      });
    } catch {
      // swallow analytics errors
    }

    // --- NEW: persist running counts in localStorage ---
    try {
      const keyCorrect = "quiz.correctCount";
      const keyWrong = "quiz.wrongCount";
      if (correct) {
        const v = parseInt(localStorage.getItem(keyCorrect) || "0", 10) + 1;
        localStorage.setItem(keyCorrect, String(v));
      } else {
        const v = parseInt(localStorage.getItem(keyWrong) || "0", 10) + 1;
        localStorage.setItem(keyWrong, String(v));
      }
    } catch {
      // ignore storage issues
    }

    // Fire confetti on correct answer
    if (correct) {
      triggerConfetti();
    }

    setFeedback({
      type: correct ? "success" : "error",
      message: correct ? "Bravo!" : `The correct answer is: ${question.answer}`
    });

    if (timerRef.current) window.clearTimeout(timerRef.current);
    // Short delay to show feedback, then advance automatically
    timerRef.current = window.setTimeout(() => {
      setFeedback(null);
      onNext?.();
      setIsProcessing(false);
    }, 4000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  if (!question) {
    // changed: silently go straight to DomainScreen (handled by effect above)
    return null;
  }

  const content = (question.Title && question.Title.trim().length > 0) ? question.Title : '_No question available_';
  return (
    <AnimatePresence mode="wait">
    <div className="relative h-full w-full flex items-center justify-center bg-base-200">
      <motion.div
          key={question.id}
          variants={swapCard}
          initial="hidden"
          animate="enter"
          exit="exit"
          layout
          className="card w-full max-w-3xl bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex">
            <div className="text-base-content/80 font-medium text-xl text-justify pl-2 space-y-1" 
            dangerouslySetInnerHTML={{ __html: content }}
            />
              {/* <h2 className="card-title text-left text-2xl">{question.Title}</h2> */}
              {/* <p className="text-base-content/80 font-medium text-2xl text-justify">{question.Title}</p> */}
              
            {/* <div className="hidden sm:block">
              <span className="badge badge-outline badge-lg" style={accentStyle} title={domainObj?.label}>
                {domainObj?.label ?? "Dimension"}
              </span>
            </div> */}
          </div>

          <div className="mt-4">
            <div className="flex flex-col gap-3">
              {displayedChoices.map((choice, idx) => {
                const checked = selectedChoice === choice;
                return (
                  <motion.label
                    key={`${choice}-${idx}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="form-control cursor-pointer"
                    onClick={() => handleChoiceClick(choice)}
                  >
                    <div
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors
                      ${checked ? "border-primary bg-primary/10" : "border-base-300 hover:border-base-400"}
                    `}
                    >
                      <input
                        type="radio"
                        name="choice"
                        className="radio radio-primary"
                        checked={checked}
                        onChange={() => handleChoiceClick(choice)}
                        disabled={isProcessing}
                        aria-label={choice}
                      />
                      <span className="flex-1 text-base font-medium text-justify">{choice}</span>
                    </div>
                  </motion.label>
                );
              })}
            </div>

            {/* changed: add Skip button that proceeds to DomainScreen */}
            <div className="card-actions border-t border-base-200 pt-3 mt-4 flex flex-col sm:flex-row gap-3">
                {/* <button type="button" className="btn btn-ghost" onClick={onBack} disabled={isProcessing}>
                ← Back
              </button> */}
              <div className="flex-1" />
              <button type="button" className="btn rounded-full border border-transparent bg-gray-200 text-gray-700" 
              onClick={() => onNext?.()}
                disabled={isProcessing}>
                Skip
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* DaisyUI toast alert */}
      {feedback && (
        <div role="alert" className="absolute w-1/2 top-0">
          {feedback.type === "success" ? (<div className="bg-teal-50 border-t-2 border-teal-500 rounded-lg p-4 dark:bg-teal-800/30" role="alert" aria-labelledby="hs-bordered-success-style-label">
    <div className="flex">
      <div className="shrink-0">
        {/* Icon */}
        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-teal-100 bg-teal-200 text-teal-800 dark:border-teal-900 dark:bg-teal-800 dark:text-teal-400">
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </span>
        {/* End Icon */}
      </div>
      <div className="ms-3">
        <h3 id="hs-bordered-success-style-label" className="text-gray-800 font-semibold dark:text-white">
          Correct.
        </h3>
        <p className="text-md text-gray-700 dark:text-neutral-400">
          {feedback.message}
        </p>
      </div>
    </div>
  </div>
     ):(<div className="bg-red-50 border-s-4 border-red-500 p-4 dark:bg-red-800/30" role="alert" aria-labelledby="hs-bordered-red-style-label">
    <div className="flex">
      <div className="shrink-0">
        {/* Icon */}
        <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
          <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </span>
        {/* End Icon */}
      </div>
      <div className="ms-3">
        <h3 id="hs-bordered-red-style-label" className="text-gray-800 font-semibold dark:text-white">
          Sorry!
        </h3>
        <p className="text-md text-gray-700 dark:text-neutral-400">
          {feedback.message}
        </p>
      </div>
    </div>
  </div>)}
  
  
</div>
      )}

      {/* {feedback && (
        <div
          role="alert"
          className="toast fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
        >
          <div
            className={`alert ${feedback.type === "success" ? "alert-success" : "alert-error"}`}
          >
            <span>{feedback.message}</span>
          </div>
        </div>
      )} */}
    </div>
    </AnimatePresence>
  );
};

export default QuestionScreen;