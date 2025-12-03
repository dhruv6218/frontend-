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
        list: async () => {
            await delay(LATENCY);
            const stored = localStorage.getItem('mock_bulk_jobs');
            return stored ? JSON.parse(stored) : [];
        },
        create: async (fileUrl: string, jobName?: string) => {
            await delay(LATENCY);
            const job = {
                id: `job_${Date.now()}`,
                name: jobName || `Bulk Job ${new Date().toLocaleDateString()}`,
                status: "processing",
                created_at: new Date().toISOString(),
                total_rows: 25,
                success_count: 0,
                fail_count: 0,
                file_url: fileUrl,
                errors: []
            };
            const stored = localStorage.getItem('mock_bulk_jobs');
            const jobs = stored ? JSON.parse(stored) : [];
            jobs.push(job);
            localStorage.setItem('mock_bulk_jobs', JSON.stringify(jobs));
            // Simulate job completion after 3 seconds
            setTimeout(() => {
                const updatedJobs = JSON.parse(localStorage.getItem('mock_bulk_jobs') || '[]');
                const jobIndex = updatedJobs.findIndex((j: any) => j.id === job.id);
                if (jobIndex !== -1) {
                    updatedJobs[jobIndex].status = "completed";
                    updatedJobs[jobIndex].success_count = 23;
                    updatedJobs[jobIndex].fail_count = 2;
                    updatedJobs[jobIndex].errors = [
                        { row: 5, vendor: "Vendor A", error: "Invalid GSTIN format" },
                        { row: 12, vendor: "Vendor B", error: "PAN verification failed" }
                    ];
                    updatedJobs[jobIndex].report_ids = Array.from({ length: 23 }, (_, i) => `RPT-${Date.now()}-${i}`);
                    localStorage.setItem('mock_bulk_jobs', JSON.stringify(updatedJobs));
                }
            }, 3000);
            return job;
        },
        get: async (jobId: string) => {
            await delay(LATENCY);
            const stored = localStorage.getItem('mock_bulk_jobs');
            const jobs = stored ? JSON.parse(stored) : [];
            return jobs.find((j: any) => j.id === jobId) || null;
        }
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
    },
    reports: {
        list: async () => {
            await delay(LATENCY);
            const { MOCK_REPORTS } = await import('./data');
            return MOCK_REPORTS;
        },
        get: async (id: string) => {
            await delay(LATENCY);
            const { MOCK_REPORTS } = await import('./data');
            return MOCK_REPORTS.find(r => r.id === id) || null;
        },
        saveToDrive: async (reportId: string) => {
            await delay(LATENCY);
            return { success: true, drive_file_id: `drive_${Date.now()}` };
        },
        downloadPDF: async (reportId: string) => {
            await delay(LATENCY);
            return { success: true, pdf_url: `https://storage.example.com/reports/${reportId}.pdf` };
        }
    },
    integrations: {
        createKey: async (scope: string) => { await delay(LATENCY); return { id: `key_${Date.now()}`, last4: "1234", createdAt: new Date().toISOString(), scope }; },
        revokeKey: async (_id: string) => { void _id; await delay(LATENCY); return { success: true }; },
        createWebhook: async (url: string, events: string[]) => { await delay(LATENCY); return { id: `wh_${Date.now()}`, url, events }; },
        testWebhook: async (_id: string) => { void _id; await delay(LATENCY); return { success: true }; },
        getDriveStatus: async () => {
            await delay(LATENCY);
            const connected = localStorage.getItem('mock_drive_connected') === 'true';
            return {
                connected,
                email: connected ? 'user@gmail.com' : null,
                auto_save: localStorage.getItem('mock_drive_auto_save') === 'true'
            };
        },
        connectDrive: async () => {
            await delay(LATENCY);
            localStorage.setItem('mock_drive_connected', 'true');
            localStorage.setItem('mock_drive_email', 'user@gmail.com');
            return { success: true, email: 'user@gmail.com' };
        },
        disconnectDrive: async () => {
            await delay(LATENCY);
            localStorage.removeItem('mock_drive_connected');
            localStorage.removeItem('mock_drive_email');
            localStorage.removeItem('mock_drive_auto_save');
            return { success: true };
        },
        setAutoSave: async (enabled: boolean) => {
            await delay(LATENCY);
            localStorage.setItem('mock_drive_auto_save', enabled ? 'true' : 'false');
            return { success: true, auto_save: enabled };
        }
    }
};
