"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { mockService } from "@/lib/mock/service";

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    credits: number;
    plan_id?: string;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    isAuthenticated: false,
    login: async () => { },
    logout: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const session = await mockService.auth.getSession();
                setUser(session);
            } catch (err) {
                // Silently handle auth init failures in production
                if (process.env.NODE_ENV === 'development') {
                    console.error("Auth init failed", err);
                }
            } finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (email: string) => {
        setLoading(true);
        try {
            const user = await mockService.auth.login(email);
            setUser(user);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await mockService.auth.logout();
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
