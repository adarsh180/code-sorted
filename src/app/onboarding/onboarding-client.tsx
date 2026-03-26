"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitOnboardingDetails } from "../dashboard/actions";
import { useRouter } from "next/navigation";

export default function OnboardingPage({ userId }: { userId?: string }) { // In real app, we might get userId from session on server
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    birthday: "",
    age: "",
    gender: "",
    college: "",
    course: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!userId) {
      // client fetch workaround if we don't pass userId
      router.push("/dashboard"); // fallback
      return; 
    }
    setLoading(true);
    await submitOnboardingDetails(userId, {
      age: parseInt(formData.age),
      birthday: new Date(formData.birthday),
      college: formData.college,
      course: formData.course,
      gender: formData.gender
    });
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#070914] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-black/40 border border-white/5 p-10 rounded-3xl backdrop-blur-3xl shadow-2xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none rounded-3xl" />
        
        <div className="mb-10 text-center relative z-10">
          <div className="mx-auto mb-5 w-fit">
            <img
              src="/logo/logo.png"
              alt="CodeSorted"
              className="w-14 h-14 object-contain drop-shadow-[0_0_16px_rgba(99,102,241,0.6)]"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Complete your profile</h1>
          <p className="text-white/40 font-medium">We need a few more details to personalize your experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Date of Birth</label>
                  <input required type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors input-glass" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Age</label>
                    <input required type="number" min="10" max="100" placeholder="e.g. 21" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors input-glass" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Gender</label>
                    <select required value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})} className="w-full bg-[#15182e] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                      <option value="" disabled>Select...</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
                <button type="button" onClick={handleNext} disabled={!formData.birthday || !formData.age || !formData.gender} className="w-full py-4 mt-2 rounded-xl bg-indigo-500 text-white font-semibold tracking-wide hover:bg-indigo-600 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:shadow-none">
                  Continue &rarr;
                </button>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">College / University</label>
                  <input required type="text" placeholder="e.g. MIT, Stanford, Local Tech" value={formData.college} onChange={(e) => setFormData({...formData, college: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors input-glass" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mb-2">Course Pursuing</label>
                  <input required type="text" placeholder="e.g. B.Tech Computer Science" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors input-glass" />
                </div>
                <div className="flex gap-4 mt-4">
                  <button type="button" onClick={handleBack} className="px-6 py-4 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors border border-white/10">
                    &larr; Back
                  </button>
                  <button type="submit" disabled={!formData.college || !formData.course || loading} className="flex-1 py-4 rounded-xl bg-indigo-500 text-white font-semibold tracking-wide hover:bg-indigo-600 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.3)] disabled:opacity-50 disabled:shadow-none">
                    {loading ? "Saving Profile..." : "Complete Setup"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
