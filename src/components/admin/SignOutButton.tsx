"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="flex w-full items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}
