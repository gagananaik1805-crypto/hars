import React from 'react';
import { Clock, Scissors, AlertCircle, Sun, CloudSun, Moon, Trash2 } from 'lucide-react';
import { PrescriptionInfo } from '../types';

interface MedicineCardProps {
  medicine: PrescriptionInfo & { id: string };
  onDelete?: (id: string) => void;
}

export default function MedicineCard({ medicine, onDelete }: MedicineCardProps) {
  return (
    <div className="glass rounded-[2.5rem] p-8 hover:shadow-2xl transition-all duration-300 group border-white/5 hover:border-neon-teal/20">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight leading-none mb-3">{medicine.medicineName}</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-teal shadow-[0_0_8px_rgba(0,255,204,0.8)]" />
            <p className="text-neon-teal font-bold text-sm uppercase tracking-[0.2em]">{medicine.dosage}</p>
          </div>
        </div>
        {onDelete && (
          <button onClick={() => onDelete(medicine.id)} className="p-3 bg-white/5 rounded-2xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all">
            <Trash2 className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-8">
        <TimingBadge active={medicine.timing.morning} icon={<Sun />} label="AM" />
        <TimingBadge active={medicine.timing.afternoon} icon={<CloudSun />} label="NOON" />
        <TimingBadge active={medicine.timing.night} icon={<Moon />} label="PM" />
      </div>

      <div className="glass-accent p-6 rounded-3xl mb-6">
        <p className="text-emerald-100 font-medium leading-relaxed text-lg">
          {medicine.simplifiedInstructions}
        </p>
      </div>

      {(medicine.ageWarnings || medicine.genderWarnings || medicine.warnings.length > 0) && (
        <div className="space-y-3 bg-red-400/5 p-4 rounded-2xl border border-red-400/10">
          <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            <AlertCircle className="w-3 h-3" />
            <span>Safety Alerts</span>
          </div>
          {medicine.warnings.map((w, i) => (
            <div key={i} className="flex gap-3 text-red-100/70 text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
              <span>{w}</span>
            </div>
          ))}
          {medicine.ageWarnings && (
            <div className="flex gap-3 text-amber-200/70 text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{medicine.ageWarnings}</span>
            </div>
          )}
          {medicine.genderWarnings && (
            <div className="flex gap-3 text-amber-200/70 text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{medicine.genderWarnings}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TimingBadge({ active, icon, label }: { active: boolean, icon: React.ReactNode, label: string }) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 p-5 rounded-[2rem] border-2 transition-all duration-500 ${
      active 
        ? 'bg-neon-teal/20 border-neon-teal/50 text-neon-teal shadow-[0_0_20px_rgba(0,255,204,0.1)] scale-105' 
        : 'bg-white/5 border-white/5 text-white/10 opacity-40'
    }`}>
      {React.cloneElement(icon as React.ReactElement, { className: 'w-7 h-7' })}
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
    </div>
  );
}
