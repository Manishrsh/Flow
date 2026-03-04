"use client";

import React from "react";
import { MessageSquare, MousePointerClick, GitBranch, Webhook, GripVertical } from "lucide-react";

export default function Sidebar() {
    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData("application/reactflow", nodeType);
        event.dataTransfer.setData("application/reactflow-label", label);
        event.dataTransfer.effectAllowed = "move";
    };

    const nodeTypes = [
        { type: "messageNode", label: "Send Message", icon: <MessageSquare className="w-5 h-5 text-blue-500" />, desc: "Send text or media" },
        { type: "buttonNode", label: "Interactive Button", icon: <MousePointerClick className="w-5 h-5 text-purple-500" />, desc: "Multiple choice buttons" },
        { type: "conditionNode", label: "Condition", icon: <GitBranch className="w-5 h-5 text-orange-500" />, desc: "If/Else branching" },
        { type: "apiNode", label: "API Request", icon: <Webhook className="w-5 h-5 text-emerald-500" />, desc: "Fetch external data" }
    ];

    return (
        <aside className="w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col h-full z-10 shadow-sm relative">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800">
                <h2 className="text-lg font-bold tracking-tight">Nodes</h2>
                <p className="text-sm text-zinc-500 mt-1">Drag and drop nodes to build your flow.</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {nodeTypes.map((node) => (
                    <div
                        key={node.type}
                        className="flex items-start gap-3 p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900 cursor-grab hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all active:cursor-grabbing"
                        onDragStart={(event) => onDragStart(event, node.type, node.label)}
                        draggable
                    >
                        <div className="mt-0.5 cursor-grab">
                            <GripVertical className="w-4 h-4 text-zinc-400" />
                        </div>
                        <div className="w-8 h-8 rounded-md bg-white dark:bg-zinc-950 shadow-sm flex items-center justify-center border border-zinc-200 dark:border-zinc-800">
                            {node.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold">{node.label}</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">{node.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
}
