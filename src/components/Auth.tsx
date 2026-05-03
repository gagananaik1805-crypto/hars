import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, HeartPulse } from 'lucide-react';
import { motion } from 'motion/react';
import PremiumBackground from './PremiumBackground';

interface AuthProps {
  onLogin: (user: { email: string }) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) {
      alert('Please fill in all fields');
      return;
    }
    // Simulated auth for demo purposes
    onLogin({ email });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <PremiumBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-[3rem] p-10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 20px rgba(0,255,204,0.3)", "0 0 40px rgba(0,255,204,0.6)", "0 0 20px rgba(0,255,204,0.3)"] 
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-28 h-28 bg-neon-teal rounded-[2.5rem] flex items-center justify-center mb-8"
          >
            <HeartPulse className="w-14 h-14 text-[#050a18]" />
          </motion.div>
          <h1 className="text-5xl font-black text-white tracking-tighter leading-none">Simple Med</h1>
          <p className="text-neon-teal font-black mt-4 uppercase tracking-[0.4em] text-[10px] opacity-100">Quantum Health AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 focus:border-neon-teal/50 focus:bg-white/10 rounded-3xl outline-none transition-all text-lg font-medium placeholder:text-white/20 text-white"
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input
              type="email"
              placeholder="Email Protocol"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 focus:border-neon-teal/50 focus:bg-white/10 rounded-3xl outline-none transition-all text-lg font-medium placeholder:text-white/20 text-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5" />
            <input
              type="password"
              placeholder="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white/5 border border-white/10 focus:border-neon-teal/50 focus:bg-white/10 rounded-3xl outline-none transition-all text-lg font-medium placeholder:text-white/20 text-white"
            />
          </div>

          <button 
            type="submit"
            className="w-full p-6 bg-neon-teal text-[#050a18] rounded-[2rem] font-black text-xl shadow-[0_0_30px_rgba(0,255,204,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all mt-4"
          >
            {isLogin ? 'Initialize System' : 'Register Profile'}
            <ArrowRight className="w-7 h-7" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-teal font-black uppercase tracking-widest text-[10px] hover:opacity-80 transition-opacity"
          >
            {isLogin ? "Bypass to Registration" : "Return to Terminal"}
          </button>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-gray-400 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Secure AES-256 Encryption</span>
        </div>
      </motion.div>
    </div>
  );
}
