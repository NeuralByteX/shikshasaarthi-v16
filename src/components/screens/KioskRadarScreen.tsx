import React, { useState } from 'react';
import { StudentProfile } from '../../types';

interface KioskRadarScreenProps {
  student: StudentProfile;
  onSyncComplete: () => void;
  isHindi: boolean;
}

export const KioskRadarScreen: React.FC<KioskRadarScreenProps> = ({
  student,
  onSyncComplete,
  isHindi,
}) => {
  const [syncing, setSyncing] = useState(false);
  const [syncedSuccess, setSyncedSuccess] = useState(false);

  const handleBroadcastSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setSyncedSuccess(true);
      onSyncComplete();
      setTimeout(() => {
        setSyncedSuccess(false);
      }, 4000);
    }, 1800);
  };

  return (
    <div className="flex flex-col w-full gap-space-md animate-fadeIn pb-6">
      {/* Radar Header */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary p-space-md rounded-2xl text-white shadow-md flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-primary text-[10px] font-bold">
              NDEAR Mesh v2.4
            </span>
            <span className="text-[11px] text-primary-fixed font-semibold">Zero Internet Required</span>
          </div>
          <h1 className="font-display text-[18px] font-extrabold mt-1 leading-tight">
            Kiosk Mesh Radar • कियोस्क रडार
          </h1>
          <p className="text-[12px] text-white/85 font-medium">
            Local Peer-to-Peer Wi-Fi Direct & Bluetooth 5.0 Network
          </p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-tertiary-fixed shrink-0">
          <span className="material-symbols-outlined text-[26px]">radar</span>
        </div>
      </div>

      {/* Interactive Radar Visualizer Screen */}
      <div className="relative w-full h-64 rounded-2xl bg-surface-container-lowest border border-surface-container-highest shadow-sm overflow-hidden flex items-center justify-center">
        {/* Concentric circles */}
        <div className="absolute w-56 h-56 rounded-full border border-secondary/20"></div>
        <div className="absolute w-40 h-40 rounded-full border border-secondary/30"></div>
        <div className="absolute w-24 h-24 rounded-full border border-secondary/40"></div>

        {/* Rotating radar scanner sweep */}
        <div className="absolute w-56 h-56 rounded-full overflow-hidden pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-secondary/30 via-transparent to-transparent animate-spin origin-center"></div>
        </div>

        {/* Center Node (Aarav's Device) */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-surface-container-lowest">
            <span className="material-symbols-outlined text-[20px]">phone_android</span>
          </div>
          <span className="text-[10px] font-bold text-primary bg-surface-container px-2 py-0.5 rounded-full mt-1">
            You (Aarav)
          </span>
        </div>

        {/* Node 1: Kiosk #04 (Connected, green) */}
        <div className="absolute top-8 right-16 flex flex-col items-center">
          <div className="w-8 h-8 rounded-full bg-tertiary text-white flex items-center justify-center shadow-md animate-pulse">
            <span className="material-symbols-outlined text-[16px]">cell_tower</span>
          </div>
          <span className="text-[9px] font-bold text-tertiary bg-white px-1.5 py-0.5 rounded shadow mt-0.5">
            Kiosk #04 (94%)
          </span>
        </div>

        {/* Node 2: Kiosk #02 */}
        <div className="absolute bottom-8 left-12 flex flex-col items-center">
          <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shadow">
            <span className="material-symbols-outlined text-[14px]">cell_tower</span>
          </div>
          <span className="text-[9px] font-bold text-secondary bg-white px-1.5 py-0.5 rounded shadow mt-0.5">
            Kiosk #02 (68%)
          </span>
        </div>

        {/* Node 3: Mobile Van Kiosk */}
        <div className="absolute top-12 left-14 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-surface-variant text-on-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[13px]">rv_hookup</span>
          </div>
          <span className="text-[9px] font-semibold text-outline bg-white px-1 rounded shadow mt-0.5">
            Mobile Van (42%)
          </span>
        </div>
      </div>

      {/* Sync Success Alert */}
      {syncedSuccess && (
        <div className="p-space-sm rounded-xl bg-tertiary text-white font-bold text-[12px] flex items-center gap-2 shadow-md animate-fadeIn">
          <span
            className="material-symbols-outlined text-[20px] text-tertiary-fixed"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <span>
            सफलतापूर्वक सिंक हुआ! All local learning packets synced to Kiosk Node #04 & teacher server.
          </span>
        </div>
      )}

      {/* Detected Kiosks List */}
      <div className="flex flex-col gap-2">
        <span className="text-[12px] font-bold text-on-surface px-1">Detected Kiosks in School Perimeter:</span>

        {/* Kiosk #04 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl border-2 border-tertiary/40 shadow-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
              <span className="material-symbols-outlined text-[20px]">router</span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-display text-[13px] font-bold text-primary">
                  Kiosk Node #04 (Science Block)
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-tertiary text-white text-[9px] font-bold">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant font-medium">
                Signal: 94% (Excellent) • 14 peers connected
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-tertiary">Connected</span>
        </div>

        {/* Kiosk #02 */}
        <div className="bg-surface-container-lowest p-space-sm rounded-xl border border-surface-container-highest shadow-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
              <span className="material-symbols-outlined text-[20px]">router</span>
            </div>
            <div>
              <h3 className="font-display text-[13px] font-bold text-primary">
                Kiosk Node #02 (Main Courtyard)
              </h3>
              <p className="text-[11px] text-on-surface-variant font-medium">
                Signal: 68% • Range: 18m
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-secondary">Available</span>
        </div>
      </div>

      {/* Sync Queue Breakdown */}
      <div className="bg-surface-container-low p-space-sm rounded-xl border border-surface-container flex flex-col gap-2">
        <div className="flex items-center justify-between text-[12px] font-bold text-primary">
          <span>Pending Sync Payloads (2)</span>
          <span className="text-[10px] text-secondary font-semibold">Ready for Hash Verify</span>
        </div>
        <div className="text-[11px] text-on-surface-variant flex flex-col gap-1">
          <div className="flex items-center justify-between py-1 border-b border-surface-container">
            <span>• Fractions Diagnostic Result (40% → 80% Remedial)</span>
            <span className="font-mono text-[10px] text-outline">4.2 KB</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span>• Weekly Quiz Duel Score (+60 pts vs Pooja)</span>
            <span className="font-mono text-[10px] text-outline">1.8 KB</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={handleBroadcastSync}
        disabled={syncing}
        className="w-full py-3.5 px-4 rounded-xl bg-secondary text-white font-display font-bold text-[14px] flex items-center justify-center gap-2 shadow-lg active:scale-98 hover:bg-secondary-container transition-all disabled:opacity-50"
      >
        <span className={`material-symbols-outlined text-[20px] ${syncing ? 'animate-spin' : ''}`}>
          {syncing ? 'sync' : 'cell_tower'}
        </span>
        <span>
          {syncing
            ? 'Broadcasting via Wi-Fi Direct Mesh...'
            : 'Broadcast Sync to School Kiosk • सिंक प्रसारित करें'}
        </span>
      </button>
    </div>
  );
};
