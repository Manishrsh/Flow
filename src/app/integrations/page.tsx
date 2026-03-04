"use client";

import React, { useState } from "react";
import { MessageSquare, Instagram, Youtube, Zap, CheckCircle2, AlertCircle, X } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected";
  expiresAt?: string;
  apiKey?: string;
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "whatsapp",
      name: "WhatsApp",
      description: "Send and receive messages via WhatsApp",
      icon: <MessageSquare className="w-8 h-8" />,
      status: "connected",
      expiresAt: "Feb 15, 2025",
    },
    {
      id: "instagram",
      name: "Instagram",
      description: "Manage Instagram Direct Messages",
      icon: <Instagram className="w-8 h-8" />,
      status: "connected",
    },
    {
      id: "youtube",
      name: "YouTube",
      description: "Respond to YouTube comments and messages",
      icon: <Youtube className="w-8 h-8" />,
      status: "disconnected",
    },
    {
      id: "webhook",
      name: "Webhooks",
      description: "Custom API webhooks for advanced integrations",
      icon: <Zap className="w-8 h-8" />,
      status: "connected",
    },
  ]);

  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setIsConnecting(id);
    setTimeout(() => {
      setIntegrations(
        integrations.map((int) =>
          int.id === id ? { ...int, status: "connected" } : int
        )
      );
      setIsConnecting(null);
    }, 1500);
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id ? { ...int, status: "disconnected" } : int
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
        <p className="text-muted-foreground mt-1">Connect your favorite tools and platforms</p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className="border border-border rounded-lg p-6 bg-background hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-muted text-primary">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{integration.name}</h3>
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {integration.status === "connected" ? (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    Connected
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-500/10 text-gray-600 dark:text-gray-400 text-xs font-medium">
                    <AlertCircle className="w-3 h-3" />
                    Disconnected
                  </div>
                )}
              </div>
            </div>

            {integration.expiresAt && (
              <div className="p-3 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs mb-4">
                Token expires {integration.expiresAt}. {" "}
                <button className="underline hover:no-underline">Refresh now</button>
              </div>
            )}

            <div className="flex gap-2">
              {integration.status === "connected" ? (
                <>
                  <button
                    onClick={() => setShowSettings(integration.id)}
                    className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm font-medium"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="flex-1 px-4 py-2 border border-destructive rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleConnect(integration.id)}
                  disabled={isConnecting === integration.id}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors text-sm font-medium"
                >
                  {isConnecting === integration.id ? "Connecting..." : "Connect"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">
                {integrations.find((i) => i.id === showSettings)?.name} Settings
              </h3>
              <button
                onClick={() => setShowSettings(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">API Key</label>
                <input
                  type="password"
                  placeholder="Enter API key..."
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Webhook URL</label>
                <input
                  type="text"
                  placeholder="https://your-domain.com/webhook"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => setShowSettings(null)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowSettings(null)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
