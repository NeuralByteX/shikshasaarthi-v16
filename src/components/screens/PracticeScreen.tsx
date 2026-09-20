import React, { useState } from 'react';
import { practiceQuestionsData, realWorldExamplesData } from '../../data';
import { shuffleOptionsOf } from '../../lib/shuffle';
import { PracticeAnswerRecord } from '../../types';

interface PracticeScreenProps {
  onCompletePractice: (results: PracticeAnswerRecord[]) => void;
  isHindi: boolean;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ onCompletePractice, isHindi }) => {
  // Options are shuffled once per session so the right answer isn't always
  // in the same slot — otherwise the score wouldn't mean anything.
  const [questions] = useState(() => practiceQuestionsData.map(shuffleOptionsOf));
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [realWorldOpen, setRealWorldOpen] = useState<boolean>(false);

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const isAnswered = selectedAnswers[currentIndex] !== undefined;

  // Pick one real-life example that matches this question's topic, if any exist
  const realWorldMatch = realWorldExamplesData.find((ex) => ex.topic === currentQ.topic);

  const handleSelectOption = (optIdx: number) => {
    // First tap is final — once the right answer is revealed the student
    // can't switch to it, so the score reflects what they actually knew.
    if (selectedAnswers[currentIndex] !== undefined) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIdx }));
  };

  const handleNext = () => {
    setRealWorldOpen(false);
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const results: PracticeAnswerRecord[] = questions.map((q, idx) => ({
        step: q.step,
        topic: q.topic,
        selectedIndex: selectedAnswers[idx],
        correctIndex: q.correctIndex,
        isCorrect: selectedAnswers[idx] === q.correctIndex,
      }));
      onCompletePractice(results);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 animate-fadeIn pb-6 max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="bg-surface-container-lowest border border-surface-container-highest p-3.5 rounded-2xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-secondary text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">fitness_center</span>
          </div>
          <div>
            <h3 className="font-display text-[14px] font-bold text-primary">
              {isHindi ? 'वैयक्तिक उपचारात्मक अभ्यास' : 'Personalised Remedial Practice'}
            </h3>
            <p className="text-[12px] text-on-surface-variant font-medium">
              {isHindi
                ? `कदम ${currentIndex + 1} / ${totalQuestions}: असमान भिन्न निपुणता`
                : `Step ${currentIndex + 1} of ${totalQuestions}: Unlike Fractions Mastery`}
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-secondary text-white font-bold text-[11px] shrink-0">
          {isHindi ? '+16 XP / सही उत्तर' : '+16 XP / correct'}
        </span>
      </div>

      {/* 5-Step Visual Bars */}
      <div className="flex items-center justify-between gap-1.5 px-0.5">
        {questions.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
              idx <= currentIndex ? 'bg-secondary' : 'bg-surface-container-highest'
            }`}
          />
        ))}
      </div>

      {/* Practice Question Card */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl border border-surface-container-highest shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="font-display text-secondary font-bold text-[12px] tracking-wide">
            {currentQ.title}
          </span>
          <span className="text-[11px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            {isHindi ? 'संकेत आधारित' : 'Interactive Remedial'}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="font-display text-[16px] text-primary font-bold leading-snug">
            {isHindi ? currentQ.questionHi : currentQ.question}
          </h3>
          <p className="text-[12px] text-on-surface-variant font-medium">
            {isHindi ? currentQ.question : currentQ.questionHi}
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-2 pt-1">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentIndex] === idx;
            const isCorrect = idx === currentQ.correctIndex;

            let buttonStyle =
              'border-surface-container-highest bg-surface-container-low/40 hover:bg-surface-container text-on-surface';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle =
                  'border-emerald-300 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-400';
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'border-rose-300 bg-rose-50 text-rose-900 ring-1 ring-rose-400';
              }
            } else if (isSelected) {
              buttonStyle = 'border-secondary bg-secondary/15 text-primary font-bold ring-2 ring-secondary/40';
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between active:scale-[0.99] ${buttonStyle}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold bg-surface-container-highest text-primary">
                    {idx + 1}
                  </span>
                  <span className="text-[14px]">{opt}</span>
                </span>
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isAnswered && isCorrect
                      ? 'text-emerald-700 font-bold'
                      : isSelected
                      ? 'text-secondary font-bold'
                      : 'text-outline/30'
                  }`}
                >
                  {isAnswered && isCorrect
                    ? 'check_circle'
                    : isSelected
                    ? 'radio_button_checked'
                    : 'radio_button_unchecked'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback / Educational Tip Box */}
        {isAnswered && (
          <div
            className={`p-3 rounded-xl text-[12px] leading-snug border transition-all ${
              selectedAnswers[currentIndex] === currentQ.correctIndex
                ? 'bg-emerald-50 text-emerald-900 font-medium border-emerald-200'
                : 'bg-rose-50 text-rose-900 font-medium border-rose-200'
            }`}
          >
            <strong>
              {selectedAnswers[currentIndex] === currentQ.correctIndex
                ? isHindi
                  ? 'शानदार उत्तर! '
                  : 'Well done! '
                : isHindi
                ? 'सुझाव: '
                : 'Helpful Hint: '}
            </strong>
            {isHindi ? currentQ.hintHi : currentQ.hint}
          </div>
        )}

        {/* Where is this used in real life? */}
        {isAnswered && realWorldMatch && (
          <div className="rounded-xl border border-tertiary-fixed/60 bg-tertiary-fixed/15 overflow-hidden">
            <button
              type="button"
              onClick={() => setRealWorldOpen((prev) => !prev)}
              className="w-full flex items-center justify-between gap-2 p-3 text-left"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-tertiary-container">
                  travel_explore
                </span>
                <span className="text-[12.5px] font-bold text-primary">
                  {isHindi ? 'यह असल ज़िंदगी में कहां काम आता है?' : 'Where is this used in real life?'}
                </span>
              </span>
              <span
                className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${
                  realWorldOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>
            {realWorldOpen && (
              <div className="px-3 pb-3 flex flex-col gap-2 animate-fadeIn">
                <p className="text-[12px] text-on-surface leading-relaxed">
                  <strong>{isHindi ? realWorldMatch.titleHi : realWorldMatch.title}: </strong>
                  {isHindi ? realWorldMatch.scenarioHi : realWorldMatch.scenario}
                </p>
                <div className="bg-surface-container-lowest rounded-lg p-2.5 border border-surface-container-highest">
                  <p className="text-[11.5px] text-on-surface-variant leading-relaxed">
                    {isHindi ? realWorldMatch.howItWorksHi : realWorldMatch.howItWorks}
                  </p>
                  <p className="text-[11.5px] text-emerald-800 font-bold mt-1.5">
                    {isHindi ? realWorldMatch.exampleHi : realWorldMatch.example}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={handleNext}
          disabled={!isAnswered}
          className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow transition-all ${
            isAnswered
              ? 'bg-secondary text-white hover:bg-secondary-container active:scale-95'
              : 'bg-surface-container-high text-outline cursor-not-allowed opacity-60'
          }`}
        >
          <span>
            {!isAnswered
              ? isHindi
                ? 'उत्तर जांचने के लिए एक विकल्प चुनें'
                : 'Select an option to check'
              : currentIndex === totalQuestions - 1
              ? isHindi
                ? 'पूर्ण करें और अपना स्कोर देखें'
                : 'Finish & See My Score'
              : isHindi
              ? `कदम ${currentIndex + 2} पर बढ़ें`
              : `Proceed to Step ${currentIndex + 2}`}
          </span>
          <span className="material-symbols-outlined text-[18px]">
            {currentIndex === totalQuestions - 1 ? 'stars' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </div>
  );
};
