import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, X, Volume2, AlertCircle } from 'lucide-react';
import { MedicineReminder } from '../types';
import { REMINDER_VOICE_ALERT } from '../constants';

interface ReminderModalProps {
  reminder: MedicineReminder;
  onClose: () => void;
  onTake: () => void;
}

export default function ReminderModal({ reminder, onClose, onTake }: ReminderModalProps) {
  const speak = () => {
    const text = `${REMINDER_VOICE_ALERT}. It is time for ${reminder.medicineName}. ${reminder.instructions}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  React.useEffect(() => {
    speak();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl"
      >
        <div className="bg-emerald-600 p-8 text-white flex flex-col items-center text-center gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center animate-bounce">
            <Bell className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Time for Medicine!</h2>
            <p className="text-emerald-100 mt-2 text-lg">Current time: {reminder.time}</p>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl p-6 mb-8 text-center">
            <h3 className="text-4xl font-black text-emerald-950 mb-2">{reminder.medicineName}</h3>
            <p className="text-2xl text-emerald-800 font-medium">{reminder.instructions}</p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 flex gap-3 items-center text-amber-900">
            <AlertCircle className="shrink-0" />
            <p className="text-sm font-medium italic">Please take your medicine only if it was prescribed by your doctor.</p>
          </div>

          <div className="flex flex-col gap-4">
            <button 
              onClick={onTake}
              className="w-full p-6 bg-emerald-600 text-white rounded-3xl font-bold text-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform"
            >
              <Check className="w-8 h-8" />
              I took it
            </button>
            <div className="flex gap-4">
              <button 
                onClick={speak}
                className="flex-1 p-5 bg-blue-100 text-blue-700 rounded-3xl font-bold text-xl flex items-center justify-center gap-2"
              >
                <Volume2 />
                Speak Again
              </button>
              <button 
                onClick={onClose}
                className="flex-1 p-5 bg-gray-100 text-gray-500 rounded-3xl font-bold text-xl"
              >
                Wait
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
