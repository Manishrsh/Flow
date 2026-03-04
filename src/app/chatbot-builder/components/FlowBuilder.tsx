"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  BackgroundVariant,
  MarkerType
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import Sidebar from "./Sidebar";
import CustomNode from "./CustomNode";
import PropertiesPanel from "./PropertiesPanel";
import { ArrowLeft, Play, LayoutGrid, FileDown, Rocket, Smartphone } from "lucide-react";

const initialNodes: Node[] = [
  {
    id: "trigger",
    type: "messageNode",
    position: { x: 250, y: 150 },
    data: { label: "Trigger: WhatsApp", type: "messageNode", content: "Bot triggered on user keyword 'Hello'" },
  },
];

const initialEdges: Edge[] = [];

const nodeTypes = {
  messageNode: CustomNode,
  buttonNode: CustomNode,
  conditionNode: CustomNode,
  apiNode: CustomNode,
};

let id = 0;
const getId = () => `node_${id++}`;

export default function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const type = event.dataTransfer.getData("application/reactflow");
      const label = event.dataTransfer.getData("application/reactflow-label");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label, type, content: "New " + label + " block configured." },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top Navbar specifically for builder context */}
      <header className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 flex items-center justify-between shadow-sm z-20">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-md transition-colors text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div>
            <h1 className="text-sm font-bold truncate max-w-[200px] flex items-center gap-2">
              Customer Onboarding Bot
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">Active</span>
            </h1>
            <p className="text-xs text-zinc-500">Last saved 2m ago</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-white dark:text-zinc-300 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <LayoutGrid className="w-4 h-4" />
            Auto Arrange
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 bg-white dark:text-zinc-300 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <Smartphone className="w-4 h-4" />
            Preview
          </button>
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
          <button className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
            <Rocket className="w-4 h-4" />
            Publish Flow
          </button>
        </div>
      </header>

      {/* Main Builder Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        <ReactFlowProvider>
          <Sidebar />

          <div
            className="flex-1 bg-[#F9FAFB] dark:bg-zinc-950"
            ref={reactFlowWrapper}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              fitView
              attributionPosition="bottom-right"
              className="react-flow-custom"
            >
              <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#9CA3AF" />
              <Controls className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 !shadow-md !rounded-lg overflow-hidden flex flex-col" />
              <MiniMap
                className="!bg-white dark:!bg-zinc-900 !border !border-zinc-200 dark:!border-zinc-800 !shadow-md !rounded-xl overflow-hidden"
                nodeColor={(n) => {
                  switch (n.type) {
                    case "messageNode": return "#3b82f6";
                    case "buttonNode": return "#a855f7";
                    case "conditionNode": return "#f97316";
                    case "apiNode": return "#10b981";
                    default: return "#71717a";
                  }
                }}
              />
            </ReactFlow>
          </div>

          {selectedNode && (
            <div className="absolute top-0 right-0 h-full w-80 shadow-2xl z-50">
              <PropertiesPanel
                selectedNode={selectedNode}
                setNodes={setNodes}
                onClose={() => setSelectedNode(null)}
              />
            </div>
          )}
        </ReactFlowProvider>
      </div>
    </div>
  );
}
