'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Link from 'next/link';
import { MessageSquare, Users, GitBranch, Settings, Search, Phone, Video, MoreVertical, Send, Mic, Paperclip } from 'lucide-react';
export default function Home() {
  const [messages, setMessages] = useState<any[]>([
    { id: '1', text: 'Hey there! How can I help with your order today?', sender: 'agent', time: '10:45 AM' },
    { id: '2', text: 'I need to check the status of order #9021', sender: 'user', time: '10:48 AM', contact: 'John Doe' },
  ]);
  const [inputText, setInputText] = useState('');
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to our local dev backend
    const socket = io('http://localhost:4000');

    socket.on('connect', () => {
      setConnected(true);
    });

    socket.on('disconnect', () => {
      setConnected(false);
    });

    socket.on('new_message', (data) => {
      let isSystemBot = data.source === 'system_bot';
      let msgText = '';

      if (typeof data.payload === 'object') {
        msgText = data.payload.text || JSON.stringify(data.payload);
      } else {
        msgText = data.payload;
      }

      const parsedMessage = {
        id: Math.random().toString(),
        text: msgText,
        sender: isSystemBot ? 'agent' : 'user',
        time: new Date().toLocaleTimeString([], { timeStyle: 'short' }),
        contact: isSystemBot ? (data.payload.botName || 'Automated Bot') : (data.payload.customerName || data.source),
        platform: data.source || 'meta'
      };
      setMessages(prev => [...prev, parsedMessage]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: Math.random().toString(),
      text: inputText,
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { timeStyle: 'short' })
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  return (
    <div className="flex h-screen w-full bg-[#0a0a0b] text-white font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-20 border-r border-gray-800 bg-[#121214] flex flex-col items-center py-6 gap-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          C
        </div>
        <nav className="flex flex-col gap-6 text-gray-500">
          <Link href="/" className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-colors border border-indigo-500/20 shadow-inner flex flex-col items-center">
            <MessageSquare size={24} />
          </Link>
          <button className="p-3 hover:text-white transition-colors">
            <Users size={24} />
          </button>
          <Link href="/bots" className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-colors border border-indigo-500/20 shadow-inner flex flex-col items-center">
            <GitBranch size={24} />
          </Link>
          <Link href="/settings/integrations" className="p-3 hover:text-white transition-colors mt-auto flex-1 flex flex-col justify-end items-center">
            <Settings size={24} />
          </Link>
        </nav>
      </div>

      {/* Inbox List */}
      <div className="w-80 border-r border-gray-800 bg-[#121214] flex flex-col z-20 shadow-2xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold tracking-tight">Inbox</h1>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'}`} />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-[#1c1c1f] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder-gray-600 shadow-inner"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hidden-scrollbar">
          {/* Active Chat Item */}
          <div className="p-4 border-l-2 border-indigo-500 bg-gray-800/20 cursor-pointer transition-colors relative">
            <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-indigo-500/5 to-transparent pointer-events-none"></div>
            <div className="flex justify-between items-start mb-1 relative z-10">
              <span className="font-medium text-gray-100">John Doe</span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">10:48 AM</span>
            </div>
            <div className="text-sm text-gray-400 truncate relative z-10">
              I need to check the status...
            </div>
            <div className="mt-2 flex gap-2 relative z-10">
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-semibold tracking-wider uppercase border border-green-500/20">WhatsApp</span>
            </div>
          </div>

          {/* Dummy Chat Items */}
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4 border-l-2 border-transparent cursor-pointer hover:bg-gray-800/30 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-gray-400 group-hover:text-gray-200 transition-colors">Jane Smith {i}</span>
                <span className="text-xs text-gray-600 font-medium">Yesterday</span>
              </div>
              <div className="text-sm text-gray-500 truncate">
                Can I get a refund for my order?
              </div>
              <div className="mt-2 flex gap-2">
                <span className="px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-[10px] font-semibold tracking-wider uppercase border border-pink-500/20">Instagram</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 flex flex-col bg-[#0a0a0b] relative w-full overflow-hidden">
        {/* Subtle background pattern for premium feel */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0a0a0b] to-[#0a0a0b] pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none mix-blend-screen opacity-50"></div>

        {/* Chat Header */}
        <div className="px-8 py-5 border-b border-gray-800/50 bg-[#0a0a0b]/60 backdrop-blur-xl flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 flex items-center justify-center text-gray-300 font-bold text-lg border border-gray-600 shadow-lg">
                JD
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#0a0a0b]"></div>
            </div>
            <div>
              <h2 className="font-bold text-lg text-gray-100 tracking-tight">John Doe</h2>
              <p className="text-xs text-gray-400 font-medium">
                Customer since 2023 • LTV: $450
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-gray-400">
            <button className="p-2.5 hover:bg-gray-800/80 hover:text-gray-200 rounded-xl transition-all shadow-sm"><Phone size={18} /></button>
            <button className="p-2.5 hover:bg-gray-800/80 hover:text-gray-200 rounded-xl transition-all shadow-sm"><Video size={18} /></button>
            <button className="p-2.5 hover:bg-gray-800/80 hover:text-gray-200 rounded-xl transition-all shadow-sm"><MoreVertical size={18} /></button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 z-10 scroll-smooth">
          <div className="text-center my-6 relative flex items-center justify-center">
            <div className="border-t border-gray-800/50 absolute w-full"></div>
            <span className="bg-[#0a0a0b] px-4 text-xs font-semibold uppercase tracking-wider text-gray-600 relative z-10">Today</span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`max-w-[75%] rounded-2xl p-4 shadow-xl backdrop-blur-md relative group ${msg.sender === 'agent'
                ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-sm border border-indigo-400/20'
                : 'bg-[#1c1c1f]/80 text-gray-200 rounded-tl-sm border border-gray-700/50'
                }`}>
                {msg.sender === 'agent' && msg.contact && (
                  <div className="text-xs font-bold text-indigo-200 mb-1.5 flex items-center gap-2">
                    ⚡ {msg.contact}
                  </div>
                )}
                {msg.sender === 'user' && (
                  <div className="text-xs font-bold text-gray-400 mb-1.5 flex items-center gap-2">
                    {msg.contact || 'User'}
                    <span className={`text-[10px] font-normal px-1.5 rounded text-white ${msg.platform === 'instagram' ? 'bg-gradient-to-r from-pink-500 to-orange-400' :
                        msg.platform === 'youtube' ? 'bg-red-600' :
                          'bg-green-600'
                      }`}>
                      {msg.platform === 'instagram' ? 'Instagram' : msg.platform === 'youtube' ? 'YouTube' : 'WhatsApp'}
                    </span>
                  </div>
                )}
                <div className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                  {msg.text}
                </div>
                <div className={`text-[10px] mt-2 font-medium tracking-wide ${msg.sender === 'agent' ? 'text-indigo-200/80' : 'text-gray-500'} flex justify-end opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5 right-0`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-[#0a0a0b]/80 backdrop-blur-xl z-20 border-t border-gray-800/50">
          <div className="bg-[#1c1c1f] border border-gray-700/50 rounded-2xl flex items-center pr-2 pl-4 py-2 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-transparent transition-all shadow-2xl">
            <button className="text-gray-500 hover:text-indigo-400 p-2 transition-colors">
              <Paperclip size={20} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type your reply to John Doe..."
              className="flex-1 bg-transparent border-none focus:outline-none px-4 text-[15px] text-gray-100 placeholder-gray-500"
            />
            <button className="text-gray-500 hover:text-indigo-400 p-2 transition-colors mr-2">
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.4)] flex items-center justify-center group"
            >
              <Send size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
          <div className="text-center mt-3 text-[10px] text-gray-600 font-medium tracking-wide">
            Press Enter to send. Use Shift+Enter for a new line.
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .hidden-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hidden-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
