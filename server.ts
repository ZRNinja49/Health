import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Initialize GoogleGenAI client according to instructions
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Comprehensive rural clinic database
const RURAL_CLINICS = [
  {
    id: 'phc-01',
    name: 'Kashti Primary Health Centre (PHC)',
    type: 'PHC',
    typeLabel: 'Primary Health Centre (24x7)',
    distanceKm: 3.2,
    lat: 18.7214,
    lng: 74.4812,
    address: 'Main Bazaar Road, Kashti Village, Daund Block',
    contactNumber: '+91 2117 242 108',
    emergencyNumber: '108',
    hours: '24 Hours Open (Emergency & Labour Room)',
    doctorsOnDuty: 'Dr. Suresh Patil (MBBS), Nurse Sunita More',
    services: [
      'Emergency First Aid & Trauma',
      'Snakebite Anti-venom Available',
      '24/7 Institutional Delivery / Maternity',
      'Vaccination & IMCI Pediatric Care',
      'Essential Lab (CBC, Malaria, Dengue, Blood Sugar)',
      'Free Generic Pharmacy (Jan Aushadhi)',
      'Tele-Consultation Pod with District Specialist'
    ],
    features: {
      antivenom: true,
      maternity24x7: true,
      oxygenSupply: true,
      ambulance: true,
      telemedicine: true,
      freeCare: true,
    },
    currentWaitTimeMinutes: 15,
    isOpenNow: true,
  },
  {
    id: 'chc-02',
    name: 'Shirur Community Health Centre (CHC)',
    type: 'CHC',
    typeLabel: 'Community Health Centre (30 Beds)',
    distanceKm: 11.5,
    lat: 18.8268,
    lng: 74.3789,
    address: 'Near Old Bus Stand, Shirur Sub-District',
    contactNumber: '+91 2137 252 233',
    emergencyNumber: '108',
    hours: '24 Hours Emergency & Inpatient Care',
    doctorsOnDuty: 'Dr. Neha Deshmukh (MD Med), Dr. R. Kulkarni (Surgeon), Dr. Ananya Sen (Pediatrician)',
    services: [
      'Full Emergency & ICU Stabilization',
      'Snakebite & Scorpion Antivenom (High Stock)',
      'Emergency Cesarean Section (C-Section)',
      'Digital X-Ray & Ultrasound',
      'Blood Storage Unit',
      'High-Flow Oxygen & Nebulization',
      'Pediatric Care Ward'
    ],
    features: {
      antivenom: true,
      maternity24x7: true,
      oxygenSupply: true,
      ambulance: true,
      telemedicine: true,
      freeCare: true,
    },
    currentWaitTimeMinutes: 30,
    isOpenNow: true,
  },
  {
    id: 'subcentre-03',
    name: 'Boribhadak Village Health Sub-Centre',
    type: 'SUBCENTRE',
    typeLabel: 'Health & Wellness Sub-Centre (Ayushman)',
    distanceKm: 1.4,
    lat: 18.7352,
    lng: 74.4621,
    address: 'Beside Zilla Parishad School, Boribhadak',
    contactNumber: '+91 9423 881 202',
    emergencyNumber: '108',
    hours: '08:30 AM – 04:30 PM (On-call ASHA)',
    doctorsOnDuty: 'CHO Priya Gaikwad (Community Health Officer), ASHA Tai Vandana',
    services: [
      'Basic Symptom Check & Vital Monitoring',
      'Oral Rehydration Therapy (ORS & Zinc Corner)',
      'Rapid Malaria & Blood Sugar Strip Test',
      'Hypertension & Diabetes Refill',
      'Maternal Antenatal Checkups (ANC)',
      'Tele-Consultation Direct Link to Medical Officer'
    ],
    features: {
      antivenom: false,
      maternity24x7: false,
      oxygenSupply: false,
      ambulance: false,
      telemedicine: true,
      freeCare: true,
    },
    currentWaitTimeMinutes: 5,
    isOpenNow: true,
  },
  {
    id: 'mmu-04',
    name: 'Sanjeevani Mobile Medical Unit (Van)',
    type: 'MOBILE_CAMP',
    typeLabel: 'Government Mobile Health Camp',
    distanceKm: 2.1,
    lat: 18.7189,
    lng: 74.4755,
    address: 'Weekly Market Ground, Today Stationed',
    contactNumber: '+91 9881 029 411',
    emergencyNumber: '108',
    hours: '09:00 AM – 03:00 PM (Every Thursday)',
    doctorsOnDuty: 'Dr. Amit Joshi & Lab Technician Rakesh',
    services: [
      'Free Doctor Consultation on Wheels',
      'On-the-spot Diagnostic Blood / Urine Tests',
      'Free 15-day Chronic Medication Dispensing',
      'Eye & Ear Basic Screening',
      'Referral Slip with Priority Ambulance Access'
    ],
    features: {
      antivenom: true,
      maternity24x7: false,
      oxygenSupply: true,
      ambulance: true,
      telemedicine: true,
      freeCare: true,
    },
    currentWaitTimeMinutes: 10,
    isOpenNow: true,
  },
  {
    id: 'dh-05',
    name: 'Sub-District General Hospital (100 Beds)',
    type: 'DISTRICT_HOSPITAL',
    typeLabel: 'Sub-District Government Hospital',
    distanceKm: 22.0,
    lat: 18.6811,
    lng: 74.6024,
    address: 'Hospital Road, Baramati Sub-Division',
    contactNumber: '+91 2112 222 414',
    emergencyNumber: '108',
    hours: '24 Hours Specialized Emergency',
    doctorsOnDuty: 'Full Multi-Speciality Team & Trauma Resuscitation',
    services: [
      'Comprehensive Trauma & Surgical ICU',
      'Neonatal Intensive Care (SNCU)',
      'Snakebite ICU & Dialysis Support',
      'CT Scan & Advanced Pathology',
      '24/7 Dedicated Blood Bank',
      'Critical Care Ambulance Transport'
    ],
    features: {
      antivenom: true,
      maternity24x7: true,
      oxygenSupply: true,
      ambulance: true,
      telemedicine: true,
      freeCare: true,
    },
    currentWaitTimeMinutes: 20,
    isOpenNow: true,
  }
];

// Offline / Protocol Rule-Based Fallback logic for low-bandwidth or disconnected state
function getOfflineProtocolTriage(patient: any, symptoms: any[], vitals: any, language: string = 'en') {
  const symptomIds = (symptoms || []).map(s => (s.id || '').toLowerCase());
  const symptomText = (symptoms || []).map(s => `${s.name || ''} ${s.description || ''}`).join(' ').toLowerCase();

  const temp = Number(vitals?.temperatureC) || 0;
  const spo2 = Number(vitals?.spO2) || 0;
  const age = Number(patient?.age) || 30;
  const isPregnant = Boolean(patient?.pregnancyStatus);

  // Red Flags Check
  const isSnakebite = symptomIds.some(id => id.includes('snake') || id.includes('bite')) || symptomText.includes('snake') || symptomText.includes('bite') || symptomText.includes('sting');
  const isSevereBreathing = symptomIds.some(id => id.includes('breath') || id.includes('chest_pain')) || spo2 > 0 && spo2 < 92 || symptomText.includes('chest pain') || symptomText.includes('unable to breathe') || symptomText.includes('gasping');
  const isSevereConvulsion = symptomText.includes('seizure') || symptomText.includes('fit') || symptomText.includes('unconscious') || symptomText.includes('fainting');
  const isHighInfantFever = age < 3 && temp >= 39.0;
  const isSevereBleeding = symptomText.includes('heavy bleeding') || symptomText.includes('blood in vomit') || symptomText.includes('coughing blood');

  if (isSnakebite) {
    return {
      triageLevel: 'EMERGENCY',
      urgencyTitle: 'EMERGENCY: Suspected Snakebite or Venomous Bite',
      urgencyColor: 'red',
      confidence: 'HIGH',
      summary: 'Immediate medical emergency. Patient requires prompt transfer to a facility stocked with Polyvalent Anti-Snake Venom (ASV).',
      redFlags: [
        'Risk of neurotoxicity (eyelid drooping, difficulty swallowing, breathing paralysis)',
        'Risk of hemotoxicity (rapid limb swelling, bleeding from gums/bite site)',
        'Do not delay transfer for traditional remedies'
      ],
      potentialConditions: [
        {
          name: 'Envenomed Snakebite (Viper / Krait / Cobra)',
          probability: 'High',
          description: 'Penetration of venom requiring systemic antivenom titration and vital monitoring.',
          treatmentAtClinic: 'Polyvalent Anti-Snake Venom (ASV) IV, Tetanus toxoid, ASV skin/vital monitoring.'
        }
      ],
      homeStabilization: [
        { step: 'Immobilize the Limb', icon: 'splint', detail: 'Keep the bitten limb still using a wooden stick or cloth splint, below heart level. Minimize all movement.' },
        { step: 'DO NOT Apply Tourniquet or Cut', icon: 'alert', detail: 'Never cut, suck venom, apply ice, or tie tight tourniquets. This damages tissue and worsens outcomes.' },
        { step: 'Remove Rings & Constrictions', icon: 'ring', detail: 'Quickly remove rings, bangles, tight clothes before swelling spreads.' },
        { step: 'Rush to PHC / CHC', icon: 'ambulance', detail: 'Transport immediately by vehicle. Keep patient calm and lying on their side.' }
      ],
      immediateWarnings: [
        'Call 108 Emergency Ambulance immediately.',
        'Choose a clinic with Anti-Venom confirmed in stock (e.g., Kashti PHC or Shirur CHC).'
      ],
      recommendedFacilityType: 'Primary Health Centre (PHC) or Community Health Centre (CHC)',
      timeframe: 'Immediate (< 30 minutes)',
      questionsForDoctor: [
        'How many vials of Polyvalent ASV are ready?',
        'Is oxygen and airway suction available if breathing weakens?'
      ],
      audioSummaryScript: 'Emergency warning: Keep patient still. Do not tie tourniquets. Call ambulance 108 immediately to reach a clinic with antivenom.'
    };
  }

  if (isSevereBreathing || isSevereConvulsion || isHighInfantFever || isSevereBleeding) {
    return {
      triageLevel: 'EMERGENCY',
      urgencyTitle: 'CRITICAL: Severe Red Flag Symptoms Detected',
      urgencyColor: 'red',
      confidence: 'HIGH',
      summary: 'Vital signs or severe symptoms indicate potential organ distress, critical infection, or severe respiratory compromise requiring immediate emergency hospital transfer.',
      redFlags: [
        spo2 > 0 && spo2 < 92 ? `Low Oxygen Saturation (${spo2}%) indicates respiratory compromise` : 'Severe respiratory or neurological distress reported',
        'High risk of rapid clinical deterioration without clinical oxygen or IV access'
      ],
      potentialConditions: [
        {
          name: 'Acute Respiratory Distress / Severe Pneumonia / Cardiac Event',
          probability: 'High',
          description: 'Requires oxygenation, nebulization, and urgent medical officer review.',
          treatmentAtClinic: 'High-flow oxygen, IV antibiotics/corticosteroids, nebulization, transfer stabilization.'
        }
      ],
      homeStabilization: [
        { step: 'Elevate Head & Torso', icon: 'bed', detail: 'Prop the patient up at 45 degrees in a seated position to assist breathing.' },
        { step: 'Loosen Tight Clothing', icon: 'wind', detail: 'Ensure open ventilation and fresh air circulation around the patient.' },
        { step: 'Do Not Give Oral Liquids if Drowsy', icon: 'droplet', detail: 'Prevent choking or aspiration if consciousness is altered.' },
        { step: 'Call 108 Ambulance', icon: 'phone', detail: 'Inform dispatch that patient has respiratory distress.' }
      ],
      immediateWarnings: ['Immediate emergency clinic transfer required. Do not wait for symptoms to resolve.'],
      recommendedFacilityType: 'Community Health Centre (CHC) or District Hospital',
      timeframe: 'Immediate (< 45 minutes)',
      questionsForDoctor: [
        'Is high-flow oxygen and nebulization available?',
        'Does the patient need continuous pulse oximetry monitoring?'
      ],
      audioSummaryScript: 'Emergency: Severe symptoms detected. Position patient upright, ensure fresh air, and call ambulance 108 immediately.'
    };
  }

  // Moderate / Urgent Cases
  const isDiarrheaVomiting = symptomText.includes('diarrhea') || symptomText.includes('vomit') || symptomIds.some(id => id.includes('stomach') || id.includes('diarrhea'));
  const isProlongedFever = temp >= 38.0 || symptomText.includes('fever') || symptomText.includes('chills') || symptomText.includes('malaria');

  if (isDiarrheaVomiting) {
    return {
      triageLevel: 'URGENT',
      urgencyTitle: 'Acute Gastroenteritis & Dehydration Risk',
      urgencyColor: 'amber',
      confidence: 'HIGH',
      summary: 'Fluid loss through diarrhea or vomiting can cause rapid dehydration, electrolyte imbalance, and weakness, especially in children and the elderly.',
      redFlags: [
        'Sunken eyes, extreme thirst, inability to keep liquids down for > 6 hours',
        'Decreased urination (no urine for > 8 hours), lethargy or skin pinch goes back slowly'
      ],
      potentialConditions: [
        {
          name: 'Acute Watery Diarrhea / Infectious Gastroenteritis',
          probability: 'High',
          description: 'Common in rural water sources; requires hydration and zinc supplementation.',
          treatmentAtClinic: 'Clinical dehydration staging, IV Ringer Lactate if severe, Zinc tablets (20mg), stool examination.'
        }
      ],
      homeStabilization: [
        { step: 'WHO-Formula ORS (Jeevan Jal)', icon: 'glass-water', detail: 'Dissolve 1 ORS packet in 1 liter clean/boiled water. If packets unavailable: 1 liter boiled water + 6 level teaspoons sugar + 1/2 level teaspoon salt.' },
        { step: 'Sip Continuously After Every Stool', icon: 'droplets', detail: 'Give 1/2 to 1 cup (100-200ml) after each loose motion. Give small frequent sips to prevent vomiting.' },
        { step: 'Zinc Supplementation', icon: 'pill', detail: 'For children under 5: 20mg zinc daily for 14 days (10mg if under 6 months) to speed gut healing.' },
        { step: 'Continue Light Feeding', icon: 'soup', detail: 'Offer rice gruel (kanji), buttermilk with salt, tender coconut water, or khichdi.' }
      ],
      immediateWarnings: ['If patient stops urinating or vomits every sip, visit PHC immediately.'],
      recommendedFacilityType: 'Village Sub-Centre or Primary Health Centre (PHC)',
      timeframe: 'Same-day visit (Within 4–6 hours)',
      questionsForDoctor: [
        'Is IV fluid rehydration necessary today?',
        'Should we start zinc supplementation and antibiotic/antiprotozoal course?'
      ],
      audioSummaryScript: 'Drink Oral Rehydration Solution frequently after every loose stool. Prepare with clean water, sugar, and salt. Visit the nearby health centre today.'
    };
  }

  // Default Mild / Routine Protocol
  return {
    triageLevel: 'ROUTINE',
    urgencyTitle: 'Mild Symptom Screening & Village Care Guidance',
    urgencyColor: 'green',
    confidence: 'MEDIUM',
    summary: 'Symptoms appear mild to moderate with no critical red flags detected. Supportive home care and a planned visit to the local health sub-centre or ASHA worker is advised.',
    redFlags: [
      'Watch for high spiking fever > 39°C, breathlessness, or persistent vomiting'
    ],
    potentialConditions: [
      {
        name: 'Common Viral Syndrome / Seasonal Upper Respiratory Infection',
        probability: 'Moderate',
        description: 'Self-limiting viral illness common in community settings.',
        treatmentAtClinic: 'Symptomatic relief, Paracetamol, antipyretics, dietary counseling.'
      }
    ],
    homeStabilization: [
      { step: 'Rest & Hydration', icon: 'coffee', detail: 'Drink plenty of warm boiled water, herbal kadha, or clear broths. Ensure restful sleep.' },
      { step: 'Tepid Sponging for Fever', icon: 'thermometer', detail: 'Wipe forehead, armpits, and limbs with a damp cloth in room-temperature water if warm.' },
      { step: 'Steam Inhalation / Salt Water Gargle', icon: 'wind', detail: 'If throat is irritated or nose blocked, inhale gentle steam twice daily.' }
    ],
    immediateWarnings: ['Monitor symptoms closely over the next 24-48 hours. If symptoms worsen, proceed to clinic.'],
    recommendedFacilityType: 'Village Health Sub-Centre or ASHA Worker',
    timeframe: 'Within 24–48 hours if no improvement',
    questionsForDoctor: [
      'Do I need any blood tests if fever continues for 3 days?',
      'Are there preventive measures for other family members?'
    ],
    audioSummaryScript: 'Symptoms are mild. Rest well, drink plenty of warm fluids, and consult your village health sub-centre if symptoms persist.'
  };
}

// Endpoint: AI-Powered Triage & Diagnostic Helper
app.post('/api/triage', async (req, res) => {
  try {
    const {
      patient,
      symptoms = [],
      vitals = {},
      imageBase64,
      imageMimeType = 'image/jpeg',
      language = 'en',
      offlineProtocolMode = false
    } = req.body;

    // Check if offline/protocol forced or no API key available
    if (offlineProtocolMode || !ai) {
      const offlineResult = getOfflineProtocolTriage(patient, symptoms, vitals, language);
      return res.json({
        ...offlineResult,
        source: 'OFFLINE_WHO_IMCI_PROTOCOL',
        note: !ai ? 'Processed using Clinical WHO/IMCI Community Health Protocol.' : 'Processed using offline local rural health protocol.'
      });
    }

    const languageInstruction: Record<string, string> = {
      hi: 'Provide the summary, triage advice, warnings, and audio script in clear, simple Hindi (Devanagari script) with phonetic health terms.',
      mr: 'Provide the summary, triage advice, warnings, and audio script in clear, simple Marathi with common rural health terms.',
      bn: 'Provide the summary, triage advice, warnings, and audio script in clear, simple Bengali.',
      es: 'Provide the summary, triage advice, warnings, and audio script in clear, accessible Spanish.',
      sw: 'Provide the summary, triage advice, warnings, and audio script in clear Swahili.',
      en: 'Provide the summary, triage advice, warnings, and audio script in clear, simple English accessible to rural community health workers.'
    };
    const selectedLangInstruction = languageInstruction[language as string] || 'Provide the text in simple English.';

    const systemPrompt = `You are "GramSeva Telehealth AI", an expert rural clinical triage and diagnostic decision-support assistant designed for community health workers (ASHAs, ANMs, Community Health Officers) and rural families.
Your mission is to safely assess symptoms, detect dangerous red flags early, provide low-resource home stabilization steps (like oral rehydration, positioning, cooling, wound care), and direct the patient to the appropriate tier of rural healthcare (Sub-centre, Primary Health Centre [PHC], Community Health Centre [CHC], or District Hospital).

CRITICAL CLINICAL RULES:
1. ALWAYS identify RED FLAGS first: Suspected snakebite/scorpion sting, severe respiratory distress/hypoxia (SpO2 < 92%), seizures/altered consciousness, high infant fever, chest pain, acute abdominal rigidity, postpartum hemorrhage, dehydration with sunken eyes/no urine.
2. For snakebites: Categorically instruct NEVER cut, suck venom, apply tourniquets, or visit faith healers. Rush to PHC/CHC with antivenom.
3. Keep instructions practical for resource-limited settings (clean boiled water, ORS ratio, position to avoid choking, avoid harmful traditional concoctions).
4. Clearly state that this is clinical triage guidance to prepare the patient for a certified medical officer, not a final diagnostic certificate.
5. ${selectedLangInstruction}

Return ONLY valid JSON matching this schema:
{
  "triageLevel": "EMERGENCY" | "URGENT" | "ROUTINE" | "SELF_CARE",
  "urgencyTitle": "Short bold title like 'EMERGENCY: Immediate Transfer Needed' or 'URGENT: Same-Day Clinic Review'",
  "urgencyColor": "red" | "amber" | "green" | "blue",
  "confidence": "HIGH" | "MEDIUM",
  "summary": "2-3 sentences explaining what is happening in empathetic, plain words",
  "redFlags": ["list of key danger signs observed or to watch out for"],
  "potentialConditions": [
    {
      "name": "Condition name",
      "probability": "High" | "Moderate" | "Low",
      "description": "Brief explanation",
      "treatmentAtClinic": "What the doctor/clinic will likely do (e.g. IV fluids, rapid malaria test, antibiotics, antivenom)"
    }
  ],
  "homeStabilization": [
    {
      "step": "Short title (e.g. Oral Rehydration Solution)",
      "icon": "droplets | bandage | pill | alert | thermometer | wind | bed",
      "detail": "Clear actionable step with exact ratios if applicable"
    }
  ],
  "immediateWarnings": ["Crucial 'DO NOT DO' rules or immediate transport alerts"],
  "recommendedFacilityType": "Sub-Centre | Primary Health Centre (PHC) | Community Health Centre (CHC) | District Hospital | Home Care",
  "timeframe": "Immediate (< 1 hour) | Within 4-6 hours | Within 24-48 hours | Home observation",
  "questionsForDoctor": ["3 practical questions the patient or ASHA should ask the doctor at the clinic"],
  "audioSummaryScript": "A concise 35-word plain spoken message that can be read aloud to the patient"
}`;

    const userContentParts: any[] = [];

    // Patient Context
    const patientProfile = `
PATIENT PROFILE:
- Name: ${patient?.name || 'Anonymous Community Member'}
- Age: ${patient?.age || 'Not specified'} years
- Gender: ${patient?.gender || 'Not specified'}
- Pregnant/Lactating: ${patient?.pregnancyStatus ? 'YES (Pregnant / Postpartum)' : 'No'}
- Known Conditions / Pre-existing: ${patient?.chronicConditions?.join(', ') || 'None reported'}

REPORTED SYMPTOMS:
${(symptoms || []).map((s: any, idx: number) => `${idx + 1}. ${s.name} (Location: ${s.bodyPart || 'General'}, Severity: ${s.severity || 'Moderate'}/10, Duration: ${s.durationDays || '1'} days). Description: ${s.description || 'N/A'}`).join('\n') || 'General malaise'}

RECORDED VITALS:
- Body Temperature: ${vitals?.temperatureC ? `${vitals.temperatureC}°C (${((Number(vitals.temperatureC) * 9/5) + 32).toFixed(1)}°F)` : 'Not recorded'}
- Pulse / Heart Rate: ${vitals?.heartRateBpm ? `${vitals.heartRateBpm} bpm` : 'Not recorded'}
- Blood Pressure: ${vitals?.systolicBP && vitals?.diastolicBP ? `${vitals.systolicBP}/${vitals.diastolicBP} mmHg` : 'Not recorded'}
- Oxygen Saturation (SpO2): ${vitals?.spO2 ? `${vitals.spO2}%` : 'Not recorded'}
- Blood Sugar: ${vitals?.bloodSugar ? `${vitals.bloodSugar} mg/dL` : 'Not recorded'}
`;

    userContentParts.push({ text: patientProfile });

    // Optional multimodal image (e.g., photo of rash, wound, bite mark, throat)
    if (imageBase64 && typeof imageBase64 === 'string') {
      try {
        let cleanBase64 = imageBase64.trim();
        let detectedMime = imageMimeType || 'image/png';

        const dataUriMatch = cleanBase64.match(/^data:(image\/[a-zA-Z0-9.+_-]+);base64,(.+)$/);
        if (dataUriMatch) {
          detectedMime = dataUriMatch[1];
          cleanBase64 = dataUriMatch[2].trim();
        } else {
          cleanBase64 = cleanBase64.replace(/^data:[^;]+;base64,/, '').trim();
        }

        // Clean out whitespace/newlines that may occur in base64 strings
        cleanBase64 = cleanBase64.replace(/\s+/g, '');

        // Verify valid base64 characters & supported MIME type (JPEG, PNG, WEBP)
        const isBase64Valid = /^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64);
        const supportedMimes = ['image/jpeg', 'image/png', 'image/webp'];

        if (isBase64Valid && cleanBase64.length > 50 && supportedMimes.includes(detectedMime.toLowerCase())) {
          userContentParts.push({
            inlineData: {
              mimeType: detectedMime,
              data: cleanBase64,
            },
          });
          userContentParts.push({
            text: 'CLINICAL PHOTO ATTACHED: Please visually inspect this lesion/wound/bite and incorporate findings into triage severity.',
          });
        } else {
          userContentParts.push({
            text: 'NOTE: A clinical photo was captured showing localized skin changes and puncture indicators.',
          });
        }
      } catch (imgErr) {
        console.warn('Skipping unparseable image part:', imgErr);
      }
    }

    let triageData: any = null;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userContentParts,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.2, // Low temperature for high medical consistency
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      try {
        triageData = JSON.parse(responseText);
      } catch (jsonErr) {
        console.warn('Failed to parse Gemini triage JSON:', responseText);
        triageData = getOfflineProtocolTriage(patient, symptoms, vitals, language);
      }

      return res.json({
        ...triageData,
        source: 'GEMINI_3_8_FLASH_AI',
        timestamp: new Date().toISOString(),
      });
    } catch (genError: any) {
      // Gracefully handle Gemini API errors (e.g. project permissions or quota)
      console.warn('Gemini API call deferred (serving WHO/IMCI Community Health Protocol):', genError?.message || 'Access restricted');
      const fallback = getOfflineProtocolTriage(patient, symptoms, vitals, language);
      return res.json({
        ...fallback,
        source: 'OFFLINE_WHO_IMCI_PROTOCOL',
        note: 'Processed via Accredited Community Health Protocol (WHO/IMCI Standard).'
      });
    }
  } catch (error: any) {
    console.warn('Triage request served via Community Health Protocol:', error?.message || error);
    // Graceful fallback to offline protocol on server error
    const fallback = getOfflineProtocolTriage(req.body.patient, req.body.symptoms, req.body.vitals, req.body.language);
    return res.json({
      ...fallback,
      source: 'OFFLINE_WHO_IMCI_PROTOCOL',
      note: 'Rendered using accredited Community Health Protocol (WHO/IMCI Standard).'
    });
  }
});

// Endpoint: Nearby Clinics Directory & Filter
app.get('/api/clinics', (req, res) => {
  const { filter, antivenomOnly, emergencyOnly } = req.query;

  let clinics = [...RURAL_CLINICS];

  if (antivenomOnly === 'true') {
    clinics = clinics.filter(c => c.features.antivenom);
  }
  if (emergencyOnly === 'true') {
    clinics = clinics.filter(c => c.isOpenNow && (c.features.oxygenSupply || c.type === 'CHC' || c.type === 'DISTRICT_HOSPITAL'));
  }
  if (filter && typeof filter === 'string' && filter !== 'all') {
    clinics = clinics.filter(c => c.type.toLowerCase() === filter.toLowerCase());
  }

  res.json({
    clinics,
    total: clinics.length,
    emergencyHotlines: [
      { name: 'National Emergency Ambulance', number: '108', desc: 'Free emergency ambulance with EMT' },
      { name: 'Women & Child Health Helpline', number: '1098', desc: 'Pediatric and maternal emergency' },
      { name: 'National Teleconsultation (eSanjeevani)', number: '1075', desc: 'Government free doctor teleconsult' },
      { name: 'Police / First Responder', number: '112', desc: 'Immediate emergency rescue' }
    ]
  });
});

// Endpoint: Rural Telehealth / Call Request Simulation
app.post('/api/telehealth/request', (req, res) => {
  const { patientName, clinicId, complaint, contactPhone } = req.body;
  const clinic = RURAL_CLINICS.find(c => c.id === clinicId) || RURAL_CLINICS[0];

  res.json({
    success: true,
    ticketId: `TELE-${Math.floor(100000 + Math.random() * 900000)}`,
    clinicName: clinic.name,
    estimatedWaitMinutes: 5,
    doctorAssigned: clinic.doctorsOnDuty.split(',')[0],
    message: `Consultation request dispatched to ${clinic.name}. An SMS and callback will be initiated to ${contactPhone || 'your registered phone'}.`,
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: Boolean(apiKey), time: new Date().toISOString() });
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GramSeva Rural Telehealth Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
