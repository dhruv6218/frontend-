"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useEffect, useState } from "react";
import { mockService } from "@/lib/mock/service";
import { Icon } from "@iconify/react";
import { ToastContainer } from "@/app/components/ui/Toast";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";

type ApiKey = { id: string; last4: string; createdAt: string; scope: string };
type Webhook = { id: string; url: string; events: string[] };

export default function Integrations() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [scope, setScope] = useState("read");
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["verification.completed"]);
  const [driveStatus, setDriveStatus] = useState<{ connected: boolean; email: string | null; auto_save: boolean }>({ connected: false, email: null, auto_save: false });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: string; message: string; type?: "success" | "error" | "info" | "warning" }>>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; onConfirm: () => void }>({ isOpen: false, onConfirm: () => {} });

  const addToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    loadDriveStatus();
    setKeys([{ id: "key_123", last4: "abcd", createdAt: new Date().toISOString(), scope: "read" }]);
    setWebhooks([{ id: "wh_123", url: "https://example.com/webhooks/vendor", events: ["verification.completed"] }]);
  }, []);

  async function loadDriveStatus() {
    const status = await mockService.integrations.getDriveStatus();
    setDriveStatus(status);
  }

  const handleConnectDrive = async () => {
    setLoading(true);
    try {
      await mockService.integrations.connectDrive();
      await loadDriveStatus();
      addToast("Google Drive connected successfully!", "success");
    } catch (err) {
      addToast("Failed to connect Google Drive", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnectDrive = () => {
    setConfirmDialog({
      isOpen: true,
      onConfirm: async () => {
        setLoading(true);
        try {
          await mockService.integrations.disconnectDrive();
          await loadDriveStatus();
          addToast("Google Drive disconnected", "success");
        } catch (err) {
          addToast("Failed to disconnect", "error");
        } finally {
          setLoading(false);
          setConfirmDialog({ isOpen: false, onConfirm: () => {} });
        }
      },
    });
  };

  const handleToggleAutoSave = async (enabled: boolean) => {
    setLoading(true);
    try {
      await mockService.integrations.setAutoSave(enabled);
      await loadDriveStatus();
      addToast(`Auto-save ${enabled ? 'enabled' : 'disabled'}`, "success");
    } catch (err) {
      addToast("Failed to update auto-save setting", "error");
    } finally {
      setLoading(false);
    }
  };

  async function createKey() {
    await mockService.integrations.createKey(scope);
    // reload list (placeholder)
  }
  async function revokeKey(id: string) {
    await mockService.integrations.revokeKey(id);
  }

  async function addWebhook() {
    await mockService.integrations.createWebhook(url, events);
  }
  async function testWebhook(id: string) {
    await mockService.integrations.testWebhook(id);
  }

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Integrations" subtitle="Manage API keys, webhooks, and external storage">

        {/* Connectors Grid */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-neutral-900 mb-4 uppercase tracking-wider">Connected Apps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-neutral-200/70 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center text-blue-500">
                  <Icon icon="mdi:google-drive" width={24} />
                </div>
                {driveStatus.connected ? (
                  <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-medium border border-green-100">
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={handleConnectDrive}
                    disabled={loading}
                    className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50"
                  >
                    Connect
                  </button>
                )}
              </div>
              <h4 className="font-semibold text-neutral-900 text-sm mb-1">Google Drive</h4>
              {driveStatus.connected && driveStatus.email && (
                <p className="text-xs text-neutral-600 mb-2">Connected as: {driveStatus.email}</p>
              )}
              <p className="text-xs text-neutral-500">{driveStatus.connected ? "Store reports automatically" : "Store reports automatically"}</p>
              
              {driveStatus.connected && (
                <div className="mt-4 pt-4 border-t border-neutral-100">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Auto-save all new reports</p>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Automatically save reports to Drive</p>
                    </div>
                    <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${driveStatus.auto_save ? 'bg-orange-500' : 'bg-neutral-200'}`}>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={driveStatus.auto_save}
                        onChange={(e) => handleToggleAutoSave(e.target.checked)}
                        disabled={loading}
                      />
                      <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${driveStatus.auto_save ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </label>
                  <button
                    onClick={handleDisconnectDrive}
                    disabled={loading}
                    className="mt-3 w-full px-3 py-1.5 rounded-md border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    Disconnect
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Keys */}
          <div className="rounded-xl border border-neutral-200/70 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">API Keys</h3>
                <p className="text-xs text-neutral-500">Manage access tokens for your applications.</p>
              </div>
              <button onClick={() => void createKey()} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-medium hover:bg-orange-100 transition-colors">
                <Icon icon="mdi:plus" width={14} /> Generate
              </button>
            </div>

            <div className="space-y-3">
              {keys.map(k => (
                <div key={k.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-white border border-neutral-200 flex items-center justify-center text-neutral-400">
                      <Icon icon="mdi:key-variant" width={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-neutral-700">sk_live_...{k.last4}</code>
                        <span className="px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-600 text-[10px] uppercase font-medium">{k.scope}</span>
                      </div>
                      <p className="text-[10px] text-neutral-400">Created {new Date(k.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button onClick={() => void revokeKey(k.id)} className="text-neutral-400 hover:text-red-500 transition-colors p-1">
                    <Icon icon="mdi:delete-outline" width={18} />
                  </button>
                </div>
              ))}
              {keys.length === 0 && (
                <div className="text-center py-8 text-neutral-400 text-sm">No active API keys found.</div>
              )}
            </div>
          </div>

          {/* Webhooks */}
          <div className="rounded-xl border border-neutral-200/70 bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-neutral-900">Webhooks</h3>
                <p className="text-xs text-neutral-500">Listen for real-time events.</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {webhooks.map(w => (
                <div key={w.id} className="p-3 rounded-lg border border-neutral-100 bg-neutral-50/50">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                      <p className="text-sm font-medium text-neutral-900 truncate max-w-[200px]">{w.url}</p>
                    </div>
                    <button onClick={() => void testWebhook(w.id)} className="text-xs text-blue-600 hover:underline">Test</button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {w.events.map(ev => (
                      <span key={ev} className="px-1.5 py-0.5 rounded bg-white border border-neutral-200 text-neutral-500 text-[10px] font-mono">
                        {ev}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <label className="block text-xs font-medium text-neutral-700 mb-2">Add Endpoint</label>
              <div className="flex gap-2 mb-3">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.yoursite.com/webhooks"
                  className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <button
                  onClick={() => void addWebhook()}
                  className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800"
                >
                  Add
                </button>
              </div>

              <p className="text-xs text-neutral-500 mb-2">Subscribe to events:</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "verification.started",
                  "verification.completed",
                  "invoice.paid",
                  "invoice.failed"
                ].map(ev => (
                  <label key={ev} className="flex items-center gap-2 p-2 rounded border border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={events.includes(ev)}
                      onChange={(e) => setEvents(prev => e.target.checked ? [...prev, ev] : prev.filter(x => x !== ev))}
                      className="rounded border-neutral-300 text-orange-600 focus:ring-orange-500 w-3.5 h-3.5"
                    />
                    <span className="text-xs text-neutral-600 font-mono">{ev}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          title="Disconnect Google Drive?"
          message="Are you sure you want to disconnect Google Drive? Auto-saved reports will stop."
          confirmText="Disconnect"
          cancelText="Cancel"
          confirmVariant="danger"
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ isOpen: false, onConfirm: () => {} })}
        />
      </PageShell>
    </Protected>
  );
}
