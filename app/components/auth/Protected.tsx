"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/lib/auth/mock-client";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export type AllowedRole = "user" | "manager" | "admin" | "service";

interface ProtectedProps {
  children: React.ReactNode;
  allowedRoles: AllowedRole[];
}

function getUserRole(user: Record<string, unknown> | null | undefined): AllowedRole {
  const raw = (user as Record<string, unknown> | null)?.["role"] as string | undefined;
  const role = (raw || "user").toLowerCase();
  if (role === "manager" || role === "admin" || role === "service") return role;
  return "user";
}

export default function Protected({ children, allowedRoles }: ProtectedProps) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace(`/auth/sign-in?from=${encodeURIComponent(pathname)}`);
        return;
      }
      const role = getUserRole(user as unknown as Record<string, unknown>);
      if (!allowedRoles.includes(role)) {
        router.replace(`/auth/sign-in?from=${encodeURIComponent(pathname)}`);
      }
    }
  }, [loading, isAuthenticated, user, allowedRoles, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1.2, repeatType: "reverse" }}
          className="h-8 w-8 rounded-full border-2 border-orange-400 border-t-transparent"
          style={{ animation: "spin 1s linear infinite" }}
          aria-label="Loading"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div className="min-h-[60vh] flex items-center justify-center"><p className="text-sm">Redirecting to sign in…</p></div>;
  }

  const role = getUserRole(user as unknown as Record<string, unknown>);
  if (!allowedRoles.includes(role)) return null;

  return <>{children}</>;
}
