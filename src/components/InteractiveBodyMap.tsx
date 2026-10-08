import React from 'react';
import {
  Brain,
  Eye,
  Activity,
  Flame,
  AlertTriangle,
  HeartHandshake,
  Bone,
  CheckCircle2,
} from 'lucide-react';
import { BODY_REGIONS } from '../data/mockData';
import { Language } from '../types';

interface InteractiveBodyMapProps {
  selectedRegion: string;
  onSelectRegion: (regionId: string) => void;
  language: Language;
}

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({
  selectedRegion,
  onSelectRegion,
  language,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return Brain;
      case 'Eye':
        return Eye;
      case 'Activity':
        return Activity;
      case 'Flame':
        return Flame;
      case 'AlertTriangle':
        return AlertTriangle;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'Bone':
        return Bone;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Tap Affected Body Region (संबधित भाग चुनें)
        </h3>
        <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
          Pictorial Guide
        </span>
      </div>

      {/* Grid of touch-friendly anatomical buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {BODY_REGIONS.map((region) => {
          const Icon = getIcon(region.icon);
          const isSelected = selectedRegion === region.id;
          const isBite = region.id === 'bite';

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onSelectRegion(region.id)}
              className={`relative p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[96px] ${
                isSelected
                  ? isBite
                    ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-500/20 scale-[1.02]'
                    : 'bg-teal-700 text-white border-teal-800 shadow-md shadow-teal-700/20 scale-[1.02]'
                  : isBite
                  ? 'bg-red-50/70 border-red-200 hover:bg-red-100/70 text-slate-800'
                  : 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : isBite
                      ? 'bg-red-200 text-red-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                )}
                {isBite && !isSelected && (
                  <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded-sm">
                    High Risk
                  </span>
                )}
              </div>

              <div className="mt-2">
                <div className="text-xs font-bold leading-tight truncate">
                  {language === 'hi' || language === 'mr' ? region.hindiName : region.name}
                </div>
                <div
                  className={`text-[10px] mt-0.5 leading-snug line-clamp-1 ${
                    isSelected ? 'text-white/80' : 'text-slate-500'
                  }`}
                >
                  {region.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
