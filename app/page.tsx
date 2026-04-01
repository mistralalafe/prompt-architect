"use client";
import { useState } from 'react';
import { Sparkles, Copy, Check, Terminal } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ userRequest: input }),
    });
    const data = await res.json();
    setOutput(data.refinedPrompt);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4">
      <div className="max-w-3xl w-full space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
            Prompt <span className="text-blue-600">Architect</span>
          </h1>
          <p className="text-slate-500 text-lg">Turn your "meh" ideas into "wow" AI results in seconds.</p>
        </div>

        {/* Input Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
          <textarea
            className="w-full h-32 p-4 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-800 resize-none"
            placeholder="Describe what you want to achieve (e.g., 'Write a diet plan for a runner')..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !input}
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? "Architecting..." : <><Sparkles size={20} /> Generate Master Prompt</>}
          </button>
        </div>

        {/* Output Section */}
        {output && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-900 rounded-2xl p-6 relative group">
            <div className="flex items-center gap-2 text-blue-400 mb-4">
              <Terminal size={18} />
              <span className="text-xs font-mono uppercase tracking-widest">Optimized Prompt</span>
            </div>
            <p className="text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{output}</p>
            <button 
              onClick={copyToClipboard}
              className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
            >
              {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}