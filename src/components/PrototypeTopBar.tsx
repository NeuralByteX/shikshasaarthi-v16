import React, { useState, useRef, useEffect } from 'react';
import { ViewMode, DeviceMode } from '../types';

interface PrototypeTopBarProps {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  deviceMode: DeviceMode;
  onToggleDevice: () => void;
  isHindi: boolean;
  onToggleLang: () => void;
}

export const PrototypeTopBar: React.FC<PrototypeTopBarProps> = ({
  currentView,
  onSelectView,
  deviceMode,
  onToggleDevice,
  isHindi,
  onToggleLang,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary navigation items requested: Home, Diagnostic, Practice, Teacher
  const primaryNavItems: { id: ViewMode; label: string; labelHi: string; icon: string }[] = [
    { id: 'student-home', label: 'Home', labelHi: 'होम', icon: 'home' },
    { id: 'diagnostic-flow', label: 'Diagnostic', labelHi: 'जांच', icon: 'psychology' },
    { id: 'practice-flow', label: 'Practice', labelHi: 'अभ्यास', icon: 'menu_book' },
    { id: 'real-world', label: 'Real Life', labelHi: 'वास्तविक जीवन', icon: 'travel_explore' },
    { id: 'teacher-portal', label: 'Teacher', labelHi: 'शिक्षक', icon: 'school' },
  ];

  // Secondary items moved to More menu: Quiz Duel, AI Buddy, Print, Kiosk Radar (+ secondary demo states)
  const secondaryNavItems: { id: ViewMode; label: string; labelHi: string; icon: string; category?: string }[] = [
    { id: 'quiz-duel', label: 'Quiz Duel', labelHi: 'प्रश्नोत्तरी मुकाबला', icon: 'swords' },
    { id: 'saarthi-buddy', label: 'AI Buddy', labelHi: 'सारथी एआई बडी', icon: 'smart_toy' },
    { id: 'print-fallback', label: 'Print Worksheet', labelHi: 'प्रिंट वर्कशीट', icon: 'print' },
    { id: 'kiosk-radar', label: 'Kiosk Radar', labelHi: 'कियोस्क मेश रडार', icon: 'radar' },
    { id: 'diagnostic-result', label: 'Result (40%)', labelHi: 'निदान परिणाम (40%)', icon: 'assessment', category: 'Flow Step' },
    { id: 'updated-home', label: '80% Unlocked Home', labelHi: '80% अनलॉक होम', icon: 'verified', category: 'Flow Step' },
    { id: 'kiosk-login', label: 'Kiosk Login', labelHi: 'कियोस्क प्रवेश', icon: 'badge', category: 'Flow Step' },
  ];

  const isCurrentInMore = secondaryNavItems.some((item) => item.id === currentView);

  return (
    <aside
      aria-label="Prototype Navigation Bar"
      className="sticky top-0 inset-x-0 z-[100] bg-[#001738] text-white border-b border-white/10 px-3 py-2 shadow-md backdrop-blur-md w-full"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-secondary text-white font-bold text-[11px] shadow-sm">
            SS
          </span>
          <div className="flex flex-col">
            <span className="font-bold text-white text-[12px] leading-tight">
              शिक्षासारथी • ShikshaSaarthi
            </span>
            <span className="text-[10px] text-white/70 hidden sm:inline">
              {isHindi ? 'ऑफ़लाइन निदानात्मक व उपचारात्मक मंच' : 'NDEAR Offline Diagnostic & Remedial'}
            </span>
          </div>
        </div>

        {/* Primary Navigation: Home, Diagnostic, Practice, Teacher + More Menu */}
        <nav aria-label="Main Navigation" className="flex items-center gap-1 shrink-0">
          {primaryNavItems.map((item) => {
            const isActive =
              currentView === item.id ||
              (item.id === 'student-home' && currentView === 'updated-home');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-white text-primary font-bold shadow-sm ring-1 ring-white/60'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">{item.icon}</span>
                <span>{isHindi ? item.labelHi : item.label}</span>
              </button>
            );
          })}

          {/* Secondary "More" Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-haspopup="true"
              onClick={() => setMoreOpen((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-lg text-[12px] font-semibold flex items-center gap-1 transition-all ${
                isCurrentInMore || moreOpen
                  ? 'bg-secondary text-white font-bold shadow-sm ring-1 ring-white/30'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">more_vert</span>
              <span>{isHindi ? 'अधिक' : 'More'}</span>
              <span className={`material-symbols-outlined text-[14px] transition-transform ${moreOpen ? 'rotate-180' : ''}`}>
                arrow_drop_down
              </span>
            </button>

            {/* Dropdown Menu Overlay */}
            {moreOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-[#002756] border border-white/20 rounded-xl shadow-2xl p-1.5 z-50 text-white animate-fadeIn">
                <div className="px-2 py-1 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  {isHindi ? 'अतिरिक्त उपकरण' : 'Tools & Matchups'}
                </div>
                {secondaryNavItems.slice(0, 4).map((tool) => {
                  const isActive = currentView === tool.id;
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => {
                        onSelectView(tool.id);
                        setMoreOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[12px] transition-colors ${
                        isActive
                          ? 'bg-secondary text-white font-bold'
                          : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                        {tool.icon}
                      </span>
                      <span>{isHindi ? tool.labelHi : tool.label}</span>
                    </button>
                  );
                })}

                <div className="h-px bg-white/15 my-1" />

                <div className="px-2 py-1 text-[10px] font-bold text-white/50 uppercase tracking-wider">
                  {isHindi ? 'डेमो चरण' : 'Demo Steps'}
                </div>
                {secondaryNavItems.slice(4).map((step) => {
                  const isActive = currentView === step.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        onSelectView(step.id);
                        setMoreOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[12px] transition-colors ${
                        isActive
                          ? 'bg-secondary text-white font-bold'
                          : 'text-white/85 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px] text-white/60">
                        {step.icon}
                      </span>
                      <span>{isHindi ? step.labelHi : step.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Device Switcher & Language Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Device Frame Switcher */}
          <button
            type="button"
            onClick={onToggleDevice}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium flex items-center gap-1 text-[11px] border border-white/15 transition-all"
            title={deviceMode === 'mobile' ? 'Switch to Kiosk/Laptop View' : 'Switch to Mobile View'}
          >
            <span className="material-symbols-outlined text-[14px]">
              {deviceMode === 'mobile' ? 'smartphone' : 'laptop_chromebook'}
            </span>
            <span className="hidden sm:inline">
              {deviceMode === 'mobile' ? 'Mobile' : 'Kiosk'}
            </span>
          </button>

          {/* Hindi / English Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all flex items-center gap-1 ${
              isHindi
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
            title="Toggle between English and Hindi"
          >
            <span className="text-xs">🇮🇳</span>
            <span>{isHindi ? 'हिंदी' : 'English'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
