import React, { useMemo, useRef, useState } from 'react';
import { realWorldExamplesData, practicalVideosData } from '../../data';

interface RealWorldScreenProps {
  onStartPractice?: () => void;
  isHindi: boolean;
}

export const RealWorldScreen: React.FC<RealWorldScreenProps> = ({
  onStartPractice,
  isHindi,
}) => {
  const [activeTab, setActiveTab] = useState<'examples' | 'videos'>('examples');
  const [activeTopic, setActiveTopic] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(realWorldExamplesData[0]?.id ?? null);
  const [exploredIds, setExploredIds] = useState<Set<string>>(new Set());
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Unique topics, in first-seen order, for the filter chips
  const topics = useMemo(() => {
    const seen: { key: string; label: string; labelHi: string }[] = [];
    realWorldExamplesData.forEach((ex) => {
      if (!seen.some((t) => t.key === ex.topic)) {
        seen.push({ key: ex.topic, label: ex.topic, labelHi: ex.topicHi });
      }
    });
    return seen;
  }, []);

  const visibleExamples = useMemo(
    () =>
      activeTopic === 'All'
        ? realWorldExamplesData
        : realWorldExamplesData.filter((ex) => ex.topic === activeTopic),
    [activeTopic]
  );

  const handleToggle = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setExploredIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const handleWatchVideo = (videoId?: string) => {
    if (!videoId) return;
    setActiveTab('videos');
    setExpandedVideoId(videoId);
    setTimeout(() => {
      videoRefs.current[videoId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const totalCount = realWorldExamplesData.length;
  const exploredCount = exploredIds.size;
  const progressPct = totalCount > 0 ? Math.round((exploredCount / totalCount) * 100) : 0;

  const visibleVideos = useMemo(
    () =>
      activeTopic === 'All'
        ? practicalVideosData
        : practicalVideosData.filter((v) => v.topic === activeTopic),
    [activeTopic]
  );

  return (
    <div className="flex flex-col w-full gap-4 animate-fadeIn pb-8 max-w-2xl mx-auto">
      {/* 1. Header */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-0.5">
          <div className="w-9 h-9 rounded-xl bg-tertiary-fixed/40 text-tertiary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">travel_explore</span>
          </div>
          <div>
            <h1 className="font-display text-[17px] font-bold text-primary leading-tight">
              {isHindi ? 'रोज़मर्रा की ज़िंदगी में गणित' : 'Maths in Real Life'}
            </h1>
            <p className="text-[12px] text-on-surface-variant font-medium">
              {isHindi
                ? 'देखें कि आप जो सीख रहे हैं वो घर, बाज़ार और स्कूल में कहां काम आता है'
                : 'See where what you study shows up at home, in the market, and beyond'}
            </p>
          </div>
        </div>

        {/* Explored progress bar */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-3 shadow-sm flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-on-surface-variant">
                {isHindi
                  ? `खोजे गए: ${exploredCount} / ${totalCount}`
                  : `Explored: ${exploredCount} / ${totalCount}`}
              </span>
              <span className="text-[11px] font-bold text-tertiary-container">{progressPct}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-container-highest overflow-hidden">
              <div
                className="h-full bg-tertiary-fixed transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 1b. Examples / Videos tab switcher */}
      <div className="flex items-center gap-1.5 bg-surface-container-low rounded-full p-1 border border-surface-container-highest">
        <button
          type="button"
          onClick={() => setActiveTab('examples')}
          className={`flex-1 py-1.5 rounded-full text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'examples'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">lightbulb</span>
          {isHindi ? 'उदाहरण' : 'Examples'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`flex-1 py-1.5 rounded-full text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'videos'
              ? 'bg-primary text-white shadow-sm'
              : 'text-on-surface-variant hover:text-primary'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">play_circle</span>
          {isHindi ? 'वीडियो' : 'Videos'}
        </button>
      </div>

      {/* 2. Topic filter chips (shared by both tabs) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
        <button
          type="button"
          onClick={() => setActiveTopic('All')}
          className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${
            activeTopic === 'All'
              ? 'bg-primary text-white border-primary'
              : 'bg-surface-container-lowest text-on-surface-variant border-surface-container-highest hover:bg-surface-container'
          }`}
        >
          {isHindi ? 'सभी विषय' : 'All Topics'}
        </button>
        {topics.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTopic(t.key)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${
              activeTopic === t.key
                ? 'bg-primary text-white border-primary'
                : 'bg-surface-container-lowest text-on-surface-variant border-surface-container-highest hover:bg-surface-container'
            }`}
          >
            {isHindi ? t.labelHi : t.label}
          </button>
        ))}
      </div>

      {/* 3. Example cards */}
      {activeTab === 'examples' && (
        <div className="flex flex-col gap-3">
          {visibleExamples.map((ex) => {
            const isOpen = expandedId === ex.id;
            const isExplored = exploredIds.has(ex.id);
            return (
              <div
                key={ex.id}
                className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => handleToggle(ex.id)}
                  className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-surface-container-low/60 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-tertiary-fixed/30 text-tertiary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">{ex.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-secondary bg-secondary-fixed/50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                        {isHindi ? ex.categoryHi : ex.category}
                      </span>
                      <span className="text-[10px] font-semibold text-on-surface-variant">
                        {isHindi ? ex.topicHi : ex.topic}
                      </span>
                      {isExplored && (
                        <span className="material-symbols-outlined text-[14px] text-emerald-600">
                          check_circle
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-[14px] text-primary mt-0.5 leading-snug">
                      {isHindi ? ex.titleHi : ex.title}
                    </h3>
                    <p className="text-[12px] text-on-surface-variant leading-relaxed mt-0.5">
                      {isHindi ? ex.scenarioHi : ex.scenario}
                    </p>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0 flex flex-col gap-2.5 animate-fadeIn">
                    <div className="bg-surface-container-low rounded-xl p-3 border border-surface-container-highest">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-wide">
                        {isHindi ? 'गणित यहां कैसे काम करती है' : 'How the maths works here'}
                      </span>
                      <p className="text-[12.5px] text-on-surface leading-relaxed mt-1">
                        {isHindi ? ex.howItWorksHi : ex.howItWorks}
                      </p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                      <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
                        {isHindi ? 'हल किया गया उदाहरण' : 'Worked Example'}
                      </span>
                      <p className="text-[12.5px] text-emerald-900 font-semibold leading-relaxed mt-1">
                        {isHindi ? ex.exampleHi : ex.example}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[13px]">stars</span>
                        +{ex.xp} XP {isHindi ? 'खोजने पर' : 'for exploring'}
                      </span>
                      <div className="flex items-center gap-3">
                        {ex.videoId && (
                          <button
                            type="button"
                            onClick={() => handleWatchVideo(ex.videoId)}
                            className="inline-flex items-center gap-1 text-[12px] font-bold text-tertiary-container hover:text-primary transition-colors"
                          >
                            <span className="material-symbols-outlined text-[15px]">play_circle</span>
                            <span>{isHindi ? 'वीडियो देखें' : 'Watch video'}</span>
                          </button>
                        )}
                        {onStartPractice && (
                          <button
                            type="button"
                            onClick={onStartPractice}
                            className="inline-flex items-center gap-1 text-[12px] font-bold text-secondary hover:text-primary transition-colors"
                          >
                            <span>{isHindi ? 'अभ्यास में आज़माएं' : 'Try it in Practice'}</span>
                            <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {visibleExamples.length === 0 && (
            <div className="text-center py-8 text-[12px] text-on-surface-variant">
              {isHindi
                ? 'इस विषय के लिए अभी कोई उदाहरण उपलब्ध नहीं है।'
                : 'No examples for this topic yet.'}
            </div>
          )}
        </div>
      )}

      {/* 4. Video library */}
      {activeTab === 'videos' && (
        <div className="flex flex-col gap-3">
          {visibleVideos.map((v) => {
            const isOpen = expandedVideoId === v.id;
            return (
              <div
                key={v.id}
                ref={(el) => {
                  videoRefs.current[v.id] = el;
                }}
                className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedVideoId((prev) => (prev === v.id ? null : v.id))}
                  className="w-full text-left p-3.5 flex items-start gap-3 hover:bg-surface-container-low/60 transition-colors"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 relative"
                    style={{ backgroundColor: v.thumbColor }}
                  >
                    <span className="material-symbols-outlined text-[24px] text-white/90">
                      {v.thumbIcon}
                    </span>
                    <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="material-symbols-outlined text-[22px] text-white">
                        play_circle
                      </span>
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-semibold text-on-surface-variant">
                        {isHindi ? v.topicHi : v.topic}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">
                        <span className="material-symbols-outlined text-[12px]">download_done</span>
                        {isHindi ? 'ऑफ़लाइन उपलब्ध' : 'Available offline'}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-[14px] text-primary mt-0.5 leading-snug">
                      {isHindi ? v.titleHi : v.title}
                    </h3>
                    <p className="text-[11.5px] text-on-surface-variant leading-relaxed mt-0.5">
                      {isHindi ? v.descriptionHi : v.description}
                    </p>
                    <div className="flex items-center gap-2.5 mt-1">
                      <span className="text-[10.5px] font-semibold text-outline flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">schedule</span>
                        {v.durationLabel}
                      </span>
                      <span className="text-[10.5px] font-semibold text-outline flex items-center gap-0.5">
                        <span className="material-symbols-outlined text-[12px]">sd_card</span>
                        {v.sizeLabel}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0 animate-fadeIn">
                    <video
                      key={v.id}
                      src={v.videoUrl}
                      controls
                      playsInline
                      className="w-full rounded-xl bg-black aspect-video"
                    />
                  </div>
                )}
              </div>
            );
          })}

          {visibleVideos.length === 0 && (
            <div className="text-center py-8 text-[12px] text-on-surface-variant">
              {isHindi
                ? 'इस विषय के लिए अभी कोई वीडियो उपलब्ध नहीं है।'
                : 'No videos for this topic yet.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
