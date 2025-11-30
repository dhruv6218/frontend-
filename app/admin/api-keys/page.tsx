"use client";

import Protected from "@/app/components/auth/Protected";
import PageShell from "@/app/components/dashboard/PageShell";
import React, { useEffect, useState } from "react";

interface KeyItem { id: string; name: string; key_prefix: string; key_last_four: string; status: string }

export default function AdminApiKeys() {
  const [items, setItems] = useState<KeyItem[]>([]);
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    // Mock data
    await new Promise(r => setTimeout(r, 500));
    setItems([
      { id: "key_1", name: "Production Key", key_prefix: "rv_prod", key_last_four: "1234", status: "active" },
      { id: "key_2", name: "Test Key", key_prefix: "rv_test", key_last_four: "5678", status: "active" }
    ]);
  }

  async function createKey() {
    if (!name) { setMsg("Name required"); return; }
    await new Promise(r => setTimeout(r, 500));
    setMsg(`Created: rv_live_...9999`);
    setName("");
    await load();
  }

  async function rotate(id: string) {
    void id;
    await new Promise(r => setTimeout(r, 500));
    setMsg(`Rotated: rv_live_...8888`);
    await load();
  }

  useEffect(() => { void load(); }, []);

  return (
    <Protected allowedRoles={["admin"]}>
      <PageShell title="API Keys" subtitle="Manage verification API keys with rotation">
        <div className="rounded-lg border border-neutral-200/70 bg-white/80 p-4">
          <div className="text-sm mb-2">Create new key</div>
          <div className="flex items-center gap-2">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="px-3 py-2 text-sm rounded-md border border-neutral-200/70" />
            <button onClick={() => void createKey()} className="px-3 py-2 text-sm rounded-md border border-neutral-200/70">Create</button>
          </div>
          {msg && <p className="text-xs mt-2">{msg}</p>}
          <div className="mt-4 text-sm">
            {items.map(it => (
              <div key={it.id} className="flex items-center justify-between border-t py-2">
                <div>
                  <div>{it.name}</div>
                  <div className="text-xs text-neutral-600">{it.key_prefix}••••••••{it.key_last_four} • {it.status}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => void rotate(it.id)} className="px-3 py-2 text-sm rounded-md border border-neutral-200/70">Rotate</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageShell>
    </Protected>
  );
}
