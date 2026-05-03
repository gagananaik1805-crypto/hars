import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Type, X, Check, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { simplifyPrescription } from '../services/gemini';
import { PrescriptionInfo } from '../types';
import { APP_DISCLAIMER } from '../constants';

interface ScannerProps {
  onCapture: (info: PrescriptionInfo) => void;
  onClose: () => void;
}

export default function Scanner({ onCapture, onClose }: ScannerProps) {
  const [mode, setMode] = useState<'selection' | 'camera' | 'text'>('selection');
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setMode('camera');
    } catch (err) {
      alert('Could not access camera. Please check permissions.');
      console.error(err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        const base64Data = dataUrl.split(',')[1];
        
        setLoading(true);
        const result = await simplifyPrescription({ 
          data: base64Data, 
          mimeType: 'image/jpeg' 
        });
        setLoading(false);
        
        if (result) {
          onCapture(result);
          stopCamera();
        } else {
          alert("Could not read prescription. Please try a clearer photo.");
        }
      }
    }
  };

  const handleManualSubmit = async () => {
    if (!manualText.trim()) return;
    setLoading(true);
    const result = await simplifyPrescription(manualText);
    setLoading(false);
    if (result) {
      onCapture(result);
    } else {
      alert("Could not simplify instructions. Please check the text.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setLoading(true);
      const result = await simplifyPrescription({ data: base64, mimeType: file.type });
      setLoading(false);
      if (result) {
        onCapture(result);
      } else {
        alert("Could not read prescription image.");
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => stopCamera();
  }, [stream]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      className="fixed inset-4 md:inset-10 z-50 glass rounded-[3rem] p-8 md:p-12 flex flex-col shadow-2xl backdrop-blur-3xl overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
        <Sparkles className="w-64 h-64 text-emerald-900" />
      </div>

      <div className="flex justify-between items-center mb-10 relative z-10">
        <div>
          <h2 className="text-4xl font-black text-white flex items-center gap-4 tracking-tighter">
            <div className="p-4 bg-neon-teal rounded-3xl shadow-2xl shadow-neon-teal/20">
              <Sparkles className="text-[#050a18] w-7 h-7" />
            </div>
            AI Diagnosis
          </h2>
          <p className="text-neon-teal font-black uppercase tracking-[0.3em] text-[10px] mt-4 opacity-100">Neural Image Processing</p>
        </div>
        <button onClick={onClose} className="p-4 glass rounded-[2rem] hover:bg-white/10 text-white/40 hover:text-white transition-all group">
          <X className="w-8 h-8 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === 'selection' && (
          <motion.div 
            key="selection"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
          >
            <SelectionCard 
              onClick={startCamera}
              icon={<Camera className="w-10 h-10 text-neon-teal" />}
              label="Optical Scan"
              desc="Scan document with AI Vision"
              theme="emerald"
            />

            <label className="cursor-pointer group">
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              <SelectionCard 
                icon={<Upload className="w-10 h-10 text-neon-blue" />}
                label="Cloud Upload"
                desc="Process existing medical images"
                theme="blue"
              />
            </label>

            <SelectionCard 
              onClick={() => setMode('text')}
              icon={<Type className="w-10 h-10 text-white" />}
              label="Manual Feed"
              desc="Enter data parameters manually"
              theme="amber"
            />
          </motion.div>
        )}

        {mode === 'camera' && (
          <motion.div 
            key="camera"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative flex-1 bg-black rounded-3xl overflow-hidden flex flex-col"
          >
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="flex-1 object-cover"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute inset-x-0 bottom-0 p-8 flex justify-center items-center gap-6 bg-gradient-to-t from-black/60 to-transparent">
              <button 
                onClick={() => { stopCamera(); setMode('selection'); }}
                className="p-4 bg-white/20 backdrop-blur-md rounded-full text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <button 
                onClick={capturePhoto}
                disabled={loading}
                className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-transform disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-10 h-10 animate-spin text-emerald-600" /> : <div className="w-16 h-16 border-4 border-emerald-600 rounded-full" />}
              </button>
              <div className="w-14" /> {/* Spacer */}
            </div>

            <div className="absolute top-4 inset-x-4">
              <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl flex items-center gap-2 text-white text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Position the prescription within the frame
              </div>
            </div>
          </motion.div>
        )}

        {mode === 'text' && (
          <motion.div 
            key="text"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <textarea
              value={manualText}
              onChange={(e) => setManualText(e.target.value)}
              placeholder="e.g., Tab Paracetamol 500mg twice a day after food"
              className="w-full h-48 p-6 text-xl border-2 border-gray-200 rounded-3xl focus:border-amber-500 outline-none transition-all"
            />
            <div className="flex gap-4">
              <button 
                onClick={() => setMode('selection')}
                className="flex-1 p-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold"
              >
                Back
              </button>
              <button 
                onClick={handleManualSubmit}
                disabled={loading || !manualText.trim()}
                className="flex-[2] p-4 bg-amber-500 text-white rounded-2xl font-semibold shadow-lg shadow-amber-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Check />}
                Simplify Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-8 border-t border-gray-100 relative z-10">
        <div className="bg-amber-50/50 border border-amber-200 p-6 rounded-3xl flex gap-4 items-center">
          <AlertTriangle className="text-amber-600 shrink-0 w-8 h-8" />
          <p className="text-sm text-amber-900 leading-relaxed italic font-medium">
            {APP_DISCLAIMER}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function SelectionCard({ onClick, icon, label, desc, theme }: { onClick?: () => void, icon: React.ReactNode, label: string, desc: string, theme: 'emerald' | 'blue' | 'amber' }) {
  const themes = {
    emerald: 'bg-emerald-50 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-100/50',
    blue: 'bg-blue-50 border-blue-100 hover:border-blue-500 hover:bg-blue-100/50',
    amber: 'bg-amber-50 border-amber-100 hover:border-amber-500 hover:bg-amber-100/50'
  };

  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-[2.5rem] transition-all duration-300 gap-6 w-full group ${themes[theme]}`}
    >
      <div className={`p-6 rounded-[2rem] bg-white shadow-xl group-hover:scale-110 transition-transform duration-500`}>
        {icon}
      </div>
      <div className="text-center">
        <span className="font-black text-emerald-950 text-2xl tracking-tighter">{label}</span>
        <p className="text-emerald-700 font-medium mt-1 opacity-60">{desc}</p>
      </div>
    </button>
  );
}
