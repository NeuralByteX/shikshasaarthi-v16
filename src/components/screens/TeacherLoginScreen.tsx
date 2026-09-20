import React, { useState } from 'react';

interface TeacherLoginScreenProps {
  onLogin: (email: string, pin: string) => Promise<void>;
  onBack: () => void;
  onGoToSignup: () => void;
  isHindi: boolean;
  isOfflineMode: boolean;
}

export const TeacherLoginScreen: React.FC<TeacherLoginScreenProps> = ({
  onLogin,
  onBack,
  onGoToSignup,
  isHindi,
  isOfflineMode,
}) => {
  const [email, setEmail] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) && pin.trim().length >= 4;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsLoggingIn(true);
    setError(null);
    try {
      await onLogin(email.trim().toLowerCase(), pin.trim());
    } catch (err: any) {
      setError(
        err?.message?.includes('Invalid login')
          ? isHindi
            ? 'गलत शिक्षक आईडी या पिन।'
            : 'Incorrect Teacher ID or PIN.'
          : err?.message ?? (isHindi ? 'लॉगिन विफल रहा।' : 'Login failed.')
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-6 animate-fadeIn">
      <button
        type="button"
        onClick={onBack}
        className="self-start flex items-center gap-1 text-[12px] font-bold text-secondary -mb-1"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        <span>{isHindi ? 'वापस' : 'Back'}</span>
      </button>

      {/* Header */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-highest flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-secondary-fixed/70 text-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[26px]">school</span>
        </div>
        <div>
          <h1 className="font-display text-[17px] font-bold text-primary leading-tight">
            {isHindi ? 'शिक्षक लॉगिन' : 'Teacher Login'}
          </h1>
          <p className="text-[12px] text-on-surface-variant">
            {isHindi ? 'कक्षा की प्रगति देखने के लिए साइन इन करें' : 'Sign in to view class progress'}
          </p>
        </div>
      </div>

      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">wifi_off</span>
          <p className="text-[11px] text-amber-900 leading-snug">
            {isHindi
              ? 'Supabase कॉन्फ़िगर नहीं है — यह ऑफ़लाइन डेमो मोड में चल रहा है।'
              : "Supabase isn't configured — running in offline demo mode."}
          </p>
        </div>
      )}

      {/* Login form */}
      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md flex flex-col gap-3.5 border border-surface-container-highest">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface" htmlFor="teacher-id-input">
            {isHindi ? 'ईमेल पता' : 'Email Address'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">badge</span>
            <input
              id="teacher-email-input"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={isHindi ? 'आपका वास्तविक ईमेल' : 'teacher@example.com'}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-display text-[15px] font-bold focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container placeholder:font-normal placeholder:text-outline"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface" htmlFor="teacher-pin-input">
            {isHindi ? 'पिन / पासवर्ड' : 'PIN / Password'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">lock</span>
            <input
              id="teacher-pin-input"
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder={isHindi ? 'कम से कम 4 अंक' : 'At least 4 digits'}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-display text-[15px] font-bold focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container placeholder:font-normal placeholder:text-outline"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">error</span>
          <p className="text-[11.5px] text-rose-800">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isLoggingIn}
        className={`w-full h-14 rounded-xl font-display text-[16px] font-bold shadow-lg flex items-center justify-center gap-2.5 transition-all active:translate-y-0.5 ${
          canSubmit
            ? 'bg-secondary text-white'
            : 'bg-surface-container-high text-outline cursor-not-allowed opacity-70'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isLoggingIn ? 'animate-spin' : ''}`}>
          {isLoggingIn ? 'sync' : 'login'}
        </span>
        <span>
          {isLoggingIn
            ? isHindi
              ? 'साइन इन हो रहा है...'
              : 'Signing in...'
            : isHindi
            ? 'शिक्षक डैशबोर्ड खोलें'
            : 'Open Teacher Dashboard'}
        </span>
      </button>

      <button
        type="button"
        onClick={onGoToSignup}
        className="text-center text-[12.5px] font-bold text-secondary -mt-1"
      >
        {isHindi ? 'नए शिक्षक हैं? खाता बनाएं' : 'New teacher? Create an account'}
      </button>
    </div>
  );
};
