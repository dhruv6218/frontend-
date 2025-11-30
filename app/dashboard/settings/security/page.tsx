"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";

export default function SecuritySettings() {
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
    const [otp, setOtp] = useState("");

    // Mock sessions
    const sessions = [
        { id: 1, device: "Chrome on Windows", location: "Mumbai, India", ip: "103.24.1.5", current: true, time: "Active now" },
        { id: 2, device: "Safari on iPhone 14", location: "Mumbai, India", ip: "45.12.8.9", current: false, time: "2 hours ago" },
        { id: 3, device: "Firefox on MacOS", location: "Bangalore, India", ip: "112.5.3.1", current: false, time: "Yesterday" },
    ];

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setShowToast({ show: true, message, type });
        setTimeout(() => setShowToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            showNotification("Password updated successfully!");
            // Reset form logic would go here
        }, 1000);
    };

    const handleEnable2FA = () => {
        if (otp.length !== 6) {
            showNotification("Please enter a valid 6-digit code", "error");
            return;
        }
        setTwoFAEnabled(true);
        setShow2FAModal(false);
        setOtp("");
        showNotification("Two-factor authentication enabled!");
    };

    const handleDisable2FA = () => {
        setTwoFAEnabled(false);
        setShowDisable2FAModal(false);
        showNotification("Two-factor authentication disabled.");
    };

    const handleLogoutAll = () => {
        if (confirm("Are you sure you want to log out from all other devices?")) {
            showNotification("Logged out from all other devices.");
        }
    };

    return (
        <div className="max-w-3xl space-y-6">

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-neutral-200/70 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1" style={{ fontFamily: "var(--font-geist)" }}>
                    Change Password
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                    Ensure your account is using a long, random password to stay secure.
                </p>

                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Current Password</label>
                        <input type="password" required className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">New Password</label>
                        <input type="password" required className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Confirm New Password</label>
                        <input type="password" required className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-medium text-sm hover:bg-neutral-50 transition-all"
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>

            {/* 2FA */}
            <div className="bg-white rounded-xl border border-neutral-200/70 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-900 mb-1" style={{ fontFamily: "var(--font-geist)" }}>
                            Two-Factor Authentication
                        </h2>
                        <p className="text-sm text-neutral-500 mb-4 max-w-lg">
                            Add an extra layer of security to your account by requiring a code from your authenticator app.
                        </p>

                        {twoFAEnabled ? (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full w-fit mb-4">
                                <Icon icon="mdi:check-circle" width={16} />
                                <span className="text-xs font-medium">Enabled</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-neutral-500 bg-neutral-100 px-3 py-1.5 rounded-full w-fit mb-4">
                                <Icon icon="mdi:shield-off-outline" width={16} />
                                <span className="text-xs font-medium">Disabled</span>
                            </div>
                        )}
                    </div>

                    {twoFAEnabled ? (
                        <button
                            onClick={() => setShowDisable2FAModal(true)}
                            className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                        >
                            Disable 2FA
                        </button>
                    ) : (
                        <button
                            onClick={() => setShow2FAModal(true)}
                            className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition-all"
                        >
                            Set up 2FA
                        </button>
                    )}
                </div>
            </div>

            {/* Sessions */}
            <div className="bg-white rounded-xl border border-neutral-200/70 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                        Active Sessions
                    </h2>
                    <button
                        onClick={handleLogoutAll}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        Log out from all devices
                    </button>
                </div>

                <div className="space-y-4">
                    {sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between py-3 border-b border-neutral-100 last:border-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                                    <Icon icon={session.device.toLowerCase().includes("iphone") ? "mdi:cellphone" : "mdi:monitor"} width={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-neutral-900">
                                        {session.device}
                                        {session.current && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Current</span>}
                                    </p>
                                    <p className="text-xs text-neutral-500">{session.location} • {session.ip}</p>
                                </div>
                            </div>
                            <span className="text-xs text-neutral-400">{session.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2FA Setup Modal */}
            <AnimatePresence>
                {show2FAModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-neutral-900">Set up 2FA</h3>
                                    <button onClick={() => setShow2FAModal(false)} className="text-neutral-400 hover:text-neutral-600">
                                        <Icon icon="mdi:close" width={20} />
                                    </button>
                                </div>

                                <div className="flex justify-center mb-6">
                                    <div className="h-48 w-48 bg-neutral-100 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-300">
                                        <div className="text-center">
                                            <Icon icon="mdi:qrcode" width={64} className="mx-auto text-neutral-400 mb-2" />
                                            <p className="text-xs text-neutral-500">Scan QR Code</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-xs font-medium text-neutral-500 mb-1 uppercase">Secret Key</label>
                                    <div className="flex items-center gap-2">
                                        <code className="flex-1 bg-neutral-50 px-3 py-2 rounded border border-neutral-200 text-sm font-mono text-neutral-700">
                                            JBSW Y3DP K52E Z67X
                                        </code>
                                        <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded">
                                            <Icon icon="mdi:content-copy" width={16} />
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Enter 6-digit code</label>
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="000 000"
                                        className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-end gap-3">
                                <button
                                    onClick={() => setShow2FAModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleEnable2FA}
                                    className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-medium hover:bg-orange-700"
                                >
                                    Enable 2FA
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Disable 2FA Modal */}
            <AnimatePresence>
                {showDisable2FAModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                                    <Icon icon="mdi:alert" width={24} className="text-red-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-neutral-900 text-center mb-2">Disable 2FA?</h3>
                                <p className="text-sm text-neutral-500 text-center">
                                    Your account will be less secure. You will only need your password to log in.
                                </p>
                            </div>
                            <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex gap-3">
                                <button
                                    onClick={() => setShowDisable2FAModal(false)}
                                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDisable2FA}
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                                >
                                    Disable
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {showToast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 ${showToast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                            }`}
                    >
                        <div className={`p-1 rounded-full ${showToast.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                            <Icon icon={showToast.type === 'success' ? "mdi:check" : "mdi:alert-circle"} width={16} className={showToast.type === 'success' ? "text-green-600" : "text-red-600"} />
                        </div>
                        <span className="text-sm font-medium">{showToast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
