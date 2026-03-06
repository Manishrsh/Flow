"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, MoreVertical, Upload, FileDown, X, Mail } from "lucide-react";
import { contactsAPI } from "@/lib/api";

interface Contact {
  _id: string;
  name: string;
  email?: string;
  phone: string;
  tags?: string[];
  status?: string;
  createdAt: string;
}

export default function ContactsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactsAPI.getAll();
      setContacts(response.data.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone.includes(searchTerm)
  );

  const handleAddContact = async () => {
    if (newContact.name && newContact.phone) {
      try {
        await contactsAPI.create(newContact);
        setNewContact({ name: "", email: "", phone: "" });
        setIsAddingContact(false);
        fetchContacts();
      } catch (error) {
        console.error("Error creating contact:", error);
        alert("Failed to create contact");
      }
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await contactsAPI.import(file);
        fetchContacts();
        alert("Contacts imported successfully");
      } catch (error) {
        console.error("Error importing contacts:", error);
        alert("Failed to import contacts");
      }
    }
  };

  const handleExport = async () => {
    try {
      const response = await contactsAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contacts-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error exporting contacts:", error);
      alert("Failed to export contacts");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted-foreground mt-1">Manage and organize your customer contacts</p>
        </div>
        <div className="flex gap-2">
          <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".csv" onChange={handleImport} className="hidden" />
          </label>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setIsAddingContact(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Contact
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Add Contact Modal */}
      {isAddingContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Add New Contact</h3>
              <button
                onClick={() => setIsAddingContact(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  className="w-full bg-input border border-border rounded-lg px-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="flex gap-2 p-6 border-t border-border">
              <button
                onClick={() => setIsAddingContact(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContact}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Add Contact
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Tags</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Added</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr key={contact._id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-foreground font-medium">{contact.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{contact.email || '—'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{contact.phone}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {contact.tags && contact.tags.length > 0 ? (
                          contact.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contact.status === "active"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : "bg-gray-500/10 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {contact.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No contacts found
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
