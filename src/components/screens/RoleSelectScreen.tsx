import React from 'react';
import { robotMascotUrl } from '../../data';
import { UserRole } from '../../types';

interface RoleSelectScreenProps {
  onSelectRole: (role: UserRole) => void;
  isHindi: boolean;
  onToggleLang: () => void;
}

export const RoleSelectScreen: React.FC<RoleSelectScreenProps> = ({
  onSelectRole,
  isHindi,
  onToggleLang,
}) => {
  return (
    <div className="flex flex-col w-full gap-6 pb-6 animate-fadeIn items-center text-center pt-4">
      {/* Language quick toggle */}
      <button
        type="button"
        onClick={onToggleLang}
        className="self-end -mt-1 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-surface-container-high text-on-surface border-surface-container-highest flex items-center gap-1"
      >
        <span className="text-xs">🇮🇳</span>
        <span>{isHindi ? 'हिंदी' : 'English'}</span>
      </button>

      {/* Brand */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center shadow-md relative">
          <img className="w-16 h-16 object-cover rounded-full" alt="Friendly Mascot" src={robotMascotUrl} />
          <span className="absolute -bottom-1 -right-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full p-1 shadow">
            <span className="material-symbols-outlined text-[14px] block">auto_awesome</span>
          </span>
        </div>
        <div>
          <h1 className="font-display text-[24px] font-extrabold text-primary leading-tight">
            शिक्षासारथी
          </h1>
          <p className="font-display text-[14px] font-bold text-on-surface-variant">
            ShikshaSaarthi
          </p>
          <p className="text-[12px] text-on-surface-variant mt-1 max-w-xs mx-auto leading-snug">
            {isHindi
              ? 'ऑफ़लाइन निदानात्मक व उपचारात्मक शिक्षण मंच'
              : 'Offline Diagnostic & Remedial Learning Platform'}
          </p>
        </div>
      </div>

      {/* Role selection cards */}
      <div className="w-full flex flex-col gap-3 mt-2">
        <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wide">
          {isHindi ? 'जारी रखने के लिए चुनें' : 'Choose how you want to continue'}
        </p>

        <button
          type="button"
          onClick={() => onSelectRole('student')}
          className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-3.5 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-fixed/60 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">backpack</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[15px] font-bold text-primary">
              {isHindi ? 'विद्यार्थी के रूप में लॉगिन करें' : 'Login as Student'}
            </h3>
            <p className="text-[11.5px] text-on-surface-variant leading-snug mt-0.5">
              {isHindi
                ? 'कक्षा चुनें, अभ्यास करें और XP कमाएं'
                : 'Pick your class, practice, and earn XP'}
            </p>
          </div>
          <span className="material-symbols-outlined text-[20px] text-outline shrink-0">
            arrow_forward
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('teacher')}
          className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all flex items-center gap-3.5 text-left"
        >
          <div className="w-12 h-12 rounded-xl bg-secondary-fixed/70 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">school</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[15px] font-bold text-primary">
              {isHindi ? 'शिक्षक के रूप में लॉगिन करें' : 'Login as Teacher'}
            </h3>
            <p className="text-[11.5px] text-on-surface-variant leading-snug mt-0.5">
              {isHindi
                ? 'कक्षा की प्रगति देखें और छात्रों का समर्थन करें'
                : "View class progress and support your students"}
            </p>
          </div>
          <span className="material-symbols-outlined text-[20px] text-outline shrink-0">
            arrow_forward
          </span>
        </button>
      </div>

      {/* Offline footer note */}
      <div className="bg-surface-container-low rounded-xl p-2.5 shadow-sm flex items-center gap-2.5 border border-surface-container w-full mt-1">
        <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">
          wifi_off
        </span>
        <p className="text-[11px] text-on-surface-variant text-left leading-snug">
          {isHindi
            ? 'यह ऐप बिना इंटरनेट के भी पूरी तरह काम करता है।'
            : 'This app works completely without an internet connection.'}
        </p>
      </div>
    </div>
  );
};
