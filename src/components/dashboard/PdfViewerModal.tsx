"use client";

import { motion, AnimatePresence } from "framer-motion";

interface Note {
  id: string;
  title: string;
  fileUrl: string;
}

import { useEffect } from "react";
import { logNoteView } from "@/app/dashboard/actions";

export function PdfViewerModal({ note, onClose }: { note: Note | null, onClose: () => void }) {
  useEffect(() => {
    if (note) {
      logNoteView(note.id, note.title);
    }
  }, [note]);

  if (!note) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-md"
      >
        <div className="absolute inset-0" onClick={onClose} />
        
        <motion.div 
          initial={{ scale: 0.95, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.95, y: 20, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-6xl h-full bg-[#0a0c10] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <h2 className="text-xl font-semibold text-white/90">{note.title}</h2>
            <div className="flex items-center gap-4">
              <a 
                href={note.fileUrl} 
                download 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 text-sm font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition-colors"
              >
                Download PDF
              </a>
              <button 
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 transition-colors text-white/60"
              >
                ✕
              </button>
            </div>
          </div>
          
          {/* PDF Frame */}
          <div className="flex-1 w-full bg-black relative">
            <iframe 
              src={`${note.fileUrl}#toolbar=0`} 
              className="absolute inset-0 w-full h-full border-0"
              title={note.title}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
