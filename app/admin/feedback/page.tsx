"use client";

import React, { useState } from "react";
import Protected from "@/app/components/auth/Protected";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { mockSuggestions, mockTestimonials, type Suggestion, type AdminTestimonial } from "@/lib/mock/admin-data";

export default function AdminFeedback() {
    const [activeTab, setActiveTab] = useState<"suggestions" | "testimonials">("suggestions");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
    const [suggestions, setSuggestions] = useState(mockSuggestions);
    const [testimonials, setTestimonials] = useState(mockTestimonials);

    const filteredSuggestions = suggestions.filter(s => {
        const matchesStatus = statusFilter === "All" || s.status === statusFilter;
        const matchesCategory = categoryFilter === "All" || s.category === categoryFilter;
        return matchesStatus && matchesCategory;
    });

    const toggleTestimonialApproval = (id: string) => {
        setTestimonials(testimonials.map(t =>
            t.id === id ? { ...t, approved: !t.approved } : t
        ));
    };

    return (
        <Protected allowedRoles={["admin"]}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                        Feedback
                    </h1>
                    <p className="text-sm text-neutral-500 mt-1">Manage suggestions and testimonials</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("suggestions")}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "suggestions"
                                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                                : "bg-white text-neutral-600 border-2 border-neutral-200 hover:bg-neutral-50"
                            }`}
                    >
                        Suggestions
                    </button>
                    <button
                        onClick={() => setActiveTab("testimonials")}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition ${activeTab === "testimonials"
                                ? "bg-orange-100 text-orange-700 border-2 border-orange-300"
                                : "bg-white text-neutral-600 border-2 border-neutral-200 hover:bg-neutral-50"
                            }`}
                    >
                        Testimonials
                    </button>
                </div>

                {/* Suggestions Tab */}
                {activeTab === "suggestions" && (
                    <>
                        {/* Filters */}
                        <div className="bg-white rounded-xl border border-neutral-200/70 p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Open">Open</option>
                                    <option value="Planned">Planned</option>
                                    <option value="In progress">In progress</option>
                                    <option value="Done">Done</option>
                                </select>

                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                >
                                    <option value="All">All Categories</option>
                                    <option value="UI/UX">UI/UX</option>
                                    <option value="Feature">Feature</option>
                                    <option value="Platform">Platform</option>
                                </select>

                                <select className="px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                                    <option>Sort by Upvotes</option>
                                    <option>Sort by Date</option>
                                </select>
                            </div>
                        </div>

                        {/* Suggestions Table */}
                        <div className="bg-white rounded-xl border border-neutral-200/70 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-neutral-50 border-b border-neutral-200">
                                        <tr>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Title</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden md:table-cell">Category</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Upvotes</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Status</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider hidden lg:table-cell">Created</th>
                                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-neutral-100">
                                        {filteredSuggestions.map((suggestion) => (
                                            <tr key={suggestion.id} className="hover:bg-neutral-50 transition">
                                                <td className="px-4 py-3 text-sm font-medium text-neutral-900">{suggestion.title}</td>
                                                <td className="px-4 py-3 text-sm text-neutral-600 hidden md:table-cell">{suggestion.category}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-1">
                                                        <Icon icon="mdi:arrow-up-bold" width={14} className="text-orange-600" />
                                                        <span className="text-sm font-semibold text-neutral-900">{suggestion.upvotes}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${suggestion.status === 'Done' ? 'bg-green-100 text-green-700' :
                                                            suggestion.status === 'In progress' ? 'bg-blue-100 text-blue-700' :
                                                                suggestion.status === 'Planned' ? 'bg-purple-100 text-purple-700' :
                                                                    'bg-neutral-100 text-neutral-700'
                                                        }`}>
                                                        {suggestion.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-neutral-600 hidden lg:table-cell">
                                                    {new Date(suggestion.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => setSelectedSuggestion(suggestion)}
                                                        className="text-sm font-medium text-orange-600 hover:text-orange-700 transition"
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Testimonials Tab */}
                {activeTab === "testimonials" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {testimonials.map((testimonial) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl border border-neutral-200/70 p-5"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-neutral-900">{testimonial.name}</h3>
                                        <p className="text-xs text-neutral-500">{testimonial.company}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Icon
                                                key={i}
                                                icon={i < testimonial.rating ? "mdi:star" : "mdi:star-outline"}
                                                width={14}
                                                className={i < testimonial.rating ? "text-yellow-500" : "text-neutral-300"}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <p className="text-sm text-neutral-700 mb-3">{testimonial.text}</p>

                                <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                                    <p className="text-xs text-neutral-500">
                                        {new Date(testimonial.createdAt).toLocaleDateString('en-IN')}
                                    </p>
                                    <button
                                        onClick={() => toggleTestimonialApproval(testimonial.id)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${testimonial.approved
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                                            }`}
                                    >
                                        {testimonial.approved ? "Approved" : "Hidden"}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Suggestion Detail Drawer */}
            <AnimatePresence>
                {selectedSuggestion && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSuggestion(null)}
                            className="fixed inset-0 bg-black/30 z-50"
                        />

                        <motion.div
                            initial={{ x: 400 }}
                            animate={{ x: 0 }}
                            exit={{ x: 400 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-white border-b border-neutral-200 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-neutral-900" style={{ fontFamily: "var(--font-geist)" }}>
                                    Suggestion Details
                                </h2>
                                <button
                                    onClick={() => setSelectedSuggestion(null)}
                                    className="p-2 hover:bg-neutral-100 rounded-lg transition"
                                >
                                    <Icon icon="mdi:close" width={20} />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-neutral-900 mb-2">{selectedSuggestion.title}</h3>
                                    <p className="text-sm text-neutral-600">{selectedSuggestion.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Category</p>
                                        <p className="text-sm font-medium text-neutral-900">{selectedSuggestion.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Upvotes</p>
                                        <p className="text-sm font-medium text-neutral-900">{selectedSuggestion.upvotes}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">User</p>
                                        <p className="text-sm font-medium text-neutral-900">{selectedSuggestion.userEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-neutral-500 mb-1">Created</p>
                                        <p className="text-sm font-medium text-neutral-900">
                                            {new Date(selectedSuggestion.createdAt).toLocaleDateString('en-IN')}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-neutral-700 mb-2">Change Status</label>
                                    <select
                                        defaultValue={selectedSuggestion.status}
                                        className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                                    >
                                        <option value="Open">Open</option>
                                        <option value="Planned">Planned</option>
                                        <option value="In progress">In progress</option>
                                        <option value="Done">Done</option>
                                    </select>
                                </div>

                                <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white font-medium text-sm hover:shadow-lg transition">
                                    Update Status
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </Protected>
    );
}
