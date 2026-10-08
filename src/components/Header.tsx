import React from 'react';
import {
  ShieldAlert,
  Wifi,
  WifiOff,
  Globe,
  MapPin,
  Volume2,
  VolumeX,
  Stethoscope,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isLowBandwidthMode: boolean;
  onToggleLowBandwidth: () => void;
  onOpenSOS: () => void;
  isAudioMuted: boolean;
  onToggleAudioMute: () => void;
  selectedVillage: string;
  onSelectVillage: (village: string) => void;
}

const VILLAGES = [
  'Kashti Village, Daund Block (Sector 4)',
  'Boribhadak Gram Panchayat',
  'Shirur Rural Outpost (East)',
  'Khandala Agri-Settlement',
  'Baramati Rural Taluka',
];

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isLowBandwidthMode,
  onToggleLowBandwidth,
  onOpenSOS,
  isAudioMuted,
  onToggleAudioMute,
  selectedVillage,
  onSelectVillage,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Location & Mode Controls */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-cyan-900 text-white px-3 sm:px-4 py-2">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Village location selector */}
          <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors cursor-pointer group">
            <MapPin className="w-3.5 h-3.5 text-teal-300 shrink-0" />
            <select
              value={selectedVillage}
              onChange={(e) => onSelectVillage(e.target.value)}
              className="bg-transparent text-white font-medium text-xs focus:outline-hidden cursor-pointer"
            >
              {VILLAGES.map((v) => (
                <option key={v} value={v} className="text-slate-900">
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* Low Bandwidth & Audio Controls */}
          <div className="flex items-center gap-2">
            {/* Low-Bandwidth Mode Button */}
            <button
              onClick={onToggleLowBandwidth}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-semibold text-[11px] transition-all cursor-pointer ${
                isLowBandwidthMode
                  ? 'bg-amber-400 text-amber-950 shadow-xs'
                  : 'bg-white/15 text-white hover:bg-white/25'
              }`}
              title="Toggle Low Bandwidth Offline Protocol Mode"
            >
              {isLowBandwidthMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-950 animate-pulse" />
                  <span>2G / Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-teal-300" />
                  <span>Gemini AI Connected</span>
                </>
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={onToggleAudioMute}
              className={`p-1.5 rounded-full text-white transition-colors ${
                isAudioMuted ? 'bg-white/10 text-slate-300' : 'bg-teal-700/80 hover:bg-teal-600'
              }`}
              title={isAudioMuted ? 'Unmute voice readouts' : 'Mute voice readouts'}
            >
              {isAudioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-200" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                {t.appName}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded-sm">
                Rural Care
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Right side: Language selector + Big Red SOS Button */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-2.5 py-1.5 transition-colors">
            <Globe className="w-3.5 h-3.5 text-slate-500 mr-1.5 shrink-0" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="es">Español</option>
              <option value="sw">Kiswahili</option>
            </select>
          </div>

          {/* SOS 108 Emergency Button */}
          <button
            onClick={onOpenSOS}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 sm:px-4 py-2 rounded-xl font-black text-xs sm:text-sm shadow-md shadow-red-500/30 transition-transform active:scale-95 animate-pulse"
          >
            <ShieldAlert className="w-4 h-4 text-white shrink-0" />
            <span className="hidden xs:inline">108</span>
            <span>SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
