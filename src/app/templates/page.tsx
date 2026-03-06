"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Copy, Edit2, Trash2, CheckCircle2, Clock, X, MessageSquare } from "lucide-react";
import { templatesAPI } from "@/lib/api";

interface Template {
  _id: string;
  name: string;
  category?: string;
  language?: string;
  status?: string;
  components?: any[];
  createdAt: string;
}

export default function TemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [isCreating, setIsCreating] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "",
    language: "en_US",
    components: [],
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templatesAPI.getAll();
      setTemplates(response.data.data);
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (newTemplate.name) {
      try {
        await templatesAPI.create(newTemplate);
        setNewTemplate({ name: "", category: "", language: "en_US", components: [] });
        setIsCreating(false);
        fetchTemplates();
      } catch (error) {
        console.error("Error creating template:", error);
        alert("Failed to create template");
      }
    }
  };

  const handleSyncTemplates = async () => {
    try {
      await templatesAPI.sync();
      alert("Templates synced successfully");
      fetchTemplates();
    } catch (error) {
      console.error("Error syncing templates:", error);
      alert("Failed to sync templates");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  const categories = ['all', ...new Set(templates.map(t => t.category).filter(Boolean))];

  const filteredTemplates = templates.filter(
    (template) =>
      (activeTab === 'all' || template.category === activeTab) &&
      template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    if (status === "approved") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "pending") return <Clock className="w-4 h-4 text-yellow-500" />;
    return <Clock className="w-4 h-4 text-gray-500" />;
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case "whatsapp":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "instagram":
        return "bg-pink-500/10 text-pink-600 dark:text-pink-400";
      case "sms":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Templates</h1>
          <p className="text-muted-foreground mt-1">Create and manage message templates</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Tabs and Search */}
      <div className="space-y-4">
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {categories.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleSyncTemplates}
            className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors whitespace-nowrap"
          >
            Sync with Meta
          </button>
        </div>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Create Template</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Template Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="e.g., Order Confirmation"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                <input
                  type="text"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  placeholder="e.g., MARKETING, UTILITY"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                <input
                  type="text"
                  value={newTemplate.language}
                  onChange={(e) => setNewTemplate({ ...newTemplate, language: e.target.value })}
                  placeholder="e.g., en_US"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                onClick={handleCreateTemplate}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTemplates.length > 0 ? (
          filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="border border-border rounded-lg p-6 bg-background hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">{template.name}</h3>
                    {template.status === 'APPROVED' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {template.status === 'PENDING' && <Clock className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Status: <span className="capitalize">{template.status || 'Unknown'}</span>
                  </p>
                </div>
              </div>

              <div className="mb-4 p-3 rounded-lg bg-muted">
                <p className="text-sm text-foreground line-clamp-3">
                  {template.components?.[0]?.text || 'No preview available'}
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                {template.category && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                    {template.category}
                  </span>
                )}
                {template.language && (
                  <span className="text-xs text-muted-foreground">
                    {template.language}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm">
                  <Copy className="w-4 h-4" />
                  Clone
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
                <button className="px-3 py-2 border border-border rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No templates found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
