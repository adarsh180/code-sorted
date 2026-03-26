"use client";

import { useState } from "react";
import { saveQuestion, deleteQuestion } from "../../actions";

type Option = any;
type Question = any;
type Quiz = any;

export default function QuizEditorClient({ quiz }: { quiz: Quiz }) {
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [text, setText] = useState("");
  const [explanation, setExplanation] = useState("");
  const [options, setOptions] = useState<Partial<Option>[]>([
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ]);

  function openNewQuestion() {
    setActiveQuestion(null);
    setText("");
    setExplanation("");
    setOptions([
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ]);
    setShowEditor(true);
  }

  function openEditQuestion(q: Question) {
    setActiveQuestion(q);
    setText(q.text);
    setExplanation(q.explanation || "");
    setOptions(q.options.map((o: any) => ({ ...o })));
    setShowEditor(true);
  }

  function handleOptionChange(index: number, val: string) {
    const newOpts = [...options];
    newOpts[index] = { ...newOpts[index], text: val };
    setOptions(newOpts);
  }

  function markCorrectOption(index: number) {
    const newOpts = options.map((opt, i) => ({ ...opt, isCorrect: i === index }));
    setOptions(newOpts);
  }

  function addOption() {
    setOptions([...options, { text: "", isCorrect: false }]);
  }

  function removeOption(index: number) {
    if (options.length <= 2) return alert("A question must have at least 2 options.");
    const newOpts = options.filter((_, i) => i !== index);
    if (options[index].isCorrect && newOpts.length > 0) {
      newOpts[0] = { ...newOpts[0], isCorrect: true };
    }
    setOptions(newOpts);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!options.some(o => o.isCorrect)) return alert("You must mark one option as correct.");
    if (options.some(o => !o.text.trim())) return alert("All options must have text.");
    
    setLoading(true);
    await saveQuestion(
      quiz.id, 
      activeQuestion?.id || null, 
      text, 
      explanation, 
      options as any
    );
    setShowEditor(false);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this question?")) return;
    setLoading(true);
    await deleteQuestion(id, quiz.id);
    setLoading(false);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Questions List */}
      <div className="flex-1 w-full space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Questions Tracker ({quiz.questions.length})</h2>
          <button 
            onClick={openNewQuestion}
            className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 text-sm font-medium transition-colors"
          >
            + Add Question
          </button>
        </div>

        {quiz.questions.map((q: Question, idx: number) => (
          <div key={q.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl relative group">
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditQuestion(q)} className="text-indigo-400 hover:text-indigo-300 text-sm">Edit</button>
              <button disabled={loading} onClick={() => handleDelete(q.id)} className="text-rose-400 hover:text-rose-300 text-sm ml-2">Delete</button>
            </div>
            
            <h3 className="text-white font-medium text-lg pr-20">
              <span className="text-gray-500 mr-2">Q{idx + 1}.</span> 
              {q.text}
            </h3>
            
            <div className="mt-4 space-y-2 pl-7">
              {q.options.map((opt: Option) => (
                <div key={opt.id} className={`p-3 rounded-lg border text-sm flex items-center gap-3 ${opt.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100' : 'bg-white/5 border-white/5 text-gray-400'}`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${opt.isCorrect ? 'border-emerald-500/50 bg-emerald-500' : 'border-gray-600'}`}>
                    {opt.isCorrect && <span className="w-1.5 h-1.5 bg-black rounded-full" />}
                  </div>
                  {opt.text}
                </div>
              ))}
            </div>

            {q.explanation && (
              <div className="mt-4 pl-7">
                <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">Explanation Base</span>
                  <p className="text-sm text-indigo-200/70">{q.explanation}</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {quiz.questions.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500 mb-4">No questions created yet.</p>
            <button onClick={openNewQuestion} className="text-indigo-400 hover:text-indigo-300 font-medium">Create your first question &rarr;</button>
          </div>
        )}
      </div>

      {/* Editor Side Panel (or full screen modal on mobile) */}
      {showEditor && (
        <div className="w-full lg:w-[450px] lg:sticky lg:top-8 shrink-0 bg-[#0f1123] p-6 border border-white/10 shadow-2xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">{activeQuestion ? "Edit Question" : "New Question"}</h3>
            <button onClick={() => setShowEditor(false)} className="text-gray-500 hover:text-white">✕</button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Question Context</label>
              <textarea 
                required 
                rows={3}
                value={text} 
                onChange={e => setText(e.target.value)} 
                className="w-full bg-[#15182e] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-indigo-500 resize-none font-medium" 
                placeholder="What is the time complexity of..." 
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">MCQ Options</label>
                <button type="button" onClick={addOption} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">+ Add Option</button>
              </div>
              <div className="space-y-3">
                {options.map((opt, idx) => (
                  <div key={idx} className={`flex items-center gap-3 p-2 rounded-xl border transition-colors ${opt.isCorrect ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-[#15182e] border-white/5 hover:border-white/10'}`}>
                    <button 
                      type="button"
                      onClick={() => markCorrectOption(idx)}
                      className={`w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${opt.isCorrect ? 'border-emerald-500 bg-emerald-500' : 'border-gray-500 hover:border-gray-400'}`}
                    >
                      {opt.isCorrect && <span className="w-2 h-2 rounded-full bg-black" />}
                    </button>
                    <input 
                      required
                      value={opt.text}
                      onChange={e => handleOptionChange(idx, e.target.value)}
                      className="flex-1 bg-transparent border-none text-sm text-white focus:outline-none placeholder-gray-600"
                      placeholder={`Option ${idx + 1}`}
                    />
                    <button 
                      type="button"
                      onClick={() => removeOption(idx)}
                      className="text-gray-500 hover:text-rose-400 shrink-0 px-2 flex items-center justify-center opacity-50 hover:opacity-100"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Explanation</label>
              <textarea 
                rows={4}
                value={explanation} 
                onChange={e => setExplanation(e.target.value)} 
                className="w-full bg-[#15182e] border border-white/10 rounded-xl p-4 text-sm text-indigo-200/80 focus:outline-none focus:border-indigo-500 resize-none" 
                placeholder="Explain why the marked option is correct to the student..." 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/20 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Question to Live Database"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
