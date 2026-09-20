import React from 'react';

interface SmoothLoaderProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
}

export const SmoothLoader: React.FC<SmoothLoaderProps> = ({ isOpen, title, subtitle }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Loading indicator"
    >
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 shadow-2xl flex flex-col items-center gap-3 max-w-xs mx-4 text-center transform scale-100 transition-transform duration-200">
        <div className="w-12 h-12 rounded-full border-4 border-secondary/25 border-t-secondary animate-spin flex items-center justify-center"></div>
        <div className="flex flex-col gap-1">
          <h4 className="font-display text-[15px] font-bold text-primary">{title}</h4>
          <p className="text-[12px] text-on-surface-variant font-medium">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};
