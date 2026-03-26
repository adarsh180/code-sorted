"use client";

import { useState, useTransition } from "react";
import { removeUser } from "@/app/admin/actions";

export function RemoveUserButton({ userId, userName }: { userId: string; userName: string | null }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      await removeUser(userId);
      setShowConfirm(false);
    });
  };

  if (showConfirm) {
    return (
      <div className="flex flex-col gap-2 items-start">
        <p className="text-xs text-rose-300 font-medium">
          Remove <span className="font-bold">{userName || "this user"}</span>?
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleRemove}
            disabled={isPending}
            className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-lg transition-all duration-200 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          >
            {isPending ? "Removing…" : "Confirm"}
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            disabled={isPending}
            className="px-3 py-1 text-xs font-semibold text-white/60 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-400/50 hover:shadow-[0_0_12px_rgba(239,68,68,0.25)] rounded-lg transition-all duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" /><path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
      Remove
    </button>
  );
}
