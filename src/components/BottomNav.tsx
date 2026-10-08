import React from 'react';
import {
  Stethoscope,
  ClipboardList,
  MapPin,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

export type TabType = 'symptom' | 'triage' | 'clinics' | 'telehealth' | 'firstaid';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  hasTriageResult: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
  hasTriageResult,
}) => {
  const t = TRANSLATIONS[language];

  const navItems = [
    {
      id: 'symptom' as TabType,
      label: t.tabs.symptomCheck,
      icon: Stethoscope,
      badge: null,
    },
    {
      id: 'triage' as TabType,
      label: t.tabs.triageReport,
      icon: ClipboardList,
      badge: hasTriageResult ? 'NEW' : null,
    },
    {
      id: 'clinics' as TabType,
      label: t.tabs.nearbyClinics,
      icon: MapPin,
      badge: null,
    },
    {
      id: 'telehealth' as TabType,
      label: t.tabs.telehealth,
      icon: Video,
      badge: null,
    },
    {
      id: 'firstaid' as TabType,
      label: t.tabs.firstAid,
      icon: ShieldCheck,
      badge: 'OFFLINE',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-teal-700 font-bold scale-105'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? 'bg-teal-100 text-teal-800' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium text-center truncate max-w-[68px]">
                {item.label}
              </span>

              {item.badge && (
                <span
                  className={`absolute -top-1 -right-1 text-[8px] font-extrabold px-1 rounded-full uppercase ${
                    item.badge === 'NEW'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
