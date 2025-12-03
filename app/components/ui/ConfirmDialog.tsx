"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmVariant?: "danger" | "primary";
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmVariant = "primary",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/50 z-50"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="confirm-title"
                        aria-describedby="confirm-message"
                    >
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                    confirmVariant === "danger" ? "bg-red-100" : "bg-blue-100"
                                }`}>
                                    <Icon
                                        icon={confirmVariant === "danger" ? "mdi:alert-circle" : "mdi:information"}
                                        width={24}
                                        className={confirmVariant === "danger" ? "text-red-600" : "text-blue-600"}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3
                                        id="confirm-title"
                                        className="text-lg font-semibold text-neutral-900 mb-1"
                                        style={{ fontFamily: "var(--font-geist)" }}
                                    >
                                        {title}
                                    </h3>
                                    <p id="confirm-message" className="text-sm text-neutral-600">
                                        {message}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`px-4 py-2 rounded-lg text-white text-sm font-medium hover:shadow-lg transition ${
                                        confirmVariant === "danger"
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-gradient-to-r from-orange-500 to-blue-600 hover:shadow-lg"
                                    }`}
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

