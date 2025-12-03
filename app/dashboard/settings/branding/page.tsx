"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function BrandingSettings() {
    // Mock plan check - toggle this to test different states
    const [isBusinessPlan, setIsBusinessPlan] = useState(true);

    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const [branding, setBranding] = useState({
        companyName: "Ravono Inc.",
        primaryColor: "#F97316",
        accentColor: "#1E3A8A",
        applyColorsToHeader: true,
        reportTitle: "Vendor Compliance Report",
        footerText: "© 2024 Ravono Inc. Confidential.",
        supportEmail: "support@ravono.com",
        phone: "+91 98765 43210",
        website: "https://ravono.com",
        disclaimer: "",
        hideRavonoBranding: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBranding(prev => ({ ...prev, [name]: value }));
    };

    const handleToggle = (name: string) => {
        setBranding(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }, 1000);
    };

    if (!isBusinessPlan) {
        return (
            <div className="max-w-3xl">
                <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-xl p-8 text-center text-white shadow-lg relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 bg-orange-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 bg-blue-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10">
                            <Icon icon="mdi:palette-swatch-outline" width={32} className="text-orange-400" />
                        </div>

                        <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "var(--font-geist)" }}>
                            White-label Reports
                        </h2>
                        <p className="text-neutral-300 max-w-md mx-auto mb-8">
                            Upgrade to the Business plan to remove Ravono branding, use your own logo, colors, and customize report headers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/dashboard/billing"
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all transform hover:-translate-y-0.5"
                            >
                                Upgrade to Business
                            </Link>
                            <button
                                onClick={() => setIsBusinessPlan(true)} // Dev toggle
                                className="px-6 py-3 rounded-lg bg-white/10 border border-white/10 text-white font-medium hover:bg-white/20 transition-all"
                            >
                                Preview Features (Dev)
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Settings Form */}
            <div className="space-y-6">
                <div className="bg-white rounded-xl border border-neutral-200/70 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-1" style={{ fontFamily: "var(--font-geist)" }}>
                        Brand Identity
                    </h2>
                    <p className="text-sm text-neutral-500 mb-6">
                        Customize how your reports look to your clients.
                    </p>

                    <div className="space-y-6">
                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-3">Company Logo</label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="h-32 border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer">
                                        <Icon icon="mdi:cloud-upload-outline" width={24} className="text-neutral-400 mb-2" />
                                        <span className="text-xs text-neutral-500 font-medium">Upload Light Logo</span>
                                        <span className="text-[10px] text-neutral-400 mt-1">PNG, SVG up to 2MB</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="h-32 border-2 border-dashed border-neutral-200 rounded-lg flex flex-col items-center justify-center bg-neutral-900 hover:bg-neutral-800 transition-colors cursor-pointer">
                                        <Icon icon="mdi:cloud-upload-outline" width={24} className="text-neutral-500 mb-2" />
                                        <span className="text-xs text-neutral-400 font-medium">Upload Dark Logo</span>
                                        <span className="text-[10px] text-neutral-600 mt-1">PNG, SVG up to 2MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Colors */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Primary Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        name="primaryColor"
                                        value={branding.primaryColor}
                                        onChange={handleChange}
                                        className="h-10 w-12 rounded border border-neutral-200 cursor-pointer p-0.5"
                                    />
                                    <input
                                        type="text"
                                        name="primaryColor"
                                        value={branding.primaryColor}
                                        onChange={handleChange}
                                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm font-mono uppercase"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Accent Color</label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        name="accentColor"
                                        value={branding.accentColor}
                                        onChange={handleChange}
                                        className="h-10 w-12 rounded border border-neutral-200 cursor-pointer p-0.5"
                                    />
                                    <input
                                        type="text"
                                        name="accentColor"
                                        value={branding.accentColor}
                                        onChange={handleChange}
                                        className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 text-sm font-mono uppercase"
                                    />
                                </div>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                            <input
                                type="checkbox"
                                checked={branding.applyColorsToHeader}
                                onChange={() => handleToggle("applyColorsToHeader")}
                                className="w-4 h-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="text-sm text-neutral-700">Apply brand colors to report header</span>
                        </label>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200/70 p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
                        Report Content
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Report Title</label>
                            <input
                                type="text"
                                name="reportTitle"
                                value={branding.reportTitle}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Footer Text</label>
                            <input
                                type="text"
                                name="footerText"
                                value={branding.footerText}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Support Email</label>
                                <input
                                    type="email"
                                    name="supportEmail"
                                    value={branding.supportEmail}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 mb-2">Support Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={branding.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Website</label>
                            <input
                                type="url"
                                name="website"
                                value={branding.website}
                                onChange={handleChange}
                                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Additional Disclaimer</label>
                            <textarea
                                name="disclaimer"
                                value={branding.disclaimer}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                                placeholder="This text will be appended to the standard disclaimer..."
                            />
                        </div>

                        <div className="pt-4 border-t border-neutral-100">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <span className="block text-sm font-medium text-neutral-900">Hide Ravono Branding</span>
                                    <span className="block text-xs text-neutral-500">Remove "Powered by Ravono" from all reports</span>
                                </div>
                                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out relative ${branding.hideRavonoBranding ? 'bg-orange-500' : 'bg-neutral-200'}`}>
                                    <input
                                        type="checkbox"
                                        className="sr-only"
                                        checked={branding.hideRavonoBranding}
                                        onChange={() => handleToggle("hideRavonoBranding")}
                                    />
                                    <span className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${branding.hideRavonoBranding ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Icon icon="mdi:loading" className="animate-spin" width={18} />
                                Saving...
                            </>
                        ) : (
                            "Save Branding"
                        )}
                    </button>
                </div>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-6 h-fit">
                <h3 className="text-sm font-medium text-neutral-500 mb-3 uppercase tracking-wider">Live Preview</h3>
                <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-neutral-200">
                    {/* Report Header */}
                    <div
                        className="p-8 text-white relative overflow-hidden"
                        style={{ backgroundColor: branding.applyColorsToHeader ? branding.primaryColor : '#171717' }}
                    >
                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <div className="h-12 w-12 bg-white/20 rounded-lg mb-4 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-xs font-bold">LOGO</span>
                                </div>
                                <h1 className="text-2xl font-bold mb-1">{branding.reportTitle}</h1>
                                <p className="text-white/80 text-sm">Generated for Client Name</p>
                            </div>
                            <div className="text-right text-xs text-white/70">
                                <p>Date: {new Date().toLocaleDateString()}</p>
                                <p>Ref: #REP-2024-001</p>
                            </div>
                        </div>
                    </div>

                    {/* Report Body Preview */}
                    <div className="p-8 space-y-6 bg-neutral-50/50">
                        <div className="h-4 w-3/4 bg-neutral-200 rounded animate-pulse"></div>
                        <div className="space-y-2">
                            <div className="h-3 w-full bg-neutral-100 rounded animate-pulse"></div>
                            <div className="h-3 w-full bg-neutral-100 rounded animate-pulse"></div>
                            <div className="h-3 w-5/6 bg-neutral-100 rounded animate-pulse"></div>
                        </div>

                        <div className="p-4 bg-white rounded-lg border border-neutral-200 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-8 w-8 rounded bg-green-100 flex items-center justify-center text-green-600">
                                    <Icon icon="mdi:check" width={16} />
                                </div>
                                <div>
                                    <div className="h-3 w-24 bg-neutral-200 rounded mb-1"></div>
                                    <div className="h-2 w-16 bg-neutral-100 rounded"></div>
                                </div>
                            </div>
                            <div className="h-2 w-full bg-neutral-100 rounded"></div>
                        </div>
                    </div>

                    {/* Report Footer */}
                    <div className="p-6 border-t border-neutral-200 bg-white text-center">
                        <p className="text-xs text-neutral-500 mb-3">{branding.footerText}</p>
                        <div className="flex flex-col items-center gap-2 text-[10px] text-neutral-400">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <Icon icon="mdi:email-outline" width={12} />
                                    {branding.supportEmail}
                                </span>
                                {branding.phone && (
                                    <>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Icon icon="mdi:phone-outline" width={12} />
                                            {branding.phone}
                                        </span>
                                    </>
                                )}
                            </div>
                            {branding.website && (
                                <span className="flex items-center gap-1">
                                    <Icon icon="mdi:web" width={12} />
                                    {branding.website}
                                </span>
                            )}
                        </div>
                        {!branding.hideRavonoBranding && (
                            <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 opacity-50">
                                <Icon icon="mdi:lightning-bolt" width={12} />
                                <span className="text-[10px] font-medium uppercase tracking-widest">Powered by Ravono</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="fixed bottom-6 right-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50"
                    >
                        <div className="bg-green-100 p-1 rounded-full">
                            <Icon icon="mdi:check" width={16} className="text-green-600" />
                        </div>
                        <span className="text-sm font-medium">Branding saved successfully!</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
