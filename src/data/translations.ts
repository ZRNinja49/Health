import { Language } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  lowBandwidthMode: string;
  onlineMode: string;
  sosEmergency: string;
  tabs: {
    symptomCheck: string;
    triageReport: string;
    nearbyClinics: string;
    telehealth: string;
    firstAid: string;
  };
  patientInfo: {
    title: string;
    fullName: string;
    age: string;
    gender: string;
    male: string;
    female: string;
    pregnant: string;
    pregnantYes: string;
    pregnantNo: string;
    village: string;
    phone: string;
    conditions: string;
    diabetes: string;
    hypertension: string;
    asthma: string;
    heartDisease: string;
  };
  symptomSection: {
    selectBodyPart: string;
    commonSymptoms: string;
    severityLabel: string;
    mild: string;
    moderate: string;
    severe: string;
    durationLabel: string;
    days: string;
    attachPhoto: string;
    photoHint: string;
    addSymptom: string;
    runTriage: string;
    analyzing: string;
  };
  vitalsSection: {
    title: string;
    subtitle: string;
    temp: string;
    pulse: string;
    bp: string;
    spo2: string;
    sugar: string;
  };
  triage: {
    emergency: string;
    urgent: string;
    routine: string;
    redFlagsTitle: string;
    conditionsTitle: string;
    homeCareTitle: string;
    warningsTitle: string;
    facilityRecTitle: string;
    doctorQuestionsTitle: string;
    listenAudio: string;
    stopAudio: string;
    requestTeleconsult: string;
    findClinic: string;
    downloadSlip: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    appName: 'GramSeva Telehealth',
    tagline: 'Rural Symptom Checker & Clinic Navigator',
    lowBandwidthMode: '2G / Low-Bandwidth Mode',
    onlineMode: 'AI Assisted Mode',
    sosEmergency: '108 SOS EMERGENCY',
    tabs: {
      symptomCheck: 'Symptom Check',
      triageReport: 'Triage Result',
      nearbyClinics: 'Nearby Clinics',
      telehealth: 'Tele-Consult',
      firstAid: 'First Aid Guide',
    },
    patientInfo: {
      title: 'Patient Profile',
      fullName: 'Full Name',
      age: 'Age (Years)',
      gender: 'Gender',
      male: 'Male',
      female: 'Female',
      pregnant: 'Pregnancy / Postpartum Status',
      pregnantYes: 'Currently Pregnant / Nursing (< 6 mo)',
      pregnantNo: 'Not Pregnant',
      village: 'Village / Gram Panchayat',
      phone: 'Mobile / WhatsApp Number',
      conditions: 'Existing Health Conditions',
      diabetes: 'Diabetes (Sugar)',
      hypertension: 'High Blood Pressure',
      asthma: 'Asthma / Breathing Trouble',
      heartDisease: 'Heart Condition',
    },
    symptomSection: {
      selectBodyPart: 'Where is the problem? (Tap Body Region)',
      commonSymptoms: 'Common Rural Concerns',
      severityLabel: 'Pain / Discomfort Severity (1 to 10)',
      mild: 'Mild (1-3)',
      moderate: 'Moderate (4-6)',
      severe: 'Severe (7-10)',
      durationLabel: 'How many days has this lasted?',
      days: 'days',
      attachPhoto: 'Attach Photo (Wound, Bite, Rash, Eye, Throat)',
      photoHint: 'Helps AI visually inspect bite marks, skin swelling or rashes',
      addSymptom: 'Add Another Symptom',
      runTriage: 'Analyze Symptoms with AI Triage',
      analyzing: 'Analyzing Symptoms & Checking Clinic Stocks...',
    },
    vitalsSection: {
      title: 'Vital Signs (Optional / If Known)',
      subtitle: 'Recorded by ASHA worker, digital BP machine, or thermometer',
      temp: 'Body Temp (°C)',
      pulse: 'Pulse / Heart Rate (bpm)',
      bp: 'Blood Pressure (mmHg)',
      spo2: 'Oxygen SpO2 (%)',
      sugar: 'Random Blood Sugar (mg/dL)',
    },
    triage: {
      emergency: 'EMERGENCY: Immediate Transfer Required',
      urgent: 'URGENT: Visit Primary Health Centre Today',
      routine: 'ROUTINE: Village Health Sub-centre / Home Care',
      redFlagsTitle: 'Critical Danger Signs (Red Flags)',
      conditionsTitle: 'Possible Conditions Considered',
      homeCareTitle: 'Home Stabilization & First Measures',
      warningsTitle: 'Important Warnings (What NOT to do)',
      facilityRecTitle: 'Recommended Healthcare Facility',
      doctorQuestionsTitle: 'Questions to Ask the Doctor at Clinic',
      listenAudio: 'Listen to Voice Guidance',
      stopAudio: 'Stop Audio',
      requestTeleconsult: 'Connect with Tele-Doctor',
      findClinic: 'Show Direction to Nearest PHC/CHC',
      downloadSlip: 'Save Referral Slip',
    },
  },
  hi: {
    appName: 'ग्रामसेवा टेलीहेल्थ',
    tagline: 'ग्रामीण लक्षण जांच एवं नजदीकी अस्पताल गाइड',
    lowBandwidthMode: 'कम नेटवर्क / ऑफलाइन मोड',
    onlineMode: 'एआई सहायता मोड',
    sosEmergency: '108 आपातकालीन सहायता',
    tabs: {
      symptomCheck: 'लक्षण जांच',
      triageReport: 'जांच रिपोर्ट',
      nearbyClinics: 'नजदीकी अस्पताल',
      telehealth: 'डॉक्टर से बात',
      firstAid: 'प्राथमिक उपचार',
    },
    patientInfo: {
      title: 'मरीज की जानकारी',
      fullName: 'मरीज का नाम',
      age: 'उम्र (वर्ष)',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      pregnant: 'गर्भावस्था की स्थिति',
      pregnantYes: 'गर्भवती / स्तनपान कराने वाली',
      pregnantNo: 'गर्भवती नहीं',
      village: 'गांव / ग्राम पंचायत',
      phone: 'मोबाइल नंबर',
      conditions: 'पुरानी बीमारियां',
      diabetes: 'डायबिटीज (शुगर)',
      hypertension: 'हाई बीपी (रक्तचाप)',
      asthma: 'दमा / सांस की बीमारी',
      heartDisease: 'हृदय रोग',
    },
    symptomSection: {
      selectBodyPart: 'शरीर में कहां तकलीफ है? (भाग चुनें)',
      commonSymptoms: 'आम ग्रामीण लक्षण',
      severityLabel: 'तकलीफ या दर्द का स्तर (1 से 10)',
      mild: 'हल्का (1-3)',
      moderate: 'मध्यम (4-6)',
      severe: 'गंभीर (7-10)',
      durationLabel: 'यह तकलीफ कितने दिनों से है?',
      days: 'दिन',
      attachPhoto: 'घाव या दाने का फोटो लें (वैकल्पिक)',
      photoHint: 'सांप के काटने, कीड़े के डंक या त्वचा के चकत्ते की फोटो',
      addSymptom: 'एक और लक्षण जोड़ें',
      runTriage: 'एआई द्वारा लक्षण जांचें',
      analyzing: 'लक्षणों की जांच और प्राथमिक स्वास्थ्य केंद्र की खोज जारी...',
    },
    vitalsSection: {
      title: 'महत्वपूर्ण माप (यदि उपलब्ध हो)',
      subtitle: 'आशा कार्यकर्ता या थर्मामीटर द्वारा मापा गया',
      temp: 'तापमान (°C)',
      pulse: 'नाड़ी की गति (Pulse bpm)',
      bp: 'रक्तचाप (BP mmHg)',
      spo2: 'ऑक्सीजन SpO2 (%)',
      sugar: 'शुगर लेवल (mg/dL)',
    },
    triage: {
      emergency: 'आपातकालीन: तुरंत बड़े अस्पताल ले जाएं',
      urgent: 'आवश्यक: आज ही प्राथमिक स्वास्थ्य केंद्र जाएं',
      routine: 'सामान्य: उप-केंद्र या घरेलू प्राथमिक देखभाल',
      redFlagsTitle: 'खतरे के मुख्य संकेत (चेतावनी)',
      conditionsTitle: 'संभावित स्वास्थ्य समस्याएं',
      homeCareTitle: 'घर पर तुरंत करने योग्य प्राथमिक उपचार (ORS/कूलिंग)',
      warningsTitle: 'क्या न करें (सावधानियां)',
      facilityRecTitle: 'अनुशंसित स्वास्थ्य केंद्र',
      doctorQuestionsTitle: 'डॉक्टर से क्या पूछें',
      listenAudio: 'आवाज में सुनें (ऑडियो)',
      stopAudio: 'आवाज बंद करें',
      requestTeleconsult: 'टेली-डॉक्टर से बात करें',
      findClinic: 'नजदीकी अस्पताल का रास्ता देखें',
      downloadSlip: 'रेफरल पर्ची सहेजें',
    },
  },
  mr: {
    appName: 'ग्रामसेवा टेलीहेल्थ',
    tagline: 'ग्रामीण लक्षण तपासणी व प्राथमिक आरोग्य केंद्र मार्गदर्शक',
    lowBandwidthMode: 'कमी नेटवर्क / ऑफलाइन मोड',
    onlineMode: 'एआय सहाय्य मोड',
    sosEmergency: '108 रुग्णवाहिका आपत्कालीन',
    tabs: {
      symptomCheck: 'लक्षण तपासणी',
      triageReport: 'तपासणी अहवाल',
      nearbyClinics: 'जवळचे दवाखाने',
      telehealth: 'डॉक्टर सल्ला',
      firstAid: 'प्रथमोपचार',
    },
    patientInfo: {
      title: 'रुग्णाची माहिती',
      fullName: 'रुग्णाचे पूर्ण नाव',
      age: 'वय (वर्षे)',
      gender: 'लिंग',
      male: 'पुरुष',
      female: 'स्त्री',
      pregnant: 'गरोदरपणाची स्थिती',
      pregnantYes: 'गरोदर / बाळंतपण',
      pregnantNo: 'नाही',
      village: 'गाव / ग्रामपंचायत',
      phone: 'मोबाईल नंबर',
      conditions: 'पूर्वीचे आजार',
      diabetes: 'मधुमेह (साखर)',
      hypertension: 'उच्च रक्तदाब (बीपी)',
      asthma: 'दम्याचा त्रास',
      heartDisease: 'हृदयरोग',
    },
    symptomSection: {
      selectBodyPart: 'त्रास कोठे आहे? (शरीराचा भाग निवडा)',
      commonSymptoms: 'वारंवार आढळणारी लक्षणे',
      severityLabel: 'त्रासाची तीव्रता (१ ते १०)',
      mild: 'कमी (१-३)',
      moderate: 'मध्यम (४-६)',
      severe: 'तीव्र (७-१०)',
      durationLabel: 'हा त्रास किती दिवसांपासून आहे?',
      days: 'दिवस',
      attachPhoto: 'जखम किंवा दंशाचा फोटो जोडा',
      photoHint: 'सापदंश, कीटकदंश किंवा त्वचेच्या जखमेचा फोटो',
      addSymptom: 'आणखी लक्षण जोडा',
      runTriage: 'एआय द्वारे लक्षणे तपासा',
      analyzing: 'लक्षणे तपासत आहे...',
    },
    vitalsSection: {
      title: 'आरोग्य मोजमापे (उपलब्ध असल्यास)',
      subtitle: 'आशा ताई किंवा थर्मामीटर द्वारे मोजलेले',
      temp: 'तापमान (°C)',
      pulse: 'नाडीचे ठोके (bpm)',
      bp: 'रक्तदाब (mmHg)',
      spo2: 'ऑक्सिजन SpO2 (%)',
      sugar: 'रक्त शर्करा (mg/dL)',
    },
    triage: {
      emergency: 'तात्काळ: मोठ्या रुग्णालयात हलवा',
      urgent: 'तातडीने: आजच प्राथमिक आरोग्य केंद्रात जा',
      routine: 'नियमित: उपकेंद्र किंवा घरगुती काळजी',
      redFlagsTitle: 'धोक्याची लक्षणे',
      conditionsTitle: 'संभाव्य आजार',
      homeCareTitle: 'घरगुती प्रथमोपचार (ORS व काळजी)',
      warningsTitle: 'काय करू नये',
      facilityRecTitle: 'योग्य आरोग्य केंद्र',
      doctorQuestionsTitle: 'डॉक्टरांना विचारायचे प्रश्न',
      listenAudio: 'माहिती ऐका',
      stopAudio: 'थांबवा',
      requestTeleconsult: 'टेली-डॉक्टरांशी संपर्क करा',
      findClinic: 'जवळचा दवाखाना शोधा',
      downloadSlip: 'तपासणी पावती डाऊनलोड करा',
    },
  },
  bn: {
    appName: 'গ্রামসেবা টেলিহেলথ',
    tagline: 'গ্রামীণ উপসর্গ নির্ণয় ও নিকটস্থ ক্লিনিক গাইড',
    lowBandwidthMode: 'কম নেটওয়ার্ক / অফলাইন মোড',
    onlineMode: 'এআই মোড',
    sosEmergency: '১০৮ জরুরি অ্যাম্বুলেন্স',
    tabs: {
      symptomCheck: 'উপসর্গ পরীক্ষা',
      triageReport: 'রিপোর্ট',
      nearbyClinics: 'নিকটস্থ ক্লিনিক',
      telehealth: 'টেলি-ডাক্তার',
      firstAid: 'প্রাথমিক চিকিৎসা',
    },
    patientInfo: {
      title: 'রোগীর বিবরণ',
      fullName: 'রোগীর নাম',
      age: 'বয়স',
      gender: 'লিঙ্গ',
      male: 'পুরুষ',
      female: 'মহিলা',
      pregnant: 'গর্ভবতী অবস্থা',
      pregnantYes: 'গর্ভবতী / দুগ্ধদানকারী',
      pregnantNo: 'না',
      village: 'গ্রাম',
      phone: 'মোবাইল নম্বর',
      conditions: 'আগের রোগ',
      diabetes: 'ডায়াবেটিস',
      hypertension: 'উচ্চ রক্তচাপ',
      asthma: 'হাঁপানি / শ্বাসকষ্ট',
      heartDisease: 'হৃদরোগ',
    },
    symptomSection: {
      selectBodyPart: 'কোথায় সমস্যা হচ্ছে?',
      commonSymptoms: 'সাধারণ গ্রামীণ উপসর্গ',
      severityLabel: 'কষ্টের তীব্রতা (১ থেকে ১০)',
      mild: 'সামান্য (১-৩)',
      moderate: 'মাঝারি (৪-৬)',
      severe: 'তীব্র (৭-১০)',
      durationLabel: 'কত দিন ধরে এই সমস্যা?',
      days: 'দিন',
      attachPhoto: 'ক্ষত বা কামড়ের ছবি তুলুন',
      photoHint: 'সাপের কামড়, পোকা বা অ্যালার্জির ছবি',
      addSymptom: 'আরেকটি উপসর্গ যোগ করুন',
      runTriage: 'এআই দিয়ে পরীক্ষা করুন',
      analyzing: 'উপসর্গ বিশ্লেষণ করা হচ্ছে...',
    },
    vitalsSection: {
      title: 'গুরুত্বপূর্ণ লক্ষণ (জানা থাকলে)',
      subtitle: 'আশা কর্মী বা থার্মোমিটার দ্বারা পরিমাপিত',
      temp: 'শরীরের তাপমাত্রা (°C)',
      pulse: 'পালস রেট (bpm)',
      bp: 'রক্তচাপ (BP)',
      spo2: 'অক্সিজেন SpO2 (%)',
      sugar: 'ব্লাড সুগার (mg/dL)',
    },
    triage: {
      emergency: 'জরুরি: অবিলম্বে হাসপাতালে স্থানান্তর করুন',
      urgent: 'জরুরি: আজই স্বাস্থ্যকেন্দ্রে যান',
      routine: 'সাধারণ: উপ-স্বাস্থ্যকেন্দ্র বা ঘরের যত্ন',
      redFlagsTitle: 'বিপদের লক্ষণসমূহ',
      conditionsTitle: 'সম্ভাব্য কারণ',
      homeCareTitle: 'প্রাথমিক পদক্ষেপ ও স্যালাইন',
      warningsTitle: 'যা করবেন না',
      facilityRecTitle: 'সুপারিশকৃত স্বাস্থ্যকেন্দ্র',
      doctorQuestionsTitle: 'ডাক্তারকে জিজ্ঞাসা করার প্রশ্ন',
      listenAudio: 'অডিও শুনুন',
      stopAudio: 'বন্ধ করুন',
      requestTeleconsult: 'টেলি-ডাক্তারকে কল করুন',
      findClinic: 'নিকটস্থ ক্লিনিক দেখুন',
      downloadSlip: 'স্লিপ সংরক্ষণ করুন',
    },
  },
  es: {
    appName: 'GramSeva Telesalud',
    tagline: 'Evaluador de síntomas rurales y guía de clínicas',
    lowBandwidthMode: 'Modo sin conexión / 2G',
    onlineMode: 'Modo asistido por IA',
    sosEmergency: 'SOS EMERGENCIA 108 / 911',
    tabs: {
      symptomCheck: 'Síntomas',
      triageReport: 'Resultado',
      nearbyClinics: 'Clínicas Cercanas',
      telehealth: 'Tele-Consulta',
      firstAid: 'Primeros Auxilios',
    },
    patientInfo: {
      title: 'Perfil del Paciente',
      fullName: 'Nombre Completo',
      age: 'Edad (Años)',
      gender: 'Género',
      male: 'Masculino',
      female: 'Femenino',
      pregnant: 'Estado de Embarazo',
      pregnantYes: 'Embarazada / Lactante',
      pregnantNo: 'No Embarazada',
      village: 'Comunidad / Pueblo',
      phone: 'Teléfono Móvil',
      conditions: 'Condiciones Previas',
      diabetes: 'Diabetes',
      hypertension: 'Presión Alta',
      asthma: 'Asma',
      heartDisease: 'Cardiopatía',
    },
    symptomSection: {
      selectBodyPart: '¿Dónde siente el malestar? (Seleccione)',
      commonSymptoms: 'Síntomas Comunes Rurales',
      severityLabel: 'Severidad del Dolor (1 a 10)',
      mild: 'Leve (1-3)',
      moderate: 'Moderado (4-6)',
      severe: 'Grave (7-10)',
      durationLabel: '¿Cuántos días lleva con el síntoma?',
      days: 'días',
      attachPhoto: 'Adjuntar Foto (Herida, Picadura, Erupción)',
      photoHint: 'Permite a la IA analizar visualmente la picadura o erupción',
      addSymptom: 'Agregar Otro Síntoma',
      runTriage: 'Evaluar con IA Médica',
      analyzing: 'Analizando síntomas y buscando centros disponibles...',
    },
    vitalsSection: {
      title: 'Signos Vitales (Opcional)',
      subtitle: 'Registrado con termómetro, oxímetro o tensiómetro',
      temp: 'Temperatura (°C)',
      pulse: 'Pulso (ppm)',
      bp: 'Presión Arterial (mmHg)',
      spo2: 'Oxígeno SpO2 (%)',
      sugar: 'Glucosa (mg/dL)',
    },
    triage: {
      emergency: 'EMERGENCIA: Traslado Inmediato a Hospital',
      urgent: 'URGENTE: Acudir al Centro de Salud Hoy',
      routine: 'RUTINARIO: Puesto de Salud / Cuidado en Casa',
      redFlagsTitle: 'Signos de Alarma Críticos',
      conditionsTitle: 'Posibles Causas Evaluadas',
      homeCareTitle: 'Estabilización Inicial en Casa (SRO)',
      warningsTitle: 'Advertencias Importantes (Qué NO hacer)',
      facilityRecTitle: 'Establecimiento de Salud Recomendado',
      doctorQuestionsTitle: 'Preguntas para el Médico',
      listenAudio: 'Escuchar Guía en Voz Alta',
      stopAudio: 'Detener Audio',
      requestTeleconsult: 'Solicitar Tele-Médico',
      findClinic: 'Ver Ruta al Centro de Salud',
      downloadSlip: 'Guardar Ficha de Derivación',
    },
  },
  sw: {
    appName: 'GramSeva Afya ya Kijijini',
    tagline: 'Ukaguzi wa Dalili na Muongozo wa Zahanati za Vijijini',
    lowBandwidthMode: 'Hali ya Mtandao Mdogo / Nje ya Mtandao',
    onlineMode: 'Hali ya Akili Bandia (AI)',
    sosEmergency: '108 / 112 SOS DHARURA',
    tabs: {
      symptomCheck: 'Ukaguzi Dalili',
      triageReport: 'Ripoti ya Uchunguzi',
      nearbyClinics: 'Zahanati za Karibu',
      telehealth: 'Daktari Mtandaoni',
      firstAid: 'Huduma ya Kwanza',
    },
    patientInfo: {
      title: 'Taarifa za Mgonjwa',
      fullName: 'Jina Kamili',
      age: 'Umri (Miaka)',
      gender: 'Jinsia',
      male: 'Mwanaume',
      female: 'Mwanamke',
      pregnant: 'Hali ya Ujauzito',
      pregnantYes: 'Mjamzito / Anayenyonyesha',
      pregnantNo: 'Si Mjamzito',
      village: 'Kijiji / Mtaa',
      phone: 'Nambari ya Simu',
      conditions: 'Magonjwa ya Awali',
      diabetes: 'Kisukari',
      hypertension: 'Shinikizo la Juu la Damu',
      asthma: 'Pumu / Matatizo ya Kupumua',
      heartDisease: 'Moyo',
    },
    symptomSection: {
      selectBodyPart: 'Wapi kuna maumivu au tatizo?',
      commonSymptoms: 'Dalili za Kawaida Vijijini',
      severityLabel: 'Ukali wa Maumivu (1 hadi 10)',
      mild: 'Kidogo (1-3)',
      moderate: 'Wastani (4-6)',
      severe: 'Kali (7-10)',
      durationLabel: 'Imedumu kwa siku ngapi?',
      days: 'siku',
      attachPhoto: 'Weka Picha (Jeraha, Kuumwa na Nyoka/Mdudu)',
      photoHint: 'Husaidia AI kuona alama za kuumwa au upele',
      addSymptom: 'Ongeza Dalili Nyingine',
      runTriage: 'Chunguza kwa AI',
      analyzing: 'Inachunguza dalili na kuangalia vituo vilivyo karibu...',
    },
    vitalsSection: {
      title: 'Vipimo vya Mwili (Ikipatikana)',
      subtitle: 'Kutoka kwa mhudumu wa afya au kipima joto',
      temp: 'Joto la Mwili (°C)',
      pulse: 'Mapigo ya Moyo (bpm)',
      bp: 'Shinikizo la Damu (mmHg)',
      spo2: 'Kiwango cha Oksijeni SpO2 (%)',
      sugar: 'Kiwango cha Sukari (mg/dL)',
    },
    triage: {
      emergency: 'DHARURA: Peleka Hospitali Kubwa Mara Moja',
      urgent: 'MUHIMU: Nenda Kituo cha Afya Leo',
      routine: 'KAWAIDA: Zahanati ya Kijiji / Huduma ya Nyumbani',
      redFlagsTitle: 'Dalili za Hatari Kubwa',
      conditionsTitle: 'Sababu Zinazowezekana',
      homeCareTitle: 'Hatua za Kwanza za Nyumbani (ORS)',
      warningsTitle: 'Maonyo Muhimu (Usichopaswa Kufanya)',
      facilityRecTitle: 'Kituo cha Afya Kinachopendekezwa',
      doctorQuestionsTitle: 'Maswali ya Kumuuliza Daktari',
      listenAudio: 'Sikiliza kwa Sauti',
      stopAudio: 'Zima Sauti',
      requestTeleconsult: 'Wasiliana na Daktari',
      findClinic: 'Angalia Njia ya Zahanati',
      downloadSlip: 'Hifadhi Hati ya Uelekezo',
    },
  },
};
