"use client";

import "./globals.css";
import { AuthProvider } from "@/lib/auth/mock-client";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
import { LanguageProvider } from "./components/i18n/LanguageProvider";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <Navbar />
                {children}
                <Footer />
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
        <script src="https://cdn.botpress.cloud/webchat/v3.3/inject.js" defer></script>
        <script src="https://files.bpcontent.cloud/2025/11/28/13/20251128134036-4O30B4JE.js" defer></script>
      </body>
    </html>
  );
}