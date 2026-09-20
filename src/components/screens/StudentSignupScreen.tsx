import React, { useState } from 'react';

interface StudentSignupScreenProps {
  onSignup: (input: {
    name: string;
    samagraId: string;
        rollNo: string;
    schoolName: string;
    udiseCode: string;
    avatarColor: string;
    pin: string;
    classCode: string;
  }) => Promise<void>;
  onBack: () => void;
  isHindi: boolean;
  isOfflineMode: boolean;
}

const AVATAR_COLORS = [
  { id: 'blue', className: 'bg-secondary' },
  { id: 'amber', className: 'bg-amber-400' },
  { id: 'rose', className: 'bg-rose-400' },
  { id: 'violet', className: 'bg-violet-400' },
  { id: 'emerald', className: 'bg-emerald-400' },
  { id: 'sky', className: 'bg-sky-400' },
];

export const StudentSignupScreen: React.FC<StudentSignupScreenProps> = ({
  onSignup,
  onBack,
  isHindi,
  isOfflineMode,
}) => {
  const [name, setName] = useState<string>('');
  const [samagraId, setSamagraId] = useState<string>('');
    const [rollNo, setRollNo] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [udiseCode, setUdiseCode] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [classCode, setClassCode] = useState<string>('');
  const [avatarColor, setAvatarColor] = useState<string>('blue');
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    name.trim().length > 1 &&
    samagraId.trim().length > 0 &&
    schoolName.trim().length > 0 &&
    classCode.trim().length > 0 &&
    pin.trim().length >= 6;
  const initial = name.trim().charAt(0).toUpperCase() || '?';
  const avatarClass = AVATAR_COLORS.find((a) => a.id === avatarColor)?.className ?? 'bg-secondary';

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsCreating(true);
    setError(null);
    try {
      await onSignup({
        name: name.trim(),
        samagraId: samagraId.trim(),
        rollNo: rollNo.trim(),
        schoolName: schoolName.trim(),
        udiseCode: udiseCode.trim(),
        avatarColor,
        pin: pin.trim(),
        classCode: classCode.trim().toUpperCase(),
      });
    } catch (err: any) {
      setError(
        err?.message?.includes('already registered') || err?.code === '23505'
          ? isHindi
            ? 'यह Student/Samagra ID पहले से पंजीकृत है या Class Code गलत है। लॉगिन/कोड जांचें।'
            : 'This Student/Samagra ID is already registered, or the Class Code is invalid. Check the code and try again.'
          : err?.message ?? (isHindi ? 'खाता नहीं बन सका।' : 'Could not create account.')
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-3.5 pb-6 animate-fadeIn font-playful bg-gradient-to-b from-[#eaf3ff] to-transparent -mx-3.5 px-3.5 -mt-3 pt-3">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-[12px] font-bold text-secondary font-sans"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{isHindi ? 'वापस' : 'Back'}</span>
        </button>
        <span className="text-[11px] font-bold text-on-surface-variant font-sans">
          {isHindi ? 'नए हैं? चलिए शुरू करें!' : "New here? Let's set you up!"}
        </span>
      </div>

      <div className="text-center pt-1">
        <h1 className="font-bold text-[21px] text-primary">
          {isHindi ? 'अपना खाता बनाएं 🎨' : 'Create your account 🎨'}
        </h1>
      </div>

      {isOfflineMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-2 font-sans">
          <span className="material-symbols-outlined text-[18px] text-amber-700 shrink-0">wifi_off</span>
          <p className="text-[11px] text-amber-900 leading-snug">
            {isHindi
              ? 'Supabase कॉन्फ़िगर नहीं है — यह खाता सहेजा नहीं जाएगा (डेमो मोड)।'
              : "Supabase isn't configured — this account won't actually be saved (demo mode)."}
          </p>
        </div>
      )}

      {/* Avatar preview */}
      <div className="flex items-center justify-center pt-1">
        <div
          className={`${avatarClass} w-16 h-16 rounded-full flex items-center justify-center text-white text-[24px] font-bold border-4 border-white shadow-lg ring-4 ring-secondary/40 transition-colors`}
        >
          {initial}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2.5">
        {AVATAR_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setAvatarColor(c.id)}
            className={`${c.className} w-9 h-9 rounded-full border-2 border-white shadow transition-all ${
              avatarColor === c.id ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            aria-label={`Choose ${c.id} avatar color`}
          />
        ))}
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-2.5 pt-1 font-sans">
        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">badge</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 text-[12.5px] font-bold outline-none bg-transparent"
            placeholder={isHindi ? 'आपका नाम' : 'Your name'}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">fingerprint</span>
            <input
              value={samagraId}
              onChange={(e) => setSamagraId(e.target.value)}
              className="flex-1 text-[12px] font-bold outline-none bg-transparent min-w-0"
              placeholder={isHindi ? 'Samagra ID' : 'Samagra ID'}
            />
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-secondary shrink-0">tag</span>
            <input
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="flex-1 text-[12px] font-bold outline-none bg-transparent min-w-0"
              placeholder={isHindi ? 'रोल नं.' : 'Roll No.'}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5 border border-secondary/10">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">school</span>
          <div className="flex-1">
            <p className="text-[12.5px] font-bold text-on-surface">
              {isHindi ? 'कक्षा अपने आप जुड़ जाएगी' : 'Class will be assigned automatically'}
            </p>
            <p className="text-[10.5px] text-on-surface-variant mt-0.5">
              {isHindi
                ? 'शिक्षक का Class Code डालें — सही कक्षा उसी Code से मिलेगी।'
                : 'Enter your teacher’s Class Code — your class is assigned from the code.'}
            </p>
          </div>
          <span className="material-symbols-outlined text-[20px] text-secondary">auto_awesome</span>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">group</span>
          <input
            value={classCode}
            onChange={(e) => setClassCode(e.target.value.toUpperCase())}
            className="flex-1 text-[12.5px] font-bold outline-none bg-transparent"
            placeholder={isHindi ? 'शिक्षक का Class Code (जैसे SHK-7A-X4K9)' : 'Teacher Class Code (e.g. SHK-7A-X4K9)'}
          />
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">domain</span>
          <input
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            className="flex-1 text-[12.5px] font-bold outline-none bg-transparent"
            placeholder={isHindi ? 'स्कूल का नाम' : 'School name'}
          />
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">pin</span>
          <input
            value={udiseCode}
            onChange={(e) => setUdiseCode(e.target.value)}
            className="flex-1 text-[12.5px] font-bold outline-none bg-transparent"
            placeholder={isHindi ? 'UDISE+ कोड (वैकल्पिक)' : 'UDISE+ code (optional)'}
          />
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">lock</span>
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="flex-1 text-[12.5px] font-bold outline-none bg-transparent"
            placeholder={isHindi ? 'एक 6-अंकों का पिन बनाएं' : 'Set a 6-digit PIN'}
          />
        </div>

        <div className="bg-tertiary-fixed/40 rounded-2xl p-2.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-tertiary-container">stars</span>
          <p className="text-[10.5px] text-on-surface-variant leading-snug">
            {isHindi
              ? 'साइन अप पूरा करके अपना पहला +20 XP बैज पाएं!'
              : 'Finish signup to unlock your first +20 XP badge!'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-2.5 flex items-center gap-2 font-sans">
          <span className="material-symbols-outlined text-[16px] text-rose-600 shrink-0">error</span>
          <p className="text-[11.5px] text-rose-800">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || isCreating}
        className={`w-full h-14 rounded-full font-bold text-[15px] flex items-center justify-center gap-2 shadow-xl transition-all active:translate-y-0.5 ${
          canSubmit ? 'bg-primary text-white' : 'bg-surface-container-high text-outline cursor-not-allowed opacity-70'
        }`}
      >
        <span className={`material-symbols-outlined text-[19px] ${isCreating ? 'animate-spin' : ''}`}>
          {isCreating ? 'sync' : 'celebration'}
        </span>
        {isCreating
          ? isHindi
            ? 'खाता बन रहा है...'
            : 'Creating account...'
          : isHindi
          ? 'मेरा खाता बनाएं'
          : 'Create My Account'}
      </button>
    </div>
  );
};
