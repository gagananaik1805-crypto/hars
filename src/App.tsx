import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Home, 
  MapPin, 
  User, 
  Bell, 
  Pill, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  Check, 
  HeartPulse, 
  Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Scanner from './components/Scanner';
import MedicineCard from './components/MedicineCard';
import PharmacyMap from './components/PharmacyMap';
import ReminderModal from './components/ReminderModal';
import Auth from './components/Auth';
import PremiumBackground from './components/PremiumBackground';
import { useLocalStorage } from './hooks/useLocalStorage';
import { PrescriptionInfo, MedicineReminder } from './types';
import { APP_DISCLAIMER } from './constants';

export default function App() {
  const [user, setUser] = useLocalStorage<{ email: string } | null>('user', null);
  const [medicines, setMedicines] = useLocalStorage<(PrescriptionInfo & { id: string })[]>('medicines', []);
  const [reminders, setReminders] = useLocalStorage<MedicineReminder[]>('reminders', []);
  const [activeTab, setActiveTab] = useState<'home' | 'map' | 'reminders'>('home');
  const [showScanner, setShowScanner] = useState(false);
  const [activeReminder, setActiveReminder] = useState<MedicineReminder | null>(null);

  // Check for reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const dueReminder = reminders.find(r => r.time === currentTime && !r.taken);
      if (dueReminder && !activeReminder) {
        setActiveReminder(dueReminder);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [reminders, activeReminder]);

  const handleCapture = (info: PrescriptionInfo) => {
    const id = Date.now().toString();
    const newMedicine = { ...info, id };
    setMedicines([...medicines, newMedicine]);
    
    // Create default reminders based on timing
    const newReminders: MedicineReminder[] = [];
    if (info.timing.morning) newReminders.push({ id: id + '-m', medicineName: info.medicineName, time: '08:00', instructions: info.simplifiedInstructions, taken: false });
    if (info.timing.afternoon) newReminders.push({ id: id + '-a', medicineName: info.medicineName, time: '14:00', instructions: info.simplifiedInstructions, taken: false });
    if (info.timing.night) newReminders.push({ id: id + '-n', medicineName: info.medicineName, time: '20:00', instructions: info.simplifiedInstructions, taken: false });
    
    setReminders([...reminders, ...newReminders]);
    setShowScanner(false);
  };

  const deleteMedicine = (id: string) => {
    setMedicines(medicines.filter(m => m.id !== id));
    setReminders(reminders.filter(r => !r.id.startsWith(id)));
  };

  const markReminderTaken = (id: string) => {
    setReminders(reminders.map(r => r.id === id ? { ...r, taken: true } : r));
    setActiveReminder(null);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <div className="min-h-screen text-white font-sans pb-32 relative">
      <PremiumBackground />
      
      {/* Header */}
      <header className="p-6 glass sticky top-0 z-40">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <HeartPulse className="text-neon-teal w-8 h-8" />
              Simple Med
            </h1>
            <p className="text-neon-teal font-bold text-xs uppercase tracking-widest mt-1 opacity-80">AI Health Assistant</p>
          </div>
          <button onClick={handleLogout} className="p-3 glass rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 pt-6 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              {/* Daily Progress */}
              <div className="bg-gradient-to-br from-blue-900/40 to-teal-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden group">
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-neon-teal/10 blur-3xl group-hover:bg-neon-teal/20 transition-all" />
                
                <div className="flex justify-between items-center mb-6 relative z-10">
                  <h2 className="text-3xl font-black tracking-tight">Daily Status</h2>
                  <Activity className="w-8 h-8 text-neon-teal" />
                </div>
                <p className="text-blue-100/80 text-xl font-medium leading-relaxed mb-8 relative z-10">
                  {reminders.filter(r => !r.taken).length === 0 
                    ? "Excellent! All medicines taken." 
                    : `You have ${reminders.filter(r => !r.taken).length} pending ${reminders.filter(r => !r.taken).length === 1 ? 'dose' : 'doses'}.`}
                </p>
                <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden relative z-10">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(reminders.filter(r => r.taken).length / (reminders.length || 1)) * 100}%` }}
                    className="bg-gradient-to-right from-neon-blue to-neon-teal h-full shadow-[0_0_10px_rgba(0,255,204,0.5)]"
                  />
                </div>
              </div>

              {/* Medicine List */}
              <section>
                <div className="flex justify-between items-center mb-6 px-4">
                  <h3 className="text-2xl font-black text-white flex items-center gap-3">
                    <Pill className="text-neon-teal w-7 h-7" /> My Medicine
                  </h3>
                  <span className="bg-white/10 text-neon-teal px-4 py-1 rounded-full font-bold text-xs uppercase tracking-widest border border-white/5">{medicines.length} Active</span>
                </div>
                {medicines.length === 0 ? (
                  <div className="glass rounded-[3rem] p-16 text-center border-dashed border-white/10">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Pill className="w-10 h-10 text-white/20" />
                    </div>
                    <p className="text-2xl font-black text-white mb-2">Prescription Empty</p>
                    <p className="text-white/40 font-medium">Scan to begin AI tracking.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {medicines.map(med => (
                      <div key={med.id}>
                        <MedicineCard medicine={med} onDelete={deleteMedicine} />
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </motion.div>
          )}

          {activeTab === 'reminders' && (
            <motion.div 
              key="reminders" 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-black text-white px-2 flex items-center gap-3">
                <Bell className="text-neon-teal w-7 h-7" /> AI Schedule
              </h3>
              {reminders.length === 0 ? (
                <div className="glass rounded-[3rem] p-16 text-center">
                  <p className="text-white/40 font-medium font-serif italic text-lg tracking-wide">"Early to bed, early to rise..."</p>
                  <p className="text-white/20 text-sm mt-4 uppercase font-black tracking-widest">No active reminders</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reminders.sort((a,b) => a.time.localeCompare(b.time)).map(rem => (
                    <div 
                      key={rem.id} 
                      className={`flex items-center gap-6 p-6 rounded-[2.5rem] transition-all duration-300 ${
                        rem.taken ? 'glass opacity-30 grayscale' : 'glass border-white/10 hover:border-neon-teal/30 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className={`p-4 rounded-3xl ${rem.taken ? 'bg-white/5 text-white/20' : 'bg-neon-teal/10 text-neon-teal'}`}>
                        <Clock className="w-7 h-7" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-2xl font-black tracking-tight ${rem.taken ? 'line-through text-white/20' : 'text-white'}`}>
                          {rem.medicineName}
                        </p>
                        <p className="text-white/40 font-black uppercase text-[11px] tracking-[0.2em] mt-1">Scheduled: {rem.time}</p>
                      </div>
                      {!rem.taken && (
                        <button 
                          onClick={() => markReminderTaken(rem.id)}
                          className="p-4 bg-neon-teal/20 text-neon-teal rounded-3xl border border-neon-teal/30 shadow-[0_0_15px_rgba(0,255,204,0.1)] active:scale-90 transition-transform"
                        >
                          <Check className="w-7 h-7" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'map' && (activeTab === 'map' && (
            <motion.div 
              key="map"
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
            >
              <PharmacyMap />
            </motion.div>
          ))}
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowScanner(true)}
        className="fixed bottom-28 right-6 w-20 h-20 bg-neon-teal text-[#050a18] rounded-[2rem] shadow-[0_0_30px_rgba(0,255,204,0.3)] flex items-center justify-center z-40 active:scale-95 transition-transform"
      >
        <Plus className="w-10 h-10" />
      </button>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 glass border-t border-white/10 p-5 px-10 z-40 rounded-t-[3rem]">
        <div className="max-w-xl mx-auto flex justify-between items-center">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home />} label="Hub" />
          <NavButton active={activeTab === 'reminders'} onClick={() => setActiveTab('reminders')} icon={<Calendar />} label="Cycle" />
          <NavButton active={activeTab === 'map'} onClick={() => setActiveTab('map')} icon={<MapPin />} label="Labs" />
        </div>
      </nav>

      {/* Overlays */}
      <AnimatePresence>
        {showScanner && (
          <Scanner 
            onCapture={handleCapture}
            onClose={() => setShowScanner(false)}
          />
        )}
        {activeReminder && (
          <ReminderModal 
            reminder={activeReminder}
            onClose={() => setActiveReminder(null)}
            onTake={() => markReminderTaken(activeReminder.id)}
          />
        )}
      </AnimatePresence>

      <footer className="max-w-xl mx-auto p-8 opacity-70">
        <div className="flex gap-4 items-center text-emerald-900 glass p-6 rounded-[2rem]">
          <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-700">
            <ShieldAlert className="shrink-0 w-6 h-6" />
          </div>
          <p className="text-sm font-bold leading-tight uppercase font-serif italic tracking-wide">
            {APP_DISCLAIMER}
          </p>
        </div>
      </footer>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1 p-2 transition-all ${
        active ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className={`p-1 rounded-xl transition-all ${active ? 'bg-emerald-50' : ''}`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' })}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );
}
