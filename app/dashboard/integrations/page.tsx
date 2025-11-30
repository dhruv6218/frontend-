"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useEffect, useState } from "react";
import { mockService } from "@/lib/mock/service";
import { Icon } from "@iconify/react";

type ApiKey = { id: string; last4: string; createdAt: string; scope: string };
type Webhook = { id: string; url: string; events: string[] };

export default function Integrations() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [scope, setScope] = useState("read");
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>(["verification.completed"]);

  useEffect(() => {
    // Placeholder loading
    setKeys([{ id: "key_123", last4: "abcd", createdAt: new Date().toISOString(), scope: "read" }]);
    setWebhooks([{ id: "wh_123", url: "https://example.com/webhooks/vendor", events: ["verification.completed"] }]);
  }, []);

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
            {[
              { name: "Google Drive", icon: "mdi:google-drive", color: "text-blue-500", desc: "Store reports automatically", connected: true },
            ].map((app) => (
              <div key={app.name} className="bg-white rounded-xl border border-neutral-200/70 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-neutral-50 flex items-center justify-center ${app.color}`}>
                    <Icon icon={app.icon} width={24} />
                  </div>
                  {app.connected ? (
                    <span className="px-2 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-medium border border-green-100">
                      Connected
                    </span>
                  ) : (
                    <button className="px-3 py-1.5 rounded-md bg-neutral-900 text-white text-xs font-medium hover:bg-neutral-800 transition-colors">
                      Connect
                    </button>
                  )}
                </div>
                <h4 className="font-semibold text-neutral-900 text-sm">{app.name}</h4>
                <p className="text-xs text-neutral-500 mt-1">{app.desc}</p>
              </div>
            ))}
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
      </PageShell>
    </Protected>
  );
}
