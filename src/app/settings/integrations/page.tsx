'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Users, Code, Key, Smartphone, Layers, CheckCircle, MessageSquare, GitBranch, Settings } from 'lucide-react';


export default function IntegrationsSettings() {
    const [waConnected, setWaConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [igConnected, setIgConnected] = useState(false);
    const [loadingIg, setLoadingIg] = useState(false);

    // Mocking the Meta Embedded Signup Flow since we don't have a real App ID
    const handleConnectWhatsApp = async () => {
        setLoading(true);

        // In production, this would trigger opening the FB Login popup via FB.login()
        console.log("Opening Meta Embedded Signup popup...");

        // Simulate user completing the flow taking a few seconds
        setTimeout(async () => {
            try {
                // Send pseudo OAuth code to backend
                const response = await fetch('http://localhost:4000/api/integrations/whatsapp/connect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        code: 'mock_oauth_code_generated_by_meta_login',
                        tenantId: 'tenant-1234-xyz' // Dummy local tenant ID
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    setWaConnected(true);
                }
            } catch (error) {
                console.error('Failed to connect:', error);
            } finally {
                setLoading(false);
            }
        }, 2000);
    };

    const handleConnectInstagram = async () => {
        setLoadingIg(true);
        console.log("Opening Meta Instagram Connect popup...");

        setTimeout(async () => {
            try {
                const response = await fetch('http://localhost:4000/api/integrations/instagram/connect', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code: 'mock_ig_oauth_code', tenantId: 'tenant-1234-xyz' }),
                });

                const data = await response.json();
                if (data.success) {
                    setIgConnected(true);
                }
            } catch (error) {
                console.error('Failed to connect IG:', error);
            } finally {
                setLoadingIg(false);
            }
        }, 2000);
    };

    return (
        <div className="flex h-screen w-full bg-[#0a0a0b] text-white font-sans overflow-hidden">
            {/* Sidebar Navigation */}
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
                    <Link href="/bots" className="p-3 hover:text-white transition-colors flex flex-col items-center">
                        <GitBranch size={24} />
                    </Link>
                    <button className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-colors border border-indigo-500/20 shadow-inner mt-auto flex-1 flex flex-col justify-end items-center">
                        <Settings size={24} />
                    </button>
                </nav>
            </div>

            {/* Settings Navigation Sidebar */}
            <div className="w-64 border-r border-gray-800 bg-[#121214] flex flex-col z-20 shadow-xl">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-tight">Settings</h1>
                </div>
                <div className="flex-1 overflow-y-auto hidden-scrollbar py-4">
                    <nav className="flex flex-col gap-1 px-3">
                        <button className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium w-full text-left">
                            <Users size={18} /> Team Members
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg transition-colors border border-indigo-500/20 text-sm font-medium w-full text-left">
                            <Layers size={18} /> Integrations
                        </button>
                        <button className="flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-gray-100 hover:bg-gray-800/50 rounded-lg transition-colors text-sm font-medium w-full text-left">
                            <Key size={18} /> API Keys
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Settings Content */}
            <div className="flex-1 overflow-y-auto p-12 bg-[#0a0a0b] relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none mix-blend-screen opacity-50"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Integrations</h2>
                        <p className="text-gray-400">Connect and manage your messaging channels and third-party apps.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* WhatsApp Integration Card */}
                        <div className="bg-[#1c1c1f] border border-gray-800 rounded-2xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600"></div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center border border-green-500/20">
                                    <Smartphone className="text-green-500" size={24} />
                                </div>
                                {waConnected && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold border border-green-500/20">
                                        <CheckCircle size={14} /> Connected
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2">WhatsApp Business</h3>
                            <p className="text-sm text-gray-400 mb-6 flex-1">
                                Connect your WhatsApp Business Account (WABA) to send and receive messages automatically. Uses Meta Embedded Signup.
                            </p>

                            {waConnected ? (
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl transition-all border border-gray-700 text-sm">
                                        Manage Numbers
                                    </button>
                                    <button className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition-all border border-red-500/20 text-sm">
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleConnectWhatsApp}
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Connect with Facebook</>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Instagram Integration Card */}
                        <div className="bg-[#1c1c1f] border border-gray-800 rounded-2xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-400"></div>

                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-pink-500/10 rounded-xl flex items-center justify-center border border-pink-500/20">
                                    <Code className="text-pink-500" size={24} />
                                </div>
                                {igConnected && (
                                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-400 text-xs font-semibold border border-pink-500/20">
                                        <CheckCircle size={14} /> Connected
                                    </span>
                                )}
                            </div>

                            <h3 className="text-xl font-bold mb-2">Instagram Direct</h3>
                            <p className="text-sm text-gray-400 mb-6 flex-1">
                                Connect your Instagram Professional account to manage DMs, comments, and story replies.
                            </p>

                            {igConnected ? (
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-medium py-2.5 rounded-xl transition-all border border-gray-700 text-sm">
                                        Manage Account
                                    </button>
                                    <button className="px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium rounded-xl transition-all border border-red-500/20 text-sm">
                                        Disconnect
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleConnectInstagram}
                                    disabled={loadingIg}
                                    className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(236,72,153,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loadingIg ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>Connect Instagram</>
                                    )}
                                </button>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
