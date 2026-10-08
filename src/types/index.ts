export type Language = 'en' | 'hi' | 'mr' | 'bn' | 'es' | 'sw';

export type TriageLevel = 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'SELF_CARE';

export interface PatientProfile {
  name: string;
  age: number | string;
  gender: 'female' | 'male' | 'other';
  pregnancyStatus: boolean;
  chronicConditions: string[];
  villageLocation: string;
  contactPhone: string;
}

export interface SymptomItem {
  id: string;
  name: string;
  bodyPart: string;
  severity: number; // 1-10
  durationDays: number;
  description: string;
  photoUrl?: string;
  photoBase64?: string;
}

export interface PatientVitals {
  temperatureC?: string;
  heartRateBpm?: string;
  systolicBP?: string;
  diastolicBP?: string;
  spO2?: string;
  bloodSugar?: string;
}

export interface PotentialCondition {
  name: string;
  probability: 'High' | 'Moderate' | 'Low';
  description: string;
  treatmentAtClinic: string;
}

export interface HomeStabilizationStep {
  step: string;
  icon: string;
  detail: string;
}

export interface TriageResult {
  triageLevel: TriageLevel;
  urgencyTitle: string;
  urgencyColor: 'red' | 'amber' | 'green' | 'blue';
  confidence: 'HIGH' | 'MEDIUM';
  summary: string;
  redFlags: string[];
  potentialConditions: PotentialCondition[];
  homeStabilization: HomeStabilizationStep[];
  immediateWarnings: string[];
  recommendedFacilityType: string;
  timeframe: string;
  questionsForDoctor: string[];
  audioSummaryScript: string;
  source?: string;
  timestamp?: string;
}

export interface RuralClinic {
  id: string;
  name: string;
  type: 'PHC' | 'CHC' | 'SUBCENTRE' | 'MOBILE_CAMP' | 'DISTRICT_HOSPITAL';
  typeLabel: string;
  distanceKm: number;
  lat: number;
  lng: number;
  address: string;
  contactNumber: string;
  emergencyNumber: string;
  hours: string;
  doctorsOnDuty: string;
  services: string[];
  features: {
    antivenom: boolean;
    maternity24x7: boolean;
    oxygenSupply: boolean;
    ambulance: boolean;
    telemedicine: boolean;
    freeCare: boolean;
  };
  currentWaitTimeMinutes: number;
  isOpenNow: boolean;
}

export interface FirstAidTopic {
  id: string;
  title: string;
  category: string;
  urgency: 'high' | 'medium';
  icon: string;
  dos: string[];
  donts: string[];
  steps: { stepNumber: number; title: string; instruction: string }[];
  warningNote: string;
}
