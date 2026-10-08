import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Droplets,
  Thermometer,
  Volume2,
  VolumeX,
  CheckCircle,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FIRST_AID_TOPICS } from '../data/mockData';
import { FirstAidTopic, Language } from '../types';
import { speakText, stopSpeech } from '../utils/speech';

interface FirstAidGuideProps {
  language: Language;
}

export const FirstAidGuide: React.FC<FirstAidGuideProps> = ({ language }) => {
  const [activeTopicId, setActiveTopicId] = useState<string>('snakebite');
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const activeTopic =
    FIRST_AID_TOPICS.find((t) => t.id === activeTopicId) || FIRST_AID_TOPICS[0];

  const handleToggleVoice = (topic: FirstAidTopic) => {
    if (isPlayingAudio === topic.id) {
      stopSpeech();
      setIsPlayingAudio(null);
    } else {
      setIsPlayingAudio(topic.id);
      const textToRead = `${topic.title}. Important warning: ${topic.warningNote}. Essential Do's: ${topic.dos.join(
        '. '
      )}. What not to do: ${topic.donts.join('. ')}.`;
      speakText(textToRead, language, () => {
        setIsPlayingAudio(null);
      });
    }
  };

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-5 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🩹</span>
            <h2 className="text-base sm:text-lg font-extrabold tracking-tight">
              Offline First Aid & Village Health Emergency Protocols
            </h2>
          </div>
          <span className="text-[10px] bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full">
            100% Offline Accessible
          </span>
        </div>
        <p className="text-xs text-emerald-100 leading-relaxed">
          Standardized clinical stabilization protocols for farm bites, severe dehydration, pediatric convulsion, and pesticide hazards.
        </p>
      </div>

      {/* Topics Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FIRST_AID_TOPICS.map((topic) => {
          const isSelected = activeTopic.id === topic.id;
          const isSnakebite = topic.id === 'snakebite';

          return (
            <button
              key={topic.id}
              onClick={() => {
                setActiveTopicId(topic.id);
                if (isPlayingAudio) {
                  stopSpeech();
                  setIsPlayingAudio(null);
                }
              }}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isSnakebite
                    ? 'bg-red-600 text-white border-red-700 shadow-md shadow-red-600/20'
                    : 'bg-teal-700 text-white border-teal-800 shadow-md shadow-teal-700/20'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="text-lg mb-1">
                {topic.id === 'snakebite'
                  ? '🐍'
                  : topic.id === 'dehydration_ors'
                  ? '💧'
                  : topic.id === 'child_fever_convulsion'
                  ? '🌡️'
                  : '🌾'}
              </div>
              <div className="text-xs font-bold leading-tight line-clamp-2">
                {topic.title.split('(')[0]}
              </div>
              <span
                className={`text-[9px] font-bold uppercase mt-1.5 ${
                  isSelected ? 'text-white/80' : 'text-slate-400'
                }`}
              >
                {topic.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Topic Detailed Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                {activeTopic.category}
              </span>
              <span className="text-xs text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                Priority: {activeTopic.urgency.toUpperCase()}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
              {activeTopic.title}
            </h3>
          </div>

          {/* Audio Readout */}
          <button
            onClick={() => handleToggleVoice(activeTopic)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer ${
              isPlayingAudio === activeTopic.id
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200'
            }`}
          >
            {isPlayingAudio === activeTopic.id ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-teal-700" />
                <span>Listen Step-by-Step</span>
              </>
            )}
          </button>
        </div>

        {/* Critical Warning Box */}
        {activeTopic.warningNote && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-extrabold text-amber-950 uppercase">
                Life-Saving Warning Note
              </div>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed font-medium">
                {activeTopic.warningNote}
              </p>
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Action Steps (चरणबद्ध मार्गदर्शक)
          </h4>

          <div className="space-y-2.5">
            {activeTopic.steps.map((st) => (
              <div
                key={st.stepNumber}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-start gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                  {st.stepNumber}
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {st.title}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {st.instruction}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Do's and Don'ts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* DO's */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900 uppercase">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>DO'S (क्या अवश्य करें)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-emerald-950 pl-4 list-disc">
              {activeTopic.dos.map((d, idx) => (
                <li key={idx} className="leading-snug">
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* DONT's */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-rose-900 uppercase">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>DON'TS (क्या बिल्कुल न करें)</span>
            </div>
            <ul className="space-y-1.5 text-xs text-rose-950 pl-4 list-disc">
              {activeTopic.donts.map((d, idx) => (
                <li key={idx} className="leading-snug">
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
