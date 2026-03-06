"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Building2, ArrowRight, Phone } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import api from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      // Real registration
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      if (response.data.success) {
        // Store tokens
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
        
        // Redirect to dashboard
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.error || "Registration failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join Flow and start managing your communications">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone (Optional)</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1234567890"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary cursor-pointer"
          />
          <span className="text-sm text-muted-foreground">
            I agree to the{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground font-medium py-2.5 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? "Creating account..." : "Create Account"}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
