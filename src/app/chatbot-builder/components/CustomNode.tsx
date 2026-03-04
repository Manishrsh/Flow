"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { MessageSquare, MousePointerClick, GitBranch, Webhook, GripVertical, Settings } from "lucide-react";

interface NodeProps {
    data: {
        label: string;
        type: "messageNode" | "buttonNode" | "conditionNode" | "apiNode";
        content?: string;
    };
    selected?: boolean;
}

const NodeIcon = ({ type }: { type: string }) => {
    switch (type) {
        case "messageNode": return <MessageSquare className="w-5 h-5 text-blue-500" />;
        case "buttonNode": return <MousePointerClick className="w-5 h-5 text-purple-500" />;
        case "conditionNode": return <GitBranch className="w-5 h-5 text-orange-500" />;
        case "apiNode": return <Webhook className="w-5 h-5 text-emerald-500" />;
        default: return <MessageSquare className="w-5 h-5 text-zinc-500" />;
    }
};

const CustomNode = memo(({ data, selected }: NodeProps) => {
    return (
        <div className={`bg-white dark:bg-zinc-950 border-2 rounded-xl shadow-md min-w-[250px] transition-all ${
          selected ? "border-blue-500 shadow-blue-500/20" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
        }`}>
      {/* Target Handle (Input) */}
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-zinc-400 border-2 border-white dark:border-zinc-900" />

      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50 dark:bg-zinc-900/50 rounded-t-xl cursor-grab">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white dark:bg-zinc-950 rounded-md shadow-sm border border-zinc-200 dark:border-zinc-800">
            <NodeIcon type={data.type} />
          </div>
          <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{data.label}</span>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-4 text-sm text-zinc-600 dark:text-zinc-400">
        {data.content ? (
          <p className="line-clamp-3 leading-relaxed">{data.content}</p>
        ) : (
          <p className="italic text-zinc-400 text-xs">Configure payload in properties...</p>
        )}
      </div>

      {/* Source Handles (Outputs) */}
      {data.type === "conditionNode" ? (
        <>
          <Handle type="source" position={Position.Right} id="true" className="w-3 h-3 top-1/3 bg-green-500 border-2 border-white dark:border-zinc-900" />
          <div className="absolute top-1/3 -right-6 text-[10px] font-bold text-green-600 dark:text-green-400 transform -translate-y-1/2">Yes</div>
          
          <Handle type="source" position={Position.Right} id="false" className="w-3 h-3 top-2/3 bg-red-500 border-2 border-white dark:border-zinc-900" />
          <div className="absolute top-2/3 -right-6 text-[10px] font-bold text-red-600 dark:text-red-400 transform -translate-y-1/2">No</div>
        </>
      ) : (
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500 border-2 border-white dark:border-zinc-900" />
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
