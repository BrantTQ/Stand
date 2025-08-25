import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import questionsData from "../data/questions.json";
import domainsData from "../data/domains.json";
// import lifeStages from "../data/lifeStages.json";
import blurbsData from "../data/blurbs.json";
import { swapCard } from "../assets/animations/variants";

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

type Domain = {
  id: string;
  label: string;
  color?: string;
  icon?: string;
  // domains.json does not contain question IDs - those live in blurbs.json per stage
};

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  currentStageId,
  selectedDomain,
  // onSelectDomain,
  onBack,
  onNext,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<number | null>(null);
  const autoNavRef = useRef(false); // added: prevent double navigation when no questions

  // Domain + stage context
  const domainObj: Domain | undefined = (domainsData as Domain[]).find(d => d.id === selectedDomain);
  
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

  const accentStyle: React.CSSProperties | undefined = domainObj?.color
    ? { borderColor: domainObj.color, color: domainObj.color }
    : undefined;

  const handleChoiceClick = (choice: string) => {
    if (!question || isProcessing) return;
    setIsProcessing(true);
    setSelectedChoice(choice);

    const correct = choice === question.answer;
    setFeedback({ type: correct ? "success" : "error", message: correct ? "Correct! 🎉" : `Incorrect. The correct answer is: ${question.answer}` });

    if (timerRef.current) window.clearTimeout(timerRef.current);
    // Short delay to show feedback, then advance automatically
    timerRef.current = window.setTimeout(() => {
      setFeedback(null);
      onNext?.();
      setIsProcessing(false);
    }, 800);
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

  return (
    <AnimatePresence mode="wait">
    <div className="h-full w-full flex items-center justify-center bg-base-200">
      <motion.div
          key={question.id}
          variants={swapCard}
          initial="hidden"
          animate="enter"
          exit="exit"
          layout
          className="card w-full max-w-3xl bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex items-start justify-between gap-5">
            <div className="pl-2 space-y-1">
              <h2 className="card-title text-left text-2xl">{question.Title}</h2>
              <p className="text-base-content/70">{question.description}</p>
            </div>
            <div className="hidden sm:block">
              <span className="badge badge-outline badge-lg" style={accentStyle} title={domainObj?.label}>
                {domainObj?.label ?? "Dimension"}
              </span>
            </div>
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
                      <span className="flex-1 text-base">{choice}</span>
                    </div>
                  </motion.label>
                );
              })}
            </div>

            {/* changed: add Skip button that proceeds to DomainScreen */}
            <div className="card-actions border-t border-base-200 pt-3 mt-4 flex flex-col sm:flex-row gap-3">
                <button type="button" className="btn btn-ghost" onClick={onBack} disabled={isProcessing}>
                ← Back
              </button>
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
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}
    </div>
    </AnimatePresence>
  );
};

export default QuestionScreen;