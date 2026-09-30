import React, { useEffect, useRef, useState } from 'react';
import { DiagnosticQuestion } from '../../types';
import { getShuffledDiagnostic } from '../../lib/shuffle';
import { getOfflineDiagnosticQuestions } from '../../lib/questionRepository';
import { DiagnosticAnswerRecord } from '../../types';

interface DiagnosticScreenProps {
  onComplete: (results: DiagnosticAnswerRecord[]) => void;
  onExit: () => void;
  isHindi: boolean;
}

export const DiagnosticScreen: React.FC<DiagnosticScreenProps> = ({
  onComplete,
  onExit,
  isHindi,
}) => {
  // Questions are loaded from IndexedDB. The repository seeds IndexedDB from
  // the bundled question bank on first use, so this screen does not require
  // Supabase, n8n, Gemini, or an internet connection.
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;

  useEffect(() => {
    let active = true;
    getOfflineDiagnosticQuestions()
      .then((items) => {
        if (active) setQuestions(getShuffledDiagnostic(items));
      })
      .catch((error) => {
        if (active) setLoadError(error instanceof Error ? error.message : 'Could not load questions.');
      });
    return () => { active = false; };
  }, []);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [confidence, setConfidence] = useState<Record<number, 'low' | 'medium' | 'high'>>({});
  const questionStartedAt = useRef<Record<number, number>>({});

  useEffect(() => {
    if (currentQ && questionStartedAt.current[currentIndex] === undefined) {
      questionStartedAt.current[currentIndex] = Date.now();
    }
  }, [currentIndex, currentQ]);

  if (loadError) {
    return (
      <div className="bg-surface-container-lowest border border-rose-200 rounded-2xl p-5 text-center">
        <h2 className="font-display text-primary font-bold">Could not load the offline question bank</h2>
        <p className="text-sm text-on-surface-variant mt-2">{loadError}</p>
        <button type="button" onClick={onExit} className="mt-4 px-4 py-2 rounded-xl bg-secondary text-white font-bold">Back</button>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-5 text-center">
        <div className="animate-pulse text-primary font-bold">Loading offline question bank…</div>
        <p className="text-xs text-on-surface-variant mt-2">Questions are being prepared locally on this device.</p>
      </div>
    );
  }
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;
  const isAnswered = answers[currentIndex] !== undefined;
  const hasConfidence = confidence[currentIndex] !== undefined;

  const handleSelect = (optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
  };

  const handleNext = () => {
    if (!isAnswered || !hasConfidence) return;
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const results: DiagnosticAnswerRecord[] = questions.map((q, idx) => {
        const selectedIndex = answers[idx];
        const itemConfidence = confidence[idx] ?? 'medium';
        const responseTimeMs = Math.max(0, Date.now() - (questionStartedAt.current[idx] ?? Date.now()));
        const difficulty = q.difficulty ?? 2;
        const confidenceMultiplier = selectedIndex === q.correctIndex
          ? ({ low: 0.55, medium: 0.8, high: 1 } as const)[itemConfidence]
          : ({ low: 0, medium: 0.12, high: 0.22 } as const)[itemConfidence];
        const fastGuessPenalty = responseTimeMs < 4000 && itemConfidence === 'low' ? 0.55 : responseTimeMs < 2500 ? 0.8 : 1;
        const difficultyBonus = difficulty === 3 ? 1.08 : difficulty === 2 ? 1.02 : 0.95;
        const evidenceScore = Math.max(0, Math.min(1, confidenceMultiplier * fastGuessPenalty * difficultyBonus));
        return {
          questionId: q.id,
          topic: q.topic,
          topicHi: q.topicHi,
          selectedIndex,
          correctIndex: q.correctIndex,
          isCorrect: selectedIndex === q.correctIndex,
          confidence: itemConfidence,
          responseTimeMs,
          difficulty,
          evidenceScore,
          explanation: q.explanation,
          explanationHi: q.explanationHi,
        };
      });
      onComplete(results);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 animate-fadeIn pb-6 max-w-2xl mx-auto">
      {/* Top Banner */}
      <div className="bg-primary text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary-container text-[24px]">
            psychology
          </span>
          <div>
            <h2 className="font-display text-[15px] leading-tight font-bold">
              {isHindi ? 'कक्षा 7 AI निदानात्मक जांच' : 'Class 7 AI Diagnostic'}
            </h2>
            <p className="text-[12px] text-primary-fixed">
              {isHindi
                ? `${totalQuestions} अवधारणात्मक प्रश्न • पूर्णतः ऑफ़लाइन`
                : `${totalQuestions} Concept Questions • 100% Offline Ready`}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="text-white/80 hover:text-white px-3 py-1 rounded-lg text-[12px] font-semibold bg-white/10 hover:bg-white/20 transition-colors"
        >
          {isHindi ? '✕ बाहर निकलें' : '✕ Exit'}
        </button>
      </div>

      {/* Progress Header Bar */}
      <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-highest flex flex-col gap-2 shadow-sm">
        <div className="flex items-center justify-between text-[13px] font-semibold text-primary">
          <span className="font-bold">
            {isHindi
              ? `प्रश्न ${currentIndex + 1} / ${totalQuestions}`
              : `Question ${currentIndex + 1} of ${totalQuestions}`}
          </span>
          <span className="text-secondary font-bold">
            {isHindi ? `विषय: ${currentQ.topic}` : `Topic: ${currentQ.topic}`}
          </span>
        </div>
        <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden p-0.5">
          <div
            className="bg-secondary h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] text-on-surface-variant font-bold px-0.5">
          {questions.map((q, idx) => (
            <span
              key={q.id}
              className={`${
                idx === currentIndex
                  ? 'text-secondary font-extrabold underline'
                  : answers[idx] !== undefined
                  ? 'text-tertiary font-semibold'
                  : 'text-outline'
              }`}
            >
              Q{idx + 1}
            </span>
          ))}
        </div>
      </div>

      {/* Interactive Question Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-highest shadow-sm flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <span className="font-display text-[11px] text-secondary font-bold uppercase tracking-wider">
            {currentQ.badge}
          </span>
          <h3 className="font-display text-[16px] text-primary font-bold leading-snug">
            {isHindi ? currentQ.questionHi : currentQ.question}
          </h3>
          <p className="text-[13px] text-on-surface-variant font-medium">
            {isHindi ? currentQ.question : currentQ.questionHi}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2.5 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentIndex] === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between active:scale-[0.99] ${
                  isSelected
                    ? 'border-secondary bg-secondary/15 text-primary font-bold ring-2 ring-secondary/40 shadow-sm'
                    : 'border-surface-container-highest bg-surface-container-low/40 hover:bg-surface-container text-on-surface'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isSelected ? 'bg-secondary text-white' : 'bg-surface-container-highest text-outline'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-[14px]">{opt}</span>
                </span>
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isSelected ? 'text-secondary font-bold' : 'text-outline/40'
                  }`}
                >
                  {isSelected ? 'radio_button_checked' : 'radio_button_unchecked'}
                </span>
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="pt-2 border-t border-surface-container-highest">
            <p className="text-[12px] text-primary font-bold mb-2">
              {isHindi ? 'इस उत्तर को लेकर आपका भरोसा कितना था?' : 'How confident were you about this answer?'}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {([['low', isHindi ? 'अनुमान' : 'Guess'], ['medium', isHindi ? 'कुछ भरोसा' : 'Somewhat sure'], ['high', isHindi ? 'पूरा भरोसा' : 'Very sure']] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setConfidence((prev) => ({ ...prev, [currentIndex]: value }))}
                  className={`px-2 py-2 rounded-lg border text-[11px] font-bold transition-all ${confidence[currentIndex] === value ? 'border-secondary bg-secondary/15 text-primary ring-1 ring-secondary/40' : 'border-surface-container-highest text-on-surface-variant hover:bg-surface-container'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {isAnswered && (
          <div className="text-[12px] text-secondary font-bold flex items-center gap-1.5 pt-0.5">
            <span
              className="material-symbols-outlined text-[16px] text-tertiary-container"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              task_alt
            </span>
            <span>
              {isHindi
                ? hasConfidence ? 'उत्तर और भरोसा दर्ज है (आगे बढ़ें)' : 'आगे बढ़ने से पहले अपने भरोसे का स्तर चुनें'
                : hasConfidence ? 'Confidence recorded (tap Next to continue)' : 'Select your confidence before continuing'}
            </span>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-4 py-2.5 rounded-xl border border-surface-container-highest text-on-surface font-bold text-[13px] flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-surface-container transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>{isHindi ? 'पिछला' : 'Back'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!isAnswered || !hasConfidence}
          className={`flex-1 px-5 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md transition-all ${
            isAnswered
              ? 'bg-secondary text-on-secondary hover:bg-secondary-container active:scale-95'
              : 'bg-surface-container-high text-outline cursor-not-allowed opacity-60'
          }`}
        >
          <span>
            {currentIndex === totalQuestions - 1
              ? isHindi
                ? 'जांच सबमिट करें'
                : 'Submit Diagnostic'
              : isHindi
              ? 'अगला प्रश्न'
              : 'Next Question'}
          </span>
          <span className="material-symbols-outlined text-[18px]">
            {currentIndex === totalQuestions - 1 ? 'task_alt' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </div>
  );
};
