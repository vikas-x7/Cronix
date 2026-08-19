'use client';

import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';

export default function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(String(children));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative group my-4">
      <pre className="bg-neutral-950 border border-neutral-800 rounded-[4px] p-5 overflow-x-auto text-[14px] font-mono text-neutral-300 leading-relaxed">
        {children}
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 border border-neutral-700 bg-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-500 transition opacity-0 group-hover:opacity-100 cursor-pointer"
      >
        {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
      </button>
    </div>
  );
}
