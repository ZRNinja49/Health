import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ShieldCheck,
  Filter,
  CheckCircle,
  ExternalLink,
  ChevronRight,
  Car,
  Bike,
  Footprints,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { RuralClinic } from '../types';

interface ClinicsFinderProps {
  clinics: RuralClinic[];
  selectedClinic: RuralClinic | null;
  onSelectClinic: (clinic: RuralClinic) => void;
}

export const ClinicsFinder: React.FC<ClinicsFinderProps> = ({
  clinics,
  selectedClinic,
  onSelectClinic,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDirectionsFor, setShowDirectionsFor] = useState<RuralClinic | null>(
    selectedClinic || null
  );

  const activeClinic = showDirectionsFor || selectedClinic || clinics[0];

  const filteredClinics = clinics.filter((clinic) => {
    if (filterType === 'antivenom' && !clinic.features.antivenom) return false;
    if (filterType === 'maternity' && !clinic.features.maternity24x7) return false;
    if (filterType === 'emergency' && !clinic.features.oxygenSupply) return false;
    if (filterType === 'phc' && clinic.type !== 'PHC') return false;
    if (filterType === 'subcentre' && clinic.type !== 'SUBCENTRE') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        clinic.name.toLowerCase().includes(q) ||
        clinic.address.toLowerCase().includes(q) ||
        clinic.services.some((s) => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Top Banner & Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              Rural Healthcare Network & Clinic Directory
            </h2>
            <p className="text-xs text-slate-500">
              Verified Primary Health Centres (PHC), Sub-Centres, and Antivenom Facilities
            </p>
          </div>
          <a
            href="tel:108"
            className="self-start sm:self-auto bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 animate-bounce" />
            <span>108 Ambulance Dispatch</span>
          </a>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', label: 'All Centers' },
            { id: 'antivenom', label: '🐍 Antivenom Stocked' },
            { id: 'emergency', label: '🚑 24x7 Emergency / Oxygen' },
            { id: 'maternity', label: '👶 Maternity & Delivery' },
            { id: 'phc', label: '🏛️ Primary Health (PHC)' },
            { id: 'subcentre', label: '🏡 Village Sub-Centres' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setFilterType(chip.id)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                filterType === chip.id
                  ? 'bg-teal-700 text-white border-teal-800 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Visual Rural Map */}
      <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">Live Rural Area Map (Daund Block Sector)</span>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
            GPS Active (Kashti Village Center)
          </span>
        </div>

        {/* SVG stylized map representation */}
        <div className="relative w-full h-56 sm:h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
          {/* Background grid representing topography & rural roads */}
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="#090d16" />
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* River Bhima schematic */}
            <path
              d="M -20,180 Q 80,120 180,150 T 420,110 T 600,160"
              fill="none"
              stroke="#0e7490"
              strokeWidth="12"
              opacity="0.35"
            />
            <path
              d="M -20,180 Q 80,120 180,150 T 420,110 T 600,160"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="4"
              opacity="0.6"
            />

            {/* Connecting rural arterial roads */}
            <path
              d="M 50,220 L 150,130 L 260,80 L 380,50"
              fill="none"
              stroke="#475569"
              strokeWidth="5"
              strokeDasharray="4,4"
            />
            <path
              d="M 150,130 L 220,190 L 350,180"
              fill="none"
              stroke="#475569"
              strokeWidth="4"
            />

            {/* User current location marker */}
            <circle cx="150" cy="130" r="16" fill="#14b8a6" fillOpacity="0.25">
              <animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="130" r="6" fill="#14b8a6" />
            <text x="150" y="112" fill="#5eead4" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
              YOU ARE HERE (Kashti Village)
            </text>

            {/* Clinic Pin 1: Boribhadak Sub-Centre (1.4 km) */}
            <g
              className="cursor-pointer"
              onClick={() => {
                const c = clinics.find((cl) => cl.id === 'subcentre-03');
                if (c) {
                  onSelectClinic(c);
                  setShowDirectionsFor(c);
                }
              }}
            >
              <circle cx="90" cy="80" r="12" fill="#3b82f6" fillOpacity="0.3" />
              <circle cx="90" cy="80" r="5" fill="#3b82f6" />
              <text x="90" y="62" fill="#93c5fd" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Sub-Centre (1.4km)
              </text>
            </g>

            {/* Clinic Pin 2: Kashti PHC (3.2 km) */}
            <g
              className="cursor-pointer"
              onClick={() => {
                const c = clinics.find((cl) => cl.id === 'phc-01');
                if (c) {
                  onSelectClinic(c);
                  setShowDirectionsFor(c);
                }
              }}
            >
              <circle cx="260" cy="80" r="16" fill="#10b981" fillOpacity="0.4" />
              <circle cx="260" cy="80" r="7" fill="#10b981" />
              <text x="260" y="60" fill="#6ee7b7" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Kashti PHC (3.2km) 🐍
              </text>
            </g>

            {/* Clinic Pin 3: Mobile Health Van (2.1 km) */}
            <g
              className="cursor-pointer"
              onClick={() => {
                const c = clinics.find((cl) => cl.id === 'mmu-04');
                if (c) {
                  onSelectClinic(c);
                  setShowDirectionsFor(c);
                }
              }}
            >
              <circle cx="220" cy="190" r="12" fill="#a855f7" fillOpacity="0.3" />
              <circle cx="220" cy="190" r="5" fill="#a855f7" />
              <text x="220" y="210" fill="#d8b4fe" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Mobile Van (2.1km)
              </text>
            </g>

            {/* Clinic Pin 4: Shirur CHC (11.5 km) */}
            <g
              className="cursor-pointer"
              onClick={() => {
                const c = clinics.find((cl) => cl.id === 'chc-02');
                if (c) {
                  onSelectClinic(c);
                  setShowDirectionsFor(c);
                }
              }}
            >
              <circle cx="360" cy="45" r="14" fill="#ef4444" fillOpacity="0.3" />
              <circle cx="360" cy="45" r="6" fill="#ef4444" />
              <text x="360" y="32" fill="#fca5a5" fontSize="9" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">
                Shirur CHC (11.5km) 🏥
              </text>
            </g>
          </svg>

          {/* Quick interactive map overlay tip */}
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-xs p-2 rounded-xl text-[10px] text-slate-300 flex items-center justify-between border border-slate-700/60">
            <span>Tap any pin on the map to view instant transit time & equipment status</span>
            <span className="text-teal-400 font-bold hidden sm:inline">Offline Map Cached</span>
          </div>
        </div>

        {/* Selected Clinic Travel Times Quick Banner */}
        {activeClinic && (
          <div className="mt-3 bg-slate-800/80 rounded-2xl p-3 border border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <div>
                <span className="font-bold text-white">{activeClinic.name}</span>
                <span className="text-slate-400 ml-1.5">({activeClinic.distanceKm} km away)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-300">
              <div className="flex items-center gap-1">
                <Footprints className="w-3.5 h-3.5 text-teal-400" />
                <span>~{Math.round(activeClinic.distanceKm * 15)}m walk</span>
              </div>
              <div className="flex items-center gap-1">
                <Bike className="w-3.5 h-3.5 text-blue-400" />
                <span>~{Math.round(activeClinic.distanceKm * 4)}m cycle</span>
              </div>
              <div className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>~{Math.max(5, Math.round(activeClinic.distanceKm * 2))}m auto</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Directory of Clinics List */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>Available Rural Healthcare Facilities ({filteredClinics.length})</span>
          <span>Sorted by Distance</span>
        </div>

        {filteredClinics.map((clinic) => {
          const isSelected = activeClinic?.id === clinic.id;

          return (
            <div
              key={clinic.id}
              className={`bg-white rounded-3xl p-5 border transition-all shadow-sm space-y-3 ${
                isSelected
                  ? 'border-2 border-teal-500 ring-2 ring-teal-500/20'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                      {clinic.typeLabel}
                    </span>
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      📍 {clinic.distanceKm} km
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {clinic.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {clinic.address}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      clinic.isOpenNow
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {clinic.hours}
                  </span>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Wait: ~{clinic.currentWaitTimeMinutes} mins
                  </div>
                </div>
              </div>

              {/* On Duty Doctor */}
              <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-900">On Duty:</span>{' '}
                {clinic.doctorsOnDuty}
              </div>

              {/* Critical Capability Badges */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {clinic.features.antivenom && (
                  <span className="text-[10px] bg-red-100 text-red-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>🐍 Antivenom Stocked</span>
                  </span>
                )}
                {clinic.features.oxygenSupply && (
                  <span className="text-[10px] bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>🌬️ High-Flow Oxygen</span>
                  </span>
                )}
                {clinic.features.maternity24x7 && (
                  <span className="text-[10px] bg-pink-100 text-pink-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>👶 24x7 Labour Room</span>
                  </span>
                )}
                {clinic.features.telemedicine && (
                  <span className="text-[10px] bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>💻 Teleconsultation Link</span>
                  </span>
                )}
                {clinic.features.freeCare && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <span>🏛️ 100% Free Govt Care</span>
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${clinic.contactNumber}`}
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {clinic.contactNumber.split(' ')[0]}</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    onSelectClinic(clinic);
                    setShowDirectionsFor(clinic);
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-teal-700" />
                  <span>Route on Map</span>
                </button>

                <a
                  href={`https://maps.google.com/?q=${clinic.lat},${clinic.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl"
                  title="Open External GPS Map"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
