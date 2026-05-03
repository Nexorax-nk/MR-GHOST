"use client";

import React, { useState } from 'react';
import { AlertCircle, Check, CheckCircle2, MessageCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function GhostComment({ conflicts }: { conflicts: any[] }) {
  if (!conflicts || conflicts.length === 0) return null;

  return (
    <div className="flex gap-4 mb-8">
      <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] overflow-hidden flex-shrink-0 flex items-center justify-center z-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
          <path d="M20 50 C 20 20, 80 20, 80 50 Z" fill="url(#hardhatGrad)"/>
          <rect x="15" y="45" width="70" height="8" rx="4" fill="#5865F2"/>
          <rect x="45" y="15" width="10" height="30" fill="#4752C4"/>
          <rect x="25" y="53" width="50" height="35" rx="15" fill="#ffffff"/>
          <circle cx="40" cy="65" r="5" fill="#1e1e2e"/>
          <circle cx="60" cy="65" r="5" fill="#1e1e2e"/>
          <path d="M40 75 Q 50 85 60 75" stroke="#1e1e2e" strokeWidth="3" strokeLinecap="round"/>
          <defs>
            <linearGradient id="hardhatGrad" x1="20" y1="20" x2="80" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4A90E2"/>
              <stop offset="1" stopColor="#9013FE"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="flex-1 border border-[#30363d] rounded-md bg-[#0d1117] shadow-sm">
        <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 text-sm text-gray-400 flex items-center justify-between rounded-t-md before:absolute before:left-[45px] before:top-[...px] before:border-[8px] before:border-transparent before:border-r-[#30363d] after:absolute after:left-[47px] after:top-[...px] after:border-[7px] after:border-transparent after:border-r-[#161b22]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-200">MR-GOST</span>
            <span className="text-xs px-1.5 py-0.5 border border-[#30363d] rounded-full text-gray-500 font-medium">bot</span>
            <span>reviewed this just now</span>
          </div>
          <div className="flex items-center gap-1 text-[#f85149]">
            <span className="w-2 h-2 rounded-full bg-[#f85149]"></span>
            Changes requested
          </div>
        </div>
        <div className="p-4 text-sm">
          <p className="text-gray-300 mb-4 leading-relaxed">
            I analyzed this Pull Request using MR-GOST and compared the code semantics against your team's memory bank. 
            I found <span className="font-bold text-[#f85149]">{conflicts.length} conflict(s)</span> that violate past architectural decisions.
          </p>
          
          <div className="space-y-4">
            {conflicts.map((c, i) => (
              <ConflictItem key={i} conflict={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConflictItem({ conflict }: { conflict: any }) {
  const [state, setState] = useState<'pending' | 'overridden' | 'fixed' | 'discussing'>('pending');
  const [reply, setReply] = useState('');

  const handleOverride = () => {
    setState('overridden');
    toast.success("Conflict Overridden", { description: "You have bypassed MR-GOST's warning." });
  };

  const handleFix = () => {
    toast("MR-GOST is generating a fix...", { icon: '🤖' });
    setTimeout(() => {
      setState('fixed');
      toast.success("Issue Fixed", { description: "MR-GOST automatically applied the fix to your branch." });
    }, 1500);
  };

  const handleDiscuss = () => {
    setState('discussing');
  };

  const submitReply = () => {
    toast.success("Reply posted");
    setReply('');
    setState('pending'); // Reset state or keep discussion open
  };

  if (state === 'overridden') {
    return (
      <div className="border border-[#8b949e] bg-[#21262d]/50 rounded-md p-4">
        <div className="flex items-center gap-2 mb-2 text-[#8b949e]">
          <XCircle className="w-5 h-5" />
          <h4 className="font-semibold text-base line-through">Violation Overridden ({conflict.memory_id})</h4>
        </div>
        <p className="text-[#8b949e] mb-2 italic">This violation was manually overridden by dev-carlos.</p>
        <button onClick={() => setState('pending')} className="text-blue-400 hover:underline text-xs">Undo override</button>
      </div>
    );
  }

  if (state === 'fixed') {
    return (
      <div className="border border-[#2ea043] bg-[#238636]/10 rounded-md p-4">
        <div className="flex items-center gap-2 mb-2 text-[#2ea043]">
          <CheckCircle2 className="w-5 h-5" />
          <h4 className="font-semibold text-base">Issue Fixed ({conflict.memory_id})</h4>
        </div>
        <p className="text-[#3fb950] mb-2">MR-GOST successfully refactored the code to comply with this decision. A new commit has been pushed.</p>
        <button onClick={() => setState('pending')} className="text-blue-400 hover:underline text-xs">Undo fix</button>
      </div>
    );
  }

  return (
    <div className="border border-[#f85149]/50 bg-[#f85149]/5 rounded-md p-4">
      <div className="flex items-center gap-2 mb-3 text-[#f85149]">
        <AlertCircle className="w-5 h-5" />
        <h4 className="font-semibold text-base">MR Ghost Violation Detected ({conflict.memory_id})</h4>
      </div>
      
      <p className="text-gray-300 mb-4">{conflict.conflict_reasoning}</p>
      
      <div className="bg-[#0d1117] border border-[#30363d] rounded p-3 mb-4">
        <div className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-2">Original Decision:</div>
        <p className="text-gray-400 italic">"{conflict.original_decision}"</p>
      </div>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0zM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0z"></path></svg>
            {conflict.who}
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0zm0 3.5h8.5a.25.25 0 0 1 .25.25V6h-11V3.75a.25.25 0 0 1 .25-.25h2zm-2.25 4v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5h-11z"></path></svg>
            {new Date(conflict.when).toLocaleDateString()}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-[#f85149]/20 text-[#f85149] font-medium border border-[#f85149]/30">
            {conflict.severity} Severity
          </span>
        </div>
      </div>

      {state === 'discussing' ? (
        <div className="mt-4 border-t border-[#30363d] pt-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={reply}
              onChange={e => setReply(e.target.value)}
              placeholder="Leave a comment..." 
              className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
            />
            <button onClick={submitReply} className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-sm font-medium">Comment</button>
            <button onClick={() => setState('pending')} className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 border border-[#30363d] px-3 py-1.5 rounded-md text-sm font-medium">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-[#30363d]/50">
          <button onClick={handleDiscuss} className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-[#30363d]">
            Discuss
          </button>
          <button onClick={handleOverride} className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-[#30363d]">
            Override
          </button>
          <button onClick={handleFix} className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-[#2ea043]">
            Fix Issue
          </button>
        </div>
      )}
    </div>
  );
}
