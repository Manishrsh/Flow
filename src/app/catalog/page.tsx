'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    GitBranch,
    Settings,
    MessageSquare,
    ShoppingCart,
    RefreshCw,
    Search,
    CheckCircle2,
    AlertCircle,
    PackageSearch,
    Filter
} from 'lucide-react';

interface Product {
    id: string;
    title: string;
    price: string;
    inventory: number;
    image: string;
    status: string;
}

export default function CatalogPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSync, setLastSync] = useState<string | null>(null);

    // Initial load simulation
    useEffect(() => {
        handleSync();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await fetch('http://localhost:4000/api/integrations/shopify/sync', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tenantId: 'tenant_demo_001' })
            });
            const data = await res.json();

            if (data.success && data.data) {
                setProducts(data.data);
                setLastSync(new Date().toLocaleTimeString([], { timeStyle: 'short' }));
            }
        } catch (error) {
            console.error("Failed to sync products:", error);
        } finally {
            setIsSyncing(false);
        }
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
                    <Link href="/bots" className="p-3 hover:text-white transition-colors">
                        <GitBranch size={24} />
                    </Link>
                    <Link href="/catalog" className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl transition-colors border border-indigo-500/20 shadow-inner">
                        <ShoppingCart size={24} />
                    </Link>
                    <Link href="/settings/integrations" className="p-3 hover:text-white transition-colors mt-auto flex-1 flex flex-col justify-end items-center">
                        <Settings size={24} />
                    </Link>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative w-full bg-[#0a0a0b]">
                {/* Background Decor */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#0a0a0b] to-[#0a0a0b] pointer-events-none"></div>

                {/* Header */}
                <div className="px-10 py-8 border-b border-gray-800/50 bg-[#0a0a0b]/80 backdrop-blur-xl z-20 flex justify-between items-end sticky top-0">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-100">Product Catalog</h1>
                            <span className="px-2.5 py-1 rounded bg-[#1c1c1f] text-emerald-400 border border-emerald-500/20 text-xs font-medium flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Shopify Connected
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            Sync your e-commerce store to send products dynamically in chats.
                            {lastSync && <span>• Last synced at {lastSync}</span>}
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={handleSync}
                            disabled={isSyncing}
                            className={`px-5 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-sm
                                ${isSyncing
                                    ? 'bg-gray-800 text-gray-400 border border-gray-700 cursor-not-allowed'
                                    : 'bg-[#1c1c1f] hover:bg-gray-800 text-gray-200 border border-gray-700/50'
                                }`}
                        >
                            <RefreshCw size={16} className={`${isSyncing ? 'animate-spin' : ''}`} />
                            {isSyncing ? 'Syncing...' : 'Sync with Shopify'}
                        </button>
                        <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-xl transition-all border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 text-sm">
                            <PackageSearch size={16} /> Add Product Manually
                        </button>
                    </div>
                </div>

                {/* Tools Bar */}
                <div className="px-10 py-4 border-b border-gray-800/50 flex gap-4 z-10 bg-[#0a0a0b]/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search products by name or SKU..."
                            className="w-full bg-[#1c1c1f] border border-gray-700/50 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-500 shadow-inner"
                        />
                    </div>
                    <button className="px-4 py-2 bg-[#1c1c1f] hover:bg-gray-800 text-gray-300 font-medium rounded-xl transition-all border border-gray-700/50 flex items-center gap-2 text-sm">
                        <Filter size={16} /> Filters
                    </button>
                </div>

                {/* Main Product Grid */}
                <div className="flex-1 overflow-y-auto p-10 z-10">
                    {/* Products Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {products.length === 0 && !isSyncing && (
                            <div className="col-span-full h-40 flex flex-col items-center justify-center text-gray-500">
                                <PackageSearch size={40} className="mb-3 opacity-50" />
                                <p>No products found. Sync with Shopify to populate.</p>
                            </div>
                        )}

                        {isSyncing && products.length === 0 && (
                            <div className="col-span-full h-40 flex flex-col items-center justify-center text-emerald-500">
                                <RefreshCw size={40} className="mb-3 animate-spin opacity-80" />
                                <p>Fetching product catalog...</p>
                            </div>
                        )}

                        {products.map((product) => (
                            <div key={product.id} className="bg-[#1c1c1f]/80 backdrop-blur-md border border-gray-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all shadow-lg group relative flex flex-col">

                                {/* Status Badge */}
                                <div className="absolute top-4 right-4 z-10">
                                    {product.inventory > 0 ? (
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                                            <CheckCircle2 size={12} /> In Stock
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                                            <AlertCircle size={12} /> Out of Stock
                                        </span>
                                    )}
                                </div>

                                {/* Product Image Mock */}
                                <div className="w-full h-48 bg-gradient-to-tr from-gray-900 to-gray-800 rounded-xl mb-4 flex items-center justify-center text-6xl shadow-inner border border-gray-800 group-hover:border-emerald-500/30 transition-colors">
                                    {product.image}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                    <h3 className="font-bold text-gray-100 text-lg leading-tight mb-2 truncate group-hover:text-emerald-400 transition-colors" title={product.title}>
                                        {product.title}
                                    </h3>

                                    <div className="flex items-end justify-between mt-auto">
                                        <div>
                                            <p className="text-2xl font-black text-gray-100">${product.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-medium tracking-wide">INVENTORY</p>
                                            <p className={`text-sm font-bold ${product.inventory > 10 ? 'text-gray-300' : 'text-red-400'}`}>
                                                {product.inventory} units
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover actions */}
                                <div className="mt-4 flex gap-2 pt-4 border-t border-gray-800">
                                    <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 rounded-lg transition-colors border border-gray-700">
                                        Edit Details
                                    </button>
                                    <button className="px-3 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white text-sm font-medium py-2 rounded-lg transition-colors border border-indigo-500/30">
                                        Send in Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
