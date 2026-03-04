"use client";

import React, { useState } from "react";
import { Save, Bell, Shield, Clock } from "lucide-react";

export default function SettingsPreferencesPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    escalationEnabled: true,
    escalationTime: 5,
    autoReply: true,
    autoReplyMessage: "Thanks for your message. We will respond soon.",
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Preferences</h1>
        <p className="text-muted-foreground mt-1">Manage your notification and automation settings</p>
      </div>

      {/* Notifications */}
      <div className="border border-border rounded-lg p-6 bg-background space-y-4">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.emailNotifications}
            onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-foreground">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.pushNotifications}
            onChange={(e) => setPreferences({ ...preferences, pushNotifications: e.target.checked })}
            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-foreground">Push Notifications</p>
            <p className="text-sm text-muted-foreground">Send push notifications to your devices</p>
          </div>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.weeklyDigest}
            onChange={(e) => setPreferences({ ...preferences, weeklyDigest: e.target.checked })}
            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-foreground">Weekly Digest</p>
            <p className="text-sm text-muted-foreground">Get a summary of your week every Monday</p>
          </div>
        </label>
      </div>

      {/* Escalation */}
      <div className="border border-border rounded-lg p-6 bg-background space-y-4">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Escalation Rules</h3>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.escalationEnabled}
            onChange={(e) => setPreferences({ ...preferences, escalationEnabled: e.target.checked })}
            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-foreground">Enable Auto-escalation</p>
            <p className="text-sm text-muted-foreground">Automatically escalate unanswered messages</p>
          </div>
        </label>

        {preferences.escalationEnabled && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Escalate after (minutes)
            </label>
            <input
              type="number"
              value={preferences.escalationTime}
              onChange={(e) => setPreferences({ ...preferences, escalationTime: parseInt(e.target.value) })}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
      </div>

      {/* Auto-reply */}
      <div className="border border-border rounded-lg p-6 bg-background space-y-4">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-border">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Auto-reply</h3>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={preferences.autoReply}
            onChange={(e) => setPreferences({ ...preferences, autoReply: e.target.checked })}
            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
          />
          <div className="flex-1">
            <p className="font-medium text-foreground">Enable Auto-reply</p>
            <p className="text-sm text-muted-foreground">Send automatic reply to new messages</p>
          </div>
        </label>

        {preferences.autoReply && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Auto-reply Message</label>
            <textarea
              value={preferences.autoReplyMessage}
              onChange={(e) => setPreferences({ ...preferences, autoReplyMessage: e.target.value })}
              rows={3}
              className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
      >
        <Save className="w-4 h-4" />
        {isSaving ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}
