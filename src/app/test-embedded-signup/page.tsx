"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function TestEmbeddedSignupPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [running, setRunning] = useState(false);

  const addTest = (name: string, status: 'running' | 'success' | 'error' | 'warning', message: string, details?: any) => {
    setTests(prev => [...prev, { name, status, message, details, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setTests([]);
    setRunning(true);

    // Test 1: Frontend Environment Variables
    addTest("Frontend Env", "running", "Checking NEXT_PUBLIC_META_APP_ID...");
    const appId = process.env.NEXT_PUBLIC_META_APP_ID;
    if (appId) {
      addTest("Frontend Env", "success", `App ID found: ${appId}`, { appId });
    } else {
      addTest("Frontend Env", "error", "NEXT_PUBLIC_META_APP_ID not found in environment", {
        fix: "Add NEXT_PUBLIC_META_APP_ID to .env.local"
      });
    }

    // Test 2: API URL
    addTest("API URL", "running", "Checking NEXT_PUBLIC_API_URL...");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      addTest("API URL", "success", `API URL: ${apiUrl}`, { apiUrl });
    } else {
      addTest("API URL", "warning", "NEXT_PUBLIC_API_URL not set, using default", {
        default: "http://localhost:5000/api/v1"
      });
    }

    // Test 3: Backend Health
    addTest("Backend Health", "running", "Checking backend connection...");
    try {
      const response = await fetch('http://localhost:5000/health');
      if (response.ok) {
        addTest("Backend Health", "success", "Backend is running");
      } else {
        addTest("Backend Health", "error", `Backend returned ${response.status}`);
      }
    } catch (error: any) {
      addTest("Backend Health", "error", "Cannot connect to backend", {
        error: error.message,
        fix: "Start backend with: cd backend && npm run dev"
      });
    }

    // Test 4: Authentication
    addTest("Authentication", "running", "Checking JWT token...");
    const token = localStorage.getItem('accessToken');
    if (token) {
      addTest("Authentication", "success", "JWT token found");
    } else {
      addTest("Authentication", "warning", "No JWT token found", {
        fix: "Log in first at /login"
      });
    }

    // Test 5: Backend Config Endpoint
    if (token) {
      addTest("Backend Config", "running", "Fetching embedded signup config...");
      try {
        const response = await api.get('/meta-embedded-signup/config');
        const config = response.data.data;
        
        if (config.appId && config.configId) {
          addTest("Backend Config", "success", "Config loaded successfully", {
            appId: config.appId,
            configId: config.configId,
            redirectUri: config.redirectUri
          });

          // Verify App IDs match
          if (config.appId === appId) {
            addTest("App ID Match", "success", "Frontend and backend App IDs match");
          } else {
            addTest("App ID Match", "error", "App ID mismatch!", {
              frontend: appId,
              backend: config.appId,
              fix: "Ensure META_APP_ID in backend/.env matches NEXT_PUBLIC_META_APP_ID in .env.local"
            });
          }
        } else {
          addTest("Backend Config", "error", "Config missing required fields", {
            config,
            fix: "Check META_APP_ID and META_CONFIG_ID in backend/.env"
          });
        }
      } catch (error: any) {
        addTest("Backend Config", "error", "Failed to fetch config", {
          error: error.response?.data?.message || error.message,
          fix: "Check backend logs and environment variables"
        });
      }
    }

    // Test 6: Facebook SDK
    addTest("Facebook SDK", "running", "Checking if Facebook SDK can load...");
    try {
      const sdkResponse = await fetch('https://connect.facebook.net/en_US/sdk.js');
      if (sdkResponse.ok) {
        addTest("Facebook SDK", "success", "Facebook SDK is accessible");
      } else {
        addTest("Facebook SDK", "error", "Cannot access Facebook SDK");
      }
    } catch (error) {
      addTest("Facebook SDK", "error", "Network error accessing Facebook SDK", {
        fix: "Check internet connection and firewall"
      });
    }

    // Test 7: CORS
    addTest("CORS", "running", "Testing CORS configuration...");
    try {
      const response = await fetch('http://localhost:5000/api/v1/meta-embedded-signup/config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      addTest("CORS", "success", "CORS is configured correctly");
    } catch (error: any) {
      if (error.message.includes('CORS')) {
        addTest("CORS", "error", "CORS error detected", {
          fix: "Check CORS_ORIGIN in backend/.env"
        });
      }
    }

    setRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'running':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Embedded Signup Configuration Test
          </h1>
          <p className="text-muted-foreground">
            Run this test to verify your embedded signup configuration
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={running}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {running ? "Running Tests..." : "Run Configuration Tests"}
          </button>
        </div>

        {tests.length > 0 && (
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(test.status)}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{getStatusIcon(test.status)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground">{test.name}</h3>
                      <span className="text-xs text-muted-foreground">{test.timestamp}</span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{test.message}</p>
                    {test.details && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                          Show details
                        </summary>
                        <pre className="mt-2 p-2 bg-black/5 dark:bg-white/5 rounded overflow-x-auto">
                          {JSON.stringify(test.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tests.length === 0 && !running && (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">
              Click "Run Configuration Tests" to check your setup
            </p>
          </div>
        )}

        {!running && tests.length > 0 && (
          <div className="mt-8 p-6 border border-border rounded-lg bg-muted/50">
            <h3 className="font-semibold text-foreground mb-4">Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {tests.filter(t => t.status === 'success').length}
                </div>
                <div className="text-sm text-muted-foreground">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {tests.filter(t => t.status === 'warning').length}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {tests.filter(t => t.status === 'error').length}
                </div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 border border-border rounded-lg bg-background">
          <h3 className="font-semibold text-foreground mb-4">Quick Fixes</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">1. Environment Variables</p>
              <p className="text-muted-foreground mb-2">Create <code className="px-1 py-0.5 bg-muted rounded">.env.local</code> in project root:</p>
              <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
{`NEXT_PUBLIC_META_APP_ID=your-app-id
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1`}
              </pre>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">2. Backend Environment</p>
              <p className="text-muted-foreground mb-2">Update <code className="px-1 py-0.5 bg-muted rounded">backend/.env</code>:</p>
              <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
{`META_APP_ID=your-app-id
META_APP_SECRET=your-app-secret
META_CONFIG_ID=your-config-id
APP_URL=http://localhost:3000`}
              </pre>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">3. Start Backend</p>
              <pre className="p-3 bg-muted rounded text-xs overflow-x-auto">
{`cd backend
npm run dev`}
              </pre>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">4. Login First</p>
              <p className="text-muted-foreground">
                Go to <a href="/login" className="text-primary hover:underline">/login</a> to authenticate before testing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
