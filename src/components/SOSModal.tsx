import React from 'react';
import { AlertTriangle, Phone, ShieldAlert, X, MapPin, HeartPulse, Stethoscope } from 'lucide-react';
import { RuralClinic } from '../types';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  clinics: RuralClinic[];
  onSelectClinic: (clinic: RuralClinic) => void;
}

export const SOSModal: React.FC<SOSModalProps> = ({
  isOpen,
  onClose,
  clinics,
  onSelectClinic,
}) => {
  if (!isOpen) return null;

  // Find nearest clinic with antivenom / 24x7 emergency
  const nearestEmergencyClinic = clinics.find(
    c => c.features.antivenom && c.features.oxygenSupply
  ) || clinics[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-red-500 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-red-600 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">RURAL EMERGENCY SOS</h2>
              <p className="text-xs text-red-100 font-medium">Immediate Ambulance & Antivenom Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-red-700 hover:bg-red-800 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Main Ambulance Call Button */}
          <a
            href="tel:108"
            className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white font-extrabold text-lg py-4 px-6 rounded-2xl shadow-lg shadow-red-500/30 flex items-center justify-between transition-transform active:scale-95 group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6 text-white animate-bounce" />
              </div>
              <div className="text-left">
                <div className="text-xs uppercase tracking-wider text-red-200">Call Free Govt Ambulance</div>
                <div className="text-2xl font-black">DIAL 108</div>
              </div>
            </div>
            <span className="text-xs bg-white text-red-700 font-bold px-3 py-1.5 rounded-full shadow">
              24x7 Free
            </span>
          </a>

          {/* Quick Helpline Numbers */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="tel:1075"
              className="p-3 bg-teal-50 border border-teal-200 rounded-2xl flex items-center gap-2.5 hover:bg-teal-100 transition-colors"
            >
              <Stethoscope className="w-5 h-5 text-teal-700 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-teal-800">Tele-Doctor (eSanjeevani)</div>
                <div className="text-sm font-black text-teal-950">Dial 1075</div>
              </div>
            </a>
            <a
              href="tel:1098"
              className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 hover:bg-amber-100 transition-colors"
            >
              <HeartPulse className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <div className="text-[11px] font-bold text-amber-800">Maternal & Child Helpline</div>
                <div className="text-sm font-black text-amber-950">Dial 1098</div>
              </div>
            </a>
          </div>

          {/* Nearest Antivenom Stocked Hospital */}
          {nearestEmergencyClinic && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-600" />
                  NEAREST ANTIVENOM & OXYGEN FACILITY
                </span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  {nearestEmergencyClinic.distanceKm} km away
                </span>
              </div>
              <div className="font-bold text-slate-900 text-base">
                {nearestEmergencyClinic.name}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {nearestEmergencyClinic.address}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[11px] bg-red-100 text-red-800 font-semibold px-2 py-0.5 rounded-md">
                  🐍 Polyvalent ASV Stocked
                </span>
                <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-md">
                  🌬️ Oxygen Ready
                </span>
              </div>
              <div className="pt-2 flex gap-2">
                <a
                  href={`tel:${nearestEmergencyClinic.contactNumber}`}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Direct Hospital Call
                </a>
                <button
                  onClick={() => {
                    onSelectClinic(nearestEmergencyClinic);
                    onClose();
                  }}
                  className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold py-2.5 px-3 rounded-xl"
                >
                  View Route
                </button>
              </div>
            </div>
          )}

          {/* Critical Do's and Don'ts for Snakebite & Suffocation */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              CRITICAL EMERGENCY RULES (DO NOT DELAY)
            </div>
            <ul className="text-xs text-amber-800 space-y-1.5 list-disc pl-4">
              <li>
                <strong>Snakebite:</strong> Keep victim still. <u>DO NOT</u> tie tourniquets, cut, or suck venom.
              </li>
              <li>
                <strong>Choking / Fainting:</strong> Turn victim onto left side to keep airways clear.
              </li>
              <li>
                <strong>Severe Bleeding:</strong> Press firmly with clean cloth. Do not remove clot.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            GramSeva Emergency Hotline link is free of toll charges on all mobile networks.
          </p>
        </div>
      </div>
    </div>
  );
};
