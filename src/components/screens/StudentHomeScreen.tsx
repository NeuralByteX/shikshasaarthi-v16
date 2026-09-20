import React, { useState } from 'react';
import { StudentProfile } from '../../types';

interface StudentHomeScreenProps {
  student: StudentProfile;
  onStartDiagnostic: () => void;
  onStartPractice?: () => void;
  onOpenDuel?: () => void;
  onOpenRealWorld?: () => void;
  onPerformSync?: () => void;
  isSyncing?: boolean;
  pendingCount: number;
  isOnline: boolean;
  lastSyncAt: string | null;
  isHindi: boolean;
}

export const StudentHomeScreen: React.FC<StudentHomeScreenProps> = ({
  student,
  onStartDiagnostic,
  onStartPractice,
  onOpenDuel,
  onOpenRealWorld,
  onPerformSync,
  isSyncing = false,
  pendingCount,
  isOnline,
  lastSyncAt,
  isHindi,
}) => {
  const [offlineDetailsOpen, setOfflineDetailsOpen] = useState(false);
  const [exploreMoreOpen, setExploreMoreOpen] = useState(false);

  return (
    <div className="flex flex-col w-full gap-4 animate-fadeIn pb-8 max-w-2xl mx-auto">
      {/* 1. Welcome and Sync Status Section */}
      <section className="flex flex-col gap-2.5">
        {/* Welcome Text */}
        <div className="flex items-center justify-between gap-2 px-0.5">
          <div>
            <h1 className="font-display text-[18px] font-bold text-primary leading-tight">
              {isHindi ? `नमस्ते, ${student.nameHi}!` : `Welcome, ${student.name}!`}
            </h1>
            <p className="text-[13px] text-on-surface-variant font-medium mt-0.5">
              {isHindi
                ? 'आज का लक्ष्य: निदानात्मक जांच पूरा करें और +50 XP प्राप्त करें'
                : "Today's Goal: Take the diagnostic & earn +50 XP"}
            </p>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface text-[12px] font-bold shrink-0 shadow-sm">
            <span className="text-sm">🔥</span>
            <span>{isHindi ? `${student.streakDays} दिन` : `${student.streakDays}d Streak`}</span>
          </div>
        </div>

        {/* Compact Offline Learning Protected Card */}
        <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-3 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {/* Status indicators */}
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              {/* Offline Ready Badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-300'
              }`}>
                <span className={`relative flex h-2 w-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span>{isOnline ? (isHindi ? 'ऑनलाइन' : 'Online') : (isHindi ? 'ऑफ़लाइन' : 'Offline')}</span>
              </div>

              {/* Last synced time */}
              <span className="text-[12px] text-on-surface-variant font-medium truncate">
                {lastSyncAt
                  ? `${isHindi ? 'अंतिम सिंक: ' : 'Last sync: '}${new Date(lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                  : (isHindi ? 'अभी तक कोई सिंक नहीं' : 'Not synced yet')}
              </span>

              {/* Pending count */}
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold shrink-0 ${
                  pendingCount > 0
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[13px]">
                  {pendingCount > 0 ? 'pending_actions' : 'check'}
                </span>
                <span>
                  {pendingCount > 0
                    ? isHindi
                      ? `${pendingCount} कतार में`
                      : `${pendingCount} to sync`
                    : isHindi
                    ? 'सभी सिंक हैं'
                    : 'All synced'}
                </span>
              </span>
            </div>

            {/* Sync Now Button */}
            <button
              type="button"
              onClick={onPerformSync}
              disabled={isSyncing}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold shadow-sm transition-all active:scale-95 shrink-0 ${
                isSyncing
                  ? 'bg-secondary/70 text-white cursor-wait'
                  : 'bg-primary text-white hover:bg-[#00387a]'
              }`}
            >
              <span className={`material-symbols-outlined text-[14px] ${isSyncing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>
                {isSyncing
                  ? isHindi
                    ? 'सिंक हो रहा है...'
                    : 'Syncing...'
                  : isHindi
                  ? 'सिंक करें'
                  : 'Sync Now'}
              </span>
            </button>
          </div>

          {/* Collapsible "How offline mode works" */}
          <div className="pt-1 border-t border-surface-container-highest/60">
            <button
              type="button"
              onClick={() => setOfflineDetailsOpen((prev) => !prev)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary hover:text-primary transition-colors focus:outline-none"
            >
              <span>
                {isHindi ? 'ऑफ़लाइन मोड कैसे कार्य करता है' : 'How offline mode works'}
              </span>
              <span
                className={`material-symbols-outlined text-[15px] transition-transform ${
                  offlineDetailsOpen ? 'rotate-180' : ''
                }`}
              >
                expand_more
              </span>
            </button>

            {offlineDetailsOpen && (
              <div className="mt-2 text-[12px] text-on-surface-variant leading-relaxed bg-surface-container-lowest p-2.5 rounded-lg border border-surface-container animate-fadeIn">
                <p>
                  {isHindi
                    ? 'कनेक्शन न होने पर आपके सीखने के परिणाम इस डिवाइस के IndexedDB में सुरक्षित रहते हैं। इंटरनेट वापस आने पर लंबित परिणाम अपने-आप Supabase में सिंक हो जाते हैं।'
                    : 'Your learning results are stored in IndexedDB on this device when the connection is unavailable. Pending results are automatically sent to Supabase when the internet returns.'}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-tertiary-container bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
                    💾 {isHindi ? 'IndexedDB स्थानीय संग्रह' : 'IndexedDB Local Storage'}
                  </span>
                  <span className="text-[11px] text-outline">
                    {isHindi ? 'लंबित डेटा सिंक कतार' : 'Pending sync queue'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Current Mission Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col gap-2 relative overflow-hidden">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-secondary text-[11px] font-bold uppercase tracking-wide">
            <span className="material-symbols-outlined text-[13px]">flag</span>
            <span>{isHindi ? 'वर्तमान लक्ष्य' : 'Current Mission'}</span>
          </span>
          <span className="text-[12px] font-bold text-tertiary-container bg-tertiary-fixed/30 px-2 py-0.5 rounded-full">
            +50 XP {isHindi ? 'बोनस' : 'Bonus'}
          </span>
        </div>

        <div>
          <h2 className="font-display text-[17px] font-bold text-primary leading-tight">
            {isHindi
              ? 'भिन्न: असमान हर वाले भिन्न (LCM विधि)'
              : 'Fractions: Unlike Denominators'}
          </h2>
          <p className="text-[13px] text-on-surface-variant mt-1 leading-relaxed">
            {isHindi
              ? 'समान हर ज्ञात करके असमान भिन्नों को जोड़ने और घटाने की समझ को परखें।'
              : 'Identify common denominators and master fraction addition using LCM visual models.'}
          </p>
        </div>

        {/* Info badges */}
        <div className="flex items-center gap-3 pt-1 text-[12px] text-on-surface-variant font-medium">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">quiz</span>
            <span>{isHindi ? '5 त्वरित प्रश्न' : '5 Quick Questions'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">schedule</span>
            <span>{isHindi ? '~3 मिनट' : '~3 Minutes'}</span>
          </div>
        </div>
      </section>

      {/* 3. Start Diagnostic Button (Visually Prominent) */}
      <section className="w-full">
        <button
          type="button"
          onClick={onStartDiagnostic}
          aria-label={isHindi ? 'निदानात्मक जांच शुरू करें' : 'Start Diagnostic'}
          className="w-full group bg-gradient-to-r from-primary via-[#00387a] to-secondary text-white rounded-2xl p-4 shadow-lg hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-between gap-3 border border-white/20 text-left"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-white/15 text-white flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-[16px] font-extrabold leading-tight text-white tracking-wide">
                {isHindi ? 'निदानात्मक जांच शुरू करें' : 'Start Diagnostic'}
              </span>
              <span className="text-[12px] text-white/85 mt-0.5 truncate">
                {isHindi
                  ? '5 त्वरित प्रश्न • तुरंत वैयक्तिक विश्लेषण रिपोर्ट'
                  : '5 quick questions • Instant concept gap analysis'}
              </span>
            </div>
          </div>

          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0 group-hover:translate-x-1 transition-transform">
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </div>
        </button>
      </section>

      {/* 4. Progress / XP Summary Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col gap-3">
        <div className="flex justify-between items-center text-on-surface">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">military_tech</span>
            <span className="text-[14px] font-bold text-primary">
              {isHindi ? `स्तर ${student.level} खोजी` : `Level ${student.level} Explorer`}
            </span>
          </div>
          <span className="font-display text-[12px] text-on-surface-variant font-bold bg-surface-container px-2.5 py-0.5 rounded-full">
            {student.currentXp} / {student.targetXp} XP
          </span>
        </div>

        {/* XP Progress Bar */}
        <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden p-0.5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-secondary to-secondary-container rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(100, (student.currentXp / student.targetXp) * 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-[12px] text-on-surface-variant font-medium">
          <span>
            {isHindi
              ? `स्तर 9 विद्वान के लिए ${student.targetXp - student.currentXp} XP आवश्यक`
              : `${student.targetXp - student.currentXp} XP needed for Level 9 Scholar`}
          </span>
          <span className="text-secondary font-bold">
            {Math.round((student.currentXp / student.targetXp) * 100)}%
          </span>
        </div>
      </section>

      {/* 5. Recommended Practice Section */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[18px]">menu_book</span>
            <h3 className="font-display text-[14px] font-bold text-primary">
              {isHindi ? 'अनुशंसित उपचारात्मक अभ्यास' : 'Recommended Practice'}
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-secondary">
            {isHindi ? 'कक्षा 7B गणित' : 'Class 7B Maths'}
          </span>
        </div>

        <p className="text-[13px] text-on-surface-variant leading-relaxed">
          {isHindi
            ? 'रोटी और पिज्जा मॉडल और संकेतों के साथ असमान भिन्नों का चरण-दर-चरण अभ्यास करें।'
            : 'Step-by-step remedial exercises using visual models and interactive hints to master fractions.'}
        </p>

        <button
          type="button"
          onClick={onStartPractice || onStartDiagnostic}
          className="w-full py-2.5 px-4 rounded-xl bg-surface-container-high hover:bg-secondary-fixed text-primary font-bold text-[13px] flex items-center justify-center gap-2 transition-colors active:scale-98"
        >
          <span className="material-symbols-outlined text-[18px] text-secondary">edit_note</span>
          <span>{isHindi ? 'उपचारात्मक अभ्यास शुरू करें' : 'Start Remedial Practice'}</span>
        </button>
      </section>

      {/* 5b. Real Life Applications Promo */}
      {onOpenRealWorld && (
        <section className="bg-gradient-to-br from-tertiary-fixed/30 to-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-highest flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-tertiary-fixed/50 text-tertiary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">travel_explore</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-[14px] font-bold text-primary leading-snug">
              {isHindi ? 'जो सीखा वो असल ज़िंदगी में देखें' : 'See What You Learn in Real Life'}
            </h3>
            <p className="text-[12px] text-on-surface-variant leading-snug mt-0.5">
              {isHindi
                ? 'बाज़ार, रसोई और यात्रा में भिन्न, पूर्णांक और प्रतिशत कैसे काम आते हैं'
                : 'Discover how fractions, integers & percentages show up at the market, kitchen and beyond'}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenRealWorld}
            aria-label={isHindi ? 'वास्तविक जीवन उदाहरण देखें' : 'Explore real-life examples'}
            className="shrink-0 w-9 h-9 rounded-full bg-tertiary-container text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </section>
      )}

      {/* 6. Other Missions Below with Collapsible Explore More */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="font-display text-[14px] font-bold text-primary">
            {isHindi ? 'अन्य विषय व चुनौतियां' : 'Other Topics & Missions'}
          </h3>
        </div>

        {/* Completed Topic: Integers Basics */}
        <div className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm border border-surface-container-highest flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-tertiary-fixed shrink-0">
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                verified
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-tertiary-container uppercase tracking-wide">
                {isHindi ? 'पूर्ण • 100% निपुणता' : 'Completed • 100% Mastery'}
              </span>
              <h4 className="font-bold text-[14px] text-on-surface truncate">
                {isHindi ? 'पूर्णांक परिचय (Integers Basics)' : 'Integers Basics'}
              </h4>
              <span className="text-[12px] text-on-surface-variant">
                {isHindi ? '+120 XP अर्जित' : '+120 XP earned'}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs">⭐⭐⭐</span>
          </div>
        </div>

        {/* Collapsible "Explore More" for Secondary Sections */}
        <div className="bg-surface-container-low rounded-2xl border border-surface-container-highest overflow-hidden">
          <button
            type="button"
            onClick={() => setExploreMoreOpen((prev) => !prev)}
            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-surface-container transition-colors focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[18px]">explore</span>
              <span className="font-display text-[13px] font-bold text-primary">
                {isHindi ? 'अधिक चुनौतियां देखें (3)' : 'Explore More (3)'}
              </span>
            </div>
            <span
              className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform ${
                exploreMoreOpen ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
          </button>

          {exploreMoreOpen && (
            <div className="px-4 pb-4 flex flex-col gap-3 pt-1 border-t border-surface-container-highest/50 animate-fadeIn">
              {/* Secondary Item 1: Locked Decimals & Percentages */}
              <div className="bg-surface-container-lowest rounded-xl p-3 border border-dashed border-outline/30 flex items-center justify-between gap-3 opacity-80">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-outline shrink-0">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-outline uppercase">
                      {isHindi ? 'अभी बंद है' : 'Locked'}
                    </span>
                    <h4 className="font-bold text-[13px] text-on-surface-variant truncate">
                      {isHindi ? 'दशमलव और प्रतिशत' : 'Decimals & Percentages'}
                    </h4>
                    <p className="text-[11px] text-outline">
                      {isHindi
                        ? 'भिन्न पूरा करने के बाद खुलेगा'
                        : 'Unlocks after completing Fractions'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Item 2: Weekly Boss Arena */}
              <div className="bg-surface-container-lowest rounded-xl p-3 border border-surface-container-highest flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-amber-800 uppercase">
                      {isHindi ? 'साप्ताहिक दंगल' : 'Weekly Arena'}
                    </span>
                    <h4 className="font-bold text-[13px] text-on-surface truncate">
                      {isHindi ? 'कक्षा 7B बॉस बैटल' : 'Class 7B Boss Battle'}
                    </h4>
                    <p className="text-[11px] text-on-surface-variant">
                      {isHindi ? '2 दिन में खुलेगा' : 'Unlocks in 2 days'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Secondary Item 3: Classmates Quiz Duel Activity */}
              {onOpenDuel && (
                <div className="bg-surface-container-lowest rounded-xl p-3 border border-surface-container-highest flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">swords</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-bold text-blue-800 uppercase">
                        {isHindi ? 'सहपाठी मुकाबला' : 'Classmate Duel'}
                      </span>
                      <h4 className="font-bold text-[13px] text-on-surface truncate">
                        {isHindi ? 'दो लैपटॉप पर लाइव मुकाबला' : 'Live duel, two laptops'}
                      </h4>
                      <p className="text-[11px] text-on-surface-variant">
                        {isHindi ? 'इंटरनेट ज़रूरी है' : 'Requires internet'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenDuel}
                    className="px-3 py-1 rounded-lg bg-secondary text-white text-[11px] font-bold hover:bg-secondary-container transition-colors shrink-0"
                  >
                    {isHindi ? 'खेलें' : 'Play'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
