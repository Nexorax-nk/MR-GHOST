import React from 'react';
import { AlertCircle, Clock, User } from 'lucide-react';

interface ConflictCardProps {
  memory_id: string;
  conflict_reasoning: string;
  severity: string;
  who: string;
  when: string;
  original_decision: string;
}

export function ConflictCard({ memory_id, conflict_reasoning, severity, who, when, original_decision }: ConflictCardProps) {
  return (
    <div className="bg-[#210f14] border border-[#f85149] rounded-md p-4 mb-4 text-gray-300 shadow-md">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#f85149] mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-[#f85149] font-semibold text-base mb-1">MR Ghost Violation Detected ({memory_id})</h3>
          <p className="mb-3 text-sm">{conflict_reasoning}</p>
          
          <div className="bg-[#0d1117] p-3 rounded text-sm border border-[#30363d] mb-3">
            <span className="text-gray-500 block mb-1 uppercase text-xs font-semibold">Original Decision:</span>
            <span className="text-gray-300 italic">"{original_decision}"</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" /> {who}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {new Date(when).toLocaleDateString()}
            </div>
            <div className={`px-2 py-0.5 rounded-full capitalize ${severity === 'critical' ? 'bg-[#f8514933] text-[#f85149]' : 'bg-[#e3b34133] text-[#e3b341]'}`}>
              {severity} severity
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2 justify-end border-t border-[#f8514933] pt-3">
        <button className="px-3 py-1.5 text-xs bg-[#21262d] border border-[#30363d] rounded hover:bg-[#30363d] transition-colors">Discuss</button>
        <button className="px-3 py-1.5 text-xs bg-[#21262d] border border-[#30363d] rounded hover:bg-[#30363d] text-[#f85149] transition-colors">Override</button>
        <button className="px-3 py-1.5 text-xs bg-[#238636] border border-[#2ea043] rounded text-white hover:bg-[#2ea043] transition-colors font-medium">Fix Issue</button>
      </div>
    </div>
  );
}
