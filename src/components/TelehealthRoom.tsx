import React, { useState } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  MessageSquare,
  FileCheck,
  UserCheck,
  Send,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PatientProfile, RuralClinic } from '../types';

interface TelehealthRoomProps {
  patient: PatientProfile;
  clinic: RuralClinic;
  onClose: () => void;
}

export const TelehealthRoom: React.FC<TelehealthRoomProps> = ({
  patient,
  clinic,
  onClose,
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState<
    { sender: 'doctor' | 'patient'; text: string; time: string }[]
  >([
    {
      sender: 'doctor',
      text: `Namaste ${patient.name || 'Friend'}. I am Dr. Suresh Patil, on duty at ${clinic.name}. I have reviewed your symptom report and vitals. Please tell me if you are feeling any dizziness or breathlessness right now?`,
      time: '10:02 AM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [hasPrescription, setHasPrescription] = useState(false);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    const newMsg = {
      sender: 'patient' as const,
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulated doctor response tailored to rural teleconsult
    setTimeout(() => {
      const doctorReply = {
        sender: 'doctor' as const,
        text: `Understood. Please keep the patient lying down calmly. ASHA Tai or your local sub-centre will provide ORS and monitor vitals. If symptoms worsen, transfer immediately to ${clinic.name}. I am attaching your electronic advice slip.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, doctorReply]);
      setHasPrescription(true);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden max-w-3xl mx-auto space-y-0 pb-20 animate-fade-in">
      {/* Telehealth Room Header */}
      <div className="bg-gradient-to-r from-teal-800 to-cyan-900 text-white p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-teal-600 flex items-center justify-center font-bold text-white text-lg border border-teal-400">
              👨‍⚕️
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-teal-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                Tele-Doctor: {clinic.doctorsOnDuty.split(',')[0]}
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-teal-200 font-medium">
              Connected to {clinic.name} • Low-Bandwidth Stream Active
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Exit Room
        </button>
      </div>

      {/* Video & Stream Simulation Area */}
      <div className="p-4 sm:p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Doctor Stream Card */}
          <div className="relative h-48 sm:h-56 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center text-white">
            <div className="text-center p-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-3xl mb-2 shadow-inner border border-slate-700">
                🩺
              </div>
              <div className="text-xs font-bold text-white">
                Dr. Suresh Patil (MBBS)
              </div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">
                ● Speaking with Audio Link
              </div>
            </div>

            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-lg text-[10px] font-bold text-slate-300">
              Primary Health Centre Pod
            </div>
          </div>

          {/* Patient Stream Card */}
          <div className="relative h-48 sm:h-56 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex items-center justify-center text-white">
            {isVideoOn ? (
              <div className="text-center p-4">
                <div className="w-16 h-16 rounded-full bg-teal-900/60 mx-auto flex items-center justify-center text-3xl mb-2 border border-teal-600">
                  👤
                </div>
                <div className="text-xs font-bold text-teal-200">
                  {patient.name}
                </div>
                <div className="text-[10px] text-slate-300 mt-0.5">
                  Village Sub-Centre Camera Feed
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-400 text-xs">
                <VideoOff className="w-8 h-8 mx-auto mb-2 text-slate-500" />
                <span>Camera Disabled (Audio-Only Mode)</span>
              </div>
            )}

            <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded-lg text-[10px] font-bold text-teal-300">
              Patient Stream
            </div>
          </div>
        </div>

        {/* Video / Call Controls Bar */}
        <div className="flex items-center justify-center gap-3 py-2 bg-slate-50 rounded-2xl border border-slate-200">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-2xl font-bold transition-colors cursor-pointer ${
              isMuted
                ? 'bg-rose-100 text-rose-700'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-2xl font-bold transition-colors cursor-pointer ${
              !isVideoOn
                ? 'bg-rose-100 text-rose-700'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
            title={isVideoOn ? 'Turn off video' : 'Turn on video'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => {
              setIsConnected(false);
              onClose();
            }}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold shadow-md cursor-pointer"
            title="End Tele-Consultation"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>

        {/* Chat / Consultation Notes Area */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2 border-b border-slate-200">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-teal-600" />
              Live Consultation Dialogue & Audio Transcripts
            </span>
            <span className="text-[10px] text-teal-700 font-semibold bg-teal-100/60 px-2 py-0.5 rounded-full">
              Encrypted Teleconsult
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'doctor' ? 'items-start' : 'items-end'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'doctor'
                      ? 'bg-white border border-teal-200 text-slate-800 shadow-xs'
                      : 'bg-teal-700 text-white font-medium'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-75 mb-0.5">
                    {m.sender === 'doctor' ? 'Doctor Patil (PHC)' : 'You (Patient)'}
                  </div>
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                  {m.time}
                </span>
              </div>
            ))}
          </div>

          {/* Chat message input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask the doctor a question or describe new symptoms..."
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium focus:border-teal-500 focus:outline-hidden"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              className="bg-teal-700 hover:bg-teal-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Digital e-Prescription Voucher */}
        {hasPrescription && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                Digital e-Prescription & Home Care Voucher Issued
              </span>
              <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-black">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Dr. Patil has prescribed <strong>WHO-ORS Sachets (5 packets)</strong>, <strong>Zinc 20mg Dispersible Tablets (14 days)</strong>, and <strong>Tepid sponging</strong>. Collect free of cost from {clinic.name} or your village ASHA worker.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
