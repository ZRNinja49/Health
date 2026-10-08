import React, { useState } from 'react';
import {
  Stethoscope,
  Camera,
  Upload,
  X,
  Plus,
  AlertTriangle,
  HeartPulse,
  Thermometer,
  Activity,
  Droplet,
  Sparkles,
  User,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import {
  Language,
  PatientProfile,
  PatientVitals,
  SymptomItem,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { COMMON_SYMPTOMS } from '../data/mockData';
import { InteractiveBodyMap } from './InteractiveBodyMap';

interface SymptomCheckerProps {
  language: Language;
  onSubmit: (payload: {
    patient: PatientProfile;
    symptoms: SymptomItem[];
    vitals: PatientVitals;
    imageBase64?: string;
  }) => void;
  isLoading: boolean;
  isLowBandwidthMode: boolean;
}

// Sample clinical photos generator (valid Base64 PNGs)
function generateSampleClinicalPng(type: 'snakebite' | 'rash' | 'wound'): string {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  if (type === 'snakebite') {
    ctx.fillStyle = '#d4a373';
    ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.arc(135, 95, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(165, 95, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(150, 95, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#450a0a';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Fang Marks + Edema', 150, 160);
  } else if (type === 'rash') {
    ctx.fillStyle = '#e29578';
    ctx.fillRect(0, 0, 300, 200);
    ctx.fillStyle = 'rgba(230, 57, 70, 0.75)';
    const spots = [[90, 70, 16], [150, 100, 22], [210, 75, 14], [120, 135, 15], [180, 130, 18]];
    spots.forEach(([x, y, r]) => {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#540b0e';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Erythematous Papular Rash', 150, 175);
  } else {
    ctx.fillStyle = '#cb997e';
    ctx.fillRect(0, 0, 300, 200);
    ctx.strokeStyle = '#780000';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(80, 100);
    ctx.quadraticCurveTo(150, 115, 220, 95);
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(150, 103, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3f0008';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Purulent Wound Exudate', 150, 165);
  }
  return canvas.toDataURL('image/png');
}

export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  language,
  onSubmit,
  isLoading,
  isLowBandwidthMode,
}) => {
  const t = TRANSLATIONS[language];

  // Patient profile state
  const [patient, setPatient] = useState<PatientProfile>({
    name: 'Ramesh Patil',
    age: 38,
    gender: 'male',
    pregnancyStatus: false,
    chronicConditions: [],
    villageLocation: 'Kashti Village, Sector 4',
    contactPhone: '+91 98220 12345',
  });

  // Selected anatomical region
  const [selectedRegion, setSelectedRegion] = useState<string>('bite');

  // Symptoms list
  const [symptoms, setSymptoms] = useState<SymptomItem[]>([
    {
      id: 's-snake',
      name: 'Suspected Snakebite on Right Foot',
      bodyPart: 'Snake / Insect Bite',
      severity: 9,
      durationDays: 1,
      description: 'Patient felt sudden sharp pain while harvesting sugarcane. Two puncture marks visible with progressive leg swelling.',
    },
  ]);

  // Vitals state
  const [vitals, setVitals] = useState<PatientVitals>({
    temperatureC: '37.4',
    heartRateBpm: '98',
    systolicBP: '130',
    diastolicBP: '84',
    spO2: '97',
    bloodSugar: '110',
  });

  // Photo attachment state - null by default
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const [customSymptomInput, setCustomSymptomInput] = useState('');

  // Fast pre-fill presets for rural community scenarios
  const applyPresetScenario = (scenario: 'snakebite' | 'diarrhea' | 'fever' | 'pesticide' | 'child') => {
    if (scenario === 'snakebite') {
      setPatient({
        name: 'Ramesh Patil',
        age: 38,
        gender: 'male',
        pregnancyStatus: false,
        chronicConditions: [],
        villageLocation: 'Kashti Village, Daund',
        contactPhone: '+91 98220 12345',
      });
      setSelectedRegion('bite');
      setSymptoms([
        {
          id: 's-snake',
          name: 'Snakebite on Right Ankle (Two Fang Marks)',
          bodyPart: 'Snake / Insect Bite',
          severity: 9,
          durationDays: 1,
          description: 'Sudden bite in agricultural field. Rapid swelling spreading up shin, burning pain, sweating.',
        },
      ]);
      setVitals({
        temperatureC: '37.3',
        heartRateBpm: '108',
        systolicBP: '138',
        diastolicBP: '90',
        spO2: '96',
        bloodSugar: '115',
      });
      setPhotoDataUri(generateSampleClinicalPng('snakebite'));
    } else if (scenario === 'diarrhea') {
      setPatient({
        name: 'Aarav Gaikwad',
        age: 3,
        gender: 'male',
        pregnancyStatus: false,
        chronicConditions: [],
        villageLocation: 'Boribhadak Sub-Centre',
        contactPhone: '+91 94238 88123',
      });
      setSelectedRegion('abdomen');
      setSymptoms([
        {
          id: 's-diarrhea',
          name: 'Severe Watery Diarrhea & Vomiting',
          bodyPart: 'Stomach & Gut',
          severity: 8,
          durationDays: 1,
          description: '6 loose watery motions since morning, vomited twice, dry tongue, crying without tears.',
        },
      ]);
      setVitals({
        temperatureC: '38.2',
        heartRateBpm: '124',
        systolicBP: '',
        diastolicBP: '',
        spO2: '98',
        bloodSugar: '',
      });
      setPhotoDataUri(null);
    } else if (scenario === 'fever') {
      setPatient({
        name: 'Savita More',
        age: 26,
        gender: 'female',
        pregnancyStatus: true,
        chronicConditions: ['Anemia'],
        villageLocation: 'Shirur Rural Outpost',
        contactPhone: '+91 98810 54321',
      });
      setSelectedRegion('chest');
      setSymptoms([
        {
          id: 's-fever',
          name: 'High Spiking Fever with Chills & Rigors',
          bodyPart: 'Chest & Breathing',
          severity: 7,
          durationDays: 3,
          description: 'Severe shivering attacks every afternoon followed by heavy sweating. Pregnant 6 months.',
        },
      ]);
      setVitals({
        temperatureC: '39.4',
        heartRateBpm: '112',
        systolicBP: '110',
        diastolicBP: '70',
        spO2: '97',
        bloodSugar: '95',
      });
      setPhotoDataUri(null);
    } else if (scenario === 'pesticide') {
      setPatient({
        name: 'Dnyaneshwar Shinde',
        age: 44,
        gender: 'male',
        pregnancyStatus: false,
        chronicConditions: ['Asthma'],
        villageLocation: 'Khandala Agri-Settlement',
        contactPhone: '+91 97654 32109',
      });
      setSelectedRegion('head');
      setSymptoms([
        {
          id: 's-pest',
          name: 'Organophosphate Pesticide Spray Inhalation',
          bodyPart: 'Head & Brain',
          severity: 8,
          durationDays: 1,
          description: 'Sprayed insecticide on cotton crops for 4 hours without mask. Nausea, blurred vision, excessive salivation.',
        },
      ]);
      setVitals({
        temperatureC: '36.8',
        heartRateBpm: '64',
        systolicBP: '142',
        diastolicBP: '92',
        spO2: '94',
        bloodSugar: '130',
      });
      setPhotoDataUri(null);
    } else if (scenario === 'child') {
      setPatient({
        name: 'Baby Priya',
        age: 1,
        gender: 'female',
        pregnancyStatus: false,
        chronicConditions: [],
        villageLocation: 'Boribhadak Sub-Centre',
        contactPhone: '+91 98812 34567',
      });
      setSelectedRegion('maternal');
      setSymptoms([
        {
          id: 's-child',
          name: 'Infant High Fever (39.5°C) with Febrile Twitching',
          bodyPart: 'Maternal & Child',
          severity: 9,
          durationDays: 1,
          description: 'Baby had sudden temperature spike, stiffened for 60 seconds, refused breastfeed, very irritable.',
        },
      ]);
      setVitals({
        temperatureC: '39.6',
        heartRateBpm: '140',
        systolicBP: '',
        diastolicBP: '',
        spO2: '96',
        bloodSugar: '',
      });
      setPhotoDataUri(null);
    }
  };

  const handleAddPresetSymptom = (preset: typeof COMMON_SYMPTOMS[0]) => {
    // Check if already added
    if (symptoms.some((s) => s.name.toLowerCase() === preset.name.toLowerCase())) {
      return;
    }
    const newSymptom: SymptomItem = {
      id: `s-${Date.now()}`,
      name: preset.name,
      bodyPart: preset.region,
      severity: preset.defaultSeverity,
      durationDays: preset.defaultDays,
      description: preset.description,
    };
    setSymptoms([...symptoms, newSymptom]);
  };

  const handleAddCustomSymptom = () => {
    if (!customSymptomInput.trim()) return;
    const newSymptom: SymptomItem = {
      id: `s-${Date.now()}`,
      name: customSymptomInput.trim(),
      bodyPart: selectedRegion,
      severity: 5,
      durationDays: 1,
      description: 'Reported by patient/caregiver.',
    };
    setSymptoms([...symptoms, newSymptom]);
    setCustomSymptomInput('');
  };

  const handleRemoveSymptom = (id: string) => {
    setSymptoms(symptoms.filter((s) => s.id !== id));
  };

  const handleUpdateSeverity = (id: string, newSeverity: number) => {
    setSymptoms(
      symptoms.map((s) => (s.id === id ? { ...s, severity: newSeverity } : s))
    );
  };

  const handleUpdateDuration = (id: string, newDays: number) => {
    setSymptoms(
      symptoms.map((s) =>
        s.id === id ? { ...s, durationDays: Math.max(1, newDays) } : s
      )
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCondition = (condition: string) => {
    if (patient.chronicConditions.includes(condition)) {
      setPatient({
        ...patient,
        chronicConditions: patient.chronicConditions.filter((c) => c !== condition),
      });
    } else {
      setPatient({
        ...patient,
        chronicConditions: [...patient.chronicConditions, condition],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symptoms.length === 0) {
      alert('Please add at least one symptom to evaluate.');
      return;
    }
    onSubmit({
      patient,
      symptoms,
      vitals,
      imageBase64: photoDataUri || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Fast Scenario Presets Bar */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-3xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Quick Rural Case Scenarios (एक-टैप परीक्षण)</span>
          </div>
          <span className="text-[10px] text-teal-700 bg-teal-100/70 font-semibold px-2 py-0.5 rounded-full">
            Tap to Auto-fill
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => applyPresetScenario('snakebite')}
            className="shrink-0 bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>🐍 Snakebite (Emergency)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPresetScenario('diarrhea')}
            className="shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>💧 Child Dehydration (ORS)</span>
          </button>
          <button
            type="button"
            onClick={() => applyPresetScenario('fever')}
            className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>🌡️ Maternal Malaria Fever</span>
          </button>
          <button
            type="button"
            onClick={() => applyPresetScenario('pesticide')}
            className="shrink-0 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>🌾 Farm Pesticide Poisoning</span>
          </button>
          <button
            type="button"
            onClick={() => applyPresetScenario('child')}
            className="shrink-0 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>👶 Pediatric High Fever</span>
          </button>
        </div>
      </div>

      {/* Section 1: Patient Profile */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">{t.patientInfo.title}</h2>
            <p className="text-[11px] text-slate-500">Demographic details for accurate rural triage</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.patientInfo.fullName}
            </label>
            <input
              type="text"
              value={patient.name}
              onChange={(e) => setPatient({ ...patient, name: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.patientInfo.age}
            </label>
            <input
              type="number"
              min="0"
              max="120"
              value={patient.age}
              onChange={(e) => setPatient({ ...patient, age: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.patientInfo.gender}
            </label>
            <select
              value={patient.gender}
              onChange={(e) =>
                setPatient({ ...patient, gender: e.target.value as any })
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
            >
              <option value="male">{t.patientInfo.male}</option>
              <option value="female">{t.patientInfo.female}</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Pregnancy / Lactation checkbox (if female) */}
        {patient.gender === 'female' && (
          <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🤰</span>
              <div>
                <div className="text-xs font-bold text-rose-900">
                  {t.patientInfo.pregnant}
                </div>
                <div className="text-[11px] text-rose-700">
                  High-risk protocols apply for antenatal & postpartum care
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={patient.pregnancyStatus}
                onChange={(e) =>
                  setPatient({ ...patient, pregnancyStatus: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
            </label>
          </div>
        )}

        {/* Known chronic conditions */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {t.patientInfo.conditions}
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'Diabetes', label: t.patientInfo.diabetes },
              { id: 'Hypertension', label: t.patientInfo.hypertension },
              { id: 'Asthma', label: t.patientInfo.asthma },
              { id: 'Heart Disease', label: t.patientInfo.heartDisease },
              { id: 'Anemia', label: 'Severe Anemia (खून की कमी)' },
            ].map((cond) => {
              const isSelected = patient.chronicConditions.includes(cond.id);
              return (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => toggleCondition(cond.id)}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-700 text-white border-teal-800 font-bold shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cond.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Section 2: Visual Body Map & Symptoms Selection */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {t.symptomSection.selectBodyPart}
            </h2>
            <p className="text-[11px] text-slate-500">
              Tap the body area where the person feels pain, swelling, or illness
            </p>
          </div>
        </div>

        {/* Pictorial Body Map Component */}
        <InteractiveBodyMap
          selectedRegion={selectedRegion}
          onSelectRegion={(reg) => setSelectedRegion(reg)}
          language={language}
        />

        {/* Common Symptoms for this region */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold text-slate-700">
            {t.symptomSection.commonSymptoms} ({selectedRegion.toUpperCase()}):
          </label>
          <div className="flex flex-wrap gap-2">
            {COMMON_SYMPTOMS.filter(
              (cs) => cs.region === selectedRegion || cs.region === 'all'
            ).map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleAddPresetSymptom(preset)}
                className={`text-xs px-3 py-2 rounded-2xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                  preset.dangerFlag
                    ? 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100 font-bold'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>
                  {language === 'hi' || language === 'mr'
                    ? preset.hindiName
                    : preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom text symptom input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={customSymptomInput}
            onChange={(e) => setCustomSymptomInput(e.target.value)}
            placeholder="Type other symptom or local term (e.g. 'छाती में भारीपन', 'काट लिया')..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:bg-white focus:border-teal-500 focus:outline-hidden"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomSymptom();
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCustomSymptom}
            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold shrink-0 cursor-pointer"
          >
            Add Symptom
          </button>
        </div>

        {/* Active Selected Symptoms List */}
        <div className="space-y-3 pt-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Reported Symptoms ({symptoms.length})
          </div>

          {symptoms.length === 0 ? (
            <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center text-xs text-slate-500">
              No symptoms selected yet. Tap a body part above or select a preset.
            </div>
          ) : (
            symptoms.map((s) => (
              <div
                key={s.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2.5 relative"
              >
                <div className="flex items-start justify-between gap-2 pr-6">
                  <div>
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{s.name}</span>
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                        {s.bodyPart}
                      </span>
                    </div>
                    {s.description && (
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(s.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-red-600 p-1 rounded-full cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Severity Slider & Duration Counter */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-200/60">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Severity (1-10):</span>
                      <span
                        className={`font-black px-2 py-0.5 rounded-md ${
                          s.severity >= 8
                            ? 'bg-red-100 text-red-800'
                            : s.severity >= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {s.severity}/10 (
                        {s.severity >= 8
                          ? t.symptomSection.severe
                          : s.severity >= 5
                          ? t.symptomSection.moderate
                          : t.symptomSection.mild}
                        )
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={s.severity}
                      onChange={(e) =>
                        handleUpdateSeverity(s.id, parseInt(e.target.value))
                      }
                      className="w-full accent-teal-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                      <span>Duration (Days):</span>
                      <span className="font-bold text-slate-800">
                        {s.durationDays} {t.symptomSection.days}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateDuration(s.id, s.durationDays - 1)
                        }
                        className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-xs hover:bg-slate-100 cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="365"
                        value={s.durationDays}
                        onChange={(e) =>
                          handleUpdateDuration(
                            s.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-16 text-center bg-white border border-slate-200 rounded-lg py-1 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdateDuration(s.id, s.durationDays + 1)
                        }
                        className="w-7 h-7 bg-white border border-slate-200 rounded-lg font-bold text-xs hover:bg-slate-100 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Multimodal Photo Attachment */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800">
              {t.symptomSection.attachPhoto}
            </label>
            <span className="text-[10px] text-slate-500 font-medium">
              Optional / Multimodal AI
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            {t.symptomSection.photoHint}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
              <Camera className="w-4 h-4 text-teal-700" />
              <span>Take / Upload Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Quick demo photos for testing */}
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Or Test Sample:
              </span>
              {[
                { name: 'Snakebite Fangs', type: 'snakebite' as const },
                { name: 'Skin Rash', type: 'rash' as const },
                { name: 'Infected Wound', type: 'wound' as const },
              ].map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoDataUri(generateSampleClinicalPng(sample.type))}
                  className="text-[11px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  {sample.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Photo Preview */}
          {photoDataUri && (
            <div className="relative inline-block mt-2 rounded-2xl overflow-hidden border-2 border-teal-500/50 shadow-md">
              <img
                src={photoDataUri}
                alt="Symptom preview"
                className="w-44 h-28 object-cover bg-slate-100"
              />
              <button
                type="button"
                onClick={() => setPhotoDataUri(null)}
                className="absolute top-1 right-1 bg-black/70 hover:bg-black text-white p-1 rounded-full cursor-pointer"
                title="Remove photo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-bold px-2 py-0.5 text-center truncate">
                Attached for AI Analysis
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Vital Signs (Thermometer, BP, Pulse, SpO2) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              {t.vitalsSection.title}
            </h2>
            <p className="text-[11px] text-slate-500">
              {t.vitalsSection.subtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Temperature */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <Thermometer className="w-3.5 h-3.5 text-rose-500" />
              <span>{t.vitalsSection.temp}</span>
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="37.0"
              value={vitals.temperatureC}
              onChange={(e) =>
                setVitals({ ...vitals, temperatureC: e.target.value })
              }
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Normal: 36.5° - 37.5°C
            </span>
          </div>

          {/* Pulse */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
              <span>{t.vitalsSection.pulse}</span>
            </label>
            <input
              type="number"
              placeholder="72"
              value={vitals.heartRateBpm}
              onChange={(e) =>
                setVitals({ ...vitals, heartRateBpm: e.target.value })
              }
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Normal: 60 - 100 bpm
            </span>
          </div>

          {/* SpO2 Oxygen */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-600" />
              <span>{t.vitalsSection.spo2}</span>
            </label>
            <input
              type="number"
              placeholder="98"
              value={vitals.spO2}
              onChange={(e) => setVitals({ ...vitals, spO2: e.target.value })}
              className={`w-full bg-white border rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-hidden ${
                vitals.spO2 && Number(vitals.spO2) < 92
                  ? 'border-red-500 text-red-600'
                  : 'border-slate-200 text-slate-900'
              }`}
            />
            <span
              className={`text-[10px] block mt-1 ${
                vitals.spO2 && Number(vitals.spO2) < 92
                  ? 'text-red-600 font-bold'
                  : 'text-slate-400'
              }`}
            >
              {vitals.spO2 && Number(vitals.spO2) < 92
                ? '⚠️ Danger: Low Oxygen'
                : 'Normal: 95% - 100%'}
            </span>
          </div>

          {/* Blood Pressure (Systolic / Diastolic) */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 sm:col-span-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              <span>{t.vitalsSection.bp} (Sys / Dia)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="120"
                value={vitals.systolicBP}
                onChange={(e) =>
                  setVitals({ ...vitals, systolicBP: e.target.value })
                }
                className="w-1/2 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
              <span className="text-slate-400 font-bold">/</span>
              <input
                type="number"
                placeholder="80"
                value={vitals.diastolicBP}
                onChange={(e) =>
                  setVitals({ ...vitals, diastolicBP: e.target.value })
                }
                className="w-1/2 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
              />
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Normal: 120/80 mmHg
            </span>
          </div>

          {/* Blood Sugar */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
              <Droplet className="w-3.5 h-3.5 text-amber-500" />
              <span>{t.vitalsSection.sugar}</span>
            </label>
            <input
              type="number"
              placeholder="110"
              value={vitals.bloodSugar}
              onChange={(e) =>
                setVitals({ ...vitals, bloodSugar: e.target.value })
              }
              className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-hidden"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Random: 80 - 140 mg/dL
            </span>
          </div>
        </div>
      </div>

      {/* Main Submit Action Button */}
      <div className="sticky bottom-18 z-30 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600 hover:from-teal-800 hover:to-emerald-700 disabled:opacity-75 text-white font-extrabold text-base py-4 px-6 rounded-2xl shadow-xl shadow-teal-700/30 flex items-center justify-center gap-3 transition-transform active:scale-98 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t.symptomSection.analyzing}</span>
            </>
          ) : (
            <>
              <Stethoscope className="w-5 h-5" />
              <span>{t.symptomSection.runTriage}</span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full font-bold ml-1">
                {isLowBandwidthMode ? '📡 2G Protocol' : '⚡ Gemini AI'}
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
