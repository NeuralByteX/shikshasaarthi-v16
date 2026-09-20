import React, { useState } from 'react';
import { robotMascotUrl } from '../../data';
import { StudentProfile } from '../../types';

interface SaarthiBuddyScreenProps {
  student: StudentProfile;
  isHindi: boolean;
}

interface ChatMessage {
  id: string;
  sender: 'buddy' | 'user';
  text: string;
  textHi?: string;
  hasAudio?: boolean;
}

export const SaarthiBuddyScreen: React.FC<SaarthiBuddyScreenProps> = ({ student, isHindi }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'buddy',
      text: 'Namaste Aarav! I am your Shiksha Saarthi AI Buddy. I run completely offline on your device!',
      textHi: 'नमस्ते आरव! मैं आपका शिक्षा सारथी हूँ। मैं बिना इंटरनेट के पूरी तरह आपके फोन पर चलता हूँ!',
      hasAudio: true,
    },
    {
      id: 'm2',
      sender: 'buddy',
      text: 'You made great progress today on Fractions! Do you have any doubt about why we need LCM for unlike denominators?',
      textHi: 'आज आपने भिन्न (Fractions) में बहुत अच्छा प्रयास किया! क्या आप समझना चाहते हैं कि असमान हरों में LCM क्यों जरूरी है?',
      hasAudio: true,
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const predefinedPrompts = [
    {
      en: 'Why do unlike fractions need LCM?',
      hi: 'असमान हरों को LCM क्यों चाहिए?',
    },
    {
      en: 'Give me a 1-minute trick for comparing fractions',
      hi: 'भिन्नों की तुलना की 1 मिनट की जादुई ट्रिक बताओ',
    },
    {
      en: 'Explain integers with positive & negative temperature',
      hi: 'तापमान के उदाहरण से पूर्णांक (Integers) समझाओ',
    },
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Simulate AI Buddy On-Device response
    setTimeout(() => {
      let replyText = 'Great question! Remember: Fractions represent slices of an equal whole. When slice sizes differ (like halves and thirds), we cut them into common smaller pieces (LCM) before adding!';
      let replyHi = 'शानदार सवाल! याद रखें: भिन्न किसी पूरे हिस्से के टुकड़े होते हैं। जब टुकड़ों का आकार अलग हो (जैसे 1/2 और 1/3), तब पहले उन्हें एक समान आकार (LCM) में काटकर ही जोड़ सकते हैं!';

      if (text.includes('trick') || text.includes('ट्रिक')) {
        replyText = 'Quick Butterfly Trick! Multiply diagonally: for 3/4 and 2/5, calculate 3×5=15 and 4×2=8. Since 15 > 8, 3/4 is larger! Super fast and reliable.';
        replyHi = 'तितली ट्रिक (Butterfly Trick)! तिरछा गुणा करें: 3/4 और 2/5 के लिए 3×5=15 और 4×2=8। क्योंकि 15 > 8, इसलिए 3/4 बड़ा है!';
      }

      const buddyMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'buddy',
        text: replyText,
        textHi: replyHi,
        hasAudio: true,
      };

      setMessages((prev) => [...prev, buddyMsg]);
    }, 700);
  };

  const handleToggleAudio = (id: string) => {
    if (isPlayingAudio === id) {
      setIsPlayingAudio(null);
    } else {
      setIsPlayingAudio(id);
      setTimeout(() => {
        setIsPlayingAudio(null);
      }, 4000);
    }
  };

  const handleToggleVoice = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        handleSend('Can you explain how to find LCM of 4 and 6?');
      }, 2500);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-md animate-fadeIn pb-6">
      {/* Buddy Header Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-secondary p-space-md rounded-2xl text-white shadow-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-primary-fixed p-1 shadow-md border-2 border-white/20">
              <img
                alt="Saarthi Buddy"
                className="w-full h-full object-cover rounded-full"
                src={robotMascotUrl}
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary-fixed rounded-full border-2 border-primary"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-display text-[18px] font-extrabold leading-tight">
                Saarthi AI Buddy • साथी
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-bold text-primary-fixed">
                100% On-Device TinyLLM
              </span>
            </div>
            <p className="text-[11px] text-white/80 font-medium">
              Zero Data Cost • Speaks Hindi, English & Hinglish
            </p>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-primary-fixed">
          <span className="material-symbols-outlined text-[20px]">psychology</span>
        </div>
      </div>

      {/* Trust Stamp & Guardrails Pill */}
      <div className="bg-surface-container-low rounded-xl px-3 py-2 border border-surface-container flex items-center justify-between text-[11px]">
        <span className="text-secondary font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px]">verified</span>
          <span>NDEAR Safe Guardrails Enabled • Indic Voice Model v1.2</span>
        </span>
        <span className="text-outline font-semibold">Offline Verified</span>
      </div>

      {/* Pre-baked Question Prompts Carousel */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[12px] font-bold text-on-surface px-1 flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-secondary">help</span>
          <span>Quick Doubts / त्वरित प्रश्न</span>
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {predefinedPrompts.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(p.en)}
              className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-medium shrink-0 border border-surface-container-highest shadow-sm active:scale-95 transition-all text-left max-w-[240px]"
            >
              <p className="font-bold text-primary line-clamp-1">{p.en}</p>
              <p className="text-on-surface-variant text-[10px] line-clamp-1">{p.hi}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Transcript Area */}
      <div className="bg-surface-container-lowest rounded-2xl p-space-md border border-surface-container-highest shadow-sm flex flex-col gap-3 min-h-[280px]">
        {messages.map((msg) => {
          const isBuddy = msg.sender === 'buddy';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[90%] ${
                isBuddy ? 'self-start' : 'self-end flex-row-reverse'
              }`}
            >
              {isBuddy && (
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    smart_toy
                  </span>
                </div>
              )}
              <div
                className={`p-3 rounded-2xl flex flex-col gap-1 shadow-sm ${
                  isBuddy
                    ? 'bg-surface-container text-on-surface rounded-tl-none border border-surface-container-high'
                    : 'bg-primary text-white rounded-tr-none'
                }`}
              >
                <p className="text-[13px] leading-relaxed font-medium">{msg.text}</p>
                {msg.textHi && (
                  <p
                    className={`text-[12px] leading-relaxed font-normal pt-1 border-t ${
                      isBuddy
                        ? 'text-on-surface-variant border-surface-container-highest'
                        : 'text-primary-fixed border-white/20'
                    }`}
                  >
                    {msg.textHi}
                  </p>
                )}

                {msg.hasAudio && (
                  <div className="pt-1.5 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleAudio(msg.id)}
                      className="px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {isPlayingAudio === msg.id ? 'stop' : 'volume_up'}
                      </span>
                      <span>{isPlayingAudio === msg.id ? 'Playing Voice...' : 'Listen in Hindi'}</span>
                    </button>
                    {isPlayingAudio === msg.id && (
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-secondary rounded-full animate-pulse"></span>
                        <span className="w-1 h-5 bg-secondary rounded-full animate-pulse"></span>
                        <span className="w-1 h-2 bg-secondary rounded-full animate-pulse"></span>
                        <span className="w-1 h-4 bg-secondary rounded-full animate-pulse"></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice and Text Input Controls */}
      <div className="flex flex-col gap-2">
        {isRecording && (
          <div className="p-2.5 rounded-xl bg-secondary-fixed/50 border border-secondary text-primary text-[12px] font-bold flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-ping"></span>
              <span>Listening to Aarav's voice (Hinglish Supported)...</span>
            </div>
            <button
              type="button"
              onClick={() => setIsRecording(false)}
              className="text-[11px] text-error underline"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* Mic Button */}
          <button
            type="button"
            onClick={handleToggleVoice}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-all active:scale-95 ${
              isRecording
                ? 'bg-error text-white animate-bounce'
                : 'bg-secondary text-white hover:bg-secondary-container'
            }`}
            title="Voice query in Hindi/English"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isRecording ? 'mic_active' : 'mic'}
            </span>
          </button>

          {/* Text Input */}
          <input
            type="text"
            placeholder="Type a doubt (उदा. 3/4 और 5/8 में कौन बड़ा है?)..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend(inputVal);
            }}
            className="flex-1 h-12 px-4 rounded-xl bg-surface-container-low border border-surface-container text-[13px] text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSend(inputVal)}
            disabled={!inputVal.trim()}
            className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all hover:bg-primary-container"
          >
            <span className="material-symbols-outlined text-[20px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
