import React, { useState } from 'react';
import { StudentProfile } from '../../types';

interface PrintFallbackScreenProps {
  student: StudentProfile;
  isHindi: boolean;
}

export const PrintFallbackScreen: React.FC<PrintFallbackScreenProps> = ({ student, isHindi }) => {
  const [queued, setQueued] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleQueuePrint = () => {
    setQueued(true);
    setTimeout(() => {
      setQueued(false);
    }, 4000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 3500);
  };

  return (
    <div className="flex flex-col w-full gap-space-md animate-fadeIn pb-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container p-space-md shadow-sm border border-surface-container-highest">
        <div className="flex items-start gap-space-sm">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-sm text-on-primary">
            <span className="material-symbols-outlined text-[28px]">print</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-highest text-primary text-[10px] font-bold w-fit mb-1">
              <span className="material-symbols-outlined text-[13px]">qr_code_2</span>
              <span>Zero Battery • Zero Data Needed</span>
            </div>
            <h1 className="font-display text-[18px] font-extrabold text-on-surface leading-tight">
              Print Fallback: Learning Without Screens
            </h1>
            <p className="text-[12px] text-on-surface-variant mt-1 font-medium">
              No phone or low battery? Download and print this week's customized remedial worksheet.
            </p>
          </div>
        </div>

        {/* Sync alert banner */}
        <div className="mt-space-sm p-space-xs rounded-lg bg-surface-container-high flex items-center justify-between border border-surface-container">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">wifi_off</span>
            <span className="text-[12px] font-bold text-on-surface">Offline Prepared Sheet</span>
          </div>
          <span className="font-display text-[10px] bg-inverse-surface text-on-primary px-2 py-0.5 rounded-full font-bold">
            Kiosk Ready
          </span>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col gap-space-xs">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full h-12 rounded-xl bg-primary text-on-primary font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:translate-y-0.5 hover:bg-primary-container transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">
            {downloaded ? 'file_download_done' : 'download'}
          </span>
          <span>
            {downloaded
              ? 'Worksheet PDF Saved to Downloads (240 KB)'
              : 'Download Printable PDF (A4 Format • 240 KB)'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleQueuePrint}
          className={`w-full h-12 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm active:translate-y-0.5 transition-all ${
            queued
              ? 'bg-tertiary-container text-white'
              : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {queued ? 'check_circle' : 'print_connect'}
          </span>
          <span>
            {queued
              ? 'Queued for Kiosk #4 (Ready for Spool)!'
              : 'Send to School Kiosk Printer (Queue Print)'}
          </span>
        </button>
      </div>

      {/* Physical Worksheet Preview Tile */}
      <div className="rounded-xl bg-surface-container-lowest p-space-md shadow-md flex flex-col gap-space-md border border-surface-container-highest">
        {/* Physical Sheet Header Simulation */}
        <div className="flex items-start justify-between gap-space-sm pb-space-xs border-b border-surface-container">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-tertiary-container">auto_stories</span>
              <span className="font-display text-[10px] text-tertiary-container uppercase tracking-wider font-bold">
                ShikshaSaarthi Sheet #W4-7B
              </span>
            </div>
            <h2 className="font-display text-[16px] font-bold text-primary mt-0.5">
              Week 4 Personalized Practice Sheet
            </h2>
            <span className="text-[12px] text-on-surface-variant font-medium">
              {student.className} • {student.name} (Roll No: {student.rollNo})
            </span>
          </div>

          {/* Interactive QR Marker */}
          <div className="flex flex-col items-center shrink-0 p-1.5 rounded-lg bg-surface-container-high text-center max-w-[86px] border border-surface-container">
            <svg className="w-14 h-14 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14-2h4v2h-4v-2zm-4 0h2v4h-2v-4zm2 4h4v4h-4v-4zm-4 2h2v2h-2v-2zm4-8h2v2h-2V8zm-2 2h2v2h-2v-2zm4 0h2v2h-2v-2z"></path>
            </svg>
            <span className="text-[8px] leading-tight text-on-surface-variant mt-1 font-bold">
              Scan at Kiosk to Grade
            </span>
          </div>
        </div>

        {/* Targeted Skills */}
        <div className="rounded-lg bg-surface-container-high p-space-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-secondary">target</span>
            <span className="text-[12px] font-bold text-primary">Targeted Skills: Fractions & Decimals</span>
          </div>
          <span className="text-[11px] text-on-surface-variant font-semibold">8 Custom Items</span>
        </div>

        {/* Instructions */}
        <div className="rounded-lg bg-surface-container p-space-xs flex flex-col gap-0.5 text-[12px] border border-surface-container-high">
          <div className="flex items-center gap-1.5 text-primary font-bold">
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span>Instructions / निर्देश:</span>
          </div>
          <p className="text-on-surface">1. Write final answers inside the marked boxes using pencil.</p>
          <p className="text-on-surface-variant text-[11px]">
            १. पेंसिल से चिन्हित बॉक्स में अपने अंतिम उत्तर साफ लिखें।
          </p>
          <p className="text-on-surface">2. Keep the QR code clean and uncreased for rapid optical capture.</p>
        </div>

        {/* Question 1 Preview */}
        <div className="rounded-lg bg-surface-container-low p-space-sm flex flex-col gap-2 border border-surface-container">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-primary">Q1. Simplify & Compare / सरल करें</span>
              <p className="text-[13px] text-on-surface font-medium mt-0.5">
                Find the sum: <strong className="text-primary font-bold">3/4 + 2/5 = ?</strong>
              </p>
              <p className="text-[11px] text-on-surface-variant">योग ज्ञात करें: ३/४ + २/५ का मान क्या होगा?</p>
            </div>
            {/* Visual Pie */}
            <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
              <svg className="w-7 h-7 text-secondary" viewBox="0 0 32 32">
                <circle cx="16" cy="16" fill="none" opacity="0.3" r="14" stroke="currentColor" strokeWidth="2.5"></circle>
                <path d="M16 16 L16 2 A14 14 0 0 1 30 16 Z" fill="currentColor" opacity="0.8"></path>
                <path d="M16 16 L30 16 A14 14 0 0 1 16 30 Z" fill="currentColor" opacity="0.5"></path>
              </svg>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex-1 h-14 rounded-lg bg-surface-container flex items-center justify-center p-2 border border-dashed border-outline/30">
              <span className="text-[10px] text-outline font-medium">Rough Work Space / रफ़ कार्य हेतु स्थान</span>
            </div>
            <div className="w-24 h-14 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center p-1 shadow-inner border border-surface-container">
              <span className="text-[9px] text-outline uppercase font-bold">Ans / उत्तर</span>
              <div className="w-16 h-6 mt-0.5 rounded bg-surface-container-high flex items-center justify-center text-on-surface-variant font-mono font-bold text-[12px]">
                [ 23/20 ]
              </div>
            </div>
          </div>
        </div>

        {/* Question 2 Preview */}
        <div className="rounded-lg bg-surface-container-low p-space-sm flex flex-col gap-2 border border-surface-container">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[12px] font-bold text-primary">Q2. Decimal Story / दशमलव व्यावहारिक प्रश्न</span>
              <p className="text-[13px] text-on-surface font-medium mt-0.5">
                Rina bought 2.75 kg of rice and 1.5 kg of dal. What is total weight?
              </p>
              <p className="text-[11px] text-on-surface-variant">रीना ने २.७५ किग्रा चावल और १.५ किग्रा दाल खरीदी।</p>
            </div>
            <div className="w-11 h-11 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-secondary">
              <span className="material-symbols-outlined text-[22px]">scale</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex-1 h-14 rounded-lg bg-surface-container flex items-center justify-center p-2 border border-dashed border-outline/30">
              <span className="text-[10px] text-outline font-medium">Rough Work Space / रफ़ कार्य हेतु स्थान</span>
            </div>
            <div className="w-24 h-14 rounded-lg bg-surface-container-lowest flex flex-col items-center justify-center p-1 shadow-inner border border-surface-container">
              <span className="text-[9px] text-outline uppercase font-bold">Ans / उत्तर</span>
              <div className="w-16 h-6 mt-0.5 rounded bg-surface-container-high flex items-center justify-center text-outline font-bold text-[11px]">
                4.25 kg
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center py-0.5 gap-1 text-on-surface-variant text-[11px] font-semibold">
          <span className="material-symbols-outlined text-[16px]">more_horiz</span>
          <span>+6 more targeted questions in downloaded PDF</span>
        </div>
      </div>

      {/* How the Paper Bridge Works Infographic */}
      <div className="rounded-xl bg-surface-container p-space-md shadow-sm flex flex-col gap-space-sm border border-surface-container-high">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-[15px] font-bold text-primary">How the Paper Bridge Works</h3>
          <span className="font-display text-[10px] text-secondary font-bold">3 Simple Steps</span>
        </div>

        {/* Step 1 */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 font-bold text-on-primary-fixed text-[14px]">
            1
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-on-surface">Print at School or Center</span>
            <p className="text-[11px] text-on-surface-variant">
              Tap queue or take the PDF to Kiosk #4 / village Panchayat hub.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
          <div className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center shrink-0 font-bold text-on-primary-fixed text-[14px]">
            2
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-on-surface">Solve at Home with Pencil</span>
            <p className="text-[11px] text-on-surface-variant">
              Take your time under daylight or lantern. No screen distractions!
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-xs rounded-lg shadow-sm">
          <div className="w-9 h-9 rounded-full bg-tertiary-fixed-dim flex items-center justify-center shrink-0 font-bold text-on-tertiary-fixed-variant text-[14px]">
            3
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[12px] font-bold text-on-surface">Hold Under Kiosk Scanner</span>
            <p className="text-[11px] text-on-surface-variant">
              Optical AI auto-grades in 3 seconds, granting <strong className="text-tertiary">+50 XP</strong> & updating diagnostic map!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
