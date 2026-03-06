"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Settings, User, LogOut, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="h-16 bg-background border-b border-border flex items-center justify-between px-6 shadow-sm sticky top-0 z-20">
      {/* Left Section - Logo/Breadcrumb */}
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full bg-input border border-border rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Right Section - Icons & Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {user ? getInitials(user.name) : 'U'}
            </div>
            <span className="hidden sm:inline text-sm font-medium">{user?.name || 'User'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
              <button 
                onClick={() => router.push('/settings/profile')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </button>
              <button 
                onClick={() => router.push('/settings/preferences')}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <hr className="my-2 border-border" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
