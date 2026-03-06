"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  Send,
  FileText,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { dashboardAPI } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  useAuth(); // Protect this route
  
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activityResponse] = await Promise.all([
        dashboardAPI.getStats(selectedPeriod),
        dashboardAPI.getActivity(10)
      ]);
      
      setDashboardData(statsResponse.data.data);
      setRecentActivity(activityResponse.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: "Messages Sent",
      value: dashboardData?.messages?.sent?.toLocaleString() || "0",
      change: "+12.5%",
      trend: "up",
      icon: <MessageSquare className="w-6 h-6" />,
      color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Active Chats",
      value: dashboardData?.conversations?.active?.toLocaleString() || "0",
      change: "+5.2%",
      trend: "up",
      icon: <Users className="w-6 h-6" />,
      color: "bg-green-500/10 text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    {
      label: "Campaigns",
      value: dashboardData?.campaigns?.total?.toLocaleString() || "0",
      change: dashboardData?.campaigns?.running > 0 ? `${dashboardData.campaigns.running} running` : "0 running",
      trend: "up",
      icon: <Send className="w-6 h-6" />,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      label: "Total Contacts",
      value: dashboardData?.contacts?.total?.toLocaleString() || "0",
      change: "+8.3%",
      trend: "up",
      icon: <FileText className="w-6 h-6" />,
      color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
    },
  ];

  const chartData = dashboardData?.messagesOverTime?.map((item: any) => ({
    date: new Date(item._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    messages: item.count,
  })) || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's your performance overview.</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg border ${stat.border} ${stat.color} bg-background transition-all hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg opacity-50">{stat.icon}</div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.trend === "up" ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                {stat.change}
              </span>
              <span className="text-xs text-muted-foreground">vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <div className="lg:col-span-2 p-6 border border-border rounded-lg bg-background">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Message Trends</h3>
              <p className="text-sm text-muted-foreground">Messages sent over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-background)",
                    border: `1px solid var(--color-border)`,
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "var(--color-foreground)" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={{ fill: "var(--color-primary)", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No data available for the selected period
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="p-6 border border-border rounded-lg bg-background">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Summary</h3>
              <p className="text-sm text-muted-foreground">Campaign performance</p>
            </div>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Total Sent</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {dashboardData?.campaigns?.totalSent?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Total Delivered</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {dashboardData?.campaigns?.totalDelivered?.toLocaleString() || "0"}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Delivery Rate</p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {dashboardData?.campaigns?.totalSent > 0
                  ? `${((dashboardData.campaigns.totalDelivered / dashboardData.campaigns.totalSent) * 100).toFixed(1)}%`
                  : "0%"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="p-6 border border-border rounded-lg bg-background">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Messages</h3>
        <div className="space-y-3">
          {recentActivity.length > 0 ? (
            recentActivity.map((activity: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="text-2xl">
                  {activity.direction === 'outbound' ? '📤' : '📥'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.direction === 'outbound' ? 'Sent' : 'Received'}: {activity.content?.substring(0, 50)}...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.contactId?.name || activity.contactId?.phone || 'Unknown'} • {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
