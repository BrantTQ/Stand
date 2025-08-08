import React, { useState } from "react";
import { motion } from "framer-motion";
import questionsData from "../data/questions.json";
import domainsData from "../data/domains.json";

interface QuestionScreenProps {
  selectedDomain: string;
  onBack: () => void;
  onNext?: () => void; // Add this prop for navigation
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
  color: string;
  icon: string;
  questionId: string[];
};

const QuestionScreen: React.FC<QuestionScreenProps> = ({ selectedDomain, onBack, onNext }) => {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  // Find domain object
  const domainObj: Domain | undefined = domainsData.find(
    (d: Domain) => d.id === selectedDomain
  );

  // Find first matching question for this domain
  let question: Question | undefined;
  if (domainObj) {
    question = questionsData.find((q: Question) =>
      domainObj.questionId.includes(q.id)
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChoice) return;
    if (selectedChoice === question?.answer) {
      alert("Correct! 🎉");
    } else {
      alert(`Incorrect. The correct answer is: ${question?.answer}`);
    }
    if (onNext) {
      onNext();
    }
  };

  if (!question) {
    return (
      <div className="p-8">
        <p>No question available for this domain.</p>
        <button onClick={onBack} className="mt-4 px-3 py-1 rounded bg-gray-200 text-gray-700">
          ← Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <h2 className="text-2xl font-bold mb-4">{question.Title}</h2>
      <p className="mb-6 text-lg">{question.description}</p>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex flex-col gap-3 mb-4">
          {question.choices.map(choice => (
            <motion.button
              key={choice}
              type="button"
              className={`px-4 py-2 rounded border ${selectedChoice === choice ? "bg-blue-500 text-white" : "bg-white text-gray-800 border-gray-300"} transition`}
              onClick={() => setSelectedChoice(choice)}
            >
              {choice}
            </motion.button>
          ))}
        </div>
        <div className="flex gap-4 justify-center mt-6">
          <motion.button
            type="button"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            onClick={onBack}
          >
            ← Back
          </motion.button>
          <motion.button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!selectedChoice}
          >
            Next →
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default QuestionScreen;