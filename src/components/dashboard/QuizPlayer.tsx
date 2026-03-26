"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logQuizAttempt } from "@/app/dashboard/quizzes/actions";
import { useRouter } from "next/navigation";

type Quiz = any;

export function QuizPlayer({ quiz, userId }: { quiz: Quiz, userId: string }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);
  
  const router = useRouter();
  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-white/50 bg-white/[0.02] border border-white/5 rounded-2xl">
        No questions available for this quiz.
      </div>
    );
  }

  const handleSelectOption = (id: string) => {
    if (showExplanation) return; // locked after answering
    setSelectedOptionId(id);
  };

  const handleSubmit = () => {
    if (!selectedOptionId) return;
    setShowExplanation(true);
    const isCorrect = currentQuestion.options.find((o: any) => o.id === selectedOptionId)?.isCorrect;
    if (isCorrect) setScore(s => s + 1);
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOptionId(null);
      setShowExplanation(false);
    } else {
      await logQuizAttempt(userId, quiz.id, score, questions.length);
      setQuizFinished(true);
    }
  };

  if (quizFinished) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
        <h2 className="text-3xl font-bold text-white mb-6 relative z-10">Quiz Completed</h2>
        <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-purple-400 mb-8 relative z-10">
          {score} / {questions.length}
        </div>
        <p className="text-white/60 mb-10 relative z-10 text-lg">
          Your progress has been recorded. Consistent practice builds mastery.
        </p>
        <button
          onClick={() => router.push("/dashboard/quizzes")}
          className="px-8 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-all relative z-10 backdrop-blur-md"
        >
          Return to Quizzes
        </button>
      </motion.div>
    );
  }

  const selectedOption = currentQuestion.options.find((o: any) => o.id === selectedOptionId);
  const isCorrectAnswer = selectedOption?.isCorrect;

  return (
    <div className="w-full relative">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8 items-center justify-between">
        <span className="text-xs font-semibold tracking-widest text-indigo-400 uppercase">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex-1 max-w-[200px] h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* Question Box */}
          <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <h3 className="text-2xl font-medium text-white/90 leading-snug">
              {currentQuestion.text}
            </h3>
          </div>

          {/* Options */}
          <div className="grid gap-4">
            {currentQuestion.options.map((option: any) => {
              const isSelected = selectedOptionId === option.id;
              const isCorrectDisplay = showExplanation && option.isCorrect;
              const isWrongSelection = showExplanation && isSelected && !option.isCorrect;

              let borderClass = "border-white/10";
              let bgClass = "bg-white/[0.02]";
              let textClass = "text-white/70";

              if (isSelected && !showExplanation) {
                borderClass = "border-indigo-500/50";
                bgClass = "bg-indigo-500/10";
                textClass = "text-white";
              } else if (isCorrectDisplay) {
                // Gentle elegant highlight for correct answer
                borderClass = "border-emerald-500/50";
                bgClass = "bg-emerald-500/10";
                textClass = "text-emerald-100";
              } else if (isWrongSelection) {
                // Neutral soft highlight for wrong answer, not aggressive red
                borderClass = "border-white/20";
                bgClass = "bg-white/5";
                textClass = "text-white/40";
              }

              return (
                <div
                  key={option.id}
                  onClick={() => handleSelectOption(option.id)}
                  className={`p-5 rounded-2xl border ${borderClass} ${bgClass} ${textClass} transition-all duration-300 ${!showExplanation ? 'hover:bg-white/[0.06] hover:border-white/20 cursor-pointer' : ''} flex items-center justify-between`}
                >
                  <span className="text-lg font-medium">{option.text}</span>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      {option.isCorrect && (
                        <div className="w-6 h-6 rounded-full border border-emerald-500/30 flex items-center justify-center p-1">
                           <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-emerald-400 stroke-current stroke-[3]"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                      {isSelected && !option.isCorrect && (
                        <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center p-1.5 opacity-50">
                           <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white/50 stroke-current stroke-[3]"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Action / Explanation Area */}
      <div className="mt-8">
        {!showExplanation ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className={`w-full py-4 rounded-2xl font-medium text-lg transition-all ${selectedOptionId ? "bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.3)]" : "bg-white/5 text-white/20 cursor-not-allowed border border-white/10"}`}
          >
            Submit Answer
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-2xl border backdrop-blur-xl flex flex-col items-start gap-4 ${isCorrectAnswer ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}
          >
            {isCorrectAnswer ? (
              <div className="flex flex-col">
                <span className="text-emerald-400 font-semibold tracking-wide uppercase text-sm mb-2">Excellent Precision</span>
                <p className="text-emerald-100/80 leading-relaxed font-medium">Valid deduction. {currentQuestion.explanation}</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-2">Constructive Insight</span>
                <p className="text-indigo-100/80 leading-relaxed font-medium">A mindful attempt. Consider this logic instead: {currentQuestion.explanation}</p>
              </div>
            )}
            <button
              onClick={handleNext}
              className={`mt-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-colors ${isCorrectAnswer ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30' : 'bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30'}`}
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Concept" : "Complete Assesment"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
