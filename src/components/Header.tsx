import React, { useState } from 'react';
import { StudentProfile, ViewMode } from '../types';
import { brandLogoUrl } from '../data';

interface HeaderProps {
  student: StudentProfile;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  pendingSyncCount?: number;
  onOpenSyncModal?: () => void;
  onAvatarClick?: () => void;
  isHindi: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  student,
  currentView,
  onNavigate,
  onAvatarClick,
  isHindi,
}) => {
  const isTeacherView = currentView === 'teacher-portal';
  const [logoError, setLogoError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Derive initials for avatar fallback (defaulting to 'AS' for Aarav Sharma)
  const studentInitials =
    student.name
      ?.split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AS';

  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-surface-container-highest px-4 py-2.5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        {/* Brand & Student Identity */}
        <button
          type="button"
          className="flex items-center gap-2.5 min-w-0 text-left focus:outline-none group"
          onClick={() => onNavigate('student-home')}
          aria-label={isHindi ? 'शिक्षासारथी होम' : 'ShikshaSaarthi Home'}
        >
          {/* Logo Mark: Reliable local asset with blue circular 'SS' fallback */}
          {!logoError && brandLogoUrl ? (
            <img
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain shrink-0 group-hover:scale-105 transition-transform rounded-full shadow-sm"
              src={brandLogoUrl}
              onError={() => setLogoError(true)}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-full bg-[#002B66] text-white flex items-center justify-center font-bold text-[12px] tracking-tight shadow-sm shrink-0 border border-white/20 group-hover:scale-105 transition-transform"
              aria-hidden="true"
            >
              SS
            </div>
          )}

          {/* Text branding & student identity */}
          <div className="flex flex-col min-w-0">
            {/* Brand Title with small subtitle "Offline Learning" */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-display text-[15px] font-bold text-primary leading-tight truncate">
                {isHindi ? 'शिक्षासारथी' : 'ShikshaSaarthi'}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 text-secondary bg-secondary-fixed/70 rounded-md hidden sm:inline-flex items-center shrink-0">
                {isHindi ? 'ऑफ़लाइन शिक्षण' : 'Offline Learning'}
              </span>
            </div>

            {/* Subtitle / student roll details */}
            <span className="text-[12px] text-on-surface-variant truncate font-medium">
              <span className="sm:hidden text-secondary font-semibold mr-1">
                {isHindi ? 'ऑफ़लाइन' : 'Offline'} •
              </span>
              {isHindi
                ? `${student.nameHi} • कक्षा ${student.className} (रोल #${student.rollNo})`
                : `${student.name} • Class ${student.className} (Roll #${student.rollNo})`}
            </span>
          </div>
        </button>

        {/* Action Controls: Teacher Portal & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            aria-label={isTeacherView ? 'Switch to Student View' : 'Open Teacher Dashboard'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all active:scale-95 shadow-sm ${
              isTeacherView
                ? 'bg-primary text-white'
                : 'bg-surface-container text-primary hover:bg-surface-container-high border border-surface-container-high'
            }`}
            onClick={() => onNavigate(isTeacherView ? 'student-home' : 'teacher-portal')}
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              {isTeacherView ? 'account_circle' : 'school'}
            </span>
            <span>
              {isTeacherView
                ? isHindi
                  ? 'छात्र दृश्य'
                  : 'Student View'
                : isHindi
                ? 'शिक्षक पोर्टल'
                : 'Teacher Portal'}
            </span>
          </button>

          {/* Student Avatar with initials fallback */}
          <button
            type="button"
            aria-label="Student Profile"
            className="w-8 h-8 rounded-full p-0.5 ring-2 ring-secondary/30 bg-white hover:ring-secondary transition-all flex items-center justify-center shrink-0"
            onClick={onAvatarClick || (() => onNavigate('kiosk-login'))}
          >
            {!avatarError && student.avatarUrl ? (
              <img
                alt={student.name}
                className="w-7 h-7 rounded-full object-cover"
                src={student.avatarUrl}
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div
                className="w-7 h-7 rounded-full bg-[#002B66] text-white font-bold text-[11px] flex items-center justify-center tracking-tight shadow-sm"
                title={student.name}
              >
                {studentInitials}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
