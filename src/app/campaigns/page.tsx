"use client";

import React, { useState } from "react";
import { Plus, Search, MoreVertical, Eye, Pause, Play, X, Calendar } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "broadcast" | "drip" | "scheduled";
  status: "draft" | "running" | "paused" | "completed";
  recipients: number;
  sent: number;
  opened: number;
  clicked: number;
  created: string;
  scheduled?: string;
}

export default function CampaignsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Spring Sale 2024",
      type: "broadcast",
      status: "completed",
      recipients: 5200,
      sent: 5200,
      opened: 2340,
      clicked: 520,
      created: "Jan 20, 2024",
    },
    {
      id: "2",
      name: "Welcome Series",
      type: "drip",
      status: "running",
      recipients: 3400,
      sent: 3200,
      opened: 1800,
      clicked: 320,
      created: "Jan 15, 2024",
    },
    {
      id: "3",
      name: "Flash Deal - 24hrs",
      type: "scheduled",
      status: "draft",
      recipients: 2100,
      sent: 0,
      opened: 0,
      clicked: 0,
      created: "Jan 22, 2024",
      scheduled: "Jan 25, 2024 10:00 AM",
    },
  ]);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    type: "broadcast" as const,
    templateId: "",
  });

  const handleCreateCampaign = () => {
    if (newCampaign.name && newCampaign.templateId) {
      const campaign: Campaign = {
        id: String(campaigns.length + 1),
        name: newCampaign.name,
        type: newCampaign.type,
        status: "draft",
        recipients: 0,
        sent: 0,
        opened: 0,
        clicked: 0,
        created: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
      setCampaigns([...campaigns, campaign]);
      setNewCampaign({ name: "", type: "broadcast", templateId: "" });
      setIsCreating(false);
    }
  };

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "running":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "paused":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "draft":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Create and manage your messaging campaigns</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search campaigns..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Create Campaign</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Campaign Name</label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g., Summer Sale 2024"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Campaign Type</label>
                <select
                  value={newCampaign.type}
                  onChange={(e) => setNewCampaign({ ...newCampaign, type: e.target.value as any })}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="broadcast">Broadcast</option>
                  <option value="drip">Drip Campaign</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Template</label>
                <select
                  value={newCampaign.templateId}
                  onChange={(e) => setNewCampaign({ ...newCampaign, templateId: e.target.value })}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a template...</option>
                  <option value="1">Welcome Message</option>
                  <option value="2">Promotional Offer</option>
                  <option value="3">Order Confirmation</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCampaign}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Recipients</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Open Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Click Rate</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.length > 0 ? (
                filteredCampaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{campaign.type}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{campaign.recipients.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {campaign.sent > 0 ? `${((campaign.opened / campaign.sent) * 100).toFixed(1)}%` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {campaign.opened > 0 ? `${((campaign.clicked / campaign.opened) * 100).toFixed(1)}%` : "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{campaign.created}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    No campaigns found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
