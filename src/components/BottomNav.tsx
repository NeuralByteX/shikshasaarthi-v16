import React from 'react';
import { ViewMode } from '../types';

interface BottomNavProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  isHindi: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, isHindi }) => {
  const isMissionsActive = currentView === 'student-home' || currentView === 'updated-home';
  const isPracticeActive = currentView === 'practice-flow';
  const isRealWorldActive = currentView === 'real-world';
  const isBuddyActive = currentView === 'saarthi-buddy';
  const isDuelActive = currentView === 'quiz-duel';
  const isTeacherActive = currentView === 'teacher-portal';

  return (
    <nav
      aria-label="Bottom Navigation"
      className="sticky bottom-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-surface-container-highest shadow-sm"
    >
      <div className="flex justify-around items-center h-14 px-1 max-w-md mx-auto">
        {/* Tab 1: Missions */}
        <button
          type="button"
          aria-label="Missions Map"
          onClick={() => onNavigate('student-home')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all active:scale-95 ${
            isMissionsActive
              ? 'text-primary font-bold bg-primary-fixed/40'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">explore</span>
          <span className="text-[10px] font-semibold leading-none">
            {isHindi ? 'लक्ष्य' : 'Missions'}
          </span>
        </button>

        {/* Tab 2: Practice */}
        <button
          type="button"
          aria-label="Practice"
          onClick={() => onNavigate('practice-flow')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all active:scale-95 ${
            isPracticeActive
              ? 'text-primary font-bold bg-primary-fixed/40'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">menu_book</span>
          <span className="text-[10px] font-semibold leading-none">
            {isHindi ? 'अभ्यास' : 'Practice'}
          </span>
        </button>

        {/* Tab 3: Real Life */}
        <button
          type="button"
          aria-label="Maths in Real Life"
          onClick={() => onNavigate('real-world')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all active:scale-95 ${
            isRealWorldActive
              ? 'text-primary font-bold bg-primary-fixed/40'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">travel_explore</span>
          <span className="text-[10px] font-semibold leading-none">
            {isHindi ? 'वास्तविक जीवन' : 'Real Life'}
          </span>
        </button>

        {/* Tab 4: Buddy */}
        <button
          type="button"
          aria-label="Saarthi AI Buddy"
          onClick={() => onNavigate('saarthi-buddy')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all active:scale-95 ${
            isBuddyActive
              ? 'text-primary font-bold bg-primary-fixed/40'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span
            className="material-symbols-outlined text-[19px] text-secondary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            smart_toy
          </span>
          <span className="text-[10px] font-semibold leading-none">
            {isHindi ? 'सारथी' : 'Buddy'}
          </span>
        </button>

        {/* Tab 5: Duel */}
        <button
          type="button"
          aria-label="Quiz Duel"
          onClick={() => onNavigate('quiz-duel')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all active:scale-95 ${
            isDuelActive
              ? 'text-primary font-bold bg-primary-fixed/40'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">swords</span>
          <span className="text-[10px] font-semibold leading-none">
            {isHindi ? 'मुकाबला' : 'Duel'}
          </span>
        </button>

        {/* Tab 6: Teacher */}
        <button
          type="button"
          aria-label="Teacher Portal"
          onClick={() => onNavigate('teacher-portal')}
          className={`flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 rounded-xl transition-all active:scale-95 ${
            isTeacherActive
              ? 'text-primary font-bold bg-primary-fixed/40'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">bar_chart</span>
          <span className="text-[10px] font-semibold leading-none">
            {isHindi ? 'शिक्षक' : 'Teacher'}
          </span>
        </button>
      </div>
    </nav>
  );
};
