import React, { useState } from 'react';

interface KioskLoginScreenProps {
  onLogin: (samagraId: string, pin: string) => Promise<void>;
  onBack?: () => void;
  onGoToSignup?: () => void;
  isHindi: boolean;
  isOfflineMode: boolean;
}

export const KioskLoginScreen: React.FC<KioskLoginScreenProps> = ({
  onLogin,
  onBack,
  onGoToSignup,
  isHindi,
  isOfflineMode,
}) => {
  const [samagraId, setSamagraId] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = samagraId.trim().length > 0 && pin.trim().length >= 6;

  const handleStart = async () => {
    if (!canSubmit) return;
    setIsStarting(true);
    setError(null);
    try {
      await onLogin(samagraId.trim(), pin.trim());
    } catch (err: any) {
      setError(
        err?.message?.includes('Invalid login')
          ? isHindi
            ? 'गलत Student ID या पिन। कृपया दोबारा जांचें।'
            : 'Incorrect Student ID or PIN. Please check and try again.'
          : err?.message ?? (isHindi ? 'लॉगिन विफल रहा।' : 'Login failed.')
      );
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-6 animate-fadeIn font-playful bg-gradient-to-b from-[#eaf3ff] to-transparent -mx-3.5 px-3.5 -mt-3 pt-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="self-start flex items-center gap-1 text-[12px] font-bold text-secondary font-sans -mb-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{isHindi ? 'वापस' : 'Back'}</span>
        </button>
      )}

      {/* Header */}
      <div className="text-center pt-1">
        <div className="w-20 h-20 mx-auto rounded-[26px] bg-gradient-to-br from-secondary to-secondary-container flex items-center justify-center shadow-lg rotate-3">
          <span className="material-symbols-outlined text-[38px] text-white">celebration</span>
        </div>
        <h1 className="font-bold text-[22px] text-primary mt-3">
          {isHindi ? 'नमस्ते! 👋' : 'Hey there! 👋'}
        </h1>
        <p className="text-[12.5px] text-on-surface-variant font-sans">
          {isHindi ? 'लॉगिन करने के लिए अपनी जानकारी भरें' : 'Enter your details to log in'}
        </p>
      </div>

      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2 font-sans">
          <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">wifi_off</span>
          <p className="text-[11px] text-amber-900 leading-snug">
            {isHindi
              ? 'Supabase कॉन्फ़िगर नहीं है — यह ऑफ़लाइन डेमो मोड में चल रहा है। कोई भी विवरण दर्ज करें।'
              : 'Supabase isn\u2019t configured — running in offline demo mode. Enter any details to continue.'}
          </p>
        </div>
      )}

      {/* Login fields */}
      <div className="flex flex-col gap-2.5 pt-1 font-sans">
        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">badge</span>
          <input
            value={samagraId}
            onChange={(e) => setSamagraId(e.target.value)}
            className="flex-1 text-[13px] font-bold outline-none bg-transparent"
            placeholder={isHindi ? 'Samagra ID / Student ID' : 'Samagra ID / Student ID'}
            autoComplete="username"
          />
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">lock</span>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="flex-1 text-[13px] font-bold outline-none bg-transparent"
            placeholder={isHindi ? 'पिन' : 'PIN'}
            autoComplete="current-password"
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center gap-2 font-sans">
          <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">error</span>
          <p className="text-[11.5px] text-rose-800">{error}</p>
        </div>
      )}

      {/* Offline note */}
      <div className="bg-tertiary-fixed/40 rounded-2xl p-3 flex items-center gap-2 font-sans">
        <span className="material-symbols-outlined text-[18px] text-tertiary-container">wifi_off</span>
        <p className="text-[11px] text-on-surface-variant leading-snug">
          {isHindi
            ? 'पहली बार खाता बनाने/लॉगिन के लिए इंटरनेट चाहिए; उसके बाद अभ्यास ऑफ़लाइन काम करता है।'
            : 'Internet is needed for first-time account setup/login; practice works offline after that.'}
        </p>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={handleStart}
        disabled={!canSubmit || isStarting}
        className={`w-full h-14 rounded-full font-bold text-[16px] flex items-center justify-center gap-2 shadow-xl transition-all active:translate-y-0.5 ${
          canSubmit ? 'bg-primary text-white' : 'bg-surface-container-high text-outline cursor-not-allowed opacity-70'
        }`}
      >
        <span className={`material-symbols-outlined text-[20px] ${isStarting ? 'animate-spin' : ''}`}>
          {isStarting ? 'sync' : 'arrow_forward'}
        </span>
        {isStarting ? (isHindi ? 'जांच हो रही है...' : 'Checking...') : isHindi ? 'चलिए शुरू करें!' : "Let's Go!"}
      </button>

      {onGoToSignup && (
        <button
          type="button"
          onClick={onGoToSignup}
          className="text-center text-[12.5px] font-bold text-secondary font-sans -mt-1"
        >
          {isHindi ? 'नए हैं? खाता बनाएं' : 'New here? Create an account'}
        </button>
      )}
    </div>
  );
};
