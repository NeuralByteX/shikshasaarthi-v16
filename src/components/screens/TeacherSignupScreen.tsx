import React, { useState } from 'react';

interface TeacherSignupScreenProps {
  onSignup: (input: {
    name: string;
    employeeId: string;
    email: string;
    schoolName: string;
    udiseCode: string;
    pin: string;
  }) => Promise<void>;
  onBack: () => void;
  isHindi: boolean;
  isOfflineMode: boolean;
}

export const TeacherSignupScreen: React.FC<TeacherSignupScreenProps> = ({
  onSignup,
  onBack,
  isHindi,
  isOfflineMode,
}) => {
  const [name, setName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [email, setEmail] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [udiseCode, setUdiseCode] = useState('');
  const [pin, setPin] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 1 &&
    employeeId.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    schoolName.trim().length > 0 &&
    pin.trim().length >= 4;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsCreating(true);
    setError(null);
    try {
      await onSignup({
        name: name.trim(),
        employeeId: employeeId.trim(),
        email: email.trim().toLowerCase(),
        schoolName: schoolName.trim(),
        udiseCode: udiseCode.trim(),
        pin: pin.trim(),
      });
    } catch (err: any) {
      setError(
        err?.message?.includes('already registered') || err?.code === '23505'
          ? isHindi
            ? 'यह शिक्षक आईडी पहले से पंजीकृत है। लॉगिन करने की कोशिश करें।'
            : 'This Teacher ID is already registered. Try logging in instead.'
          : err?.message ?? (isHindi ? 'खाता नहीं बन सका।' : 'Could not create account.')
      );
    } finally {
      setIsCreating(false);
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

      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-sm border border-surface-container-highest flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-secondary-fixed/70 text-secondary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[26px]">person_add</span>
        </div>
        <div>
          <h1 className="font-display text-[17px] font-bold text-primary leading-tight">
            {isHindi ? 'शिक्षक खाता बनाएं' : 'Create Teacher Account'}
          </h1>
          <p className="text-[12px] text-on-surface-variant">
            {isHindi ? 'कक्षा डैशबोर्ड एक्सेस करने के लिए पंजीकरण करें' : 'Register to access the class dashboard'}
          </p>
        </div>
      </div>

      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">wifi_off</span>
          <p className="text-[11px] text-amber-900 leading-snug">
            {isHindi
              ? 'Supabase कॉन्फ़िगर नहीं है — यह खाता सहेजा नहीं जाएगा (डेमो मोड)।'
              : "Supabase isn't configured — this account won't actually be saved (demo mode)."}
          </p>
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-xl p-4 shadow-md flex flex-col gap-3.5 border border-surface-container-highest">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface">
            {isHindi ? 'पूरा नाम' : 'Full Name'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">person</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isHindi ? 'जैसे कविता शर्मा' : 'e.g. Kavita Sharma'}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-display text-[15px] font-bold focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container placeholder:font-normal placeholder:text-outline"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface">
            {isHindi ? 'शिक्षक आईडी' : 'Teacher / Employee ID'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">badge</span>
            <input
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              placeholder={isHindi ? 'जैसे TCH-20481' : 'e.g. TCH-20481'}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-display text-[15px] font-bold focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container placeholder:font-normal placeholder:text-outline"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface">
            {isHindi ? 'वास्तविक ईमेल' : 'Real Email Address'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              autoComplete="email"
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-display text-[15px] font-bold focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container placeholder:font-normal placeholder:text-outline"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface">
            {isHindi ? 'स्कूल का नाम' : 'School Name'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">domain</span>
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-display text-[15px] font-bold focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface">
            {isHindi ? 'UDISE+ कोड (वैकल्पिक)' : 'UDISE+ Code (optional)'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">pin</span>
            <input
              value={udiseCode}
              onChange={(e) => setUdiseCode(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-surface-container-low text-on-surface font-display text-[15px] font-bold focus:outline-none focus:bg-surface-container-high transition-colors border border-surface-container"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-bold text-on-surface">
            {isHindi ? 'एक पिन बनाएं' : 'Set a PIN'}
          </label>
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-secondary text-[20px]">lock</span>
            <input
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

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isCreating}
        className={`w-full h-14 rounded-xl font-display text-[16px] font-bold shadow-lg flex items-center justify-center gap-2.5 transition-all active:translate-y-0.5 ${
          canSubmit
            ? 'bg-secondary text-white'
            : 'bg-surface-container-high text-outline cursor-not-allowed opacity-70'
        }`}
      >
        <span className={`material-symbols-outlined text-[22px] ${isCreating ? 'animate-spin' : ''}`}>
          {isCreating ? 'sync' : 'check_circle'}
        </span>
        <span>
          {isCreating
            ? isHindi
              ? 'खाता बन रहा है...'
              : 'Creating account...'
            : isHindi
            ? 'खाता बनाएं'
            : 'Create Account'}
        </span>
      </button>
    </div>
  );
};
