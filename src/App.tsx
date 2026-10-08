import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { SymptomChecker } from './components/SymptomChecker';
import { TriageResultView } from './components/TriageResultView';
import { ClinicsFinder } from './components/ClinicsFinder';
import { TelehealthRoom } from './components/TelehealthRoom';
import { FirstAidGuide } from './components/FirstAidGuide';
import { SOSModal } from './components/SOSModal';
import {
  Language,
  PatientProfile,
  PatientVitals,
  RuralClinic,
  SymptomItem,
  TriageResult,
} from './types';
import { INITIAL_CLINICS } from './data/mockData';

export default function App() {
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<TabType>('symptom');
  const [isLowBandwidthMode, setIsLowBandwidthMode] = useState<boolean>(false);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isSOSOpen, setIsSOSOpen] = useState<boolean>(false);
  const [selectedVillage, setSelectedVillage] = useState<string>(
    'Kashti Village, Daund Block (Sector 4)'
  );

  const [clinics, setClinics] = useState<RuralClinic[]>(INITIAL_CLINICS);
  const [selectedClinic, setSelectedClinic] = useState<RuralClinic | null>(
    INITIAL_CLINICS[0]
  );

  const [currentPatient, setCurrentPatient] = useState<PatientProfile>({
    name: 'Ramesh Patil',
    age: 38,
    gender: 'male',
    pregnancyStatus: false,
    chronicConditions: [],
    villageLocation: 'Kashti Village, Sector 4',
    contactPhone: '+91 98220 12345',
  });

  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [isLoadingTriage, setIsLoadingTriage] = useState<boolean>(false);
  const [isTelehealthOpen, setIsTelehealthOpen] = useState<boolean>(false);

  // Fetch clinics from backend if server is up
  useEffect(() => {
    fetch('/api/clinics')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch clinics');
        return res.json();
      })
      .then((data) => {
        if (data.clinics && Array.isArray(data.clinics) && data.clinics.length > 0) {
          setClinics(data.clinics);
        }
      })
      .catch((err) => {
        console.log('Using offline clinic registry cache:', err);
      });
  }, []);

  // Handle Symptom Screening Submission
  const handleTriageSubmit = async (payload: {
    patient: PatientProfile;
    symptoms: SymptomItem[];
    vitals: PatientVitals;
    imageBase64?: string;
  }) => {
    setIsLoadingTriage(true);
    setCurrentPatient(payload.patient);

    try {
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient: payload.patient,
          symptoms: payload.symptoms,
          vitals: payload.vitals,
          imageBase64: payload.imageBase64,
          language,
          offlineProtocolMode: isLowBandwidthMode,
        }),
      });

      if (!response.ok) {
        throw new Error('Triage request failed');
      }

      const data: TriageResult = await response.json();
      setTriageResult(data);
      setActiveTab('triage');

      // Auto-match best clinic
      if (data.triageLevel === 'EMERGENCY') {
        const emergencyClinic =
          clinics.find((c) => c.features.antivenom && c.features.oxygenSupply) ||
          clinics[0];
        setSelectedClinic(emergencyClinic);
      }
    } catch (error) {
      console.warn('Network issue or offline mode, generating local protocol triage:', error);
      // Generate emergency or urgent fallback
      const hasSnakebite = payload.symptoms.some(
        (s) =>
          s.name.toLowerCase().includes('snake') ||
          s.name.toLowerCase().includes('bite')
      );

      const localResult: TriageResult = hasSnakebite
        ? {
            triageLevel: 'EMERGENCY',
            urgencyTitle: 'EMERGENCY: Suspected Snakebite or Venomous Envenomation',
            urgencyColor: 'red',
            confidence: 'HIGH',
            summary:
              'Immediate medical emergency. Patient requires prompt transfer to a facility stocked with Polyvalent Anti-Snake Venom (ASV).',
            redFlags: [
              'Do NOT tie tourniquets, do NOT cut wound or suck venom',
              'Immobilize the bitten limb below heart level',
              'Rush to Kashti PHC or Shirur CHC immediately',
            ],
            potentialConditions: [
              {
                name: 'Envenomed Snakebite (Viper / Krait / Cobra)',
                probability: 'High',
                description: 'Neurotoxic or hemotoxic venom spreading through lymphatic circulation.',
                treatmentAtClinic: 'Polyvalent ASV infusion, Tetanus toxoid, vital monitoring.',
              },
            ],
            homeStabilization: [
              {
                step: 'Immobilize the Limb with a Splint',
                icon: 'alert',
                detail: 'Splint limb with a stick or rolled cloth below heart level. Restrict all walking.',
              },
              {
                step: 'Remove Rings & Tight Jewelry',
                icon: 'alert',
                detail: 'Remove tight items before tissue swelling spreads.',
              },
            ],
            immediateWarnings: [
              'Never cut the fang marks or apply ice/chemicals.',
              'Call 108 Ambulance immediately.',
            ],
            recommendedFacilityType: 'Primary Health Centre (PHC) with ASV Stock',
            timeframe: 'Immediate (< 30 minutes)',
            questionsForDoctor: [
              'Is Polyvalent ASV in stock and ready?',
              'Does the patient need respiratory support?',
            ],
            audioSummaryScript:
              'Emergency snakebite warning: Keep patient completely still. Do not tie tourniquets. Call 108 ambulance now to reach a clinic with antivenom.',
            source: 'OFFLINE_LOCAL_PROTOCOL',
          }
        : {
            triageLevel: 'URGENT',
            urgencyTitle: 'URGENT: Same-Day Primary Health Centre Review',
            urgencyColor: 'amber',
            confidence: 'HIGH',
            summary:
              'Significant symptoms reported requiring clinical examination and hydration or antipyretic evaluation.',
            redFlags: [
              'Monitor for sudden spikes in fever > 39°C or drop in oxygen',
              'Ensure frequent fluid replacement with clean ORS',
            ],
            potentialConditions: [
              {
                name: 'Acute Community Infection / Gastroenteritis / Viral Syndrome',
                probability: 'High',
                description: 'Common seasonal infection requiring hydration and symptom management.',
                treatmentAtClinic: 'Rapid diagnostic test, clinical rehydration, appropriate antipyretics.',
              },
            ],
            homeStabilization: [
              {
                step: 'Frequent Sips of Clean ORS',
                icon: 'droplets',
                detail: 'Mix 1 liter boiled water + 6 teaspoons sugar + 1/2 teaspoon salt. Sip continuously.',
              },
              {
                step: 'Rest in Well-Ventilated Room',
                icon: 'bed',
                detail: 'Keep patient resting comfortably in fresh air.',
              },
            ],
            immediateWarnings: [
              'If urine stops for > 6 hours or severe vomiting occurs, transfer to PHC immediately.',
            ],
            recommendedFacilityType: 'Primary Health Centre (PHC) or Sub-Centre',
            timeframe: 'Within 4-6 hours today',
            questionsForDoctor: [
              'Is any blood or malaria rapid strip test required?',
              'Should we continue zinc or oral rehydration at home?',
            ],
            audioSummaryScript:
              'Urgent recommendation: Please visit your primary health centre today. Drink oral rehydration solution regularly and keep rested.',
            source: 'OFFLINE_LOCAL_PROTOCOL',
          };

      setTriageResult(localResult);
      setActiveTab('triage');
    } finally {
      setIsLoadingTriage(false);
    }
  };

  const handleSelectClinicAndNavigate = (clinic: RuralClinic) => {
    setSelectedClinic(clinic);
    setActiveTab('clinics');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isLowBandwidthMode={isLowBandwidthMode}
        onToggleLowBandwidth={() => setIsLowBandwidthMode(!isLowBandwidthMode)}
        onOpenSOS={() => setIsSOSOpen(true)}
        isAudioMuted={isAudioMuted}
        onToggleAudioMute={() => setIsAudioMuted(!isAudioMuted)}
        selectedVillage={selectedVillage}
        onSelectVillage={setSelectedVillage}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5">
        {/* Telehealth Room View (if active) */}
        {isTelehealthOpen ? (
          <TelehealthRoom
            patient={currentPatient}
            clinic={selectedClinic || clinics[0]}
            onClose={() => setIsTelehealthOpen(false)}
          />
        ) : (
          <>
            {activeTab === 'symptom' && (
              <SymptomChecker
                language={language}
                onSubmit={handleTriageSubmit}
                isLoading={isLoadingTriage}
                isLowBandwidthMode={isLowBandwidthMode}
              />
            )}

            {activeTab === 'triage' && (
              <>
                {triageResult ? (
                  <TriageResultView
                    result={triageResult}
                    patient={currentPatient}
                    language={language}
                    clinics={clinics}
                    onSelectClinic={handleSelectClinicAndNavigate}
                    onRequestTelehealth={() => setIsTelehealthOpen(true)}
                    onNewScreening={() => setActiveTab('symptom')}
                  />
                ) : (
                  <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-sm space-y-4">
                    <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-3xl mx-auto flex items-center justify-center text-3xl">
                      🩺
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        No Active Screening Report
                      </h2>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                        Please check symptoms first using the Symptom Check tab or select one of the quick rural case scenarios.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('symptom')}
                      className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs py-3 px-6 rounded-2xl shadow-md shadow-teal-700/20 cursor-pointer"
                    >
                      Start Symptom Screening Now
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'clinics' && (
              <ClinicsFinder
                clinics={clinics}
                selectedClinic={selectedClinic}
                onSelectClinic={(c) => setSelectedClinic(c)}
              />
            )}

            {activeTab === 'telehealth' && (
              <TelehealthRoom
                patient={currentPatient}
                clinic={selectedClinic || clinics[0]}
                onClose={() => setActiveTab('clinics')}
              />
            )}

            {activeTab === 'firstaid' && <FirstAidGuide language={language} />}
          </>
        )}
      </main>

      {/* 108 SOS Emergency Modal */}
      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
        clinics={clinics}
        onSelectClinic={handleSelectClinicAndNavigate}
      />

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsTelehealthOpen(false);
          setActiveTab(tab);
        }}
        language={language}
        hasTriageResult={Boolean(triageResult)}
      />
    </div>
  );
}
