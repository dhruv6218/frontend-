"use client";

import React, { useState } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { mockNotifications, mockUsers, type AdminNotification } from "@/lib/mock/admin-data";

export default function AdminNotifications() {
    const [audience, setAudience] = useState<"all" | "selected">("all");
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [channels, setChannels] = useState<("In-app" | "Email")[]>(["In-app"]);
    const [notifications, setNotifications] = useState<AdminNotification[]>(mockNotifications);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSend = () => {
        if (!title || !message) return;

        const newNotification: AdminNotification = {
            id: String(Date.now()),
            timestamp: new Date(),
            title,
            message,
            audience: audience === "all" ? "All users" : `${selectedEmails.length} users`,
            channel: channels,
            status: "Sent",
        };

        setNotifications([newNotification, ...notifications]);
        setTitle("");
        setMessage("");
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    const toggleChannel = (channel: "In-app" | "Email") => {
        if (channels.includes(channel)) {
            setChannels(channels.filter(c => c !== channel));
        } else {
            setChannels([...channels, channel]);
        }
    };

    return (
        <Protected allowedRoles={["admin"]}>
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                        Notifications
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">Send notifications to users</p>
                </div>

                {/* Send Notification Form */}
                <div className="bg-white rounded-xl border border-neutral-200/70 p-6 mb-6">
                    <h2 className="text-lg font-semibold text-neutral-900 mb-4" style={{ fontFamily: "var(--font-geist)" }}>
                        Send Notification
                    </h2>

                    {/* Audience Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Audience</label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setAudience("all")}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition ${audience === "all"
                                        ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                                        : "bg-neutral-100 text-neutral-600 border-2 border-transparent"
                                    }`}
                            >
                                All Users
                            </button>
                            <button
                                onClick={() => setAudience("selected")}
                                className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition ${audience === "selected"
                                        ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                                        : "bg-neutral-100 text-neutral-600 border-2 border-transparent"
                                    }`}
                            >
                                Selected Users
                            </button>
                        </div>
                    </div>

                    {/* Selected Users (if applicable) */}
                    {audience === "selected" && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-neutral-700 mb-2">Select Users</label>
                            <input
                                type="text"
                                placeholder="Search and select users..."
                                className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                            />
                            <p className="text-xs text-neutral-500 mt-1">{selectedEmails.length} users selected</p>
                        </div>
                    )}

                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Notification title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                        />
                    </div>

                    {/* Message */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="Your message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2.5 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none"
                        />
                    </div>

                    {/* Channels */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-neutral-700 mb-2">Channels</label>
                        <div className="flex gap-3">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={channels.includes("In-app")}
                                    onChange={() => toggleChannel("In-app")}
                                    className="w-4 h-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-sm text-neutral-700">In-app notification</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={channels.includes("Email")}
                                    onChange={() => toggleChannel("Email")}
                                    className="w-4 h-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="text-sm text-neutral-700">Email</span>
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!title || !message || channels.length === 0}
                        className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send Notification
                    </button>

                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700"
                        >
                            <Icon icon="mdi:check-circle" width={18} />
                            <span>Notification sent successfully!</span>
                        </motion.div>
                    )}
                </div>

                {/* Notification History */}
                <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden">
                    <div className="px-6 py-4 border-b border-neutral-200">
                        <h2 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                            Notification History
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-50 border-b border-neutral-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Time</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Title</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden md:table-cell">Audience</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Channel</th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100">
                                {notifications.map((notif) => (
                                    <tr key={notif.id} className="hover:bg-neutral-50 transition">
                                        <td className="px-4 py-3 text-sm text-neutral-600">
                                            {new Date(notif.timestamp).toLocaleString('en-IN', {
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-neutral-900">{notif.title}</td>
                                        <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{notif.audience}</td>
                                        <td className="px-4 py-3 text-sm text-neutral-600">{notif.channel.join(", ")}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                {notif.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Protected>
    );
}
