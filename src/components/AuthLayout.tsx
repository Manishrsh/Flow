import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
          F
        </div>
        <span className="font-bold text-lg text-foreground">Flow</span>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
          {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="bg-muted rounded-lg border border-border p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
