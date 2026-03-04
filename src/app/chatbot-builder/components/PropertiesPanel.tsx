"use client";

import React from "react";
import { X, Save, MessageSquare, Plus } from "lucide-react";

interface PropertiesPanelProps {
    selectedNode: any;
    setNodes: React.Dispatch<React.SetStateAction<any[]>>;
    onClose: () => void;
}

export default function PropertiesPanel({ selectedNode, setNodes, onClose }: PropertiesPanelProps) {
    if (!selectedNode) return null;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const newContent = e.target.value;

        setNodes((nds) =>
            nds.map((n) => {
                if (n.id === selectedNode.id) {
                    return {
                        ...n,
                        data: {
                            ...n.data,
                            content: newContent
                        }
                    };
                }
                return n;
            })
        );
    };

    return (
        <aside className="w-80 bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 flex flex-col h-full z-10 shadow-sm relative right-0 top-0 bottom-0 absolute animate-in slide-in-from-right-8 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    {selectedNode.data.label} Properties
                </h2>
                <button
                    onClick={onClose}
                    className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 rounded-full transition-colors bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-6">
                {/* Basic Content Editor based on Type */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Message Content</label>
                    {selectedNode.data.type === 'messageNode' || selectedNode.data.type === 'buttonNode' ? (
                        <textarea
                            value={selectedNode.data.content || ""}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Type your message here..."
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow resize-none"
                        />
                    ) : (
                        <input
                            type="text"
                            value={selectedNode.data.content || ""}
                            onChange={handleChange}
                            placeholder="Configure value..."
                            className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        />
                    )}
                    <p className="text-xs text-zinc-500 italic">Use {'{{name}}'} to insert dynamic variables.</p>
                </div>

                {/* Dynamic Fields specific to Button Nodes */}
                {selectedNode.data.type === 'buttonNode' && (
                    <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Interactive Buttons</h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm shadow-sm">
                                <span>Yes, I'm interested</span>
                                <X className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-red-500" />
                            </div>
                            <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-3 py-2 text-sm shadow-sm">
                                <span>No, thank you</span>
                                <X className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-red-500" />
                            </div>
                            <button className="w-full py-2 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-md text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" /> Add Button Option
                            </button>
                        </div>
                    </div>
                )}

                {/* Dynamic Fields specific to API Nodes */}
                {selectedNode.data.type === 'apiNode' && (
                    <div className="space-y-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">API Endpoint URL</label>
                            <div className="flex items-center gap-2">
                                <select className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option>GET</option>
                                    <option>POST</option>
                                </select>
                                <input type="text" placeholder="https://api.example.com/v1" className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                    <Save className="w-4 h-4" /> Save Configuration
                </button>
            </div>
        </aside>
    );
}
