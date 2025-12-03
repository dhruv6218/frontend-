"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";

interface ToastProps {
    message: string;
    type?: "success" | "error" | "info" | "warning";
    duration?: number;
    onClose: () => void;
}

export default function Toast({ message, type = "info", duration = 5000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const icons = {
        success: "mdi:check-circle",
        error: "mdi:alert-circle",
        warning: "mdi:alert",
        info: "mdi:information",
    };

    const colors = {
        success: {
            bg: "bg-green-50",
            border: "border-green-200",
            text: "text-green-800",
            icon: "text-green-600",
        },
        error: {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-800",
            icon: "text-red-600",
        },
        warning: {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-800",
            icon: "text-yellow-600",
        },
        info: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-800",
            icon: "text-blue-600",
        },
    };

    const colorScheme = colors[type];

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 z-50 max-w-md ${colorScheme.bg} ${colorScheme.border} border rounded-lg shadow-lg p-4 flex items-start gap-3`}
            role="alert"
        >
            <Icon icon={icons[type]} width={20} className={`${colorScheme.icon} flex-shrink-0 mt-0.5`} />
            <p className={`flex-1 text-sm font-medium ${colorScheme.text}`}>{message}</p>
            <button
                onClick={onClose}
                className={`${colorScheme.text} hover:opacity-70 transition-opacity`}
                aria-label="Close notification"
            >
                <Icon icon="mdi:close" width={18} />
            </button>
        </motion.div>
    );
}

interface ToastContainerProps {
    toasts: Array<{ id: string; message: string; type?: "success" | "error" | "info" | "warning" }>;
    removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
            <AnimatePresence>
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

