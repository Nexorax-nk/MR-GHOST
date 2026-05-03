import React from 'react';

const diffLines = [
  { type: 'comment', content: '// This is what you paste/show as the "new PR being reviewed"' },
  { type: 'comment', content: '// It violates MEM-001 — same failure, different code' },
  { type: 'empty', content: '' },
  { type: 'add', num: 12, content: 'token_cache = {}' },
  { type: 'add', num: 13, content: '' },
  { type: 'add', num: 14, content: 'def get_auth_token(user_id: str) -> str:' },
  { type: 'add', num: 15, content: '    if user_id in token_cache:' },
  { type: 'add', num: 16, content: '        return token_cache[user_id]' },
  { type: 'add', num: 17, content: '    token = generate_token(user_id)' },
  { type: 'add', num: 18, content: '    token_cache[user_id] = token' },
  { type: 'add', num: 19, content: '    return token' }
];

export function PRDiff() {
  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden text-sm mb-2 shadow-sm font-mono mt-4">
      <div className="bg-[#161b22] px-4 py-2 border-b border-[#30363d] text-gray-300 flex justify-between items-center text-xs">
        <span className="font-semibold text-gray-300">auth/token.py</span>
        <div className="flex gap-2">
          <button className="text-gray-500 hover:text-blue-400 transition-colors">View file</button>
        </div>
      </div>
      <div className="overflow-x-auto text-gray-300 text-xs sm:text-sm">
        <table className="w-full border-collapse">
          <tbody>
            {diffLines.map((line, i) => {
              const isAdd = line.type === 'add';
              const isComment = line.type === 'comment';
              return (
                <tr key={i} className={`${isAdd ? 'bg-[#2ea04326]' : ''}`}>
                  <td className={`w-10 text-right pr-2 select-none border-r border-[#30363d] ${isAdd ? 'text-[#7ee787]' : 'text-gray-500'} ${isAdd ? 'bg-[#2ea0431a]' : ''}`}>
                    {isAdd ? line.num : ''}
                  </td>
                  <td className={`w-6 text-center select-none ${isAdd ? 'text-[#7ee787]' : 'text-transparent'}`}>
                    {isAdd ? '+' : ' '}
                  </td>
                  <td className={`px-2 whitespace-pre ${isAdd ? 'text-[#7ee787]' : ''} ${isComment ? 'text-gray-500 italic' : ''}`}>
                    {line.content}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
