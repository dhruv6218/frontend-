/**
 * Security utilities for safe operations
 */

/**
 * Safely opens a new window with security attributes
 * Prevents window.opener vulnerability
 */
export function safeWindowOpen(url: string, target: string = '_blank'): Window | null {
    const newWindow = window.open(url, target, 'noopener,noreferrer');
    if (newWindow) {
        newWindow.opener = null;
    }
    return newWindow;
}

/**
 * Sanitizes user input to prevent XSS attacks
 * Removes potentially dangerous HTML/script tags
 */
export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    
    // Remove script tags and event handlers
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
}

/**
 * Escapes HTML special characters
 */
export function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Validates URL to prevent javascript: and data: protocols
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol);
    } catch {
        return false;
    }
}

