"use client";

import { useState, useRef } from "react";
import { createSubjectFolder, deleteSubjectFolder, createNote, deleteNote } from "../actions";
import { NoteBuilderModal } from "@/components/admin/content/NoteBuilderModal";

type Folder = any; // typing loosely for speed, since Prisma types are complex to import directly sometimes
type Note = any;

export default function ContentManagerClient({ initialFolders }: { initialFolders: Folder[] }) {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // New Folder State
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderDesc, setFolderDesc] = useState("");

  // New Note State
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showBuilderModal, setShowBuilderModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteUrl, setNoteUrl] = useState("");
  const [noteFile, setNoteFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived state
  const currentFolders = initialFolders.filter(f => f.parentId === currentFolderId);
  const currentNotes = currentFolderId ? initialFolders.find(f => f.id === currentFolderId)?.notes || [] : [];
  
  const parentFolder = currentFolderId ? initialFolders.find(f => f.id === currentFolderId)?.parentId : null;

  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await createSubjectFolder(folderName, folderDesc, currentFolderId);
    setFolderName("");
    setFolderDesc("");
    setShowFolderModal(false);
    setLoading(false);
  }

  async function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!currentFolderId) return;
    if (!noteFile && !noteUrl) return alert("Please select a file or provide a URL.");
    setLoading(true);

    try {
      let finalUrl = noteUrl;
      
      if (noteFile) {
        const formData = new FormData();
        formData.append("file", noteFile);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (!res.ok) throw new Error("Upload Failed");
        const { url } = await res.json();
        finalUrl = url;
      }

      await createNote(noteTitle, "", finalUrl, currentFolderId);
      
      setNoteTitle("");
      setNoteUrl("");
      setNoteFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowNoteModal(false);
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleBuilderSave(title: string, fileUrl: string) {
    if (!currentFolderId) return;
    await createNote(title, "", fileUrl, currentFolderId);
    setShowBuilderModal(false);
  }

  return (
    <div>
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {currentFolderId && (
            <button 
              onClick={() => setCurrentFolderId(parentFolder || null)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
            >
              &larr; Back
            </button>
          )}
          <h2 className="text-xl font-semibold text-white">
            {currentFolderId ? initialFolders.find(f => f.id === currentFolderId)?.name : "Root Directory"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowFolderModal(true)}
            className="px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 text-sm font-medium transition-colors"
          >
            + New Folder
          </button>
          {currentFolderId && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowBuilderModal(true)}
                className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 border border-purple-500/30 text-sm font-medium transition-colors"
              >
                📝 Wordpad Note
              </button>
              <button 
                onClick={() => setShowNoteModal(true)}
                className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 text-sm font-medium transition-colors"
              >
                + Upload PDF
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentFolders.map(folder => (
          <div 
            key={folder.id} 
            onClick={() => setCurrentFolderId(folder.id)}
            className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-indigo-500/50 cursor-pointer transition-all group relative"
          >
            <div className="flex items-start justify-between">
              <div className="text-3xl mb-3">📁</div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteSubjectFolder(folder.id); }}
                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity"
              >
                ✕
              </button>
            </div>
            <h3 className="font-medium text-white truncate">{folder.name}</h3>
            <p className="text-xs text-gray-500 mt-1">{folder.children.length} subfolders, {folder.notes.length} notes</p>
          </div>
        ))}

        {currentNotes.map((note: Note) => (
          <div 
            key={note.id} 
            className="p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/50 cursor-pointer transition-all group relative"
            onClick={() => window.open(note.fileUrl, '_blank')}
          >
            <div className="flex items-start justify-between">
              <div className="text-3xl mb-3">📄</div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteNote(note.id); }}
                className="opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-300 transition-opacity"
              >
                ✕
              </button>
            </div>
            <h3 className="font-medium text-white truncate">{note.title}</h3>
            <p className="text-xs text-emerald-400 mt-1 truncate">PDF Document</p>
          </div>
        ))}

        {currentFolders.length === 0 && currentNotes.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <p className="text-gray-500">This folder is empty.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1123] p-6 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-semibold text-white mb-4">Create Folder</h3>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Folder Name</label>
                <input required value={folderName} onChange={e => setFolderName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" placeholder="e.g. Data Structures" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description (Optional)</label>
                <input value={folderDesc} onChange={e => setFolderDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500" />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowFolderModal(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition-colors disabled:opacity-50">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0f1123] p-6 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl relative">
            <h3 className="text-xl font-semibold text-white mb-4">Upload PDF Note</h3>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Note Title</label>
                <input required value={noteTitle} onChange={e => setNoteTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" placeholder="e.g. Class 1 Notes" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Select PDF Source</label>
                <div className="space-y-3">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={e => {
                      setNoteFile(e.target.files?.[0] || null);
                      setNoteUrl(""); // clear url if file selected
                    }} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white/70 focus:outline-none focus:border-emerald-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20" 
                  />
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex-1 border-t border-white/10"></div>
                    <span>OR GOOGLE DRIVE URL</span>
                    <div className="flex-1 border-t border-white/10"></div>
                  </div>
                  <input 
                    value={noteUrl} 
                    onChange={e => {
                      setNoteUrl(e.target.value);
                      setNoteFile(null); // clear file if URL typed
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }} 
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500" 
                    placeholder="https://drive.google.com/..." 
                  />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button type="button" onClick={() => setShowNoteModal(false)} className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50">
                  {loading ? "Uploading..." : "Upload PDF"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showBuilderModal && currentFolderId && (
        <NoteBuilderModal 
          folderId={currentFolderId} 
          onClose={() => setShowBuilderModal(false)} 
          onSave={handleBuilderSave} 
        />
      )}
    </div>
  );
}
