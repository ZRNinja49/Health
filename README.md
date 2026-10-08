# GramSeva Telehealth & Rural Clinic Guide

> **AI-Powered Diagnostic Helper & Telehealth Screening Mobile Web App for Rural Communities**

GramSeva Telehealth is designed for rural community health workers (ASHAs, ANMs, Community Health Officers) and families to perform symptom checks, identify life-threatening red flags (such as snakebites, severe pediatric dehydration, hypoxia, and pesticide exposure), receive first-aid stabilization protocols, and navigate to verified nearby health facilities (Primary Health Centres, Community Health Centres, and Sub-Centres).

---

## 🚀 Features

- **Gemini 3.8 Flash AI Clinical Triage**: Triages symptoms into Emergency (Immediate Hospital Transfer), Urgent (Same-day PHC review), or Routine (Village Sub-centre & home care).
- **Multimodal Visual Inspection**: Camera upload and inspection for skin lesions, venomous bite marks, and infected wounds.
- **2G / Low-Bandwidth Offline Mode**: Automatic WHO/IMCI rule-based clinical protocol fallback when internet connectivity is interrupted.
- **Multilingual Support**: English, हिन्दी (Hindi), मराठी (Marathi), বাংলা (Bengali), Español, and Kiswahili.
- **Audio Voice Guidance**: Built-in Web Speech API audio playback for elderly or low-literacy users.
- **Rural Health Centre Directory & Map**: Interactive map with real-time filters for Polyvalent Antivenom (ASV), 24x7 Oxygen, Labour/Delivery rooms, and walking/cycling transit times.
- **Emergency 108 SOS**: 1-tap direct emergency ambulance dialer.
- **Teleconsultation Simulation**: Virtual doctor consult link with vitals synchronization and digital e-prescription slips.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express, tsx
- **AI / LLM**: `@google/genai` (Gemini 3.8 Flash)

---

## 📋 Prerequisites

Before running locally or pushing to GitHub:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` or `pnpm` or `yarn`
- A [Google AI Studio API Key](https://aistudio.google.com/) (Free tier available)
- A [GitHub](https://github.com/) account

---

## 📦 How to Push this Project to Your GitHub

Follow these steps to create a new repository on your GitHub and upload your code:

### 1. Download or Export Code from AI Studio
In Google AI Studio Build, click the **Download ZIP** or **Export to GitHub** button in the header toolbar, or export the files to your local machine.

### 2. Initialize Git Locally (if not already done)
Open your terminal in the extracted project folder:

```bash
cd gramseva-telehealth
git init
git branch -M main
```

### 3. Create a New Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g., `gramseva-rural-telehealth`).
3. Set visibility to **Public** or **Private**.
4. **Do not** initialize with a README, .gitignore, or license (these already exist in the project).
5. Click **Create repository**.

### 4. Link Remote and Push
Copy the commands provided by GitHub and run them in your terminal:

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: GramSeva Telehealth rural screening app"

# Add your GitHub remote repository (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/gramseva-rural-telehealth.git

# Push to GitHub
git push -u origin main
```

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and add your Gemini API Key from [Google AI Studio](https://aistudio.google.com/):

```env
GEMINI_API_KEY="YOUR_ACTUAL_GEMINI_API_KEY"
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🚢 Deployment

### Deploy to Render / Railway / Google Cloud Run / Docker

1. **Build the production client:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

3. **Environment Variables on Hosting Provider:**
   - Set `GEMINI_API_KEY` in your hosting dashboard under Environment Variables / Secrets.
   - Set `NODE_ENV=production`.
   - Set `PORT=3000` (or leave default assigned by provider).

---

## 📁 Project Structure

```
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules (node_modules, .env, dist)
├── index.html                # Single Page Application HTML entry point
├── metadata.json             # AI Studio configuration
├── package.json              # Project scripts and dependencies
├── server.ts                 # Express full-stack API server & Vite integration
├── tsconfig.json             # TypeScript compiler settings
├── vite.config.ts            # Vite bundler configuration
└── src/
    ├── App.tsx               # Main application component & layout state
    ├── main.tsx              # React DOM mounting
    ├── index.css             # Tailwind CSS & global styles
    ├── types/
    │   └── index.ts          # TypeScript interfaces (Triage, Clinics, Vitals)
    ├── data/
    │   ├── mockData.ts       # Rural clinics directory & First Aid guidelines
    │   └── translations.ts   # Multilingual dictionary (EN, HI, MR, BN, ES, SW)
    ├── utils/
    │   └── speech.ts         # Multilingual Web Speech synthesizer utility
    └── components/
        ├── Header.tsx            # Location selector, 2G mode toggle & SOS
        ├── BottomNav.tsx         # Mobile tab bar navigation
        ├── SymptomChecker.tsx    # Interactive body map, vitals & photo intake
        ├── InteractiveBodyMap.tsx # Pictorial body selector for rural users
        ├── TriageResultView.tsx  # Urgency badge, audio player & referral slip
        ├── ClinicsFinder.tsx     # Rural clinic directory with transit calculator
        ├── TelehealthRoom.tsx    # Live doctor teleconsult simulation & e-Rx
        ├── FirstAidGuide.tsx     # Step-by-step offline emergency protocols
        └── SOSModal.tsx          # 108 emergency hotline popup
```

---

## 📄 Medical Disclaimer

*GramSeva Telehealth is designed for decision support, basic triage screening, and clinic navigation for frontline health workers and community members. It is not a substitute for certified in-person physician examination, laboratory diagnostics, or definitive hospital treatment. In critical emergencies (severe bleeding, snakebites, respiratory failure), immediately transfer the patient to the nearest 24/7 Primary or Community Health Centre.*
