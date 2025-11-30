"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const CATEGORIES = [
    "Verification",
    "Dashboard",
    "Reports",
    "Billing",
    "Integrations",
    "Other"
];

export default function SubmitSuggestionPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: "",
        category: "Verification",
        details: "",
        allowContact: false
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ title?: string; details?: string }>({});

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const newErrors: { title?: string; details?: string } = {};
        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }
        if (!formData.details.trim()) {
            newErrors.details = "Details are required";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success toast (you can add a toast library later)
        alert("Thanks! Your suggestion has been submitted.");

        // Redirect back to suggestions list
        setTimeout(() => {
            router.push("/suggestions");
        }, 500);
    };

    const handleCancel = () => {
        router.push("/suggestions");
    };

    return (
        <div className="mx-auto max-w-3xl px-4 md:px-6 py-16">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent mb-2">
                    Submit a new suggestion
                </h1>
                <p className="text-neutral-600">
                    Tell us what you'd like to see in Ravono Vendor Compliance.
                </p>
            </motion.div>

            {/* Form */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-neutral-200/70 bg-white/80 p-8"
            >
                {/* Title */}
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-neutral-900 mb-2">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Brief, descriptive title for your suggestion"
                        className={`w-full px-4 py-3 rounded-xl border ${errors.title ? "border-red-500" : "border-neutral-200/70"
                            } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500`}
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                {/* Category */}
                <div className="mb-6">
                    <label htmlFor="category" className="block text-sm font-medium text-neutral-900 mb-2">
                        Category
                    </label>
                    <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-neutral-200/70 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                {/* Details */}
                <div className="mb-6">
                    <label htmlFor="details" className="block text-sm font-medium text-neutral-900 mb-2">
                        Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="details"
                        value={formData.details}
                        onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                        placeholder="Describe your suggestion in detail. What problem does it solve? How would it help you?"
                        rows={6}
                        className={`w-full px-4 py-3 rounded-xl border ${errors.details ? "border-red-500" : "border-neutral-200/70"
                            } bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none`}
                    />
                    {errors.details && (
                        <p className="mt-1 text-sm text-red-600">{errors.details}</p>
                    )}
                </div>

                {/* Allow Contact Checkbox */}
                <div className="mb-8">
                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.allowContact}
                            onChange={(e) => setFormData({ ...formData, allowContact: e.target.checked })}
                            className="mt-1 h-4 w-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-neutral-700">
                            I'm okay if Ravono contacts me about this suggestion
                        </span>
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-blue-900 text-white font-medium hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Icon icon="mdi:loading" className="animate-spin" width={20} />
                                Submitting...
                            </span>
                        ) : (
                            "Submit suggestion"
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl border border-neutral-200/70 bg-white text-neutral-900 font-medium hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </motion.form>

            {/* Helper Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-200"
            >
                <div className="flex gap-3">
                    <Icon icon="mdi:information-outline" width={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Tips for great suggestions:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-800">
                            <li>Be specific about the problem you're trying to solve</li>
                            <li>Explain how this would benefit you and other users</li>
                            <li>Check if a similar suggestion already exists before submitting</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
