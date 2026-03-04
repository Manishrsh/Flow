'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Bot, Plus, Download, Upload, MessageSquare, Play, Search, PlayCircle, GitBranch, Settings, Users, MoreVertical } from 'lucide-react';

// Mock n8n-style JSON structure for a bot flow
const MOCK_N8N_WORKFLOW = {
    "nodes": [
        {
            "parameters": {
                "event": "messageReceived"
            },
            "name": "WhatsApp Trigger",
            "type": "n8n-nodes-base.webhook",
            "position": [250, 300]
        },
        {
            "parameters": {
                "conditions": {
                    "string": [
                        { "value1": "={{$json.message.text}}", "operation": "contains", "value2": "pricing" }
                    ]
                }
            },
            "name": "IF Keyword",
            "type": "n8n-nodes-base.if",
            "position": [500, 300]
        },
        {
            "parameters": {
                "phoneNumberId": "={{$json.phoneNumberId}}",
                "text": "Our pricing starts at $99/mo. Would you like a link?"
            },
            "name": "Send WhatsApp",
            "type": "n8n-nodes-base.whatsapp",
            "position": [800, 200]
        }
    ],
    "connections": {
        "WhatsApp Trigger": {
            "main": [[{ "node": "IF Keyword", "type": "main", "index": 0 }]]
        },
        "IF Keyword": {
            "main": [[{ "node": "Send WhatsApp", "type": "main", "index": 0 }]]
        }
    }
};

export default function BotBuilder() {
    const [activeTab, setActiveTab] = useState<'flows' | 'templates'>('flows');
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonInput, setJsonInput] = useState('');

    const handleImportN8n = () => {
        try {
            if (jsonInput.trim()) {
                const parsed = JSON.parse(jsonInput);
                console.log("Imported n8n workflow:", parsed);
                // In a real app, this would validate and save to the DB,
                // transforming it into our internal flow representation if needed.
                alert('n8n Workflow Imported Successfully!');
            } else {
                // Just demo the mock data if empty
                console.log("Using demo n8n workflow:", MOCK_N8N_WORKFLOW);
                setJsonInput(JSON.stringify(MOCK_N8N_WORKFLOW, null, 2));
            }
        } catch (e) {
            alert('Invalid JSON format');
        }
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0a0b] text-white font-sans overflow-hidden">

            {/* Sidebar Navigation (Reused from Home) */}
            <div className="w-20 border-r border-gray-800 bg-[#121214] flex flex-col items-center py-6 gap-8 z-30 shadow-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                    C
                </div>
                <nav className="flex flex-col gap-6 text-gray-500">
                    <Link href="/" className="p-3 hover:text-white transition-colors flex flex-col items-center">
                        <MessageSquare size={24} />
                    </Link>
                    <button className="p-3 hover:text-white transition-colors">
                        <Users size={24} />
                    </button>
                    <button className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-colors border border-indigo-500/20 shadow-inner">
                        <GitBranch size={24} />
                    </button>
                    <Link href="/settings/integrations" className="p-3 hover:text-white transition-colors mt-auto flex-1 flex flex-col justify-end items-center">
                        <Settings size={24} />
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative w-full bg-[#0a0a0b]">
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#0a0a0b] to-[#0a0a0b] pointer-events-none"></div>

                {/* Header Section */}
                <div className="px-10 py-8 border-b border-gray-800/50 bg-[#0a0a0b]/80 backdrop-blur-xl z-20 flex justify-between items-end sticky top-0">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-100">Automation Builder</h1>
                        <p className="text-gray-400 text-sm">Design chat workflows, setup keyword triggers, and manage WhatsApp templates.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowJsonModal(true)}
                            className="px-4 py-2.5 bg-[#1c1c1f] hover:bg-gray-800 text-gray-300 font-medium rounded-xl transition-all border border-gray-700/50 flex items-center gap-2 text-sm shadow-sm"
                        >
                            <Download size={16} /> Import n8n JSON
                        </button>
                        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all border border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] flex items-center gap-2 text-sm">
                            <Plus size={16} /> Create Flow
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-10 pt-6 z-10">
                    <div className="flex gap-8 border-b border-gray-800">
                        <button
                            onClick={() => setActiveTab('flows')}
                            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'flows' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Custom Flows
                            {activeTab === 'flows' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.5)]"></div>}
                        </button>
                        <button
                            onClick={() => setActiveTab('templates')}
                            className={`pb-4 text-sm font-semibold transition-colors relative ${activeTab === 'templates' ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Meta Message Templates
                            {activeTab === 'templates' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-500 rounded-t-full shadow-[0_-2px_8px_rgba(99,102,241,0.5)]"></div>}
                        </button>
                    </div>
                </div>

                {/* Dynamic Area */}
                <div className="flex-1 overflow-y-auto p-10 z-10">

                    {/* FLOWS TAB */}
                    {activeTab === 'flows' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[
                                { name: "Welcome Flow", trigger: "Keyword: 'Hi', 'Hello'", status: "active", icon: <MessageSquare size={20} /> },
                                { name: "Support Escalation", trigger: "Keyword: 'Agent', 'Help'", status: "active", icon: <Users size={20} /> },
                                { name: "Pricing Query Bot (n8n)", trigger: "Keyword: 'Pricing', 'Cost'", status: "draft", icon: <GitBranch size={20} /> }
                            ].map((flow, i) => (
                                <div key={i} className="bg-[#1c1c1f]/80 backdrop-blur-md border border-gray-800/80 rounded-2xl p-6 group hover:border-indigo-500/50 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] relative overflow-hidden flex flex-col">

                                    {/* Status Indicator */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900/50 border border-gray-700/50">
                                        <div className={`w-1.5 h-1.5 rounded-full ${flow.status === 'active' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)]' : 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.8)]'}`}></div>
                                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{flow.status}</span>
                                    </div>

                                    <div className="w-12 h-12 rounded-xl bg-gray-800 group-hover:bg-indigo-500/10 flex items-center justify-center text-gray-400 group-hover:text-indigo-400 mb-5 transition-colors border border-gray-700 group-hover:border-indigo-500/30">
                                        {flow.icon}
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-100 tracking-tight mb-1">{flow.name}</h3>
                                    <p className="text-sm text-gray-500 font-medium mb-6 flex-1">
                                        Triggered by: {flow.trigger}
                                    </p>

                                    <div className="flex gap-3 mt-auto">
                                        <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium py-2 rounded-lg transition-colors border border-gray-700">
                                            Edit Flow
                                        </button>
                                        <button className="px-3 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm font-medium rounded-lg transition-colors border border-gray-700">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* TEMPLATES TAB */}
                    {activeTab === 'templates' && (
                        <div className="bg-[#1c1c1f] border border-gray-800/80 rounded-2xl shadow-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                    <input type="text" placeholder="Search templates..." className="bg-[#121214] border border-gray-700/50 rounded-lg py-1.5 pl-9 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-gray-200 transition-colors" />
                                </div>
                                <button className="text-indigo-400 text-sm font-semibold hover:text-indigo-300">Sync with Meta</button>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-800/20 text-gray-400 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-medium">Template Name</th>
                                        <th className="px-6 py-4 font-medium">Category</th>
                                        <th className="px-6 py-4 font-medium">Language</th>
                                        <th className="px-6 py-4 font-medium">Status</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-800">
                                    {['order_confirmation', 'welcome_message', 'shipping_update'].map((tpl, i) => (
                                        <tr key={tpl} className="hover:bg-gray-800/10 transition-colors text-gray-300">
                                            <td className="px-6 py-5 font-medium text-gray-200">{tpl}</td>
                                            <td className="px-6 py-5"><span className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs">Utility</span></td>
                                            <td className="px-6 py-5">en_US</td>
                                            <td className="px-6 py-5">
                                                <span className="flex items-center gap-1.5">
                                                    <div className={`w-2 h-2 rounded-full ${i === 2 ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                                                    {i === 2 ? 'Pending Review' : 'Approved'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Preview</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                </div>
            </div>

            {/* n8n Import Modal */}
            {showJsonModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-[#1c1c1f] border border-gray-800 rounded-3xl p-8 w-[600px] shadow-2xl relative">
                        <h2 className="text-2xl font-bold mb-2">Import n8n Workflow</h2>
                        <p className="text-gray-400 text-sm mb-6">Paste your exported n8n workflow JSON snippet below.</p>

                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            placeholder="Paste JSON here..."
                            className="w-full h-64 bg-[#0a0a0b] border border-gray-700 rounded-xl p-4 text-sm font-mono text-gray-300 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors mb-6 shadow-inner"
                        ></textarea>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowJsonModal(false)}
                                className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-colors border border-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleImportN8n}
                                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(99,102,241,0.4)]"
                            >
                                <Download size={18} /> Parse & Import
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
