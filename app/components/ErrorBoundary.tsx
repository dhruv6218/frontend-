"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error to error reporting service in production
        if (process.env.NODE_ENV === 'development') {
            console.error("ErrorBoundary caught an error:", error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-[60vh] flex items-center justify-center p-6">
                    <div className="max-w-md w-full text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon icon="mdi:alert-circle" width={32} className="text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-neutral-900 mb-2" style={{ fontFamily: "var(--font-geist)" }}>
                            Something went wrong
                        </h2>
                        <p className="text-sm text-neutral-600 mb-6">
                            {this.state.error?.message || "An unexpected error occurred. Please try again."}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => {
                                    this.setState({ hasError: false, error: null });
                                    window.location.reload();
                                }}
                                className="px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-blue-600 text-white text-sm font-medium hover:shadow-lg transition"
                            >
                                Reload Page
                            </button>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-lg border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

