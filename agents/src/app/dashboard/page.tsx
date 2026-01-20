'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface TitleOutput {
  title: string;
  rationale: string;
}

interface TransitionOutput {
  timestamp: string;
  type: string;
  trigger: string;
  overlayText: string;
  source: string | null;
}

interface GeneratedOutputs {
  titles?: TitleOutput[];
  description?: string;
  transitions?: TransitionOutput[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Dashboard() {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // State
  const [transcript, setTranscript] = useState('');
  const [guestName, setGuestName] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [outputs, setOutputs] = useState<GeneratedOutputs>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [usage, setUsage] = useState({ used: 0, limit: 100000 });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch usage on mount
  useEffect(() => {
    fetchUsage();
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage');
      if (res.ok) {
        const data = await res.json();
        setUsage({ used: data.usage, limit: data.limit });
      } else if (res.status === 401) {
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error);
    }
  };

  const handleGenerate = async (type: 'titles' | 'description' | 'transitions' | 'all') => {
    if (!transcript.trim()) {
      addMessage('assistant', 'Please paste a transcript first.');
      return;
    }

    if (type === 'description' && !selectedTitle && !outputs.titles?.length) {
      addMessage('assistant', 'Please generate or select a title first before generating a description.');
      return;
    }

    setLoading(type);
    addMessage('assistant', `Generating ${type}... This may take a moment.`);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          transcript,
          guestName: guestName || undefined,
          title: selectedTitle || outputs.titles?.[0]?.title,
        }),
      });

      if (res.status === 401) {
        router.push('/');
        return;
      }

      if (res.status === 429) {
        addMessage('assistant', 'Daily token limit exceeded. Please try again tomorrow.');
        return;
      }

      const data = await res.json();

      if (data.success) {
        setOutputs((prev) => ({
          ...prev,
          ...data.outputs,
        }));

        // Format output message
        let outputMsg = '';
        if (data.outputs.titles) {
          outputMsg += '**Generated Titles:**\n\n';
          data.outputs.titles.forEach((t: TitleOutput, i: number) => {
            outputMsg += `${i + 1}. **${t.title}**\n   _${t.rationale}_\n\n`;
          });
        }
        if (data.outputs.description) {
          outputMsg += '**Generated Description:**\n\n' + data.outputs.description + '\n\n';
        }
        if (data.outputs.transitions) {
          outputMsg += '**Generated Transitions:**\n\n';
          data.outputs.transitions.forEach((t: TransitionOutput) => {
            outputMsg += `- **${t.timestamp}** [${t.type}]\n  "${t.overlayText}"\n\n`;
          });
        }

        addMessage('assistant', outputMsg || 'Generation complete!');
        fetchUsage();
      } else {
        addMessage('assistant', `Error: ${data.error}`);
      }
    } catch (error) {
      addMessage('assistant', `Error generating content: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    addMessage('user', userMessage);
    setLoading('chat');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          context: {
            transcript,
            previousOutputs: outputs,
            conversationHistory: messages.slice(-10).map((m) => ({
              role: m.role,
              content: m.content,
            })),
          },
        }),
      });

      if (res.status === 401) {
        router.push('/');
        return;
      }

      const data = await res.json();

      if (data.success) {
        addMessage('assistant', data.response);
        fetchUsage();
      } else {
        addMessage('assistant', `Error: ${data.error}`);
      }
    } catch (error) {
      addMessage('assistant', `Error: ${error}`);
    } finally {
      setLoading(null);
    }
  };

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages((prev) => [...prev, { role, content, timestamp: new Date() }]);
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/');
  };

  const usagePercent = Math.round((usage.used / usage.limit) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#333] px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-xl font-bold text-white">
              THE IDEA SANDBOX <span className="text-gray-400 font-normal">Production Suite</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="text-gray-400">Usage: </span>
              <span className={usagePercent > 80 ? 'text-yellow-400' : 'text-green-400'}>
                {usage.used.toLocaleString()}/{(usage.limit / 1000).toFixed(0)}K
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-white text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 flex flex-col gap-6">
        {/* Transcript Input Section */}
        <section className="bg-[#171717] rounded-lg border border-[#333] p-6">
          <h2 className="text-lg font-semibold text-white mb-4">TRANSCRIPT INPUT</h2>

          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Paste your podcast transcript here..."
            className="w-full h-48 px-4 py-3 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-y"
          />

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-400 mb-1">Guest Name (optional)</label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="e.g., Dr. Jane Smith"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            {outputs.titles && outputs.titles.length > 0 && (
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-gray-400 mb-1">Selected Title (for description)</label>
                <select
                  value={selectedTitle}
                  onChange={(e) => setSelectedTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="">Select a title...</option>
                  {outputs.titles.map((t, i) => (
                    <option key={i} value={t.title}>{t.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Generation Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => handleGenerate('titles')}
              disabled={loading !== null}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {loading === 'titles' && <Spinner />}
              Generate Titles
            </button>
            <button
              onClick={() => handleGenerate('description')}
              disabled={loading !== null}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {loading === 'description' && <Spinner />}
              Generate Description
            </button>
            <button
              onClick={() => handleGenerate('transitions')}
              disabled={loading !== null}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {loading === 'transitions' && <Spinner />}
              Generate Transitions
            </button>
            <button
              onClick={() => handleGenerate('all')}
              disabled={loading !== null}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              {loading === 'all' && <Spinner />}
              Generate All
            </button>
          </div>
        </section>

        {/* Chat + Outputs Section */}
        <section className="flex-1 bg-[#171717] rounded-lg border border-[#333] flex flex-col min-h-[400px]">
          <h2 className="text-lg font-semibold text-white p-4 border-b border-[#333]">
            CHAT + OUTPUTS
          </h2>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <p>Paste a transcript and click a generate button to get started.</p>
                <p className="text-sm mt-2">You can then chat to refine the outputs.</p>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#262626] text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    {formatMessage(msg.content)}
                  </div>
                  {msg.role === 'assistant' && msg.content.length > 50 && (
                    <button
                      onClick={() => copyToClipboard(msg.content, `msg-${i}`)}
                      className={`mt-2 text-xs ${
                        copiedId === `msg-${i}` ? 'text-green-400' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {copiedId === `msg-${i}` ? '✓ Copied!' : 'Copy to clipboard'}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading === 'chat' && (
              <div className="flex justify-start">
                <div className="bg-[#262626] rounded-lg px-4 py-3">
                  <Spinner />
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-[#333] p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChat()}
                placeholder="Type message to refine outputs..."
                disabled={loading !== null}
                className="flex-1 px-4 py-2 bg-[#0a0a0a] border border-[#333] rounded-lg text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
              <button
                onClick={handleChat}
                disabled={loading !== null || !chatInput.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-medium rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Helper Components
function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}

function formatMessage(content: string): React.ReactNode {
  // Simple markdown-like formatting
  return content.split('\n').map((line, i) => {
    // Bold text
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>;
      }
      // Italic text
      if (part.startsWith('_') && part.endsWith('_')) {
        return <em key={j} className="text-gray-400">{part.slice(1, -1)}</em>;
      }
      return part;
    });
    return (
      <span key={i}>
        {formatted}
        {i < content.split('\n').length - 1 && <br />}
      </span>
    );
  });
}
