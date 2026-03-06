"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Plus, CheckCircle2, AlertCircle, X, RefreshCw, Settings, Trash2, Send, Copy, ExternalLink, Zap } from "lucide-react";
import api from "@/lib/api";
import WhatsAppEmbeddedSignup from "@/components/WhatsAppEmbeddedSignup";
import { useAuth } from "@/hooks/useAuth";

interface WhatsAppAccount {
  _id: string;
  name: string;
  phoneNumber: string;
  phoneNumberId: string;
  businessAccountId: string;
  status: "active" | "inactive" | "expired" | "error";
  isDefault: boolean;
  metadata: {
    displayName?: string;
    qualityRating?: string;
    verifiedName?: string;
    messagingLimit?: string;
  };
  rateLimits: {
    messagesPerDay: number;
    currentDayCount: number;
  };
  lastSyncedAt?: string;
  createdAt: string;
}

export default function IntegrationsPage() {
  useAuth(); // Protect this route
  
  const [accounts, setAccounts] = useState<WhatsAppAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [addMethod, setAddMethod] = useState<'embedded' | 'manual' | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [showWebhook, setShowWebhook] = useState<string | null>(null);
  const [webhookConfig, setWebhookConfig] = useState<any>(null);
  const [testPhone, setTestPhone] = useState("");

  const [newAccount, setNewAccount] = useState({
    name: "",
    phoneNumberId: "",
    phoneNumber: "",
    businessAccountId: "",
    accessToken: "",
    isDefault: false
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/whatsapp-accounts');
      setAccounts(response.data.data);
    } catch (error) {
      console.error("Error fetching WhatsApp accounts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAccount = async () => {
    if (!newAccount.name || !newAccount.phoneNumberId || !newAccount.phoneNumber || 
        !newAccount.businessAccountId || !newAccount.accessToken) {
      alert("All fields are required");
      return;
    }

    try {
      const response = await api.post('/whatsapp-accounts', newAccount);
      alert(`Account added successfully!\n\nWebhook URL: ${response.data.webhookUrl}\nVerify Token: ${response.data.webhookVerifyToken}\n\nPlease configure these in Meta for Developers.`);
      setNewAccount({
        name: "",
        phoneNumberId: "",
        phoneNumber: "",
        businessAccountId: "",
        accessToken: "",
        isDefault: false
      });
      setIsAdding(false);
      fetchAccounts();
    } catch (error: any) {
      console.error("Error adding account:", error);
      alert(error.response?.data?.message || "Failed to add WhatsApp account");
    }
  };

  const handleSync = async (accountId: string) => {
    try {
      await api.post(`/whatsapp-accounts/${accountId}/sync`);
      alert("Account synced successfully");
      fetchAccounts();
    } catch (error) {
      console.error("Error syncing account:", error);
      alert("Failed to sync account");
    }
  };

  const handleTest = async (accountId: string) => {
    if (!testPhone) {
      alert("Please enter a test phone number");
      return;
    }

    try {
      await api.post(`/whatsapp-accounts/${accountId}/test`, { testPhoneNumber: testPhone });
      alert("Test message sent successfully! Check your WhatsApp.");
      setTestPhone("");
      setSelectedAccount(null);
    } catch (error: any) {
      console.error("Error sending test message:", error);
      alert(error.response?.data?.message || "Failed to send test message");
    }
  };

  const handleDelete = async (accountId: string) => {
    if (!confirm("Are you sure you want to delete this WhatsApp account?")) {
      return;
    }

    try {
      await api.delete(`/whatsapp-accounts/${accountId}`);
      alert("Account deleted successfully");
      fetchAccounts();
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account");
    }
  };

  const handleSetDefault = async (accountId: string) => {
    try {
      await api.put(`/whatsapp-accounts/${accountId}`, { isDefault: true });
      fetchAccounts();
    } catch (error) {
      console.error("Error setting default account:", error);
      alert("Failed to set default account");
    }
  };

  const fetchWebhookConfig = async (accountId: string) => {
    try {
      const response = await api.get(`/whatsapp-accounts/${accountId}/webhook`);
      setWebhookConfig(response.data.data);
      setShowWebhook(accountId);
    } catch (error) {
      console.error("Error fetching webhook config:", error);
      alert("Failed to fetch webhook configuration");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const getQualityBadge = (rating?: string) => {
    if (!rating) return null;
    const colors: any = {
      GREEN: "bg-green-500/10 text-green-600 dark:text-green-400",
      YELLOW: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      RED: "bg-red-500/10 text-red-600 dark:text-red-400"
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[rating] || colors.GREEN}`}>
        Quality: {rating}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">WhatsApp Cloud API</h1>
          <p className="text-muted-foreground mt-1">Manage your WhatsApp Business accounts</p>
        </div>
        <div className="flex gap-2">
          <WhatsAppEmbeddedSignup
            debug={true}
            onSuccess={(account) => {
              fetchAccounts();
              alert("WhatsApp account connected successfully!");
            }}
            onError={(error) => {
              console.error("Embedded signup error:", error);
              alert(`Connection failed: ${error}`);
            }}
            buttonText="Quick Connect"
            buttonClassName="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          />
          <button
            onClick={() => {
              setAddMethod('manual');
              setIsAdding(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Manual Setup
          </button>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.length > 0 ? (
          accounts.map((account) => (
            <div
              key={account._id}
              className="border border-border rounded-lg p-6 bg-background hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10 text-green-600">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{account.name}</h3>
                      {account.isDefault && (
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs rounded-full font-medium">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{account.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {account.metadata.verifiedName || account.metadata.displayName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.status === "active" ? (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-medium">
                      <AlertCircle className="w-3 h-3" />
                      {account.status}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">Messages Today</p>
                  <p className="text-lg font-bold text-foreground">
                    {account.rateLimits.currentDayCount} / {account.rateLimits.messagesPerDay}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Messaging Limit</p>
                  <p className="text-lg font-bold text-foreground">
                    {account.metadata.messagingLimit || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Quality Badge */}
              <div className="mb-4">
                {getQualityBadge(account.metadata.qualityRating)}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSync(account._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync
                </button>
                <button
                  onClick={() => setSelectedAccount(account._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <Send className="w-4 h-4" />
                  Test
                </button>
                <button
                  onClick={() => fetchWebhookConfig(account._id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm"
                >
                  <Settings className="w-4 h-4" />
                  Webhook
                </button>
                {!account.isDefault && (
                  <button
                    onClick={() => handleSetDefault(account._id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors text-sm"
                  >
                    Set Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(account._id)}
                  className="col-span-2 flex items-center justify-center gap-2 px-3 py-2 border border-destructive rounded-lg text-destructive hover:bg-destructive/10 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 border border-dashed border-border rounded-lg">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground mb-4">No WhatsApp accounts connected</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <WhatsAppEmbeddedSignup
                onSuccess={(account) => {
                  fetchAccounts();
                  alert("WhatsApp account connected successfully!");
                }}
                onError={(error) => {
                  console.error("Embedded signup error:", error);
                }}
                buttonText="Quick Connect"
                buttonClassName="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              />
              <button
                onClick={() => {
                  setAddMethod('manual');
                  setIsAdding(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-border text-foreground hover:bg-muted font-medium rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
                Manual Setup
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Account Modal */}
      {isAdding && addMethod === 'manual' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-2xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Add WhatsApp Business Account</h3>
              <button
                onClick={() => {
                  setIsAdding(false);
                  setAddMethod(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg text-sm">
                <p className="font-medium mb-2">📋 Before you start:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Create a Meta for Developers account at developers.facebook.com</li>
                  <li>Create a new app or use existing one</li>
                  <li>Add WhatsApp product to your app</li>
                  <li>Get your Phone Number ID, Business Account ID, and Access Token</li>
                </ol>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Account Name *</label>
                <input
                  type="text"
                  value={newAccount.name}
                  onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                  placeholder="e.g., Main Business Account"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number ID *</label>
                <input
                  type="text"
                  value={newAccount.phoneNumberId}
                  onChange={(e) => setNewAccount({ ...newAccount, phoneNumberId: e.target.value })}
                  placeholder="123456789012345"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">Found in WhatsApp &gt; API Setup</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number *</label>
                <input
                  type="text"
                  value={newAccount.phoneNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, phoneNumber: e.target.value })}
                  placeholder="+1234567890"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Business Account ID *</label>
                <input
                  type="text"
                  value={newAccount.businessAccountId}
                  onChange={(e) => setNewAccount({ ...newAccount, businessAccountId: e.target.value })}
                  placeholder="123456789012345"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">Found in WhatsApp &gt; API Setup</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Access Token *</label>
                <textarea
                  value={newAccount.accessToken}
                  onChange={(e) => setNewAccount({ ...newAccount, accessToken: e.target.value })}
                  placeholder="EAAxxxxxxxxxx..."
                  rows={3}
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground mt-1">Generate a permanent token in Meta for Developers</p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAccount.isDefault}
                  onChange={(e) => setNewAccount({ ...newAccount, isDefault: e.target.checked })}
                  className="rounded border-border"
                />
                <label htmlFor="isDefault" className="text-sm text-foreground">
                  Set as default account
                </label>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => {
                  setIsAdding(false);
                  setAddMethod(null);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAccount}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Message Modal */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Send Test Message</h3>
              <button
                onClick={() => {
                  setSelectedAccount(null);
                  setTestPhone("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Test Phone Number</label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">Include country code (e.g., +1 for US)</p>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => {
                  setSelectedAccount(null);
                  setTestPhone("");
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleTest(selectedAccount)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Send Test
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhook Config Modal */}
      {showWebhook && webhookConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-3xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Webhook Configuration</h3>
              <button
                onClick={() => {
                  setShowWebhook(null);
                  setWebhookConfig(null);
                }}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Callback URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookConfig.webhookUrl}
                    readOnly
                    className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-foreground font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookConfig.webhookUrl)}
                    className="px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Verify Token</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={webhookConfig.webhookVerifyToken}
                    readOnly
                    className="flex-1 bg-muted border border-border rounded-lg px-4 py-2 text-foreground font-mono text-sm"
                  />
                  <button
                    onClick={() => copyToClipboard(webhookConfig.webhookVerifyToken)}
                    className="px-3 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                <p className="font-medium mb-3 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  Setup Instructions:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  {Object.entries(webhookConfig.instructions).map(([key, value]) => (
                    <li key={key}>{value as string}</li>
                  ))}
                </ol>
              </div>

              <div className="p-4 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-lg text-sm">
                <p className="font-medium mb-2">⚠️ Important Notes:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Your server must be publicly accessible via HTTPS</li>
                  <li>Meta will send a GET request to verify the webhook</li>
                  <li>Subscribe to "messages" and "message_status" fields</li>
                  <li>Test the webhook after configuration</li>
                </ul>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => {
                  setShowWebhook(null);
                  setWebhookConfig(null);
                }}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
