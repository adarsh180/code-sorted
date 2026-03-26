"use client";

import { useState } from "react";
import jsPDF from "jspdf";

const TOOLBAR = [
  { label: "B", title: "Bold — wrap selection in **", action: "bold" },
  { label: "I", title: "Italic — wrap selection in _", action: "italic" },
  { label: "H", title: "Heading — prepend ##", action: "heading" },
  { label: "•", title: "Bullet list — prepend -", action: "bullet" },
  { label: "</>", title: "Code block — wrap in ```", action: "code" },
  { label: "—", title: "Divider line", action: "divider" },
];

function applyFormat(textarea: HTMLTextAreaElement, action: string, content: string, setContent: (v: string) => void) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = content.slice(start, end);
  let replacement = "";

  switch (action) {
    case "bold":    replacement = `**${selected || "bold text"}**`; break;
    case "italic":  replacement = `_${selected || "italic text"}_`; break;
    case "heading": replacement = `\n## ${selected || "Heading"}\n`; break;
    case "bullet":  replacement = `\n- ${selected || "List item"}`; break;
    case "code":    replacement = `\n\`\`\`\n${selected || "// code here"}\n\`\`\`\n`; break;
    case "divider": replacement = `\n---\n`; break;
    default: replacement = selected;
  }

  const newContent = content.slice(0, start) + replacement + content.slice(end);
  setContent(newContent);
  setTimeout(() => {
    textarea.focus();
    const pos = start + replacement.length;
    textarea.setSelectionRange(pos, pos);
  }, 0);
}

export function NoteBuilderModal({
  onClose, onSave, folderId
}: {
  onClose: () => void;
  onSave: (title: string, fileUrl: string) => Promise<void>;
  folderId: string;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState(12);
  const [bgColor, setBgColor] = useState<"white" | "cream" | "dark">("white");
  const [isGenerating, setIsGenerating] = useState(false);
  const [preview, setPreview] = useState(false);

  const textareaRef = { current: null as HTMLTextAreaElement | null };

  const handleToolbar = (action: string) => {
    if (!textareaRef.current) return;
    applyFormat(textareaRef.current, action, content, setContent);
  };

  const handleGeneratePdfAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return alert("Title and content are required.");
    setIsGenerating(true);
    try {
      const doc = new jsPDF();
      const pgW = doc.internal.pageSize.getWidth();
      const pgH = doc.internal.pageSize.getHeight();
      const margin = 22;
      let cy = margin;

      // Background
      if (bgColor === "cream") { doc.setFillColor(254, 252, 235); doc.rect(0, 0, pgW, pgH, "F"); }
      else if (bgColor === "dark") { doc.setFillColor(15, 17, 35); doc.rect(0, 0, pgW, pgH, "F"); }

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(bgColor === "dark" ? 255 : 20, bgColor === "dark" ? 255 : 20, bgColor === "dark" ? 255 : 20);
      doc.text(title, margin, cy); cy += 12;

      // Rule
      doc.setDrawColor(bgColor === "dark" ? 99 : 200, bgColor === "dark" ? 102 : 200, bgColor === "dark" ? 241 : 200);
      doc.line(margin, cy, pgW - margin, cy); cy += 10;

      // Content — parse pseudo-markdown
      const lines = content.split("\n");
      for (const raw of lines) {
        if (cy > pgH - 30) { doc.addPage(); cy = margin; if (bgColor !== "white") { doc.setFillColor(bgColor === "cream" ? 254 : 15, bgColor === "cream" ? 252 : 17, bgColor === "cream" ? 235 : 35); doc.rect(0, 0, pgW, pgH, "F"); } }

        if (raw.startsWith("## ")) {
          doc.setFont("helvetica", "bold"); doc.setFontSize(fontSize + 4);
          doc.setTextColor(bgColor === "dark" ? 165 : 60, bgColor === "dark" ? 180 : 60, bgColor === "dark" ? 252 : 200);
          doc.text(raw.replace("## ", ""), margin, cy); cy += 9;
          doc.setFont("helvetica", "normal"); doc.setFontSize(fontSize);
          doc.setTextColor(bgColor === "dark" ? 220 : 30, bgColor === "dark" ? 220 : 30, bgColor === "dark" ? 220 : 30);
        } else if (raw.startsWith("- ")) {
          doc.setFont("helvetica", "normal"); doc.setFontSize(fontSize);
          doc.setTextColor(bgColor === "dark" ? 210 : 40, bgColor === "dark" ? 210 : 40, bgColor === "dark" ? 210 : 40);
          const split = doc.splitTextToSize("• " + raw.slice(2), pgW - 2 * margin - 5);
          for (const l of split) { if (cy > pgH - 30) { doc.addPage(); cy = margin; } doc.text(l, margin + 3, cy); cy += 7; }
        } else if (raw === "---") {
          doc.setDrawColor(bgColor === "dark" ? 80 : 180, bgColor === "dark" ? 80 : 180, bgColor === "dark" ? 80 : 180);
          doc.line(margin, cy, pgW - margin, cy); cy += 6;
        } else if (raw.startsWith("```") || raw === "") {
          cy += 4;
        } else {
          // Strip inline ** and _ for PDF rendering
          const clean = raw.replace(/\*\*(.*?)\*\*/g, "$1").replace(/_(.*?)_/g, "$1");
          doc.setFont("helvetica", "normal"); doc.setFontSize(fontSize);
          doc.setTextColor(bgColor === "dark" ? 220 : 40, bgColor === "dark" ? 220 : 40, bgColor === "dark" ? 220 : 40);
          const split = doc.splitTextToSize(clean, pgW - 2 * margin);
          for (const l of split) { if (cy > pgH - 30) { doc.addPage(); cy = margin; } doc.text(l, margin, cy); cy += 7; }
        }
      }

      // Watermark + page numbers
      const total = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= total; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "bold"); doc.setFontSize(52);
        doc.setTextColor(bgColor === "dark" ? 35 : 230, bgColor === "dark" ? 35 : 230, bgColor === "dark" ? 35 : 230);
        doc.text("CODE-SORTED", pgW / 2, pgH / 2, { angle: 45, align: "center" });
        doc.setFont("helvetica", "normal"); doc.setFontSize(9);
        doc.setTextColor(bgColor === "dark" ? 100 : 160, bgColor === "dark" ? 100 : 160, bgColor === "dark" ? 100 : 160);
        doc.text(`${i} / ${total}`, pgW - margin, pgH - 10, { align: "right" });
      }

      const file = new File([doc.output("blob")], `${title.replace(/[^a-z0-9]/gi, "_")}.pdf`, { type: "application/pdf" });
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      await onSave(title, url);
    } catch (err) {
      alert("Error: " + (err as Error).message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-5xl flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{ height: "90vh", background: "#0a0b18", border: "1px solid rgba(99,102,241,0.2)" }}>

        {/* Topbar */}
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0"
          style={{ background: "rgba(255,255,255,0.025)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-3">
            <span className="text-white/60 text-sm font-medium">📝 Wordpad Note Builder</span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-widest"
              style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
              PDF Export
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPreview(p => !p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: preview ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)", color: preview ? "#a5b4fc" : "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}>
              {preview ? "◀ Editor" : "Preview ▶"}
            </button>
            <button onClick={onClose} className="text-white/30 hover:text-white text-xl px-2 transition-colors">✕</button>
          </div>
        </div>

        <form onSubmit={handleGeneratePdfAndSave} className="flex-1 flex flex-col overflow-hidden">
          {/* Metadata bar */}
          <div className="flex items-center gap-4 px-5 py-3 shrink-0"
            style={{ background: "rgba(255,255,255,0.015)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <input required value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Document Title…"
              className="flex-1 bg-transparent text-white text-base font-semibold placeholder-white/20 focus:outline-none" />
            <div className="flex items-center gap-3 shrink-0">
              {/* Font size */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/30">Size</span>
                <input type="number" min="8" max="24" value={fontSize} onChange={e => setFontSize(Number(e.target.value))}
                  className="w-12 text-center text-sm bg-white/5 border border-white/10 rounded-lg px-1 py-1 text-white focus:outline-none" />
              </div>
              {/* Page bg */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-white/30">Bg</span>
                {(["white", "cream", "dark"] as const).map(c => (
                  <button key={c} type="button" onClick={() => setBgColor(c)}
                    className="w-5 h-5 rounded-full border-2 transition-all"
                    style={{ background: c === "white" ? "#fff" : c === "cream" ? "#fefce8" : "#0f1123",
                      borderColor: bgColor === c ? "#818cf8" : "rgba(255,255,255,0.15)" }} />
                ))}
              </div>
            </div>
          </div>

          {/* Formatting toolbar */}
          <div className="flex items-center gap-1 px-5 py-2 shrink-0"
            style={{ background: "rgba(255,255,255,0.008)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {TOOLBAR.map(t => (
              <button key={t.action} type="button" title={t.title} onClick={() => handleToolbar(t.action)}
                className="px-3 py-1 rounded-lg text-xs font-bold text-white/50 hover:text-white hover:bg-white/10 transition-all font-mono">
                {t.label}
              </button>
            ))}
            <span className="ml-3 text-[10px] text-white/20">**bold** | _italic_ | ## heading | - list</span>
          </div>

          {/* Editor / Preview */}
          <div className="flex-1 overflow-hidden relative">
            {preview ? (
              <div className="h-full overflow-y-auto p-8 prose prose-invert max-w-none text-sm text-white/70"
                style={{ background: "#0a0b18" }}>
                <h1 className="text-white text-xl font-bold mb-4">{title || "Untitled"}</h1>
                {content.split("\n").map((line, i) => {
                  if (line.startsWith("## ")) return <h2 key={i} className="text-indigo-300 font-bold text-base mt-4 mb-1">{line.slice(3)}</h2>;
                  if (line.startsWith("- ")) return <li key={i} className="ml-4 text-white/60">{line.slice(2)}</li>;
                  if (line === "---") return <hr key={i} className="border-white/10 my-3" />;
                  if (!line) return <br key={i} />;
                  return <p key={i} className="text-white/60 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/_(.*?)_/g, "<em>$1</em>") }} />;
                })}
              </div>
            ) : (
              <textarea
                ref={el => { textareaRef.current = el; }}
                required value={content} onChange={e => setContent(e.target.value)}
                className="w-full h-full p-6 bg-transparent text-white/80 placeholder-white/15 focus:outline-none resize-none font-mono text-sm leading-relaxed"
                placeholder={"Start writing your note...\n\n## Heading\nNormal paragraph text.\n\n- Bullet point one\n- Bullet point two\n\n**Bold text** and _italic text_\n\n---\n\n```\ncode block\n```"} />
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between px-5 py-4 shrink-0"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)", background: "rgba(255,255,255,0.015)" }}>
            <span className="text-xs text-white/25">
              {content.length} chars · {content.split("\n").length} lines
            </span>
            <div className="flex gap-3">
              <button type="button" onClick={onClose}
                className="px-5 py-2 rounded-xl text-sm text-white/40 hover:text-white transition-colors">Cancel</button>
              <button type="submit" disabled={isGenerating}
                className="px-6 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
                style={{ background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "white",
                  boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
                {isGenerating ? "⏳ Generating PDF…" : "🚀 Publish as PDF"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
