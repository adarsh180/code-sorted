"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PdfViewerModal } from "@/components/dashboard/PdfViewerModal";

type Note = any;
type Folder = any;

export default function ContentLibraryClient({ folders }: { folders: Folder[] }) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState<Note | null>(null);

  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentNotes = currentFolderId ? folders.find(f => f.id === currentFolderId)?.notes || [] : [];
  
  const parentFolder = currentFolderId ? folders.find(f => f.id === currentFolderId)?.parentId : null;

  return (
    <div>
      {/* Actions */}
      <div className="flex items-center gap-4 mb-8">
        {currentFolderId && (
          <button 
            onClick={() => setCurrentFolderId(parentFolder || null)}
            className="px-4 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-sm text-white/70 hover:text-white transition-all border border-white/5 hover:border-white/20"
          >
            &larr; Go Back
          </button>
        )}
        <h2 className="text-xl font-medium text-white/90">
          {currentFolderId ? folders.find(f => f.id === currentFolderId)?.name : "Root Directory"}
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentFolders.map((folder, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={folder.id} 
            onClick={() => setCurrentFolderId(folder.id)}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-indigo-500/30 cursor-pointer transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <span className="text-xl">📁</span>
            </div>
            <h3 className="font-medium text-white/90 truncate">{folder.name}</h3>
            <p className="text-xs text-white/40 mt-1">{folder.children.length} folders, {folder.notes.length} notes</p>
          </motion.div>
        ))}

        {currentNotes.map((note: Note, i: number) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (currentFolders.length + i) * 0.05 }}
            key={note.id} 
            onClick={() => setActiveNote(note)}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-emerald-500/30 cursor-pointer transition-all group relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <span className="text-xl text-emerald-400">📄</span>
              </div>
              <h3 className="font-medium text-white/90 line-clamp-2 leading-tight">{note.title}</h3>
            </div>
            <p className="text-[11px] font-medium text-emerald-400/80 mt-4 uppercase tracking-wider">PDF Document</p>
          </motion.div>
        ))}

        {currentFolders.length === 0 && currentNotes.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
            <span className="text-4xl mb-4 opacity-50">📭</span>
            <h3 className="text-lg font-medium text-white/70">No materials yet</h3>
            <p className="text-sm text-white/40 mt-1">Check back later when materials are uploaded.</p>
          </div>
        )}
      </div>

      {/* Embedded PDF Viewer Modal */}
      <PdfViewerModal note={activeNote} onClose={() => setActiveNote(null)} />
    </div>
  );
}
