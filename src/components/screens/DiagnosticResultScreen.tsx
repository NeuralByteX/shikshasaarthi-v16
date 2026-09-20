import React, { useState } from 'react';
import { StudentProfile, DiagnosticResultData } from '../../types';

interface DiagnosticResultScreenProps {
  student: StudentProfile;
  result: DiagnosticResultData | null;
  onStartPractice: () => void;
  onStartDiagnostic: () => void;
  isHindi: boolean;
}

export const DiagnosticResultScreen: React.FC<DiagnosticResultScreenProps> = ({
  student,
  result,
  onStartPractice,
  onStartDiagnostic,
  isHindi,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Reached this screen without having actually completed a diagnostic in
  // this session (e.g. via the dev prototype nav) — nothing real to show.
  if (!result) {
    return (
      <div className="flex flex-col w-full gap-4 animate-fadeIn pb-6 max-w-2xl mx-auto items-center text-center pt-10">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-[30px] text-outline">quiz</span>
        </div>
        <h2 className="font-display text-[17px] font-bold text-primary">
          {isHindi ? 'अभी तक कोई परिणाम नहीं' : 'No Result Yet'}
        </h2>
        <p className="text-[13px] text-on-surface-variant max-w-xs">
          {isHindi
            ? 'परिणाम देखने के लिए पहले निदानात्मक जांच पूरी करें।'
            : 'Complete the diagnostic first to see your real, personalized result here.'}
        </p>
        <button
          type="button"
          onClick={onStartDiagnostic}
          className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-[13px] flex items-center gap-1.5 shadow-md"
        >
          <span>{isHindi ? 'जांच शुरू करें' : 'Start Diagnostic'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    );
  }

  const { score, totalQuestions, scorePercent, strongestTopic, weakestTopic, sampleMistake } = result;

  return (
    <div className="flex flex-col w-full gap-4 animate-fadeIn pb-6 max-w-2xl mx-auto">
      {/* Score Header Hero Banner */}
      <div className="bg-gradient-to-br from-primary via-primary-container to-secondary p-4 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between relative z-10 gap-2">
          <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-primary-fixed uppercase tracking-wider w-fit">
              {isHindi ? 'निदानात्मक विश्लेषण पूर्ण' : 'Diagnostic Analysis Complete'}
            </span>
            <h2 className="font-display text-[19px] font-extrabold leading-tight">
              {isHindi ? 'आपका परीक्षा परिणाम' : 'Your Diagnostic Result'}
            </h2>
            <p className="text-[12px] text-white/85 font-medium">
              {isHindi
                ? `${student.nameHi} • कक्षा ${student.className} आकलन`
                : `${student.name} • Class ${student.className} Assessment`}
            </p>
          </div>
          {/* Circular Score Ring */}
          <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full bg-white text-primary shadow-lg border-4 border-amber-400 shrink-0">
            <span className="font-display text-[22px] font-extrabold leading-none text-primary">
              {scorePercent}%
            </span>
            <span className="text-[10px] font-bold text-amber-700 mt-0.5">
              {isHindi ? `${score}/${totalQuestions} सही` : `${score}/${totalQuestions} Correct`}
            </span>
          </div>
        </div>
      </div>

      {/* Strong vs Needs Support Topic Breakdown */}
      {(strongestTopic || weakestTopic) && (
        <div className="grid grid-cols-2 gap-3">
          {strongestTopic ? (
            <div className="bg-surface-container-lowest p-3.5 rounded-xl border border-emerald-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span>{isHindi ? 'मजबूत अवधारणा' : 'STRONG TOPIC'}</span>
              </div>
              <h4 className="font-bold text-on-surface text-[14px] leading-tight">
                {isHindi ? strongestTopic.topicHi : strongestTopic.topic}
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                {isHindi
                  ? `${strongestTopic.correct}/${strongestTopic.total} सही • ${strongestTopic.percent}% निपुणता`
                  : `${strongestTopic.correct}/${strongestTopic.total} Correct • ${strongestTopic.percent}% Mastery`}
              </p>
            </div>
          ) : (
            <div className="bg-surface-container-low p-3.5 rounded-xl border border-surface-container-highest shadow-sm flex items-center justify-center">
              <p className="text-[11px] text-on-surface-variant text-center">
                {isHindi ? 'अभी कोई मजबूत विषय नहीं' : 'No strong topic yet'}
              </p>
            </div>
          )}

          {weakestTopic ? (
            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 shadow-sm flex flex-col gap-1">
              <div className="flex items-center gap-1 text-amber-900 font-bold text-[11px]">
                <span
                  className="material-symbols-outlined text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  warning
                </span>
                <span>{isHindi ? 'सुधार आवश्यक' : 'NEEDS PRACTICE'}</span>
              </div>
              <h4 className="font-bold text-primary text-[14px] leading-tight">
                {isHindi ? weakestTopic.topicHi : weakestTopic.topic}
              </h4>
              <p className="text-[11px] text-on-surface-variant">
                {isHindi
                  ? `${weakestTopic.correct}/${weakestTopic.total} सही • अभ्यास चाहिए`
                  : `${weakestTopic.correct}/${weakestTopic.total} Correct • Concept gap identified`}
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-center">
              <p className="text-[11px] text-emerald-800 font-bold text-center">
                {isHindi ? 'सभी विषयों में 100%! 🎉' : 'Perfect across all topics! 🎉'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Concept Insight — pulled from the actual question the student got wrong */}
      {sampleMistake && weakestTopic && (
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-surface-container-highest shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary shrink-0">
                <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              </div>
              <div>
                <h3 className="font-display text-[15px] font-bold text-primary">
                  {isHindi
                    ? `अवधारणा समझें: ${weakestTopic.topicHi}`
                    : `Concept Insight: ${weakestTopic.topic}`}
                </h3>
                <p className="text-[11px] text-on-surface-variant font-medium">
                  {isHindi
                    ? 'आपके उत्तर के आधार पर व्याख्या'
                    : 'Based on the question you missed'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="px-2.5 py-1 rounded-full bg-secondary-fixed text-primary text-[11px] font-bold flex items-center gap-1 hover:bg-secondary hover:text-white transition-all shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">
                {isPlayingAudio ? 'pause' : 'volume_up'}
              </span>
              <span>{isPlayingAudio ? (isHindi ? 'ऑडियो बंद करें' : 'Pause Audio') : (isHindi ? 'ऑडियो सुनें' : 'Audio Guide')}</span>
            </button>
          </div>

          <p className="text-[13px] text-on-surface leading-relaxed">
            {isHindi ? sampleMistake.explanationHi : sampleMistake.explanation}
          </p>

          {isPlayingAudio && (
            <div className="p-2.5 rounded-lg bg-secondary-fixed/40 text-primary text-[12px] font-medium flex items-center gap-2 border border-secondary/30 animate-pulse">
              <span className="material-symbols-outlined text-[16px] text-secondary">graphic_eq</span>
              <span>
                {isHindi
                  ? `सारथी: "${sampleMistake.explanationHi}"`
                  : `Saarthi Voice: "${sampleMistake.explanation}"`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Full topic breakdown */}
      <div className="bg-surface-container-lowest rounded-2xl p-3.5 border border-surface-container-highest shadow-sm flex flex-col gap-2">
        <h3 className="text-[12.5px] font-bold text-primary">
          {isHindi ? 'सभी विषयों का विवरण' : 'Full Topic Breakdown'}
        </h3>
        {result.topicBreakdown.map((t) => (
          <div key={t.topic} className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-on-surface truncate">
              {isHindi ? t.topicHi : t.topic}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-20 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className={`h-full rounded-full ${t.percent >= 60 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${t.percent}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-on-surface-variant w-14 text-right">
                {t.correct}/{t.total} · {t.percent}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Box */}
      <div className="bg-surface-container-high rounded-xl p-3.5 flex items-center justify-between gap-3 border border-secondary-container/50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[24px]">timer</span>
          <div>
            <span className="font-bold text-[13px] text-primary block">
              {isHindi ? 'अनुशंसित अभ्यास' : 'Recommended Practice'}
              {weakestTopic ? `: ${isHindi ? weakestTopic.topicHi : weakestTopic.topic}` : ''}
            </span>
            <span className="text-[12px] text-on-surface-variant font-medium">
              {isHindi
                ? 'संकेतों के साथ उपचारात्मक अभ्यास करें'
                : 'Guided step-by-step remedial practice'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onStartPractice}
          className="font-display bg-secondary text-on-secondary px-3.5 py-1.5 rounded-full text-[11px] font-bold shrink-0 flex items-center gap-1"
        >
          <span>{isHindi ? 'शुरू करें' : 'Start'}</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
