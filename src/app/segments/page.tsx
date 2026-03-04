"use client";

import React, { useState } from "react";
import { Plus, MoreVertical, Users, Zap, Edit2, Trash2, X } from "lucide-react";

interface Segment {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  conditions: string;
  created: string;
  active: boolean;
}

export default function SegmentsPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [segments, setSegments] = useState<Segment[]>([
    {
      id: "1",
      name: "High-Value Customers",
      description: "Customers with lifetime value > $5000",
      memberCount: 324,
      conditions: "LTV > $5000",
      created: "Jan 10, 2024",
      active: true,
    },
    {
      id: "2",
      name: "Inactive Users",
      description: "No purchase in the last 90 days",
      memberCount: 1205,
      conditions: "Last purchase > 90 days ago",
      created: "Jan 8, 2024",
      active: true,
    },
    {
      id: "3",
      name: "Newsletter Subscribers",
      description: "Opted in for marketing emails",
      memberCount: 8932,
      conditions: "Newsletter opt-in = true",
      created: "Jan 1, 2024",
      active: true,
    },
  ]);

  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    conditions: "",
  });

  const handleCreateSegment = () => {
    if (newSegment.name && newSegment.conditions) {
      const segment: Segment = {
        id: String(segments.length + 1),
        name: newSegment.name,
        description: newSegment.description,
        memberCount: 0,
        conditions: newSegment.conditions,
        created: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        active: true,
      };
      setSegments([...segments, segment]);
      setNewSegment({ name: "", description: "", conditions: "" });
      setIsCreating(false);
    }
  };

  const handleDeleteSegment = (id: string) => {
    setSegments(segments.filter((segment) => segment.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Segments</h1>
          <p className="text-muted-foreground mt-1">Create audience segments based on custom criteria</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Segment
        </button>
      </div>

      {/* Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Create New Segment</h3>
              <button
                onClick={() => setIsCreating(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Segment Name</label>
                <input
                  type="text"
                  value={newSegment.name}
                  onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                  placeholder="e.g., Premium Customers"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={newSegment.description}
                  onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                  placeholder="What defines this segment?"
                  rows={3}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Conditions</label>
                <input
                  type="text"
                  value={newSegment.conditions}
                  onChange={(e) => setNewSegment({ ...newSegment, conditions: e.target.value })}
                  placeholder="e.g., LTV > $1000"
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
                onClick={handleCreateSegment}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Segments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {segments.map((segment) => (
          <div
            key={segment.id}
            className="border border-border rounded-lg p-6 bg-background hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{segment.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{segment.description}</p>
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-4 border-y border-border">
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Members</p>
                  <p className="text-lg font-semibold text-foreground">{segment.memberCount.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-4 h-4 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground">Conditions</p>
                  <p className="text-sm text-foreground">{segment.conditions}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm">
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteSegment(segment.id)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>

            <p className="text-xs text-muted-foreground mt-3">Created {segment.created}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
