import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Phone,
  Volume2,
  VolumeX,
  MapPin,
  Video,
  FileText,
  Clock,
  ArrowRight,
  ShieldAlert,
  HelpCircle,
  Share2,
  Printer,
  ChevronRight,
  Hospital,
} from 'lucide-react';
import {
  Language,
  PatientProfile,
  RuralClinic,
  TriageResult,
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { speakText, stopSpeech } from '../utils/speech';

interface TriageResultViewProps {
  result: TriageResult;
  patient: PatientProfile;
  language: Language;
  clinics: RuralClinic[];
  onSelectClinic: (clinic: RuralClinic) => void;
  onRequestTelehealth: () => void;
  onNewScreening: () => void;
}

export const TriageResultView: React.FC<TriageResultViewProps> = ({
  result,
  patient,
  language,
  clinics,
  onSelectClinic,
  onRequestTelehealth,
  onNewScreening,
}) => {
  const t = TRANSLATIONS[language];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showReferralSlip, setShowReferralSlip] = useState(false);

  // Pick nearest clinic that satisfies the triage level
  const recommendedClinic =
    result.triageLevel === 'EMERGENCY'
      ? clinics.find((c) => c.features.antivenom && c.features.oxygenSupply) ||
        clinics[0]
      : clinics.find((c) => c.type === 'PHC' || c.type === 'SUBCENTRE') ||
        clinics[0];

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const textToSpeak =
        result.audioSummaryScript ||
        `${result.urgencyTitle}. ${result.summary}. Recommended to visit ${result.recommendedFacilityType}.`;
      speakText(textToSpeak, language, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const getUrgencyStyles = () => {
    switch (result.triageLevel) {
      case 'EMERGENCY':
        return {
          bannerBg: 'bg-gradient-to-r from-red-600 to-rose-700 text-white',
          border: 'border-red-500',
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          icon: ShieldAlert,
          titleColor: 'text-red-700',
        };
      case 'URGENT':
        return {
          bannerBg: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white',
          border: 'border-amber-500',
          badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: AlertTriangle,
          titleColor: 'text-amber-700',
        };
      case 'ROUTINE':
      default:
        return {
          bannerBg: 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white',
          border: 'border-teal-500',
          badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
          icon: CheckCircle2,
          titleColor: 'text-teal-700',
        };
    }
  };

  const styles = getUrgencyStyles();
  const UrgencyIcon = styles.icon;

  return (
    <div className="space-y-5 pb-24 animate-fade-in">
      {/* Triage Urgency Banner */}
      <div
        className={`rounded-3xl p-5 shadow-lg ${styles.bannerBg} relative overflow-hidden`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <UrgencyIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase opacity-80">
                TRIAGE LEVEL: {result.triageLevel}
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight leading-snug">
                {result.urgencyTitle}
              </h1>
            </div>
          </div>

          {/* Audio Readout Button */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl font-bold text-xs transition-all shadow-md cursor-pointer shrink-0 ${
              isPlayingAudio
                ? 'bg-white text-slate-900 animate-pulse'
                : 'bg-white/20 hover:bg-white/30 text-white'
            }`}
            title="Read out instructions aloud"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-rose-600" />
                <span className="hidden sm:inline">Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Listen Voice</span>
              </>
            )}
          </button>
        </div>

        {/* Clinical Summary */}
        <p className="mt-3 text-xs sm:text-sm text-white/95 leading-relaxed bg-black/10 p-3 rounded-2xl">
          {result.summary}
        </p>

        {/* Timeframe & Recommendation Badge */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="bg-white/25 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Timeframe: {result.timeframe}</span>
          </span>
          <span className="bg-white text-slate-900 px-2.5 py-1 rounded-full shadow-xs">
            Facility: {result.recommendedFacilityType}
          </span>
        </div>
      </div>

      {/* Critical Red Flags Box */}
      {result.redFlags && result.redFlags.length > 0 && (
        <div className="bg-red-50/90 border border-red-200 rounded-3xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-red-900 font-extrabold text-xs">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{t.triage.redFlagsTitle}</span>
          </div>
          <ul className="space-y-1.5 text-xs text-red-800 list-disc pl-5">
            {result.redFlags.map((flag, idx) => (
              <li key={idx} className="leading-snug font-medium">
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Health Facility Card */}
      {recommendedClinic && (
        <div className="bg-white rounded-3xl p-5 border-2 border-teal-500/40 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span className="flex items-center gap-1 text-teal-800">
              <Hospital className="w-4 h-4 text-teal-600" />
              {t.triage.facilityRecTitle}
            </span>
            <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-bold">
              {recommendedClinic.distanceKm} km away
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {recommendedClinic.name}
              </h3>
              <p className="text-xs text-slate-600">
                {recommendedClinic.address}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {recommendedClinic.features.antivenom && (
                  <span className="text-[10px] bg-red-100 text-red-800 font-bold px-2 py-0.5 rounded-md">
                    🐍 Antivenom Ready
                  </span>
                )}
                {recommendedClinic.features.oxygenSupply && (
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-md">
                    🌬️ Oxygen Supply
                  </span>
                )}
                {recommendedClinic.features.maternity24x7 && (
                  <span className="text-[10px] bg-pink-100 text-pink-800 font-bold px-2 py-0.5 rounded-md">
                    👶 24x7 Delivery
                  </span>
                )}
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                  🕒 Wait: ~{recommendedClinic.currentWaitTimeMinutes}m
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
              <a
                href={`tel:${recommendedClinic.contactNumber}`}
                className="flex-1 sm:flex-initial bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Clinic</span>
              </a>
              <button
                type="button"
                onClick={() => onSelectClinic(recommendedClinic)}
                className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Directions</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Potential Medical Conditions Considered */}
      {result.potentialConditions && result.potentialConditions.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t.triage.conditionsTitle}
          </h3>

          <div className="space-y-2.5">
            {result.potentialConditions.map((cond, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900">
                    {cond.name}
                  </span>
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      cond.probability === 'High'
                        ? 'bg-red-100 text-red-800'
                        : cond.probability === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {cond.probability} Probability
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cond.description}
                </p>
                {cond.treatmentAtClinic && (
                  <div className="text-[11px] bg-teal-50 text-teal-900 p-2 rounded-xl border border-teal-100 font-medium">
                    <strong>Clinic Action:</strong> {cond.treatmentAtClinic}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Immediate Home Stabilization & Care Protocols */}
      {result.homeStabilization && result.homeStabilization.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-800">
            {t.triage.homeCareTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.homeStabilization.map((step, idx) => (
              <div
                key={idx}
                className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-3.5 space-y-1"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">
                    {idx + 1}
                  </span>
                  <span>{step.step}</span>
                </div>
                <p className="text-xs text-emerald-900/90 leading-relaxed pl-7">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* What NOT to do Warnings */}
      {result.immediateWarnings && result.immediateWarnings.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-300 rounded-3xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{t.triage.warningsTitle}</span>
          </div>
          <ul className="space-y-1 text-xs text-amber-900 list-disc pl-5">
            {result.immediateWarnings.map((warn, idx) => (
              <li key={idx} className="leading-snug font-medium">
                {warn}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Questions to Ask Doctor */}
      {result.questionsForDoctor && result.questionsForDoctor.length > 0 && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <span>{t.triage.doctorQuestionsTitle}</span>
          </div>
          <div className="space-y-2">
            {result.questionsForDoctor.map((q, idx) => (
              <div
                key={idx}
                className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2"
              >
                <span className="font-bold text-teal-700">•</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          onClick={onRequestTelehealth}
          className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-md shadow-teal-700/20 cursor-pointer"
        >
          <Video className="w-4 h-4" />
          <span>{t.triage.requestTeleconsult}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowReferralSlip(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>{t.triage.downloadSlip}</span>
        </button>

        <button
          type="button"
          onClick={onNewScreening}
          className="bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs cursor-pointer"
        >
          <span>Start New Screening</span>
        </button>
      </div>

      {/* Medical Disclaimer */}
      <div className="text-[11px] text-slate-400 text-center leading-relaxed px-4 pt-2">
        Disclaimer: GramSeva Telehealth AI is a triage decision-support and navigation tool for rural health workers and families. It does not replace clinical examination by a registered medical practitioner. In emergency conditions, call 108 or transfer to nearest PHC immediately.
      </div>

      {/* Referral Slip Modal */}
      {showReferralSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 max-h-[90vh] overflow-y-auto border-2 border-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  RURAL HEALTH REFERRAL VOUCHER
                </h3>
                <p className="text-[10px] text-slate-500">
                  Government Health Mission / ASHA Handoff Slip
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowReferralSlip(false)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-800">
              <div className="bg-slate-50 p-2.5 rounded-xl space-y-1">
                <div>
                  <strong>Patient:</strong> {patient.name} ({patient.age}y /{' '}
                  {patient.gender})
                </div>
                <div>
                  <strong>Village:</strong> {patient.villageLocation}
                </div>
                <div>
                  <strong>Phone:</strong> {patient.contactPhone}
                </div>
                <div>
                  <strong>Triage Level:</strong>{' '}
                  <span className="font-black text-red-600">
                    {result.triageLevel}
                  </span>
                </div>
              </div>

              <div>
                <strong>Clinical Complaint:</strong>
                <p className="text-slate-600 mt-0.5">{result.summary}</p>
              </div>

              <div>
                <strong>Destination Facility:</strong>{' '}
                {recommendedClinic?.name} ({recommendedClinic?.distanceKm} km)
              </div>

              <div>
                <strong>Immediate Stabilization Done:</strong>
                <ul className="list-disc pl-4 text-slate-600 mt-0.5 space-y-0.5">
                  {result.homeStabilization.map((s, idx) => (
                    <li key={idx}>{s.step}</li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 bg-teal-50 border border-teal-200 rounded-xl text-teal-900 text-[11px]">
                <strong>Slip ID:</strong> GS-REF-
                {Math.floor(100000 + Math.random() * 900000)} | Generated:{' '}
                {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Voucher</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReferralSlip(false)}
                className="bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
