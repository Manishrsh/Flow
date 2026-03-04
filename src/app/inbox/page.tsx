"use client";

import React, { useState } from "react";
import {
  Search, Filter, MessageSquare, Instagram, Youtube, Phone,
  MoreVertical, Check, CheckCircle2, Paperclip, Smile, Send,
  UserCircle2, Clock, Tag, ChevronDown, Video, PhoneCall
} from "lucide-react";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChat, setSelectedChat] = useState("chat1");

  // Mock Data
  const chats = [
    { id: "chat1", name: "Alice Johnson", platform: "whatsapp", lastMessage: "Yes, I need help with my order.", time: "10:42 AM", unread: 2, avatar: "AJ", online: true },
    { id: "chat2", name: "Bob Smith", platform: "instagram", lastMessage: "How much is the premium plan?", time: "09:15 AM", unread: 0, avatar: "BS", online: false },
    { id: "chat3", name: "Tech Support Channel", platform: "youtube", lastMessage: "Thanks for the tutorial!", time: "Yesterday", unread: 0, avatar: "TS", online: false },
    { id: "chat4", name: "Maria Garcia", platform: "whatsapp", lastMessage: "Can we schedule a demo?", time: "Yesterday", unread: 1, avatar: "MG", online: true },
  ];

  const messages = [
    { id: 1, sender: "Alice Johnson", text: "Hi, I recently placed an order.", time: "10:30 AM", isMine: false },
    { id: 2, sender: "Agent", text: "Hello Alice! I'd be happy to help. Can you provide your order ID?", time: "10:32 AM", isMine: true },
    { id: 3, sender: "Alice Johnson", text: "It is #ORD-99321", time: "10:35 AM", isMine: false },
    { id: 4, sender: "Alice Johnson", text: "Yes, I need help with my order.", time: "10:42 AM", isMine: false },
  ];

  const renderPlatformIcon = (platform: string) => {
    switch (platform) {
      case "whatsapp": return <MessageSquare className="w-4 h-4 text-green-500" />;
      case "instagram": return <Instagram className="w-4 h-4 text-pink-500" />;
      case "youtube": return <Youtube className="w-4 h-4 text-red-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-100 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm m-6">

      {/* 1. Sidebar - Chat List */}
      <div className="w-80 flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">

        {/* Header */}
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold tracking-tight">Inbox</h1>
            <button className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <Filter className="w-5 h-5 text-zinc-500" />
            </button>
          </div>

          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat.id)}
            className={`flex items-start gap-3 p-4 border-b border-zinc-100 dark:border-zinc-800/50 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors ${
              selectedChat === chat.id ? "bg-blue-50/50 dark:bg-zinc-800" : ""
            }`}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium shadow-inner">
                {chat.avatar}
              </div>
              {chat.online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-semibold truncate">{chat.name}</h3>
                <span className="text-xs text-zinc-500 whitespace-nowrap">{chat.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {renderPlatformIcon(chat.platform)}
                <p className={`text-xs truncate ${chat.unread > 0 ? "font-medium text-zinc-900 dark:text-zinc-100" : "text-zinc-500"}`}>
                  {chat.lastMessage}
                </p>
              </div>
            </div>

            {chat.unread > 0 && (
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shadow-sm mt-1">
                {chat.unread}
              </div>
            )}
          </div>
        ))}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#EFEAE2] dark:bg-zinc-950 relative">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-10 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium shadow-inner">
              AJ
            </div>
            <div>
              <h2 className="text-sm font-bold flex items-center gap-2">
                Alice Johnson
                <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">Online</span>
              </h2>
              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                <MessageSquare className="w-3 h-3" /> via WhatsApp Business
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <PhoneCall className="w-5 h-5" />
            </button>
            <button className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <Video className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800 mx-1"></div>
            <button className="p-2 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
    <div className="flex justify-center mb-6">
      <span className="text-[11px] font-medium bg-white/80 dark:bg-zinc-800/80 text-zinc-500 px-3 py-1 rounded-full shadow-sm">
        Today
      </span>
    </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
            <div 
              className={`max-w-[70%] rounded-2xl p-3 shadow-sm relative ${
                msg.isMine 
                  ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-50 rounded-tr-sm" 
                  : "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-tl-sm"
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex justify-end items-center gap-1 mt-1 ${msg.isMine ? "text-emerald-700/70 dark:text-emerald-200/50" : "text-zinc-400"}`}>
                <span className="text-[10px]">{msg.time}</span>
                {msg.isMine && <CheckCircle2 className="w-3 h-3" />}
              </div>
            </div>
          </div>
        ))}

        {/* Input Area */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 z-10">
          <div className="flex items-end gap-2 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2 shadow-sm relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-shadow">
            <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full transition-colors mb-0.5">
              <Smile className="w-5 h-5" />
            </button>
            <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full transition-colors mb-0.5">
              <Paperclip className="w-5 h-5" />
            </button>
            <textarea 
              rows={1}
              placeholder="Type a message..."
              className="flex-1 max-h-32 bg-transparent text-sm resize-none py-3 focus:outline-none placeholder:text-zinc-400"
            />
            <button className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors mb-0.5 shadow-sm flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between mt-2 px-2">
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Press Enter to send, Shift + Enter for new line
            </p>
            <button className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Use Template (/)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Right Sidebar - Contact Info */}
      <div className="w-72 bg-white dark:bg-zinc-900 border-l border-zinc-200 dark:border-zinc-800 flex flex-col overflow-y-auto">
        
        {/* Profile Card */}
        <div className="p-6 flex flex-col items-center border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-3xl text-white font-medium shadow-lg mb-4 ring-4 ring-white dark:ring-zinc-900">
            AJ
          </div>
          <h2 className="text-lg font-bold">Alice Johnson</h2>
          <p className="text-sm text-zinc-500 mb-4">+1 (555) 123-4567</p>
          
          <div className="flex gap-2 w-full">
            <button className="flex-1 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium rounded-md transition-colors flex justify-center items-center gap-2">
              <UserCircle2 className="w-4 h-4" /> Profile
            </button>
            <button className="flex-1 py-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium rounded-md transition-colors flex justify-center items-center gap-2">
              <Tag className="w-4 h-4" /> Label
            </button>
          </div>
        </div>

        {/* Details Accordion */}
        <div className="p-4 flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">
              About Contact
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Email</span>
                <span className="font-medium text-right">alice@example.com</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Company</span>
                <span className="font-medium text-right">Acme Corp</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Local Time</span>
                <span className="font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-400" /> 10:42 AM
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">
              Tags
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2.5 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500 text-xs rounded-full font-medium border border-amber-200 dark:border-amber-900/50">VIP</span>
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500 text-xs rounded-full font-medium border border-blue-200 dark:border-blue-900/50">Support</span>
              <button className="px-2.5 py-1 border border-dashed border-zinc-300 dark:border-zinc-700 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-xs rounded-full font-medium flex items-center gap-1 transition-colors">
                + Add Tag
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-zinc-500 text-xs font-bold uppercase tracking-wider mb-3">
              Recent Orders
            </div>
            <div className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors cursor-pointer">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#ORD-99321</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded">Paid</span>
              </div>
              <p className="text-xs text-zinc-500 mb-2">Premium Tech Setup</p>
              <div className="flex justify-between items-center text-sm font-medium">
                <span>$299.00</span>
                <span className="text-xs text-zinc-500 font-normal">Oct 24, 2023</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
