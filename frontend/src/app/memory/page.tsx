"use client";

import React, { useEffect, useState } from 'react';
import { ExtractMemoryModal } from '@/components/ExtractMemoryModal';
import { Search, Plus, Network, ShieldAlert, BookOpen, Clock, ChevronLeft, LayoutDashboard, BrainCircuit, History, Settings, Edit2, Save, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function MemoryBank() {
  const [memories, setMemories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const fetchMemories = () => {
    setLoading(true);
    fetch('http://localhost:8000/memories')
      .then(res => res.json())
      .then(data => {
        setMemories(data.memories || data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleEdit = (memory: any) => {
    setEditingId(memory.id);
    setEditValue(memory.decision);
  };

  const handleSave = (id: string) => {
    // In a real app, this would be a PUT/PATCH request
    setMemories(memories.map(m => m.id === id ? { ...m, decision: editValue } : m));
    setEditingId(null);
    toast.success("Core directive updated successfully.");
  };

  const filtered = memories.filter(m => 
    m.module?.toLowerCase().includes(search.toLowerCase()) || 
    m.decision?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans flex flex-col">
      
      {/* Vault Header Navigation */}
      <header className="bg-[#010409] border-b border-[#30363d] px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-400 hover:text-[#a371f7] transition-colors flex items-center gap-2 text-sm font-medium">
            <ChevronLeft className="w-4 h-4" /> Back to PR
          </Link>
          <div className="h-6 w-px bg-[#30363d]"></div>
          <div className="flex items-center gap-3">
             <Network className="w-5 h-5 text-[#a371f7]" />
             <span className="text-lg font-bold text-gray-100 tracking-wide">MR-GOST <span className="text-[#a371f7] font-light">Memory Vault</span></span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group">
            <div className="flex items-center bg-[#0d1117] border border-[#30363d] focus-within:border-[#a371f7] rounded-md px-3 py-1.5 w-[350px] transition-all">
              <Search className="w-4 h-4 mr-2 text-gray-500" />
              <input 
                type="text" 
                placeholder="Query institutional memory..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-sm text-gray-200" 
              />
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 px-4 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Directive
          </button>
        </div>
      </header>

      <div className="max-w-[1280px] w-full mx-auto px-6 py-8 flex-1 flex flex-col md:flex-row gap-8">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-[260px] flex-shrink-0">
          <nav className="flex flex-col gap-1">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Vault Navigation</h3>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-[#161b22] transition-colors">
              <LayoutDashboard className="w-4 h-4 text-gray-400" /> Overview
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold text-white bg-[#161b22] border-l-2 border-[#a371f7]">
              <BrainCircuit className="w-4 h-4 text-[#a371f7]" /> Core Directives
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-[#161b22] transition-colors">
              <History className="w-4 h-4 text-gray-400" /> Violation Logs
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-[#161b22] transition-colors">
              <Settings className="w-4 h-4 text-gray-400" /> Settings
            </a>
          </nav>
        </aside>

        {/* Right Main Content */}
        <main className="flex-1">
          <div className="border-b border-[#30363d] pb-4 mb-6">
            <h1 className="text-2xl font-normal text-gray-100 mb-2">Core Directives</h1>
            <p className="text-sm text-gray-400">Manage the active semantic constraints that MR-GOST uses to review pull requests.</p>
          </div>

          <div className="border border-[#30363d] rounded-md bg-[#0d1117] overflow-hidden shadow-sm">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#a371f7] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center">
                <BrainCircuit className="w-10 h-10 text-[#30363d] mb-4" />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">No directives found.</h3>
                <p className="text-gray-500 text-sm">Adjust your query or create a new directive.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-[#30363d]">
                {filtered.map((memory) => (
                  <div key={memory.id} className="p-4 hover:bg-[#161b22]/50 transition-colors group">
                    <div className="flex justify-between items-start gap-4">
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-[#a371f7]/10 text-[#c29cff] text-xs px-2 py-0.5 rounded border border-[#a371f7]/20 font-mono">
                            {memory.id}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${memory.severity === 'critical' ? 'bg-[#f85149] shadow-[0_0_5px_#f85149]' : 'bg-[#e3b341]'}`}></span>
                          <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{memory.module}</span>
                        </div>

                        {editingId === memory.id ? (
                          <div className="mt-2 mb-3">
                            <textarea 
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full bg-[#010409] border border-blue-500 rounded-md p-3 text-sm text-gray-200 focus:outline-none min-h-[80px]"
                            />
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => handleSave(memory.id)} className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5">
                                <Save className="w-3.5 h-3.5" /> Save Rule
                              </button>
                              <button onClick={() => setEditingId(null)} className="bg-[#21262d] hover:bg-[#30363d] text-gray-300 px-3 py-1.5 rounded-md text-xs font-semibold border border-[#30363d] flex items-center gap-1.5">
                                <X className="w-3.5 h-3.5" /> Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-gray-200 text-sm font-medium mb-3 leading-relaxed">
                            {memory.decision}
                          </div>
                        )}

                        {!editingId || editingId !== memory.id ? (
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <img src={`https://github.com/identicons/${memory.who.replace(/[^a-zA-Z]/g, '')}.png`} className="w-4 h-4 rounded-full border border-[#30363d]"/>
                              {memory.who}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {new Date(memory.created_at).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer transition-colors">
                              <BookOpen className="w-3 h-3" /> Extracted from PR {memory.pr}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      {/* Action Button */}
                      {!editingId || editingId !== memory.id ? (
                        <button 
                          onClick={() => handleEdit(memory)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-300 px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 flex-shrink-0 shadow-sm"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Rule
                        </button>
                      ) : null}
                      
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <ExtractMemoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchMemories}
      />
    </div>
  );
}
