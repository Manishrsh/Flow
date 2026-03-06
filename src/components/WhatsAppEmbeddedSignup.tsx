"use client";

import { useEffect, useState } from "react";
import { MessageSquare, CheckCircle2, Loader2, AlertCircle, Bug } from "lucide-react";
import api from "@/lib/api";

interface WhatsAppEmbeddedSignupProps {
  onSuccess?: (account: any) => void;
  onError?: (error: string) => void;
  buttonText?: string;
  buttonClassName?: string;
  debug?: boolean;
}

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function WhatsAppEmbeddedSignup({
  onSuccess,
  onError,
  buttonText = "Connect WhatsApp Business",
  buttonClassName = "",
  debug = false
}: WhatsAppEmbeddedSignupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [step, setStep] = useState<'idle' | 'loading' | 'selecting' | 'completing' | 'success' | 'error'>('idle');
  const [selectedPhone, setSelectedPhone] = useState<any>(null);
  const [availablePhones, setAvailablePhones] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [tokenData, setTokenData] = useState<any>(null);

  const addDebug = (message: string) => {
    console.log(`[WhatsApp Signup] ${message}`);
    if (debug) {
      setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    }
  };

  useEffect(() => {
    addDebug("Component mounted");
    loadConfig();
    loadFacebookSDK();
  }, []);

  const loadConfig = async () => {
    try {
      addDebug("Loading config from backend...");
      const response = await api.get('/meta-embedded-signup/config');
      setConfig(response.data.data);
      addDebug(`Config loaded: App ID ${response.data.data.appId}, Config ID ${response.data.data.configId}`);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to load config";
      addDebug(`Config load error: ${errorMsg}`);
      setError(errorMsg);
      console.error("Failed to load config:", error);
    }
  };

  const loadFacebookSDK = () => {
    addDebug("Loading Facebook SDK...");
    
    if (window.FB) {
      addDebug("Facebook SDK already loaded");
      setIsSdkLoaded(true);
      return;
    }

    window.fbAsyncInit = function() {
      const appId = process.env.NEXT_PUBLIC_META_APP_ID;
      addDebug(`Initializing FB SDK with App ID: ${appId}`);
      
      if (!appId) {
        addDebug("ERROR: NEXT_PUBLIC_META_APP_ID not found in environment");
        setError("Meta App ID not configured. Please check environment variables.");
        return;
      }

      window.FB.init({
        appId: appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });
      
      addDebug("Facebook SDK initialized successfully");
      setIsSdkLoaded(true);
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        addDebug("Facebook SDK script already exists");
        return;
      }
      js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.onerror = () => {
        addDebug("ERROR: Failed to load Facebook SDK script");
        setError("Failed to load Facebook SDK. Please check your internet connection.");
      };
      js.onload = () => {
        addDebug("Facebook SDK script loaded");
      };
      fjs.parentNode?.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  };

  const launchWhatsAppSignup = () => {
    addDebug("Launch button clicked");
    
    if (!isSdkLoaded) {
      const errorMsg = "Facebook SDK not loaded yet. Please wait a moment and try again.";
      addDebug(`ERROR: ${errorMsg}`);
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    if (!config) {
      const errorMsg = "Configuration not loaded. Please refresh the page.";
      addDebug(`ERROR: ${errorMsg}`);
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    if (!config.configId) {
      const errorMsg = "Meta Config ID is missing. Please check your backend configuration.";
      addDebug(`ERROR: ${errorMsg}`);
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    addDebug(`Launching FB.login with config_id: ${config.configId}`);
    setIsLoading(true);
    setStep('loading');
    setError("");

    try {
      // Launch Meta's Embedded Signup
      window.FB.login(
        function(response: any) {
          addDebug(`FB.login response received: ${JSON.stringify(response)}`);
          
          if (response.authResponse) {
            addDebug("Auth response received successfully");
            const code = response.authResponse.code;
            
            if (!code) {
              addDebug("ERROR: No authorization code in response");
              setIsLoading(false);
              setStep('error');
              setError("No authorization code received from Meta");
              onError?.("No authorization code received");
              return;
            }
            
            addDebug(`Authorization code received: ${code.substring(0, 20)}...`);
            handleAuthResponse(code);
          } else {
            addDebug("Authorization cancelled or failed");
            setIsLoading(false);
            setStep('error');
            const errorMsg = response.error?.message || "Authorization cancelled or failed";
            setError(errorMsg);
            onError?.(errorMsg);
          }
        },
        {
          config_id: config.configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            setup: {},
            featureType: '',
            sessionInfoVersion: 2
          }
        }
      );
      addDebug("FB.login called successfully");
    } catch (err: any) {
      addDebug(`ERROR launching FB.login: ${err.message}`);
      setIsLoading(false);
      setStep('error');
      setError(err.message);
      onError?.(err.message);
    }
  };

  const handleAuthResponse = async (code: string) => {
    try {
      addDebug("Starting token exchange...");
      setStep('loading');

      // Exchange code for access token
      addDebug("Calling /meta-embedded-signup/exchange-token");
      const tokenResponse = await api.post('/meta-embedded-signup/exchange-token', { code });
      const { accessToken, wabaId } = tokenResponse.data.data;
      
      addDebug(`Token exchange successful. WABA ID: ${wabaId}`);
      setTokenData({ accessToken, wabaId });

      // Get available phone numbers
      addDebug("Fetching available phone numbers...");
      const phonesResponse = await api.post('/meta-embedded-signup/phone-numbers', {
        wabaId,
        accessToken
      });

      const phones = phonesResponse.data.data;
      addDebug(`Found ${phones.length} phone number(s)`);

      if (phones.length === 0) {
        throw new Error("No phone numbers found in this WhatsApp Business Account");
      }

      if (phones.length === 1) {
        addDebug("Auto-selecting single phone number");
        // Auto-select if only one phone
        await completeSignup(phones[0].id, wabaId, accessToken, phones[0].verifiedName);
      } else {
        addDebug("Showing phone selection modal");
        // Show phone selection
        setAvailablePhones(phones);
        setStep('selecting');
        setIsLoading(false);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to complete signup";
      addDebug(`ERROR in handleAuthResponse: ${errorMsg}`);
      console.error("Auth response error:", error);
      setStep('error');
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
    }
  };

  const completeSignup = async (phoneNumberId: string, wabaId: string, accessToken: string, name?: string) => {
    try {
      addDebug(`Completing signup for phone: ${phoneNumberId}`);
      setStep('completing');
      setIsLoading(true);

      const response = await api.post('/meta-embedded-signup/complete', {
        accessToken,
        wabaId,
        phoneNumberId,
        name
      });

      addDebug("Signup completed successfully!");
      setStep('success');
      setIsLoading(false);
      onSuccess?.(response.data.data);

      // Auto-close after 2 seconds
      setTimeout(() => {
        setStep('idle');
      }, 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to complete signup";
      addDebug(`ERROR in completeSignup: ${errorMsg}`);
      console.error("Complete signup error:", error);
      setStep('error');
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
    }
  };

  const handlePhoneSelect = (phone: any) => {
    addDebug(`Phone selected: ${phone.displayPhoneNumber}`);
    setSelectedPhone(phone);
  };

  const confirmPhoneSelection = async () => {
    if (!selectedPhone || !tokenData) {
      addDebug("ERROR: No phone selected or token data missing");
      return;
    }

    addDebug("Confirming phone selection");
    await completeSignup(
      selectedPhone.id, 
      tokenData.wabaId, 
      tokenData.accessToken, 
      selectedPhone.verifiedName
    );
  };

  return (
    <>
      {/* Debug Panel */}
      {debug && debugInfo.length > 0 && (
        <div className="fixed bottom-4 right-4 max-w-md w-full bg-black/90 text-white p-4 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              <span className="font-semibold text-sm">Debug Log</span>
            </div>
            <button
              onClick={() => setDebugInfo([])}
              className="text-xs text-gray-400 hover:text-white"
            >
              Clear
            </button>
          </div>
          <div className="space-y-1 text-xs font-mono">
            {debugInfo.map((info, i) => (
              <div key={i} className="text-gray-300">{info}</div>
            ))}
          </div>
        </div>
      )}

      {/* Phone Selection Modal */}
      {step === 'selecting' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Select Phone Number</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose which phone number to connect
              </p>
            </div>
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {availablePhones.map((phone) => (
                <button
                  key={phone.id}
                  onClick={() => handlePhoneSelect(phone)}
                  className={`w-full p-4 border rounded-lg text-left transition-all ${
                    selectedPhone?.id === phone.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{phone.displayPhoneNumber}</p>
                      <p className="text-sm text-muted-foreground">{phone.verifiedName}</p>
                    </div>
                    {selectedPhone?.id === phone.id && (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      phone.qualityRating === 'GREEN' 
                        ? 'bg-green-500/10 text-green-600'
                        : phone.qualityRating === 'YELLOW'
                        ? 'bg-yellow-500/10 text-yellow-600'
                        : 'bg-red-500/10 text-red-600'
                    }`}>
                      {phone.qualityRating}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => {
                  setStep('idle');
                  setAvailablePhones([]);
                  setSelectedPhone(null);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPhoneSelection}
                disabled={!selectedPhone}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading/Completing Modal */}
      {(step === 'completing' || step === 'loading') && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {step === 'loading' ? 'Connecting...' : 'Completing Setup...'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we set up your WhatsApp Business account
            </p>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {step === 'success' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Successfully Connected!
            </h3>
            <p className="text-sm text-muted-foreground">
              Your WhatsApp Business account is now connected and ready to use
            </p>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {step === 'error' && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Connection Failed
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {error}
            </p>
            <button
              onClick={() => {
                setStep('idle');
                setError("");
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main Button */}
      {step === 'idle' && (
        <button
          onClick={launchWhatsAppSignup}
          disabled={isLoading || !isSdkLoaded || !config}
          className={buttonClassName || "flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"}
          title={!isSdkLoaded ? "Loading Facebook SDK..." : !config ? "Loading configuration..." : ""}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : !isSdkLoaded ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading SDK...
            </>
          ) : !config ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading...
            </>
          ) : (
            <>
              <MessageSquare className="w-5 h-5" />
              {buttonText}
            </>
          )}
        </button>
      )}
    </>
  );
}
