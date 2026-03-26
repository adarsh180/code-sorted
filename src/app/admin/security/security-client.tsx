"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SecurityLog = {
  id: string;
  encryptedIp: string | null;
  deviceInfo: string | null;
  approxLocation: string | null;
  actionType: string;
  isSuspicious: boolean;
  timestamp: Date;
};

type UserData = {
  id: string;
  email: string;
  createdAt: Date;
  consentGiven: boolean;
  userSessions: any[];
  securityLogs: SecurityLog[];
};

export default function SecurityTableClient({ initialUsers }: { initialUsers: UserData[] }) {
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const generatePDF = (user: UserData) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("CodeSorted Official Security & Audit Log", 14, 22);
    
    doc.setFontSize(11);
    doc.text(`Subject Account: ${user.email}`, 14, 30);
    doc.text(`Internal ID: ${user.id}`, 14, 36);
    doc.text(`Account Created: ${new Date(user.createdAt).toISOString()}`, 14, 42);
    doc.text(`Strict Consent Verified: ${user.consentGiven ? "YES" : "NO"}`, 14, 48);
    doc.text(`Active Devices Detected: ${user.userSessions.length} (Max Allowed: 2)`, 14, 54);

    doc.line(14, 60, 196, 60);

    // Logs Table
    const tableData = user.securityLogs.map(log => [
      new Date(log.timestamp).toISOString().split('T').join('\n').split('.')[0],
      log.actionType,
      log.approxLocation || "N/A",
      log.encryptedIp ? `${log.encryptedIp.slice(0, 15)}... (Encrypted)` : "Missing",
      log.isSuspicious ? "FLAGGED" : "CLEAN"
    ]);

    autoTable(doc, {
      startY: 65,
      head: [['Timestamp', 'Action', 'Approx Location', 'IP Data', 'Status']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241] }, // Indigo 500
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        3: { cellWidth: 50 } // Give the encrypted IP column more space
      }
    });

    const pageCount = doc.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Page ${i} of ${pageCount} | Strictly Confidential. Generated for legal compliance purposes by Admin.`,
        14, 
        doc.internal.pageSize.getHeight() - 10
      );
    }

    doc.save(`CodeSorted_Audit_${user.email.replace('@', '_at_')}_${Date.now()}.pdf`);
  };

  return (
    <div className="space-y-4">
      {initialUsers.map(user => (
        <div key={user.id} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-white font-medium">{user.email}</h3>
                {user.securityLogs.some(log => log.isSuspicious) && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/20">
                    FLAGGED ACTIVITY
                  </span>
                )}
                {!user.consentGiven && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                    MISSING CONSENT
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Tracking {user.securityLogs.length} events | {user.userSessions.length} active sessions
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                title="View Encrypted Trail"
              >
                {expandedUser === user.id ? "Minimize Trail" : "View Trail"}
              </button>
              
              <button 
                onClick={() => generatePDF(user)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                title="Download Official Audit PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>

          {/* Expanded Security Trail */}
          {expandedUser === user.id && (
            <div className="border-t border-white/5 bg-black/20 p-5">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">
                Encrypted Event Trail
              </h4>
              
              {user.securityLogs.length === 0 ? (
                <p className="text-sm text-gray-500">No events logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {user.securityLogs.map(log => (
                    <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-2 border-b border-white/5 last:border-0 hover:bg-white/5 rounded px-2 -mx-2 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${log.isSuspicious ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span className="text-white font-medium">{log.actionType}</span>
                          <span className="text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-gray-400">
                          <span className="text-indigo-300">GEO:</span> {log.approxLocation || "Unknown"} | 
                          <span className="text-indigo-300 ml-2">DEVICE:</span> {log.deviceInfo ? log.deviceInfo.split('(')[0] : "Unknown"}
                        </p>
                      </div>
                      <div className="mt-2 sm:mt-0 text-right">
                        <p className="text-[10px] font-mono text-gray-500 break-all w-48 ml-auto" title="Encrypted IP Payload">
                          {log.encryptedIp || "N/A"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {initialUsers.length === 0 && (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-gray-400">No users found in the system.</p>
        </div>
      )}
    </div>
  );
}
