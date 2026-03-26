"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { updateProfile } from "../actions";

export function SettingsClient({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    age: user.age || "",
    birthday: user.birthday || "",
    college: user.college || "",
    course: user.course || "",
    gender: user.gender || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const res = await updateProfile(user.id, {
      name: formData.name,
      age: parseInt(formData.age),
      birthday: new Date(formData.birthday),
      college: formData.college,
      course: formData.course,
      gender: formData.gender
    });

    setLoading(false);
    if (res.success) setSuccess(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 rounded-3xl bg-black/40 border border-white/5 backdrop-blur-[60px] relative shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_32px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent blur-[1px]" />
      
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        
        {/* Name & Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Display Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-white/20" 
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Age</label>
            <input 
              required 
              type="number" 
              min="10" 
              max="100" 
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
            />
          </div>
        </div>

        {/* Birthday & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Date of Birth</label>
            <input 
              required 
              type="date" 
              value={formData.birthday} 
              onChange={(e) => setFormData({...formData, birthday: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Gender Alignment</label>
            <select 
              required 
              value={formData.gender} 
              onChange={(e) => setFormData({...formData, gender: e.target.value})} 
              className="w-full bg-[#11131f] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="" disabled>Select...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
        </div>

        {/* Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">University / College</label>
            <input 
              required 
              type="text" 
              value={formData.college} 
              onChange={(e) => setFormData({...formData, college: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Academic Pursuit</label>
            <input 
              required 
              type="text" 
              value={formData.course} 
              onChange={(e) => setFormData({...formData, course: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="text-sm">
            {success && <span className="text-emerald-400 font-medium tracking-wide">✓ Profile perfectly synchronized</span>}
          </div>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-8 py-3 rounded-xl bg-indigo-500 text-white font-semibold tracking-wide hover:bg-indigo-600 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? "Syncing..." : "Update Profile"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
