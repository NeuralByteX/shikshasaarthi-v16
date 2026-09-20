import React, { useState } from 'react';
import { StudentProfile, PracticeResultData, PracticeSaveState } from '../../types';

interface UpdatedHomeScreenProps {
  student: StudentProfile;
  /** Real result of the practice session that was just completed (null if none this session). */
  practiceResult: PracticeResultData | null;
  saveState: PracticeSaveState;
  onRetrySave: () => void;
  onOpenTeacherPortal: () => void;
  onViewReport: () => void;
  onStartDecimals: () => void;
  onRetryPractice: () => void;
  isHindi: boolean;
}

const MASTERY_THRESHOLD = 80;

export const UpdatedHomeScreen: React.FC<UpdatedHomeScreenProps> = ({
  student,
  practiceResult,
  saveState,
  onRetrySave,
  onOpenTeacherPortal,
  onViewReport,
  onStartDecimals,
  onRetryPractice,
  isHindi,
}) => {
  const [offlineDetailsOpen, setOfflineDetailsOpen] = useState(false);

  // Reached without finishing a practice this session — nothing real to show.
  if (!practiceResult) {
    return (
      <div className="flex flex-col w-full gap-4 animate-fadeIn pb-6 max-w-2xl mx-auto items-center text-center pt-10">
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center">
          <span className="material-symbols-outlined text-[30px] text-outline">fitness_center</span>
        </div>
        <h2 className="font-display text-[17px] font-bold text-primary">
          {isHindi ? 'अभी तक कोई अभ्यास परिणाम नहीं' : 'No Practice Result Yet'}
        </h2>
        <p className="text-[13px] text-on-surface-variant max-w-xs">
          {isHindi
            ? 'अपना असली स्कोर देखने के लिए पहले उपचारात्मक अभ्यास पूरा करें।'
            : 'Finish a remedial practice to see your real score and progress here.'}
        </p>
        <button
          type="button"
          onClick={onRetryPractice}
          className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-[13px] flex items-center gap-1.5 shadow-md"
        >
          <span>{isHindi ? 'अभ्यास शुरू करें' : 'Start Practice'}</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    );
  }

  const { score, totalQuestions, scorePercent, xpEarned, previousPercent, topic, topicHi } = practiceResult;
  const mastered = scorePercent >= MASTERY_THRESHOLD;
  const topicLabel = isHindi ? topicHi : topic;
  const xpLeft = Math.max(0, student.targetXp - student.currentXp);
  const xpPercent = Math.min(100, Math.round((student.currentXp / student.targetXp) * 100));
  const delta = previousPercent !== null ? scorePercent - previousPercent : null;

  const scoreLine = isHindi
    ? `स्कोर ${scorePercent}% (${score}/${totalQuestions} सही)${
        previousPercent !== null ? ` • पहले ${previousPercent}%` : ''
      }`
    : `Score ${scorePercent}% (${score}/${totalQuestions} correct)${
        previousPercent !== null ? ` • was ${previousPercent}%` : ''
      }`;

  return (
    <div className="flex flex-col w-full gap-4 animate-fadeIn pb-8 max-w-2xl mx-auto">
      {/* Result Banner */}
      <div
        className={`text-white p-4 rounded-2xl shadow-md flex items-center justify-between gap-3 border ${
          mastered
            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 border-emerald-400'
            : 'bg-gradient-to-r from-amber-600 to-orange-600 border-amber-400'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
            <span
              className="material-symbols-outlined text-[26px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {mastered ? 'verified' : 'trending_up'}
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-display text-[15px] font-bold">
                {mastered
                  ? isHindi ? 'अभ्यास सफल! 🎉' : 'Practice Completed! 🎉'
                  : isHindi ? 'अभ्यास पूरा — थोड़ा और करें 💪' : 'Practice Done — Keep Going 💪'}
              </span>
              <span className="text-[11px] bg-white/25 px-2 py-0.5 rounded-full font-extrabold">
                +{xpEarned} XP
              </span>
            </div>
            <p className="text-[12px] text-white/90 mt-0.5">{scoreLine}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenTeacherPortal}
          className="px-3.5 py-1.5 rounded-xl bg-white text-primary text-[12px] font-bold shrink-0 shadow-sm hover:bg-emerald-50 active:scale-95 transition-all"
        >
          {isHindi ? 'शिक्षक दृश्य →' : 'Teacher View →'}
        </button>
      </div>

      {/* 1. Real sync status */}
      <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-3 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {saveState === 'saving' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px] animate-spin">sync</span>
              <span>{isHindi ? 'शिक्षक डैशबोर्ड पर भेजा जा रहा है…' : 'Sending to teacher dashboard…'}</span>
            </div>
          )}
          {saveState === 'saved' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>{isHindi ? 'सहेजा गया • शिक्षक अभी देख सकते हैं' : 'Saved • Your teacher can see this now'}</span>
            </div>
          )}
          {saveState === 'failed' && (
            <>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[11px] font-bold">
                <span className="material-symbols-outlined text-[14px]">cloud_off</span>
                <span>{isHindi ? 'सहेजा नहीं जा सका' : "Couldn't save — check connection"}</span>
              </div>
              <button
                type="button"
                onClick={onRetrySave}
                className="text-[12px] font-bold text-white bg-secondary px-3 py-1 rounded-full active:scale-95 transition-all"
              >
                {isHindi ? 'फिर कोशिश करें' : 'Retry'}
              </button>
            </>
          )}
          {saveState === 'local-only' && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold">
              <span className="material-symbols-outlined text-[14px]">wifi_off</span>
              <span>{isHindi ? 'डेमो मोड • केवल इस डिवाइस पर' : 'Demo mode • stored on this device only'}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOfflineDetailsOpen((prev) => !prev)}
            className="text-[11px] font-semibold text-secondary hover:text-primary flex items-center gap-0.5 ml-auto"
          >
            <span>{isHindi ? 'विवरण' : 'Details'}</span>
            <span className={`material-symbols-outlined text-[14px] transition-transform ${offlineDetailsOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </button>
        </div>

        {offlineDetailsOpen && (
          <div className="text-[12px] text-on-surface-variant bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container mt-1 animate-fadeIn">
            <p>
              {saveState === 'local-only'
                ? isHindi
                  ? 'Supabase से जुड़े बिना यह परिणाम सिर्फ इसी सत्र में दिख रहा है।'
                  : 'Without a Supabase login this result only lives in the current session.'
                : isHindi
                ? `आपका ${scorePercent}% स्कोर और +${xpEarned} XP आपके खाते में सहेजे जाते हैं और शिक्षक के डैशबोर्ड पर लाइव दिखते हैं।`
                : `Your ${scorePercent}% score and +${xpEarned} XP are written to your account and show up live on your teacher's dashboard.`}
            </p>
          </div>
        )}
      </div>

      {/* 2. Progress / XP Summary — real numbers */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col gap-3">
        <div className="flex justify-between items-center text-on-surface">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
            <span className="text-[14px] font-bold text-primary">
              {isHindi ? `स्तर ${student.level} खोजी` : `Level ${student.level} Explorer`}
            </span>
          </div>
          <span className="font-display text-[12px] text-emerald-800 font-extrabold bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {student.currentXp} / {student.targetXp} XP (+{xpEarned} XP)
          </span>
        </div>

        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-secondary via-secondary-container to-emerald-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${xpPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
          <span className="text-secondary font-bold">
            {isHindi
              ? `स्तर ${student.level + 1} के लिए केवल ${xpLeft} XP शेष!`
              : `Only ${xpLeft} XP needed for Level ${student.level + 1}!`}
          </span>
          <span className="font-bold text-emerald-700">{xpPercent}%</span>
        </div>
      </section>

      {/* 3. Topic result — mastered or needs another go, based on the real score */}
      <section
        className={`bg-surface-container-lowest rounded-2xl p-4 shadow-sm border-2 flex flex-col gap-2.5 ${
          mastered ? 'border-emerald-200' : 'border-amber-200'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
              mastered ? 'text-emerald-800 bg-emerald-100' : 'text-amber-800 bg-amber-100'
            }`}
          >
            <span className="material-symbols-outlined text-[13px]">{mastered ? 'check_circle' : 'flag'}</span>
            <span>
              {mastered
                ? isHindi ? `निपुणता हासिल • स्कोर: ${scorePercent}%` : `Mastered • Score: ${scorePercent}%`
                : isHindi ? `अभी अभ्यास बाकी • स्कोर: ${scorePercent}%` : `Almost there • Score: ${scorePercent}%`}
            </span>
          </span>
          <button
            type="button"
            onClick={onViewReport}
            className="text-[12px] text-secondary font-bold hover:underline"
          >
            {isHindi ? 'विश्लेषण रिपोर्ट देखें' : 'View Report'}
          </button>
        </div>

        <h3 className="font-display text-[16px] font-bold text-primary">{topicLabel}</h3>
        <p className="text-[13px] text-on-surface-variant">
          {isHindi
            ? `उपचारात्मक अभ्यास में ${totalQuestions} में से ${score} प्रश्न सही हल किए।${
                delta !== null ? (delta > 0 ? ` निदानात्मक जांच से ${delta}% का सुधार!` : delta < 0 ? ` निदानात्मक जांच से ${Math.abs(delta)}% कम।` : ' निदानात्मक जांच जितना ही स्कोर।') : ''
              }`
            : `You solved ${score} of ${totalQuestions} remedial problems correctly.${
                delta !== null ? (delta > 0 ? ` That's a ${delta}-point improvement over your diagnostic!` : delta < 0 ? ` That's ${Math.abs(delta)} points below your diagnostic — worth another look.` : ' Same as your diagnostic score.') : ''
              }`}
        </p>

        {!mastered && (
          <button
            type="button"
            onClick={onRetryPractice}
            className="w-full py-2.5 px-4 rounded-xl bg-secondary text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">replay</span>
            <span>{isHindi ? 'फिर से अभ्यास करें' : 'Practice Again'}</span>
          </button>
        )}
      </section>

      {/* 4. Next mission — only unlocked once the real score clears the bar */}
      {mastered && (
        <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border-2 border-secondary flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary bg-secondary-fixed px-2.5 py-0.5 rounded-full uppercase">
              <span className="material-symbols-outlined text-[13px]">lock_open</span>
              <span>{isHindi ? 'नया अध्याय खुला!' : 'New Chapter Unlocked!'}</span>
            </span>
            <span className="text-[11px] text-tertiary-container font-bold bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
              +60 XP
            </span>
          </div>

          <div>
            <h3 className="font-display text-[16px] font-bold text-primary">
              {isHindi ? 'दशमलव और प्रतिशत' : 'Decimals & Percentages'}
            </h3>
            <p className="text-[13px] text-on-surface-variant mt-0.5">
              {isHindi
                ? 'दशमलव संख्याओं की तुलना, जोड़ और प्रतिशत में रूपांतरण की नई चुनौतियां।'
                : 'Learn decimal comparisons, conversions to percentages, and practical word problems.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onStartDecimals}
            className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-[#00387a] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
          >
            <span>{isHindi ? 'दशमलव अभ्यास शुरू करें' : 'Start Decimals Practice'}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </section>
      )}
    </div>
  );
};
