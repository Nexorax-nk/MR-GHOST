import React from 'react';
import { Calendar, User, Tag, ShieldAlert } from 'lucide-react';

interface MemoryCardProps {
  id: string;
  decision: string;
  reason: string;
  module: string;
  severity: string;
  who: string;
  pr: string;
  tags: string[];
  created_at: string;
}

export function MemoryCard({ id, decision, reason, module, severity, who, pr, tags, created_at }: MemoryCardProps) {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-[#8b949e] transition-all group flex flex-col h-full shadow-md hover:shadow-lg">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="bg-indigo-900/40 text-indigo-400 text-xs px-2 py-1 rounded font-mono font-medium border border-indigo-900/50">{id}</span>
          <span className="text-xs bg-[#21262d] text-gray-300 px-2 py-1 rounded border border-[#30363d] capitalize flex items-center gap-1">
            <Tag className="w-3 h-3" /> {module}
          </span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full capitalize flex items-center gap-1 font-medium ${
          severity === 'critical' ? 'bg-[#f8514922] text-[#f85149] border border-[#f8514944]' : 
          severity === 'high' ? 'bg-[#e3b34122] text-[#e3b341] border border-[#e3b34144]' : 
          'bg-[#3fb95022] text-[#3fb950] border border-[#3fb95044]'
        }`}>
          <ShieldAlert className="w-3 h-3" /> {severity}
        </span>
      </div>

      <p className="text-gray-200 text-sm font-medium mb-4 leading-relaxed flex-1">
        {decision}
      </p>
      
      <div className="bg-[#0d1117] rounded-md p-3 mb-4 border border-[#30363d] text-xs">
        <span className="text-gray-500 font-semibold block mb-1">Reason (from PR {pr}):</span>
        <span className="text-gray-400 italic leading-snug block">"{reason}"</span>
      </div>

      <div className="mt-auto border-t border-[#30363d] pt-3 flex flex-wrap justify-between items-center text-xs text-gray-500">
        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-gray-400" /> <span className="text-gray-400">{who}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-gray-400" /> <span className="text-gray-400">{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
