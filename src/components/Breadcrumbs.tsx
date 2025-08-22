import lifeStages from "../data/lifeStages.json";
import domainsData from "../data/domains.json";

interface BreadcrumbsProps {
  currentStageId: string | null;
  setCurrentStageId: (id: string | null) => void;
  selectedDomain: string | null;
  setSelectedDomain: (id: string | null) => void;
  showQuestion: boolean;
  setShowQuestion: (show: boolean) => void;
}

export default function Breadcrumbs({
  currentStageId,
  setCurrentStageId,
  selectedDomain,
  setSelectedDomain,
  showQuestion,
  setShowQuestion
}: BreadcrumbsProps) {
  const stageTitle = currentStageId
    ? lifeStages.find(s => s.id === currentStageId)?.title || "Stage"
    : null;

  const domainLabel = selectedDomain
    ? (domainsData as Array<{ id: string; label: string }>).find(d => d.id === selectedDomain)?.label ?? selectedDomain
    : null;

  return (
    <nav
      aria-label="breadcrumb"
      className="pl-4 flex justify-start items-start"
    >
      <div className="breadcrumbs text-base">
        <ul>
          <li>
            <button
              className={`link link-hover ${!currentStageId ? "font-semibold text-primary" : ""}`}
              onClick={() => {
                setCurrentStageId(null);
                setSelectedDomain(null);
                setShowQuestion(false);
              }}
            >
              Home
            </button>
          </li>

          {stageTitle && (
            <li>
              <button
                className={`link link-hover ${
                  currentStageId && !selectedDomain ? "font-semibold text-primary" : ""
                }`}
                onClick={() => {
                  setSelectedDomain(null);
                  setShowQuestion(false);
                }}
              >
                {stageTitle}
              </button>
            </li>
          )}

          {domainLabel && (
            <li>
              <button
                className={`link link-hover ${showQuestion ? "font-semibold text-primary" : ""}`}
                onClick={() => setShowQuestion(false)}
              >
                {domainLabel}
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}