import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import questionsData from "../data/questions.json";
import domainsData from "../data/domains.json";
import lifeStages from "../data/lifeStages.json";

interface QuestionScreenProps {
  currentStageId: string;                     // NEW
  selectedDomain: string;
  onSelectDomain: (domainId: string) => void; // NEW
  onBack: () => void;
  onNext?: () => void;
}

type Question = {
  id: string;
  Title: string;
  description: string;
  choices: string[];
  answer: string;
};

type Domain = {
  id: string;
  label: string;
  color?: string;
  icon?: string;
  questionId: string[];
};

const QuestionScreen: React.FC<QuestionScreenProps> = ({
  currentStageId,
  selectedDomain,
  onSelectDomain,
  onBack,
  onNext,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Domain + stage context
  const domainObj: Domain | undefined = (domainsData as Domain[]).find(d => d.id === selectedDomain);
  const stageObj = (lifeStages as Array<{ id: string; title: string; domains?: string[] }>).find(
    s => s.id === currentStageId
  );
  const stageDomainIds = stageObj?.domains ?? [];
  const stageDomains = (domainsData as Domain[]).filter(d => stageDomainIds.includes(d.id));
  const otherDomains = stageDomains.filter(d => d.id !== selectedDomain);

  // Find first matching question for this domain
  const question: Question | undefined =
    domainObj && (questionsData as Question[]).find((q: Question) => domainObj.questionId.includes(q.id));

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
    return (
      <div className="h-full w-full flex items-center justify-center bg-base-200">
        <div className="card w-full max-w-xl bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="alert alert-info">
              <span>No question available for this domain.</span>
            </div>
            <div className="card-actions justify-end">
              <button onClick={onBack} className="btn btn-ghost">← Back</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-3xl bg-base-100 shadow-2xl">
        <div className="card-body">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="card-title text-2xl">{question.Title}</h2>
              <p className="text-base-content/70">{question.description}</p>
            </div>
            <div className="hidden sm:block">
              <span className="badge badge-outline badge-lg" style={accentStyle} title={domainObj?.label}>
                {domainObj?.label ?? "Domain"}
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
                    transition={{ delay: idx * 0.04 }}
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

            <div className="card-actions justify-start mt-6">
              <button type="button" className="btn btn-ghost" onClick={onBack} disabled={isProcessing}>
                ← Back
              </button>
            </div>
          </div>

          {/* Other domains in this stage */}
          {otherDomains.length > 0 && (
            <div className="mt-6">
              <div className="mb-2 text-sm text-base-content/70">
                Other domains in {stageObj?.title ?? "this stage"}
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Current domain shown as disabled for context */}
                <button className="btn btn-sm btn-primary btn-outline" disabled>
                  {domainObj?.icon ? <span className="mr-1">{domainObj.icon}</span> : null}
                  {domainObj?.label ?? selectedDomain}
                </button>

                {otherDomains.map((d) => (
                  <button
                    key={d.id}
                    className="btn btn-sm btn-outline"
                    onClick={() => {
                      setSelectedChoice(null);
                      onSelectDomain(d.id);
                    }}
                    title={d.label}
                  >
                    {d.icon ? <span className="mr-1">{d.icon}</span> : null}
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DaisyUI toast alert */}
      {feedback && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${feedback.type === "success" ? "alert-success" : "alert-error"}`}>
            <span>{feedback.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionScreen;