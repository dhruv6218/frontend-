"use client";

import React, { useState } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export default function AdminSettings() {
  const [productName, setProductName] = useState("Ravono Vendor Compliance");
  const [primaryColor, setPrimaryColor] = useState("#F97316");
  const [supportEmail, setSupportEmail] = useState("support@ravono.com");
  const [whatsappNumber, setWhatsappNumber] = useState("9034950792");
  const [privacyUrl, setPrivacyUrl] = useState("/legal/privacy");
  const [termsUrl, setTermsUrl] = useState("/legal/terms");
  const [driveIntegration, setDriveIntegration] = useState(true);
  const [manualService, setManualService] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <Protected allowedRoles={["admin"]}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
            Settings
          </h1>
          <p className="text-sm text-neutral-500 mt-1">Configure global application settings</p>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
            Branding
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Product Name</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Logo</label>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center">
                  <Icon icon="mdi:image-outline" width={24} className="text-neutral-400" />
                </div>
                <button className="px-4 py-2 rounded-lg border border-neutral-200 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition">
                  Upload Logo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-20 rounded-lg border border-neutral-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Support Contacts */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
            Support Contacts
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">WhatsApp Number</label>
              <input
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
            Legal
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Privacy Policy URL</label>
              <input
                type="text"
                value={privacyUrl}
                onChange={(e) => setPrivacyUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Terms & Conditions URL</label>
              <input
                type="text"
                value={termsUrl}
                onChange={(e) => setTermsUrl(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Feature Flags */}
        <div className="bg-white rounded-xl border border-neutral-200/70 p-6 mb-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
            Feature Flags
          </h2>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition">
              <div>
                <p className="text-sm font-medium text-neutral-900">Google Drive Integration</p>
                <p className="text-xs text-neutral-500">Allow users to save reports to Google Drive</p>
              </div>
              <input
                type="checkbox"
                checked={driveIntegration}
                onChange={(e) => setDriveIntegration(e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 cursor-pointer hover:bg-neutral-50 transition">
              <div>
                <p className="text-sm font-medium text-neutral-900">Manual Service (₹299/report)</p>
                <p className="text-xs text-neutral-500">Enable manual verification service</p>
              </div>
              <input
                type="checkbox"
                checked={manualService}
                onChange={(e) => setManualService(e.target.checked)}
                className="w-5 h-5 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition"
        >
          Save Changes
        </button>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700"
          >
            <Icon icon="mdi:check-circle" width={18} />
            <span>Settings saved successfully!</span>
          </motion.div>
        )}
      </div>
    </Protected>
  );
}
