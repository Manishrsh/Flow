"use client";

import React from "react";
import FlowBuilder from "./components/FlowBuilder";

export default function ChatbotBuilderPage() {
  return (
    <div className="w-full h-full bg-zinc-50 dark:bg-zinc-900 absolute inset-0 pt-0 overflow-hidden">
      {/* We use inset-0 to take over the whole screen just for the builder context,
            but keeping within the layout. */}
      <FlowBuilder />
    </div>
  );
}
