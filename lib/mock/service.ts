import { MOCK_USERS, MOCK_VERIFICATIONS } from './data';

const LATENCY = 100;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockService = {
    auth: {
        login: async (email: string) => {
            await delay(LATENCY);
            const user = MOCK_USERS.find(u => u.email === email);
            if (user) {
                localStorage.setItem('mock_session', JSON.stringify(user));
                return user;
            }
            throw new Error('Invalid credentials');
        },
        logout: async () => {
            await delay(LATENCY);
            localStorage.removeItem('mock_session');
        },
        getSession: async () => {
            await delay(LATENCY);
            const session = localStorage.getItem('mock_session');
            return session ? JSON.parse(session) : null;
        }
    },
    verifications: {
        list: async () => {
            await delay(LATENCY);
            return MOCK_VERIFICATIONS;
        },
        create: async (type: string, payload: unknown) => {
            await delay(LATENCY);
            const newVerif = {
                id: `verif_${Date.now()}`,
                type,
                status: 'processing',
                created_at: new Date().toISOString(),
                payload,
                result: type === 'aadhaar_send_otp' ? { reqId: "mock_req_id_123" } : {}
            };
            return newVerif;
        }
    },
    files: {
        upload: async (file: File) => {
            await delay(LATENCY);
            return {
                success: true,
                url: URL.createObjectURL(file),
                name: file.name
            };
        }
    },

    settings: {
        update2FA: async (enabled: boolean) => { await delay(LATENCY); return { two_factor_enabled: enabled }; },
        updateBranding: async (_branding: unknown) => { void _branding; await delay(LATENCY); return { success: true }; },
        logoutAll: async () => { await delay(LATENCY); return { success: true }; }
    },
    notifications: {
        list: async () => { await delay(LATENCY); return [{ id: "1", message: "Welcome to Ravono", read: false }]; },
        markAllRead: async () => { await delay(LATENCY); return { success: true }; },
        updatePrefs: async (_prefs: unknown) => { void _prefs; await delay(LATENCY); return { success: true }; }
    },
    bulkJobs: {
        list: async () => { await delay(LATENCY); return []; },
        create: async (_fileUrl: string) => { void _fileUrl; await delay(LATENCY); return { id: `job_${Date.now()}`, status: "processing" }; }
    },
    integrations: {
        createKey: async (scope: string) => { await delay(LATENCY); return { id: `key_${Date.now()}`, last4: "1234", createdAt: new Date().toISOString(), scope }; },
        revokeKey: async (_id: string) => { void _id; await delay(LATENCY); return { success: true }; },
        createWebhook: async (url: string, events: string[]) => { await delay(LATENCY); return { id: `wh_${Date.now()}`, url, events }; },
        testWebhook: async (_id: string) => { void _id; await delay(LATENCY); return { success: true }; }
    },

    testimonials: {
        submit: async (data: unknown) => { void data; await delay(LATENCY); return { success: true }; }
    },
    contact: {
        submit: async (_data: unknown) => { void _data; await delay(LATENCY); return { success: true }; }
    },
    serviceOrders: {
        list: async () => {
            await delay(LATENCY);
            return [
                { id: "order_1", client: "Acme Corp", items: 5, status: "pending" },
                { id: "order_2", client: "Tech Solutions", items: 3, status: "completed" }
            ];
        },
        complete: async (id: string) => { void id; await delay(LATENCY); return { success: true }; }
    }
};
