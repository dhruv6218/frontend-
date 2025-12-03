"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useEffect, useState } from "react";
import { useI18n } from "@/app/components/i18n/LanguageProvider";
import { mockService } from "@/lib/mock/service";

interface Item { id: string; text: string; read: boolean }

export default function Notifications() {
  const { t } = useI18n();
  const [items, setItems] = useState<Item[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [prefs, setPrefs] = useState({ 
    inApp: true, 
    email: true, 
    lowCreditsWarning: true,
    bulkJobFinished: true,
    newReportReady: true,
    productUpdates: true,
    dndStart: "22:00", 
    dndEnd: "07:00" 
  });

  async function load() {
    const items = await mockService.notifications.list();
    const mapped: Item[] = items.map((n) => ({ id: String(n.id), text: String(n.message ?? ""), read: Boolean(n.read) }));
    setItems(mapped);
  }

  async function markAll() {
    try {
      await mockService.notifications.markAllRead();
      setMsg("All notifications marked as read.");
      await load();
    } catch (err) {
      setMsg((err as Error).message);
    }
  }

  async function savePrefs() {
    try {
      await mockService.notifications.updatePrefs(prefs);
      setMsg("Preferences saved.");
    } catch (err) {
      setMsg((err as Error).message);
    }
  }

  useEffect(() => { void load(); }, []);

  return (
    <Protected allowedRoles={["user"]}>
      <PageShell title="Notifications" subtitle="Manage read/unread vendor events">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border border-neutral-200/70 bg-white/80 p-4">
            <p className="text-sm font-medium">{t("notifications.preferences")}</p>
            <div className="mt-2 space-y-3 text-sm">
              <div>
                <p className="text-xs text-neutral-600 mb-2 font-medium">Notification Channels</p>
                <label className="flex items-center justify-between mb-2">
                  <span>In-App Notifications</span>
                  <input type="checkbox" checked={prefs.inApp} onChange={(e) => setPrefs(p => ({ ...p, inApp: e.target.checked }))} className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>Email Notifications</span>
                  <input type="checkbox" checked={prefs.email} onChange={(e) => setPrefs(p => ({ ...p, email: e.target.checked }))} className="rounded" />
                </label>
              </div>
              
              <div className="pt-3 border-t border-neutral-200">
                <p className="text-xs text-neutral-600 mb-2 font-medium">Notification Types</p>
                <label className="flex items-center justify-between mb-2">
                  <span>Low Credits Warning</span>
                  <input type="checkbox" checked={prefs.lowCreditsWarning} onChange={(e) => setPrefs(p => ({ ...p, lowCreditsWarning: e.target.checked }))} className="rounded" />
                </label>
                <label className="flex items-center justify-between mb-2">
                  <span>Bulk Job Finished</span>
                  <input type="checkbox" checked={prefs.bulkJobFinished} onChange={(e) => setPrefs(p => ({ ...p, bulkJobFinished: e.target.checked }))} className="rounded" />
                </label>
                <label className="flex items-center justify-between mb-2">
                  <span>New Report Ready</span>
                  <input type="checkbox" checked={prefs.newReportReady} onChange={(e) => setPrefs(p => ({ ...p, newReportReady: e.target.checked }))} className="rounded" />
                </label>
                <label className="flex items-center justify-between">
                  <span>Product Updates</span>
                  <input type="checkbox" checked={prefs.productUpdates} onChange={(e) => setPrefs(p => ({ ...p, productUpdates: e.target.checked }))} className="rounded" />
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <p className="text-xs text-neutral-600 mb-2 font-medium">Do Not Disturb</p>
                <div className="grid grid-cols-2 gap-2">
                  <input type="time" value={prefs.dndStart} onChange={(e) => setPrefs(p => ({ ...p, dndStart: e.target.value }))} className="px-2 py-1 rounded border border-neutral-200/70 text-xs" />
                  <input type="time" value={prefs.dndEnd} onChange={(e) => setPrefs(p => ({ ...p, dndEnd: e.target.value }))} className="px-2 py-1 rounded border border-neutral-200/70 text-xs" />
                </div>
              </div>
              
              <button onClick={() => void savePrefs()} className="mt-3 w-full px-3 py-2 text-sm rounded-md border border-neutral-200/70 hover:bg-neutral-50 transition">
                Save Preferences
              </button>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="mb-2"><button onClick={() => void markAll()} className="px-3 py-2 text-sm rounded-md border border-neutral-200/70">Mark all as read</button></div>
            {msg && <p className="text-xs mb-2">{msg}</p>}
            <ul className="space-y-2 text-sm">
              {items.map(i => (
                <li key={i.id} className={`rounded-md border px-3 py-2 ${i.read ? 'border-neutral-200/70 bg-white/60' : 'border-orange-200 bg-orange-50'}`}>{i.text}</li>
              ))}
            </ul>
          </div>
        </div>
      </PageShell>
    </Protected>
  );
}
