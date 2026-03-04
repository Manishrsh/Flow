"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Zap,
  Send,
  MessageCircle,
  Users,
  Layers,
  ShoppingBag,
  CreditCard,
  Puzzle,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  User,
  Moon,
  Sun,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Inbox",
    href: "/inbox",
    icon: <MessageSquare className="w-5 h-5" />,
    badge: "3",
  },
  {
    label: "Chatbot Builder",
    href: "/chatbot-builder",
    icon: <Zap className="w-5 h-5" />,
  },
  {
    label: "Campaigns",
    href: "/campaigns",
    icon: <Send className="w-5 h-5" />,
  },
  {
    label: "Templates",
    href: "/templates",
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    label: "Contacts",
    href: "/contacts",
    icon: <Users className="w-5 h-5" />,
  },
  {
    label: "Segments",
    href: "/segments",
    icon: <Layers className="w-5 h-5" />,
  },
  {
    label: "Catalog",
    href: "/catalog",
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    label: "Payments",
    href: "/payments",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    label: "Integrations",
    href: "/integrations",
    icon: <Puzzle className="w-5 h-5" />,
  },
  {
    label: "Settings",
    href: "/settings/profile",
    icon: <Settings className="w-5 h-5" />,
    children: [
      { label: "Profile", href: "/settings/profile", icon: <User className="w-4 h-4" /> },
      { label: "Team", href: "/settings/team", icon: <Users className="w-4 h-4" /> },
      { label: "Preferences", href: "/settings/preferences", icon: <Settings className="w-4 h-4" /> },
    ],
  },
  {
    label: "Admin",
    href: "/admin/tenants",
    icon: <Shield className="w-5 h-5" />,
    children: [
      { label: "Tenants", href: "/admin/tenants", icon: <Building2 className="w-4 h-4" /> },
      { label: "Billing", href: "/admin/billing", icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
];

import { Building2, BarChart3 } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.style.colorScheme = "light";
    } else {
      document.documentElement.style.colorScheme = "dark";
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static md:translate-x-0 h-screen w-64 bg-background border-r border-border flex flex-col transition-transform duration-300 z-40 shadow-lg`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                F
              </div>
              <span className="font-bold text-lg">Flow</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
          {navItems.map((item) => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      expandedItems.includes(item.label)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                    </div>
                    {isOpen && (
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          expandedItems.includes(item.label) ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                      </svg>
                    )}
                  </button>
                  {expandedItems.includes(item.label) && (
                    <div className="ml-4 space-y-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                            isActive(child.href)
                              ? "bg-primary text-primary-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {child.icon}
                          {isOpen && child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                  </div>
                  {item.badge && isOpen && (
                    <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
            {isOpen && <span className="text-sm font-medium">Theme</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors">
            <LogOut className="w-5 h-5" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
