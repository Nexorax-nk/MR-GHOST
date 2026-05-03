"use client";

import React, { useState } from 'react';
import { Send, CheckCircle2, CircleDashed } from 'lucide-react';
import { toast } from 'sonner';

export function AskGhost() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'agent', content: string, citations?: string[]}[]>([]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    // Add user message
    const userMessage = query;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setLoading(true);
    
    // MOCK DEMO RESPONSE (Copilot style Threading)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'agent',
        content: "According to **MEM-001**, `alice-sec` decided to never cache auth token responses after the Sept 2025 incident where revoked tokens were still being served from cache.\n\nPassword resets must immediately invalidate all active tokens. If you must optimize, consider implementing a very short-lived bloom filter for *invalid* tokens rather than caching valid ones.",
        citations: ["MEM-001"]
      }]);
      setLoading(false);
    }, 1800);
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg mb-6 shadow-sm overflow-hidden flex flex-col font-sans">
      <div className="bg-[#161b22] px-4 py-2 flex justify-between items-center border-b border-[#30363d]">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
          MR GOST AGENT
        </h3>
        <span className="bg-[#21262d] border border-[#30363d] px-2 py-0.5 rounded-full text-xs text-gray-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-[#3fb950]" /> Connected
        </span>
      </div>
      
      <div className="p-4 flex flex-col min-h-[200px] max-h-[400px] overflow-y-auto bg-[#0d1117] space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-6">
             <div className="w-12 h-12 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center mb-3">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <path d="M20 50 C 20 20, 80 20, 80 50 Z" fill="url(#hhGradSidebar)"/>
                  <rect x="15" y="45" width="70" height="8" rx="4" fill="#5865F2"/>
                  <rect x="45" y="15" width="10" height="30" fill="#4752C4"/>
                  <rect x="25" y="53" width="50" height="35" rx="15" fill="#ffffff"/>
                  <circle cx="40" cy="65" r="5" fill="#1e1e2e"/>
                  <circle cx="60" cy="65" r="5" fill="#1e1e2e"/>
                  <path d="M40 75 Q 50 85 60 75" stroke="#1e1e2e" strokeWidth="3" strokeLinecap="round"/>
                </svg>
             </div>
             <p className="text-sm">Hi, I'm your MR-GOST Agent.<br/>Ask me questions about past PR decisions.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'agent' ? (
                <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <path d="M20 50 C 20 20, 80 20, 80 50 Z" fill="url(#hhGradSidebar)"/>
                    <rect x="15" y="45" width="70" height="8" rx="4" fill="#5865F2"/>
                    <rect x="45" y="15" width="10" height="30" fill="#4752C4"/>
                    <rect x="25" y="53" width="50" height="35" rx="15" fill="#ffffff"/>
                    <circle cx="40" cy="65" r="5" fill="#1e1e2e"/>
                    <circle cx="60" cy="65" r="5" fill="#1e1e2e"/>
                    <path d="M40 75 Q 50 85 60 75" stroke="#1e1e2e" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] overflow-hidden flex-shrink-0">
                   <img src="https://github.com/identicons/dev-carlos.png" alt="user" className="w-full h-full" />
                </div>
              )}
              
              <div className={`p-3 rounded-md max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[#21262d] border border-[#30363d] text-gray-200' : 'bg-transparent text-gray-300'}`}>
                {msg.role === 'agent' ? (
                  <>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.citations && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border-[#30363d]">
                        <span className="text-gray-500 text-xs">Citations:</span>
                        {msg.citations.map(c => (
                          <span key={c} className="bg-[#161b22] border border-[#30363d] text-blue-400 px-1.5 py-0.5 rounded-md text-xs cursor-pointer hover:underline">{c}</span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p>{msg.content}</p>
                )}
              </div>
            </div>
          ))
        )}
        
        {loading && (
          <div className="flex gap-3 animate-in fade-in">
            <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center flex-shrink-0">
               <CircleDashed className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
            <div className="py-1.5">
               <div className="h-4 w-32 bg-[#21262d] rounded animate-pulse"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 bg-[#0d1117] border-t border-[#30363d]">
        <div className="relative border border-[#30363d] bg-[#161b22] rounded-md focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all flex items-end">
          <textarea 
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask MR-GOST a question... (e.g. Why no auth cache?)" 
            className="w-full bg-transparent resize-none min-h-[40px] max-h-[120px] px-3 py-2.5 text-sm text-gray-200 focus:outline-none placeholder-gray-500"
            rows={1}
          />
          <div className="p-1.5">
             <button 
               onClick={handleAsk}
               disabled={loading || !query.trim()}
               className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-300 disabled:opacity-50 p-1.5 rounded-md transition-colors flex items-center justify-center shadow-sm"
             >
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-500">MR-GOST AGENT uses the Team Memory Bank. Verify critical decisions.</span>
        </div>
      </div>
    </div>
  );
}
