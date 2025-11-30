"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function OTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Auto-focus first input
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleChange = (index: number, value: string) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
        const newOtp = [...otp];
        pastedData.forEach((char, index) => {
            if (index < 6 && !isNaN(Number(char))) {
                newOtp[index] = char;
            }
        });
        setOtp(newOtp);
        inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const code = otp.join("");
        if (code.length !== 6) {
            setError("Please enter a valid 6-digit code.");
            return;
        }

        setLoading(true);
        setError("");

        // Simulate verification
        setTimeout(() => {
            setLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex bg-white">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 xl:px-32 relative z-10">
                <div className="mb-10">
                    <Link href="/" className="flex items-center gap-2 text-neutral-900 font-bold text-xl tracking-tight">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                            <Icon icon="mdi:shield-check" width={20} />
                        </div>
                        Ravono
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-3" style={{ fontFamily: "var(--font-geist)" }}>
                            Verify your identity
                        </h1>
                        <p className="text-neutral-500">
                            Enter the 6-digit code we sent to your email address.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-4">
                                Authentication Code
                            </label>
                            <div className="flex gap-3 justify-between sm:justify-start" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => { inputRefs.current[index] = el; }}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold rounded-xl border border-neutral-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all bg-neutral-50 focus:bg-white"
                                    />
                                ))}
                            </div>
                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-3 flex items-center gap-1"
                                >
                                    <Icon icon="mdi:alert-circle" width={16} />
                                    {error}
                                </motion.p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-xl shadow-lg shadow-orange-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Icon icon="mdi:loading" className="animate-spin" width={20} />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Code"
                            )}
                        </button>

                        <div className="text-center text-sm text-neutral-500">
                            Didn't receive the code?{" "}
                            <button type="button" className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
                                Resend
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
                        <Link href="/auth/sign-in" className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center justify-center gap-1 transition-colors">
                            <Icon icon="mdi:arrow-left" width={16} />
                            Back to Sign In
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Visual Panel */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0F172A] items-center justify-center">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-[#0F172A] to-neutral-900 z-0"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>

                {/* Content */}
                <div className="relative z-10 max-w-lg px-12 text-center">
                    <div className="mb-8 flex justify-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl">
                            <Icon icon="mdi:shield-lock" width={40} className="text-orange-500" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-6 leading-tight">
                        Secure Access to Your<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">
                            Compliance Dashboard
                        </span>
                    </h2>

                    <div className="space-y-4 text-left bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        {[
                            "Two-factor authentication enabled",
                            "End-to-end encrypted session",
                            "Real-time fraud detection active"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-neutral-300">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                                    <Icon icon="mdi:check" width={14} className="text-green-400" />
                                </div>
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
