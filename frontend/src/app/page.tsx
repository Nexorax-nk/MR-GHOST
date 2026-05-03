"use client";

import React, { useState } from 'react';
import { PRDiff } from '@/components/PRDiff';
import { GhostComment } from '@/components/GhostComment';
import { AskGhost } from '@/components/AskGhost';
import { 
  GitPullRequest, Search, MessageSquare, GitCommit, CheckSquare, FileCode, Check, ChevronDown,
  Menu, Plus, Bell, CircleDot, PlayCircle, Layout, BookOpen, Shield, Activity, Settings, Code, GitMerge, XCircle, History, Copy
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function PRPage() {
  const [analyzing, setAnalyzing] = useState(false);
  const [conflicts, setConflicts] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState('conversation');
  const [isMerged, setIsMerged] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState<string | null>(null);
  const [showCodeDropdown, setShowCodeDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editContent, setEditContent] = useState(`import os
import hashlib

token_cache = {}

def get_auth_token(user_id: str) -> str:
    # Check cache first for performance
    if user_id in token_cache:
        return token_cache[user_id]
        
    # Generate new if missing
    token = generate_token(user_id)
    token_cache[user_id] = token
    return token`);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setConflicts(null);
    
    // Simulate real AI processing
    setAnalyzingStep("Scanning PR diff...");
    await new Promise(r => setTimeout(r, 1000));
    
    setAnalyzingStep("Querying Institutional Memory...");
    await new Promise(r => setTimeout(r, 1500));
    
    setAnalyzingStep("Evaluating semantic conflicts...");
    await new Promise(r => setTimeout(r, 1200));
    
    setAnalyzingStep("Synthesizing review...");
    await new Promise(r => setTimeout(r, 800));

    try {
      const diffText = `+ token_cache = {}
+
+ def get_auth_token(user_id: str) -> str:
+     if user_id in token_cache:
+         return token_cache[user_id]
+     token = generate_token(user_id)
+     token_cache[user_id] = token
+     return token`;

      const res = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diff: diffText })
      });
      const data = await res.json();
      setConflicts(data.conflicts || []);
      
      if (data.conflicts && data.conflicts.length > 0) {
        toast.error(`Analysis complete: Found ${data.conflicts.length} semantic conflicts!`);
      } else {
        toast.success("Analysis complete: No conflicts found.");
      }
    } catch (e) {
      console.error(e);
      setConflicts([]);
      toast.error("Analysis failed to complete.");
    }
    setAnalyzingStep(null);
    setAnalyzing(false);
  };

  const handleMerge = () => {
    setIsMerged(true);
    toast.success("Pull request successfully merged and closed", {
      description: "You're all set! The feature/token-cache branch can be safely deleted."
    });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-sans flex flex-col">
      {/* Global GitHub Header */}
      <header className="bg-[#010409] text-white px-4 py-3 flex items-center justify-between border-b border-[#30363d] text-sm">
        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors border border-[#30363d] p-1.5 rounded-md">
            <Menu className="w-5 h-5" />
          </button>
          <a href="#" className="text-white">
            <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" className="fill-current">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
          <div className="flex items-center text-sm font-semibold ml-2">
            <span className="text-[#c9d1d9] hover:bg-[#21262d] px-2 py-1 rounded-md cursor-pointer transition-colors">Nexorax-nk</span>
            <span className="text-gray-500 mx-1">/</span>
            <span className="text-[#c9d1d9] hover:bg-[#21262d] px-2 py-1 rounded-md cursor-pointer transition-colors">MR-GOST</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 w-[300px] text-gray-400 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <Search className="w-4 h-4 mr-2" />
              <input type="text" placeholder="Type / to search" className="bg-transparent border-none outline-none w-full text-sm text-gray-200" />
            </div>
          </div>
          <div className="flex items-center gap-2 border-l border-[#30363d] pl-3 ml-1 text-gray-400">
            <button className="hover:text-white p-1.5 rounded-md border border-transparent hover:border-[#30363d] transition-colors"><Plus className="w-5 h-5" /></button>
            <button className="hover:text-white p-1.5 rounded-md border border-transparent hover:border-[#30363d] transition-colors"><CircleDot className="w-5 h-5" /></button>
            <button className="hover:text-white p-1.5 rounded-md border border-transparent hover:border-[#30363d] transition-colors"><GitPullRequest className="w-5 h-5" /></button>
            <button className="hover:text-white p-1.5 rounded-md border border-transparent hover:border-[#30363d] transition-colors"><Bell className="w-5 h-5" /></button>
            <div className="w-6 h-6 rounded-full bg-[#161b22] border border-[#30363d] overflow-hidden ml-1 cursor-pointer">
              <img src="https://github.com/identicons/dev-carlos.png" alt="user" className="w-full h-full" />
            </div>
          </div>
        </div>
      </header>

      {/* Sub Repository Navigation */}
      <nav className="bg-[#010409] px-4 pt-4 border-b border-[#30363d] text-sm overflow-x-auto flex-shrink-0">
        <ul className="flex items-center gap-2">
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <Code className="w-4 h-4" /> Code
          </li>
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <CircleDot className="w-4 h-4" /> Issues
          </li>
          <li className="flex items-center gap-2 px-3 py-2 border-b-2 border-[#fd8c73] font-semibold text-gray-200 cursor-pointer">
            <GitPullRequest className="w-4 h-4" /> Pull requests
          </li>
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <PlayCircle className="w-4 h-4" /> Actions
          </li>
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <Layout className="w-4 h-4" /> Projects
          </li>
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <BookOpen className="w-4 h-4" /> Wiki
          </li>
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <Shield className="w-4 h-4" /> Security
          </li>
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <Activity className="w-4 h-4" /> Insights
          </li>
          <li className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:bg-[#161b22] rounded-t-md cursor-pointer transition-colors">
            <Settings className="w-4 h-4" /> Settings
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-[1280px] w-full mx-auto px-4 py-6 flex-1">
        
        {/* Title Block */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-normal text-gray-100 flex items-center gap-2">
            Add user token caching <span className="text-gray-500 font-light">#142</span>
          </h1>
          <div className="flex gap-2 relative">
            <button onClick={() => setIsEditModalOpen(true)} className="bg-[#21262d] border border-[#30363d] rounded-md px-3 py-1 text-sm font-medium text-gray-300 hover:bg-[#30363d] transition-colors">Edit</button>
            <button 
              onClick={() => setShowCodeDropdown(!showCodeDropdown)}
              className="bg-[#21262d] border border-[#30363d] rounded-md px-3 py-1 text-sm font-medium text-gray-300 hover:bg-[#30363d] transition-colors flex items-center gap-1"
            >
              <Code className="w-4 h-4" /> Code <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            
            {showCodeDropdown && (
              <div className="absolute top-10 left-12 w-[350px] bg-[#161b22] border border-[#30363d] rounded-md shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <div className="p-3 border-b border-[#30363d]">
                  <div className="flex items-center gap-2 mb-2 font-semibold text-gray-200 text-sm">
                    <Code className="w-4 h-4" /> Clone
                  </div>
                  <div className="flex rounded-md overflow-hidden border border-[#30363d] bg-[#0d1117] text-sm mb-3">
                    <button className="px-3 py-1.5 bg-[#21262d] border-r border-[#30363d] text-gray-200 font-medium">HTTPS</button>
                    <button className="px-3 py-1.5 text-gray-400 hover:text-gray-200">SSH</button>
                    <button className="px-3 py-1.5 text-gray-400 hover:text-gray-200">GitHub CLI</button>
                  </div>
                  <div className="flex bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden relative">
                    <input type="text" readOnly value="https://github.com/Nexorax-nk/MR-GHOST.git" className="w-full bg-transparent px-3 py-1.5 text-sm text-gray-300 outline-none" />
                    <button onClick={() => {toast.success("Copied to clipboard!"); setShowCodeDropdown(false);}} className="p-1.5 bg-[#21262d] border-l border-[#30363d] text-gray-400 hover:text-gray-200">
                      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 15.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-[#21262d] hover:text-white rounded-md transition-colors flex items-center gap-2">
                    <FileCode className="w-4 h-4" /> Open with GitHub Desktop
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-300 hover:bg-[#21262d] hover:text-white rounded-md transition-colors flex items-center gap-2">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" fill="currentColor"><path d="M2 1.75C2 .784 2.784 0 3.75 0h8.5C13.216 0 14 .784 14 1.75v12.5A1.75 1.75 0 0 1 12.25 16h-8.5A1.75 1.75 0 0 1 2 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25h-8.5ZM4 4.5h8v1H4v-1Zm0 3h8v1H4v-1Zm0 3h8v1H4v-1Z"></path></svg> Download ZIP
                  </button>
                </div>
              </div>
            )}

            <Link href="/memory" className="bg-[#238636] text-white border border-[#2ea043] rounded-md px-3 py-1 text-sm font-medium hover:bg-[#2ea043] transition-colors flex items-center gap-1.5 ml-2">
              <Search className="w-4 h-4" /> Memory Bank
            </Link>
          </div>
        </div>
        
        {/* Status Line */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#30363d] text-sm text-gray-400">
          {isMerged ? (
            <span className="bg-[#8957e5] text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 leading-none">
              <GitMerge className="w-4 h-4" /> Merged
            </span>
          ) : (
            <span className="bg-[#238636] text-white px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 leading-none">
              <GitPullRequest className="w-4 h-4" /> Open
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="font-semibold text-gray-200">dev-carlos</span> wants to merge 1 commit into 
            <code className="bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d] text-blue-400 mx-0.5 font-mono text-xs cursor-pointer hover:underline">main</code> 
            from <code className="bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d] text-blue-400 mx-0.5 font-mono text-xs cursor-pointer hover:underline">feature/token-cache</code>
          </span>
        </div>

        {/* PR Tabs */}
        <div className="flex gap-6 border-b border-[#30363d] mb-6">
          <div 
            onClick={() => setActiveTab('conversation')}
            className={`flex items-center gap-2 pb-2 border-b-2 cursor-pointer transition-colors ${activeTab === 'conversation' ? 'border-[#f78166] text-gray-100 font-semibold' : 'border-transparent hover:border-gray-500 text-gray-400'}`}
          >
            <MessageSquare className="w-4 h-4" /> Conversation <span className="bg-[#161b22] text-xs px-2 py-0.5 rounded-full border border-[#30363d]">{conflicts ? conflicts.length : 0}</span>
          </div>
          <div 
            onClick={() => setActiveTab('commits')}
            className={`flex items-center gap-2 pb-2 border-b-2 cursor-pointer transition-colors ${activeTab === 'commits' ? 'border-[#f78166] text-gray-100 font-semibold' : 'border-transparent hover:border-gray-500 text-gray-400'}`}
          >
            <GitCommit className="w-4 h-4" /> Commits <span className="bg-[#161b22] text-xs px-2 py-0.5 rounded-full border border-[#30363d]">3</span>
          </div>
          <div 
            onClick={() => setActiveTab('checks')}
            className={`flex items-center gap-2 pb-2 border-b-2 cursor-pointer transition-colors ${activeTab === 'checks' ? 'border-[#f78166] text-gray-100 font-semibold' : 'border-transparent hover:border-gray-500 text-gray-400'}`}
          >
            <CheckSquare className="w-4 h-4" /> Checks <span className="bg-[#161b22] text-xs px-2 py-0.5 rounded-full border border-[#30363d]">3</span>
          </div>
          <div 
            onClick={() => setActiveTab('files')}
            className={`flex items-center gap-2 pb-2 border-b-2 cursor-pointer transition-colors ${activeTab === 'files' ? 'border-[#f78166] text-gray-100 font-semibold' : 'border-transparent hover:border-gray-500 text-gray-400'}`}
          >
            <FileCode className="w-4 h-4" /> Files changed <span className="bg-[#161b22] text-xs px-2 py-0.5 rounded-full border border-[#30363d]">2</span>
          </div>
        </div>

        {activeTab !== 'conversation' ? (
          <div className="w-full">
            {activeTab === 'commits' && (
              <div className="border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117]">
                <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-3 text-sm text-gray-300 font-semibold">
                  Commits on May 03, 2026
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-[#161b22]/50 transition-colors border-b border-[#30363d]">
                  <div className="flex items-center gap-3">
                    <img src="https://github.com/identicons/dev-carlos.png" alt="author" className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="text-gray-200 font-semibold text-sm hover:text-blue-400 hover:underline">Initial setup for token caching logic</div>
                      <div className="text-gray-500 text-xs mt-0.5">dev-carlos committed 5 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-blue-400 font-mono text-xs hover:underline">8f92b41</code>
                    <button className="border border-[#30363d] rounded bg-[#21262d] px-2 py-1 text-gray-300 hover:bg-[#30363d] transition-colors"><Code className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-[#161b22]/50 transition-colors border-b border-[#30363d]">
                  <div className="flex items-center gap-3">
                    <img src="https://github.com/identicons/dev-carlos.png" alt="author" className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="text-gray-200 font-semibold text-sm hover:text-blue-400 hover:underline">Update auth validation to check cache first</div>
                      <div className="text-gray-500 text-xs mt-0.5">dev-carlos committed 3 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-blue-400 font-mono text-xs hover:underline">c7d8e9f</code>
                    <button className="border border-[#30363d] rounded bg-[#21262d] px-2 py-1 text-gray-300 hover:bg-[#30363d] transition-colors"><Code className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-[#161b22]/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src="https://github.com/identicons/dev-carlos.png" alt="author" className="w-6 h-6 rounded-full" />
                    <div>
                      <div className="text-gray-200 font-semibold text-sm hover:text-blue-400 hover:underline">Add in-memory token cache for performance</div>
                      <div className="text-gray-500 text-xs mt-0.5">dev-carlos committed 2 hours ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-green-400 flex items-center gap-1 text-xs">
                      <Check className="w-3 h-3" />
                    </div>
                    <code className="text-blue-400 font-mono text-xs hover:underline">a1b2c3d</code>
                    <button className="border border-[#30363d] rounded bg-[#21262d] px-2 py-1 text-gray-300 hover:bg-[#30363d] transition-colors"><Code className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'checks' && (
              <div className="border border-[#30363d] rounded-md overflow-hidden bg-[#0d1117] flex">
                <div className="w-[250px] border-r border-[#30363d] bg-[#161b22] hidden md:block">
                  <div className="p-3 border-b border-[#30363d] font-semibold text-gray-300 text-sm flex items-center justify-between">
                    Checks <span className="text-gray-500 font-normal">3</span>
                  </div>
                  <div className="p-3 bg-[#0d1117] flex items-center gap-2 cursor-pointer border-l-2 border-green-500">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <div className="text-sm text-gray-200 font-medium">build (ubuntu-latest)</div>
                  </div>
                  <div className="p-3 bg-[#161b22] hover:bg-[#21262d] flex items-center gap-2 cursor-pointer border-l-2 border-transparent">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <div className="text-sm text-gray-400 font-medium">test (ubuntu-latest)</div>
                  </div>
                  <div className="p-3 bg-[#161b22] hover:bg-[#21262d] flex items-center gap-2 cursor-pointer border-l-2 border-transparent">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-green-500" />
                    </div>
                    <div className="text-sm text-gray-400 font-medium">lint (eslint)</div>
                  </div>
                </div>
                <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">All checks have passed</h2>
                  <p className="text-gray-400 text-sm mb-6">3 successful checks</p>
                  <button className="text-blue-400 hover:underline text-sm font-medium">Show all checks</button>
                </div>
              </div>
            )}

            {activeTab === 'files' && (
              <div className="text-left w-full">
                <PRDiff />
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 relative">
            <div className="absolute left-5 top-12 bottom-[400px] w-[2px] bg-[#30363d] -z-10 hidden lg:block"></div>
            
            <div className="flex-1 max-w-[850px]">
              
              {/* Initial PR Description */}
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-[#161b22] border border-[#30363d] overflow-hidden flex-shrink-0 z-10">
                  <img src="https://github.com/identicons/dev-carlos.png" alt="author" className="w-full h-full" />
                </div>
                <div className="flex-1 border border-[#30363d] rounded-md bg-[#0d1117] shadow-sm">
                  <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-2 text-sm text-gray-400 flex items-center rounded-t-md before:absolute before:left-[45px] before:top-4 before:border-[8px] before:border-transparent before:border-r-[#30363d] after:absolute after:left-[47px] after:top-[17px] after:border-[7px] after:border-transparent after:border-r-[#161b22]">
                    <span className="font-semibold text-gray-200 mr-1">dev-carlos</span> commented 5 hours ago
                  </div>
                  <div className="p-4 text-sm text-gray-300">
                    <p className="mb-4">This PR introduces in-memory caching for auth tokens to speed up validation on high-throughput endpoints. It reduces DB calls significantly.</p>
                    <PRDiff />
                  </div>
                </div>
              </div>

              {/* Realistic Timeline Events */}
              <div className="pl-14 mb-8 relative">
                
                {/* Commits Event */}
                <div className="flex items-start gap-4 mb-6 relative">
                  <div className="absolute left-[-37px] w-8 h-8 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center z-10">
                    <GitCommit className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-sm text-gray-300 w-full pt-1">
                    <span className="font-semibold text-gray-200">dev-carlos</span> added 3 commits <span className="text-gray-500">4 hours ago</span>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-3 text-xs hover:bg-[#161b22] p-1.5 rounded-md transition-colors">
                         <img src="https://github.com/identicons/dev-carlos.png" className="w-5 h-5 rounded-full border border-[#30363d]"/>
                         <span className="text-gray-300 font-medium">Initial setup for token caching logic</span>
                         <code className="text-blue-400 font-mono ml-auto hover:underline cursor-pointer">8f92b41</code>
                      </div>
                      <div className="flex items-center gap-3 text-xs hover:bg-[#161b22] p-1.5 rounded-md transition-colors">
                         <img src="https://github.com/identicons/dev-carlos.png" className="w-5 h-5 rounded-full border border-[#30363d]"/>
                         <span className="text-gray-300 font-medium">Update auth validation to check cache first</span>
                         <code className="text-blue-400 font-mono ml-auto hover:underline cursor-pointer">c7d8e9f</code>
                      </div>
                      <div className="flex items-center gap-3 text-xs hover:bg-[#161b22] p-1.5 rounded-md transition-colors">
                         <img src="https://github.com/identicons/dev-carlos.png" className="w-5 h-5 rounded-full border border-[#30363d]"/>
                         <span className="text-gray-300 font-medium">Add in-memory token cache for performance</span>
                         <code className="text-blue-400 font-mono ml-auto hover:underline cursor-pointer">a1b2c3d</code>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* CI/CD Event */}
                <div className="flex items-start gap-4 relative">
                  <div className="absolute left-[-37px] w-8 h-8 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center z-10">
                    <CheckSquare className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-sm text-gray-300 w-full pt-1">
                    <span className="font-semibold text-gray-200">github-actions</span><span className="text-gray-500 border border-[#30363d] rounded-full px-1.5 py-0.5 text-[10px] mx-1">bot</span> passing <span className="text-gray-500">2 hours ago</span>
                    <div className="mt-3 bg-[#0d1117] border border-[#30363d] rounded-md p-3 text-xs w-full max-w-lg">
                       <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#30363d]">
                          <div className="font-semibold text-gray-200">All checks have passed</div>
                          <span className="text-blue-400 cursor-pointer hover:underline font-medium">Show all checks</span>
                       </div>
                       <div className="flex items-center gap-2 text-gray-400">
                          <Check className="w-4 h-4 text-green-500" /> 3 successful checks
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analyze Trigger (MR Ghost Simulation) */}
              <div className="pl-14 mb-8">
                <div className="flex items-center gap-4 relative">
                  <div className="absolute left-[-37px] w-8 h-8 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center z-10">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a371f7]"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  </div>
                  <button 
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className={`bg-[#21262d] border border-[#30363d] hover:border-[#8b949e] hover:bg-[#30363d] text-gray-200 px-4 py-1.5 rounded-md flex items-center gap-2 transition-all font-medium disabled:opacity-80 text-sm shadow-sm ${analyzing ? 'border-[#a371f7]/50 shadow-[0_0_10px_rgba(163,113,247,0.2)]' : ''}`}
                  >
                    {analyzing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#a371f7] border-t-transparent rounded-full animate-spin"></div> 
                        <span className="text-[#a371f7] font-semibold tracking-wide">{analyzingStep}</span>
                      </>
                    ) : (
                      <>Run MR-GOST Analysis</>
                    )}
                  </button>
                  <span className="text-gray-500 text-xs">Simulates the webhook trigger on PR open</span>
                </div>
              </div>

              {conflicts !== null && (
                <div className="mb-8">
                  <GhostComment conflicts={conflicts} />
                </div>
              )}

              {/* Merge Box */}
              <div className="pl-14 mb-8">
                <div className="border border-[#30363d] rounded-md bg-[#0d1117] shadow-sm">
                  {isMerged ? (
                    <div className="p-4 flex items-start gap-3 bg-[#8957e5]/10 border-b border-[#30363d] rounded-t-md">
                      <div className="bg-[#8957e5] p-1.5 rounded-full mt-0.5">
                        <GitMerge className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#8957e5] text-base">Pull request successfully merged and closed</h3>
                        <p className="text-gray-400 text-sm mt-1">You're all set—the <code className="bg-[#161b22] px-1.5 py-0.5 rounded border border-[#30363d] text-blue-400 text-xs">feature/token-cache</code> branch can be safely deleted.</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="p-4 flex items-start gap-3 bg-[#161b22] border-b border-[#30363d] rounded-t-md">
                        <div className="bg-[#238636] p-1.5 rounded-full mt-0.5">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-200 text-base">This branch has no conflicts with the base branch</h3>
                          <p className="text-gray-400 text-sm">Merging can be performed automatically.</p>
                        </div>
                      </div>
                      <div className="p-4 bg-[#0d1117] rounded-b-md">
                        <div className="flex gap-2">
                          <button onClick={handleMerge} className="bg-[#238636] hover:bg-[#2ea043] border border-[#2ea043] text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors">
                            Merge pull request
                          </button>
                          <button className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-gray-200 px-2 py-1.5 rounded-md text-sm transition-colors">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Ask Bob inline chat box */}
              <div className="pl-14">
                <AskGhost />
              </div>

            </div>
            
            {/* GitHub Sidebar */}
            <div className="w-full lg:w-[280px] text-sm">
              <div className="border-b border-[#30363d] pb-4 mb-4">
                <div className="group flex justify-between items-center mb-2 font-semibold text-gray-400 text-xs cursor-pointer">
                  <span className="hover:text-blue-400 transition-colors">Reviewers</span>
                  <Settings className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-all" />
                </div>
                <div className="flex items-center gap-2 text-gray-300 mt-3">
                  <div className="w-6 h-6 rounded-full bg-[#161b22] border border-[#30363d] flex items-center justify-center overflow-hidden">
                     <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
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
                  <span className="font-semibold">MR-GOST AGENT</span>
                  {conflicts === null ? (
                    <span className="ml-auto text-gray-500">Pending</span>
                  ) : conflicts.length === 0 ? (
                    <span className="ml-auto text-green-400 flex items-center gap-1"><Check className="w-3 h-3"/> Approved</span>
                  ) : (
                    <span className="ml-auto text-[#f85149] font-semibold">Changes requested</span>
                  )}
                </div>
              </div>
              
              <div className="border-b border-[#30363d] pb-4 mb-4">
                <div className="group flex justify-between items-center mb-2 font-semibold text-gray-400 text-xs cursor-pointer">
                  <span className="hover:text-blue-400 transition-colors">Assignees</span>
                  <Settings className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-all" />
                </div>
                <div className="flex flex-col gap-3 mt-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <img src="https://github.com/identicons/dev-carlos.png" alt="assignee" className="w-6 h-6 rounded-full border border-[#30363d]" />
                    <span>dev-carlos</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <img src="https://github.com/identicons/alice.png" alt="assignee" className="w-6 h-6 rounded-full border border-[#30363d]" />
                    <span>alice-sec</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <img src="https://github.com/identicons/sarah.png" alt="assignee" className="w-6 h-6 rounded-full border border-[#30363d]" />
                    <span>sarah-lead</span>
                  </div>
                </div>
              </div>
              
              <div className="border-b border-[#30363d] pb-4 mb-4 text-gray-500">
                <div className="group flex justify-between items-center mb-2 font-semibold text-gray-400 text-xs cursor-pointer">
                  <span className="hover:text-blue-400 transition-colors">Labels</span>
                  <Settings className="w-3.5 h-3.5 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-blue-400 transition-all" />
                </div>
                <div className="mt-3 text-sm">None yet</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Code Modal (Full Screen GitHub File View) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#0d1117] z-[100] flex flex-col overflow-hidden text-sm animate-in fade-in duration-200">
          
          {/* Top Header */}
          <div className="bg-[#010409] border-b border-[#30363d] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white transition-colors bg-[#21262d] border border-[#30363d] p-1.5 rounded-md">
                 <XCircle className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-[#21262d] border border-[#30363d] rounded-md px-3 py-1.5 flex items-center gap-2 text-gray-300 font-medium text-xs cursor-pointer hover:bg-[#30363d] transition-colors">
                  <GitCommit className="w-3.5 h-3.5" /> feature/token-cache <ChevronDown className="w-3.5 h-3.5" />
                </div>
                <div className="text-gray-200 text-sm font-semibold">
                  MR-GHOST <span className="text-gray-500 mx-1 font-normal">/</span> auth <span className="text-gray-500 mx-1 font-normal">/</span> token.py
                </div>
              </div>
            </div>
            <div className="flex gap-2">
               <div className="flex items-center bg-[#0d1117] border border-[#30363d] rounded-md px-2 py-1 w-[250px] text-gray-400">
                  <Search className="w-4 h-4 mr-2" />
                  <input type="text" placeholder="Go to file" className="bg-transparent border-none outline-none w-full text-xs text-gray-200" />
                  <div className="border border-[#30363d] rounded px-1 text-[10px] ml-2">T</div>
               </div>
            </div>
          </div>

          {/* Commit Info */}
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="https://github.com/identicons/dev-carlos.png" className="w-6 h-6 rounded-full border border-[#30363d]" />
              <span className="font-semibold text-gray-200">dev-carlos</span>
              <span className="text-gray-400">Add in-memory token cache for performance</span>
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <span className="font-mono text-blue-400 hover:underline cursor-pointer">8f92b41</span>
              <span>2 hours ago</span>
              <span className="flex items-center gap-1 hover:text-blue-400 cursor-pointer font-medium"><History className="w-4 h-4" /> History</span>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden px-6 pb-6 gap-6">
            
            {/* Main Code Area */}
            <div className="flex-1 border border-[#30363d] rounded-md bg-[#0d1117] flex flex-col overflow-hidden shadow-sm">
              {/* Toolbar */}
              <div className="bg-[#0d1117] border-b border-[#30363d] p-2 flex items-center justify-between rounded-t-md">
                <div className="flex items-center gap-4 pl-2">
                  <div className="flex rounded-md overflow-hidden border border-[#30363d]">
                    <button className="bg-[#21262d] text-gray-200 px-3 py-1 font-medium text-xs">Code</button>
                    <button className="text-gray-400 hover:text-gray-200 px-3 py-1 font-medium text-xs border-l border-[#30363d] hover:bg-[#21262d]">Blame</button>
                  </div>
                  <span className="text-gray-500 text-xs">14 lines (12 loc) · 324 Bytes</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex rounded-md overflow-hidden border border-[#30363d]">
                    <button className="text-gray-400 hover:text-gray-200 px-3 py-1 font-medium text-xs hover:bg-[#21262d]">Raw</button>
                    <button className="text-gray-400 hover:text-gray-200 px-3 py-1 font-medium text-xs border-l border-[#30363d] hover:bg-[#21262d]"><Copy className="w-3.5 h-3.5" /></button>
                    <button className="text-gray-400 hover:text-gray-200 px-3 py-1 font-medium text-xs border-l border-[#30363d] hover:bg-[#21262d]"><FileCode className="w-3.5 h-3.5" /></button>
                  </div>
                  <button className="bg-[#21262d] border border-[#30363d] rounded-md px-2 py-1 text-gray-300 hover:bg-[#30363d] transition-colors"><Settings className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              
              {/* Editor wrapper with line numbers */}
              <div className="flex-1 flex overflow-auto bg-[#0d1117]">
                <div className="w-14 flex-shrink-0 border-r border-[#30363d] text-right pr-4 pt-4 text-xs text-gray-500 font-mono leading-6 select-none bg-[#0d1117]">
                  {editContent.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
                </div>
                <textarea 
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 bg-[#0d1117] text-gray-300 font-mono text-[13px] p-4 leading-6 outline-none resize-none"
                  spellCheck={false}
                />
              </div>
              
              <div className="p-3 border-t border-[#30363d] bg-[#161b22] flex justify-between items-center">
                 <span className="text-xs text-gray-500 flex items-center gap-2"><GitCommit className="w-4 h-4"/> Committing directly to feature/token-cache</span>
                 <button onClick={() => {toast.success("Changes committed directly to feature/token-cache"); setIsEditModalOpen(false);}} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#238636] hover:bg-[#2ea043] rounded-md border border-[#2ea043] transition-colors shadow-sm">Commit changes...</button>
              </div>
            </div>

            {/* Right Sidebar - Symbols */}
            <div className="w-[300px] border border-[#30363d] rounded-md bg-[#0d1117] flex-col overflow-hidden shadow-sm hidden xl:flex">
              <div className="bg-[#161b22] border-b border-[#30363d] p-3 flex justify-between items-center rounded-t-md">
                <span className="font-semibold text-gray-200 text-sm">Symbols</span>
                <button className="text-gray-500 hover:text-gray-300"><XCircle className="w-4 h-4" /></button>
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  Find definitions and references for functions and other symbols in this file by clicking a symbol below or in the code.
                </p>
                <div className="flex items-center bg-[#010409] border border-[#30363d] rounded-md px-2 py-1.5 mb-4 focus-within:border-blue-500 transition-colors">
                  <Menu className="w-4 h-4 text-gray-500 mr-2" />
                  <input type="text" placeholder="Filter symbols" className="bg-transparent border-none outline-none w-full text-xs text-gray-300" />
                  <div className="border border-[#30363d] rounded px-1 text-[10px] text-gray-500">R</div>
                </div>
                <div className="flex flex-col gap-4 mt-2">
                  <div className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 cursor-pointer transition-colors">
                    <span className="text-[#a371f7] text-xs font-mono">func</span> get_auth_token
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-300 hover:text-blue-400 cursor-pointer transition-colors">
                    <span className="text-blue-400 text-xs font-mono">var</span> token_cache
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
