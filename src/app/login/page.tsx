"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, ArrowRight } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Real authentication
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.success) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.error || "Invalid email or password");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Flow account">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Password</label>
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
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-primary hover:underline transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? "Signing in..." : "Sign In"}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline font-medium">
            Create one
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
