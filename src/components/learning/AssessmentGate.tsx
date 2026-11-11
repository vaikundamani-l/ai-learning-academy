import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle, RotateCcw, Check, HelpCircle } from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizQuestionItem {
  id: number;
  question: string;
  options: QuizOption[];
}

export interface AssessmentGateProps {
  currentPath: string;
  lessonTitle: string;
  sectionNumber?: number;
  passingScore?: number; // defaults to 80
  questions: QuizQuestionItem[];
  onMasteryUnlocked?: () => void;
}

export const AssessmentGate: React.FC<AssessmentGateProps> = ({
  currentPath,
  lessonTitle,
  sectionNumber = 18,
  passingScore = 80,
  questions,
  onMasteryUnlocked,
}) => {
  const { progress, markLessonCompleted, saveAssessmentScore } = useProgress();

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [assessmentScore, setAssessmentScore] = useState<number | null>(null);

  const completed = progress.completedLessons.includes(currentPath);
  const recordedScore = progress.assessmentScores[currentPath];

  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    if (assessmentSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
  };

  const handleSubmitAssessment = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    setAssessmentScore(scorePct);
    setAssessmentSubmitted(true);
    saveAssessmentScore(currentPath, scorePct);

    if (scorePct >= passingScore && onMasteryUnlocked) {
      onMasteryUnlocked();
    }
  };

  const handleResetAssessment = () => {
    setUserAnswers({});
    setAssessmentSubmitted(false);
    setAssessmentScore(null);
  };

  const isMastered =
    (assessmentScore !== null && assessmentScore >= passingScore) ||
    (recordedScore !== undefined && recordedScore >= passingScore);

  const attemptPassed = assessmentScore !== null && assessmentScore >= passingScore;

  const allAnswered = questions.every((q) => userAnswers[q.id] !== undefined);
  const answeredCount = Object.keys(userAnswers).length;

  return (
    <section id="assessment" className="space-y-6 pt-6 border-t border-surface-border">
      {/* Section Header */}
      <div className="flex items-center space-x-2 text-cyber-emerald font-mono font-semibold text-xs tracking-wider uppercase">
        <Award className="w-4 h-4 text-cyber-emerald" />
        <span>Section {sectionNumber} — Lesson Knowledge Check</span>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
          Lesson Knowledge Check
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed font-sans">
          Check your understanding of {lessonTitle} with these {questions.length} questions. A passing score of <strong>&ge; {passingScore}% ({Math.ceil((passingScore / 100) * questions.length)} of {questions.length} correct)</strong> unlocks lesson completion. Complete the practical exercises as well.
        </p>
      </div>

      {/* Exam Results Score Card */}
      {assessmentSubmitted && (
        <div
          className={`p-5 rounded-xl border space-y-3 transition ${
            attemptPassed
              ? 'bg-cyber-emerald/10 border-cyber-emerald/40 text-cyber-emerald'
              : 'bg-cyber-rose/10 border-cyber-rose/40 text-cyber-rose'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono font-bold text-sm">
              {attemptPassed ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <span>{attemptPassed ? 'Knowledge Check Passed!' : 'Score Threshold Not Reached'}</span>
            </div>
            <span className="text-lg font-mono font-extrabold">{assessmentScore}%</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {attemptPassed
              ? `Congratulations! You scored ${assessmentScore}%, meeting the ${passingScore}% passing requirement for ${lessonTitle}. Your achievement is recorded in progress storage.`
              : `You scored ${assessmentScore}%. An ${passingScore}% score (at least ${Math.ceil((passingScore / 100) * questions.length)} correct questions) is required to pass this check. Review the technical explanations below and retry.`}
          </p>
        </div>
      )}

      {/* Assessment Questions List */}
      <div className="space-y-6">
        {questions.map((q, qIdx) => {
          const selectedOptionIdx = userAnswers[q.id];
          const isAnswered = selectedOptionIdx !== undefined;

          return (
            <div
              key={q.id}
              className="p-5 rounded-xl bg-surface-card border border-surface-border space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="text-xs font-mono font-bold text-cyber-sky">
                  Question {qIdx + 1} of {questions.length}
                </div>
                {assessmentSubmitted && isAnswered && (
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      q.options[selectedOptionIdx]?.isCorrect
                        ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40'
                        : 'bg-cyber-rose/20 text-cyber-rose border border-cyber-rose/40'
                    }`}
                  >
                    {q.options[selectedOptionIdx]?.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-semibold text-slate-100 leading-relaxed font-sans">
                {q.question}
              </h3>

              {/* Options list */}
              <div className="space-y-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  const isSelected = selectedOptionIdx === optIdx;
                  let optionStyle =
                    'bg-surface border-surface-border text-slate-300 hover:bg-surface-elevated hover:text-slate-100';

                  if (assessmentSubmitted) {
                    if (opt.isCorrect) {
                      optionStyle =
                        'bg-cyber-emerald/15 border-cyber-emerald/50 text-cyber-emerald font-semibold';
                    } else if (isSelected && !opt.isCorrect) {
                      optionStyle =
                        'bg-cyber-rose/15 border-cyber-rose/50 text-cyber-rose font-semibold';
                    } else {
                      optionStyle =
                        'bg-surface/50 border-surface-border/50 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle =
                      'bg-cyber-sky/15 border-cyber-sky text-cyber-sky font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={assessmentSubmitted}
                      onClick={() => handleSelectAnswer(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition flex items-start space-x-2.5 ${optionStyle}`}
                    >
                      <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-mono">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Technical explanation post-submission */}
              {assessmentSubmitted && isAnswered && (
                <div className="p-3.5 rounded-lg bg-surface/80 border border-surface-border text-xs leading-relaxed space-y-1">
                  <div className="flex items-center space-x-1.5 font-mono text-[11px] text-cyber-sky font-semibold">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Technical Explanation:</span>
                  </div>
                  <p className="text-slate-300">
                    {q.options.find((o) => o.isCorrect)?.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Assessment Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-card border border-surface-border">
        <div className="text-xs font-mono text-slate-400">
          Progress: <strong className="text-slate-200">{answeredCount} of {questions.length}</strong> answered
        </div>

        <div className="flex items-center space-x-3">
          {assessmentSubmitted ? (
            <>
              <button
                onClick={handleResetAssessment}
                className="px-4 py-2 rounded-lg bg-surface border border-surface-border text-slate-300 hover:text-slate-100 hover:bg-surface-elevated text-xs font-mono transition flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Exam</span>
              </button>

              {isMastered && (
                <button
                  onClick={() => markLessonCompleted(currentPath)}
                  disabled={completed}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition flex items-center space-x-1.5 ${
                    completed
                      ? 'bg-cyber-emerald/20 text-cyber-emerald border border-cyber-emerald/40 cursor-default'
                      : 'bg-cyber-emerald text-void hover:bg-emerald-400 shadow-md shadow-cyber-emerald/20'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{completed ? 'Lesson Completed' : 'Complete Lesson'}</span>
                </button>
              )}
            </>
          ) : (
            <button
              onClick={handleSubmitAssessment}
              disabled={!allAnswered}
              className="px-5 py-2.5 rounded-lg bg-cyber-sky text-void font-bold text-xs font-mono hover:bg-sky-400 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-cyber-sky/20"
            >
              Submit Assessment for Verification
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
