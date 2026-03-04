"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    // Mock password reset
    setTimeout(() => {
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }, 1000);
  };

  if (success) {
    return (
      <AuthLayout title="Password Reset" subtitle="Your password has been updated">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="w-16 h-16 text-primary" />
          </div>
          <div>
            <p className="text-foreground">
              Your password has been successfully reset
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Redirecting you to sign in...
            </p>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout title="Invalid Link" subtitle="This password reset link is invalid">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            This link may have expired or is invalid. Please request a new password reset.
          </p>
          <a
            href="/forgot-password"
            className="inline-block text-primary hover:underline font-medium"
          >
            Request New Reset Link
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your new password">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">At least 8 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </AuthLayout>
  );
}
