"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, CircleDashed, Copy, Check, Sparkles, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export function AskGhost() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'agent', content: string, citations?: string[]}[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClear = () => {
    setMessages([]);
    toast.info('Chat cleared');
  };

  const suggestedQuestions = [
    "Why can't we cache auth tokens?",
    "What's our policy on SQL queries?",
    "Tell me about background jobs",
  ];

  const handleAsk = async () => {
    if (!query.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    const userMessage = query;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setQuery('');
    setLoading(true);
    
    try {
      const res = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'agent',
        content: data.answer || "I couldn't find an answer to that question.",
        citations: data.citations || []
      }]);
      toast.success('✨ Bob has answered your question');
    } catch (e) {
      console.error(e);
      toast.error('Failed to get answer. Using demo response.');
      // Fallback to demo response
      setMessages(prev => [...prev, {
        role: 'agent',
        content: "According to **MEM-001**, `alice-sec` decided to never cache auth token responses after the Sept 2025 incident where revoked tokens were still being served from cache.\n\nPassword resets must immediately invalidate all active tokens. If you must optimize, consider implementing a very short-lived bloom filter for *invalid* tokens rather than caching valid ones.",
        citations: ["MEM-001"]
      }]);
    }
    setLoading(false);
  };

  const handleSuggestionClick = (question: string) => {
    setQuery(question);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-lg mb-6 shadow-lg overflow-hidden flex flex-col font-sans hover:border-[#484f58] transition-colors">
      <div className="bg-gradient-to-r from-[#161b22] to-[#1c2128] px-4 py-3 flex justify-between items-center border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200">MR GHOST Agent</h3>
        </div>
        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-[#30363d] rounded"
              title="Clear chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="bg-[#21262d] border border-[#30363d] px-2 py-1 rounded-full text-xs text-gray-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[#3fb950]" /> Online
          </span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col min-h-[280px] max-h-[500px] overflow-y-auto bg-[#0d1117] space-y-4">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 py-8">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-[#30363d] flex items-center justify-center mb-4">
                <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                  <path d="M20 50 C 20 20, 80 20, 80 50 Z" fill="url(#hhGradSidebar)"/>
                  <rect x="15" y="45" width="70" height="8" rx="4" fill="#5865F2"/>
                  <rect x="45" y="15" width="10" height="30" fill="#4752C4"/>
                  <rect x="25" y="53" width="50" height="35" rx="15" fill="#ffffff"/>
                  <circle cx="40" cy="65" r="5" fill="#1e1e2e"/>
                  <circle cx="60" cy="65" r="5" fill="#1e1e2e"/>
                  <path d="M40 75 Q 50 85 60 75" stroke="#1e1e2e" strokeWidth="3" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="hhGradSidebar" x1="20" y1="20" x2="80" y2="50" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4A90E2"/>
                      <stop offset="1" stopColor="#9013FE"/>
                    </linearGradient>
                  </defs>
                </svg>
             </div>
             <p className="text-base font-medium text-gray-300 mb-2">Hi, I'm your MR-GHOST Agent</p>
             <p className="text-sm text-gray-500 mb-6">Ask me questions about past PR decisions and architectural choices</p>
             
             <div className="flex flex-col gap-2 w-full max-w-md">
               <p className="text-xs text-gray-500 mb-1">Try asking:</p>
               {suggestedQuestions.map((q, i) => (
                 <button
                   key={i}
                   onClick={() => handleSuggestionClick(q)}
                   className="text-left px-4 py-2 bg-[#161b22] border border-[#30363d] rounded-md text-sm text-gray-300 hover:bg-[#21262d] hover:border-blue-500/50 transition-all"
                 >
                   💡 {q}
                 </button>
               ))}
             </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'agent' ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-[#30363d] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                    <path d="M20 50 C 20 20, 80 20, 80 50 Z" fill="url(#hhGradMsg)"/>
                    <rect x="15" y="45" width="70" height="8" rx="4" fill="#5865F2"/>
                    <rect x="45" y="15" width="10" height="30" fill="#4752C4"/>
                    <rect x="25" y="53" width="50" height="35" rx="15" fill="#ffffff"/>
                    <circle cx="40" cy="65" r="5" fill="#1e1e2e"/>
                    <circle cx="60" cy="65" r="5" fill="#1e1e2e"/>
                    <path d="M40 75 Q 50 85 60 75" stroke="#1e1e2e" strokeWidth="3" strokeLinecap="round"/>
                    <defs>
                      <linearGradient id="hhGradMsg" x1="20" y1="20" x2="80" y2="50" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4A90E2"/>
                        <stop offset="1" stopColor="#9013FE"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] overflow-hidden flex-shrink-0">
                   <img src="https://github.com/identicons/dev-carlos.png" alt="user" className="w-full h-full" />
                </div>
              )}
              
              <div className={`group relative p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-[#21262d] border border-[#30363d] text-gray-200' : 'bg-transparent text-gray-300'}`}>
                {msg.role === 'agent' ? (
                  <>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-[#30363d]">
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Citations:
                        </span>
                        {msg.citations.map(c => (
                          <span key={c} className="bg-[#161b22] border border-[#30363d] text-blue-400 px-2 py-1 rounded-md text-xs cursor-pointer hover:bg-[#21262d] hover:border-blue-500 transition-all">{c}</span>
                        ))}
                      </div>
                    )}
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#30363d] rounded"
                      title="Copy message"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </button>
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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-[#30363d] flex items-center justify-center flex-shrink-0">
               <CircleDashed className="w-4 h-4 text-blue-400 animate-spin" />
            </div>
            <div className="py-2 space-y-2">
               <div className="h-3 w-40 bg-[#21262d] rounded animate-pulse"></div>
               <div className="h-3 w-32 bg-[#21262d] rounded animate-pulse"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-[#0d1117] border-t border-[#30363d]">
        <div className="relative border border-[#30363d] bg-[#161b22] rounded-lg focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all flex items-end">
          <textarea 
            ref={textareaRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if(e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask MR-GHOST a question... (Press Enter to send)" 
            className="w-full bg-transparent resize-none min-h-[44px] max-h-[120px] px-4 py-3 text-sm text-gray-200 focus:outline-none placeholder-gray-500"
            rows={1}
          />
          <div className="p-2">
             <button 
               onClick={handleAsk}
               disabled={loading || !query.trim()}
               className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white disabled:opacity-50 p-2 rounded-md transition-all flex items-center justify-center shadow-lg disabled:shadow-none"
               title="Send message"
             >
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
        <div className="text-center mt-2">
          <span className="text-[10px] text-gray-500">MR-GHOST uses your Team Memory Bank • Verify critical decisions</span>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
