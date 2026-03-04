"use client";

import React, { useState } from "react";
import { Download, Search, CreditCard, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";

interface Payment {
  id: string;
  customer: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  method: string;
  date: string;
  orderId: string;
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSettings, setIsSettings] = useState(false);
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "PAY-001",
      customer: "John Doe",
      amount: 299.99,
      status: "completed",
      method: "Stripe",
      date: "Jan 22, 2024",
      orderId: "ORD-1001",
    },
    {
      id: "PAY-002",
      customer: "Jane Smith",
      amount: 149.99,
      status: "completed",
      method: "Razorpay",
      date: "Jan 21, 2024",
      orderId: "ORD-1002",
    },
    {
      id: "PAY-003",
      customer: "Bob Johnson",
      amount: 499.99,
      status: "pending",
      method: "Stripe",
      date: "Jan 20, 2024",
      orderId: "ORD-1003",
    },
    {
      id: "PAY-004",
      customer: "Alice Williams",
      amount: 89.99,
      status: "failed",
      method: "Razorpay",
      date: "Jan 19, 2024",
      orderId: "ORD-1004",
    },
  ]);

  const filteredPayments = payments.filter(
    (payment) =>
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.orderId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      case "failed":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
    }
  };

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground mt-1">Manage transactions and payment settings</p>
        </div>
        <button
          onClick={() => setIsSettings(true)}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 border border-border rounded-lg bg-background">
          <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold text-foreground mt-2">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Completed payments only</p>
        </div>
        <div className="p-6 border border-border rounded-lg bg-background">
          <p className="text-sm font-medium text-muted-foreground">Pending Amount</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">${pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">{payments.filter((p) => p.status === "pending").length} transactions</p>
        </div>
        <div className="p-6 border border-border rounded-lg bg-background">
          <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
          <p className="text-3xl font-bold text-foreground mt-2">{payments.length}</p>
          <p className="text-xs text-muted-foreground mt-2">This month</p>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Payment Settings</h3>
              <button
                onClick={() => setIsSettings(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 border border-border rounded-lg">
                <h4 className="font-medium text-foreground mb-3">Configure Payment Gateways</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Stripe API Key</label>
                    <input
                      type="password"
                      placeholder="sk_live_..."
                      className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Razorpay Key ID</label>
                    <input
                      type="password"
                      placeholder="rzp_live_..."
                      className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => setIsSettings(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsSettings(false)}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by customer or order ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Payment ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{payment.id}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payment.customer}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payment.orderId}</td>
                    <td className="px-6 py-4 text-sm text-foreground font-medium">${payment.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payment.method}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(payment.status)}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{payment.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs">Invoice</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-muted-foreground">
                    No payments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
