"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { motion } from "framer-motion";

const ORANGE = "#F97316";
const NAVY = "#1E3A8A";

type Suggestion = {
    id: string;
    title: string;
    description: string;
    status: "Open" | "Planned" | "In progress" | "Done";
    votes: number;
    category: string;
    createdAt: string;
};

// Mock data - will be replaced with Supabase later
const MOCK_SUGGESTIONS: Suggestion[] = [
    {
        id: "1",
        title: "Add Excel export for verification reports",
        description: "Would be great to export all verification data to Excel format for offline analysis and record keeping.",
        status: "Planned",
        votes: 24,
        category: "Reports",
        createdAt: "2025-01-15"
    },
    {
        id: "2",
        title: "Bulk verification status notifications",
        description: "Send email notifications when bulk verification jobs complete, instead of checking the dashboard manually.",
        status: "In progress",
        votes: 18,
        category: "Verification",
        createdAt: "2025-01-10"
    },
    {
        id: "3",
        title: "Dark mode for dashboard",
        description: "Add a dark theme option for the dashboard to reduce eye strain during long sessions.",
        status: "Open",
        votes: 42,
        category: "Dashboard",
        createdAt: "2025-01-20"
    },
    {
        id: "4",
        title: "API rate limit increase for Business plan",
        description: "Current API limits are too restrictive for high-volume verification needs.",
        status: "Open",
        votes: 15,
        category: "Integrations",
        createdAt: "2025-01-18"
    },
    {
        id: "5",
        title: "Mobile app for iOS and Android",
        description: "A native mobile app would make it easier to verify vendors on the go.",
        status: "Open",
        votes: 67,
        category: "Other",
        createdAt: "2025-01-05"
    },
    {
        id: "6",
        title: "Automated fraud score alerts",
        description: "Get instant alerts when a verification returns a high fraud score above a certain threshold.",
        status: "Done",
        votes: 31,
        category: "Verification",
        createdAt: "2024-12-20"
    }
];

const STATUS_COLORS = {
    "Open": "bg-blue-100 text-blue-800",
    "Planned": "bg-purple-100 text-purple-800",
    "In progress": "bg-yellow-100 text-yellow-800",
    "Done": "bg-green-100 text-green-800"
};

export default function SuggestionsPage() {
    const [suggestions, setSuggestions] = useState<Suggestion[]>(MOCK_SUGGESTIONS);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<"votes" | "newest" | "oldest">("votes");
    const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

    const handleVote = (id: string) => {
        const newVotedIds = new Set(votedIds);
        const isVoted = votedIds.has(id);

        if (isVoted) {
            newVotedIds.delete(id);
        } else {
            newVotedIds.add(id);
        }

        setVotedIds(newVotedIds);
        setSuggestions(prev => prev.map(s =>
            s.id === id ? { ...s, votes: s.votes + (isVoted ? -1 : 1) } : s
        ));
    };

    const filteredAndSorted = suggestions
        .filter(s =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "votes") return b.votes - a.votes;
            if (sortBy === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });

    return (
        <div className="mx-auto max-w-7xl px-4 md:px-6 py-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent mb-2">
                        Feature Suggestions
                    </h1>
                    <p className="text-neutral-600">
                        Suggest improvements and upvote ideas from other users.
                    </p>
                </div>
                <Link
                    href="/suggestions/submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-blue-900 text-white font-medium hover:shadow-lg transition"
                >
                    <Icon icon="mdi:plus" width={20} />
                    Submit a suggestion
                </Link>
            </div>

            {/* Search and Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Icon
                        icon="mdi:magnify"
                        width={20}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                        type="text"
                        placeholder="Search suggestions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as "votes" | "newest" | "oldest")}
                    className="px-4 py-3 rounded-xl border border-neutral-200/70 bg-white/80 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="votes">Most upvoted</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>

            {/* Suggestions List */}
            {filteredAndSorted.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-neutral-200/70 bg-white/80">
                    <Icon icon="mdi:lightbulb-outline" width={64} className="mx-auto text-neutral-300 mb-4" />
                    <p className="text-neutral-600 mb-4">No suggestions found</p>
                    <Link
                        href="/suggestions/submit"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-blue-900 text-white font-medium hover:shadow-lg transition"
                    >
                        Be the first to suggest
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAndSorted.map((suggestion, idx) => (
                        <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * idx }}
                            className="rounded-2xl border border-neutral-200/70 bg-white/80 p-6 hover:shadow-lg transition"
                        >
                            <div className="flex gap-4">
                                {/* Upvote Button */}
                                <button
                                    onClick={() => handleVote(suggestion.id)}
                                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl border transition ${votedIds.has(suggestion.id)
                                            ? "border-orange-500 bg-orange-50 text-orange-600"
                                            : "border-neutral-200/70 bg-white hover:bg-neutral-50"
                                        }`}
                                >
                                    <Icon
                                        icon={votedIds.has(suggestion.id) ? "mdi:arrow-up-bold" : "mdi:arrow-up"}
                                        width={20}
                                    />
                                    <span className="text-sm font-medium">{suggestion.votes}</span>
                                </button>

                                {/* Content */}
                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <h3 className="text-lg font-bold text-neutral-900">{suggestion.title}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[suggestion.status]}`}>
                                            {suggestion.status}
                                        </span>
                                    </div>
                                    <p className="text-neutral-700 mb-3">{suggestion.description}</p>
                                    <div className="flex items-center gap-3 text-sm text-neutral-600">
                                        <span className="flex items-center gap-1">
                                            <Icon icon="mdi:tag-outline" width={16} />
                                            {suggestion.category}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Icon icon="mdi:calendar-outline" width={16} />
                                            {new Date(suggestion.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
