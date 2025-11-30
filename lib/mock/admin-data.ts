// Mock data types for Admin Panel

export interface AdminUser {
    id: string;
    name: string;
    email: string;
    organization: string;
    plan: 'Free' | 'Starter' | 'Professional' | 'Business';
    credits: number;
    monthlyLimit: number;
    status: 'Active' | 'Suspended';
    createdAt: Date;
    driveConnected: boolean;
}

export interface CreditChange {
    id: string;
    timestamp: Date;
    adminName: string;
    userEmail: string;
    change: number;
    reason: string;
}

export interface ReportStats {
    id: string;
    userEmail: string;
    organization: string;
    plan: string;
    totalReports: number;
    driveReports: number;
    lastReportDate: Date;
    verificationType: string;
}

export interface AuditLog {
    id: string;
    timestamp: Date;
    actor: string;
    actionType: 'Login' | 'Credits changed' | 'Plan changed' | 'Report generated' | 'Notification sent' | 'User suspended' | 'User activated';
    target: string;
    details: string;
    ipAddress: string;
}

export interface AdminNotification {
    id: string;
    timestamp: Date;
    title: string;
    message: string;
    audience: string;
    channel: ('In-app' | 'Email')[];
    status: 'Sent' | 'Draft';
}

export interface Suggestion {
    id: string;
    title: string;
    description: string;
    category: string;
    upvotes: number;
    status: 'Open' | 'Planned' | 'In progress' | 'Done';
    createdAt: Date;
    userEmail: string;
}

export interface AdminTestimonial {
    id: string;
    name: string;
    company: string;
    rating: number;
    text: string;
    createdAt: Date;
    approved: boolean;
}

// Mock data generators
export const mockUsers: AdminUser[] = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@techcorp.com',
        organization: 'TechCorp India',
        plan: 'Professional',
        credits: 245,
        monthlyLimit: 300,
        status: 'Active',
        createdAt: new Date('2024-01-15'),
        driveConnected: true,
    },
    {
        id: '2',
        name: 'Priya Sharma',
        email: 'priya@startupxyz.in',
        organization: 'StartupXYZ',
        plan: 'Starter',
        credits: 15,
        monthlyLimit: 20,
        status: 'Active',
        createdAt: new Date('2024-02-20'),
        driveConnected: false,
    },
    {
        id: '3',
        name: 'Amit Patel',
        email: 'amit@enterprises.com',
        organization: 'Patel Enterprises',
        plan: 'Business',
        credits: 850,
        monthlyLimit: 1000,
        status: 'Active',
        createdAt: new Date('2023-11-10'),
        driveConnected: true,
    },
    {
        id: '4',
        name: 'Sneha Reddy',
        email: 'sneha@freelance.com',
        organization: 'Freelance',
        plan: 'Free',
        credits: 2,
        monthlyLimit: 3,
        status: 'Active',
        createdAt: new Date('2024-03-05'),
        driveConnected: false,
    },
    {
        id: '5',
        name: 'Vikram Singh',
        email: 'vikram@suspended.com',
        organization: 'Suspended Corp',
        plan: 'Starter',
        credits: 0,
        monthlyLimit: 20,
        status: 'Suspended',
        createdAt: new Date('2024-01-20'),
        driveConnected: false,
    },
];

export const mockCreditChanges: CreditChange[] = [
    {
        id: '1',
        timestamp: new Date('2024-03-20T10:30:00'),
        adminName: 'Admin User',
        userEmail: 'rajesh@techcorp.com',
        change: 50,
        reason: 'Bonus credits for annual subscription',
    },
    {
        id: '2',
        timestamp: new Date('2024-03-19T14:15:00'),
        adminName: 'Admin User',
        userEmail: 'amit@enterprises.com',
        change: -100,
        reason: 'Refund adjustment',
    },
    {
        id: '3',
        timestamp: new Date('2024-03-18T09:00:00'),
        adminName: 'Admin User',
        userEmail: 'priya@startupxyz.in',
        change: 10,
        reason: 'Compensation for service downtime',
    },
];

export const mockReportStats: ReportStats[] = [
    {
        id: '1',
        userEmail: 'rajesh@techcorp.com',
        organization: 'TechCorp India',
        plan: 'Professional',
        totalReports: 156,
        driveReports: 120,
        lastReportDate: new Date('2024-03-20'),
        verificationType: 'GST',
    },
    {
        id: '2',
        userEmail: 'amit@enterprises.com',
        organization: 'Patel Enterprises',
        plan: 'Business',
        totalReports: 342,
        driveReports: 342,
        lastReportDate: new Date('2024-03-21'),
        verificationType: 'PAN',
    },
    {
        id: '3',
        userEmail: 'priya@startupxyz.in',
        organization: 'StartupXYZ',
        plan: 'Starter',
        totalReports: 8,
        driveReports: 0,
        lastReportDate: new Date('2024-03-15'),
        verificationType: 'Aadhaar',
    },
];

export const mockAuditLogs: AuditLog[] = [
    {
        id: '1',
        timestamp: new Date('2024-03-21T15:30:00'),
        actor: 'admin@ravono.com',
        actionType: 'Credits changed',
        target: 'rajesh@techcorp.com',
        details: 'Added 50 credits',
        ipAddress: '192.168.1.100',
    },
    {
        id: '2',
        timestamp: new Date('2024-03-21T14:20:00'),
        actor: 'rajesh@techcorp.com',
        actionType: 'Report generated',
        target: 'GST-2024-001',
        details: 'Generated GST verification report',
        ipAddress: '103.45.67.89',
    },
    {
        id: '3',
        timestamp: new Date('2024-03-21T13:15:00'),
        actor: 'admin@ravono.com',
        actionType: 'User suspended',
        target: 'vikram@suspended.com',
        details: 'Suspended due to payment failure',
        ipAddress: '192.168.1.100',
    },
    {
        id: '4',
        timestamp: new Date('2024-03-21T12:00:00'),
        actor: 'amit@enterprises.com',
        actionType: 'Login',
        target: 'Dashboard',
        details: 'Successful login',
        ipAddress: '103.45.67.90',
    },
    {
        id: '5',
        timestamp: new Date('2024-03-21T11:30:00'),
        actor: 'admin@ravono.com',
        actionType: 'Plan changed',
        target: 'priya@startupxyz.in',
        details: 'Upgraded from Free to Starter',
        ipAddress: '192.168.1.100',
    },
];

export const mockNotifications: AdminNotification[] = [
    {
        id: '1',
        timestamp: new Date('2024-03-20T10:00:00'),
        title: 'New Feature: Google Drive Integration',
        message: 'You can now save your reports directly to Google Drive!',
        audience: 'All users',
        channel: ['In-app', 'Email'],
        status: 'Sent',
    },
    {
        id: '2',
        timestamp: new Date('2024-03-15T09:00:00'),
        title: 'Scheduled Maintenance',
        message: 'System will be under maintenance on Sunday 2-4 AM IST',
        audience: 'All users',
        channel: ['In-app'],
        status: 'Sent',
    },
    {
        id: '3',
        timestamp: new Date('2024-03-10T14:30:00'),
        title: 'Premium Plan Discount',
        message: 'Upgrade to Professional plan and get 20% off!',
        audience: '15 users',
        channel: ['Email'],
        status: 'Sent',
    },
];

export const mockSuggestions: Suggestion[] = [
    {
        id: '1',
        title: 'Dark mode support',
        description: 'Add dark mode theme option for better viewing experience at night',
        category: 'UI/UX',
        upvotes: 67,
        status: 'Planned',
        createdAt: new Date('2024-02-15'),
        userEmail: 'rajesh@techcorp.com',
    },
    {
        id: '2',
        title: 'Mobile app',
        description: 'Create native mobile apps for iOS and Android',
        category: 'Platform',
        upvotes: 42,
        status: 'Open',
        createdAt: new Date('2024-03-01'),
        userEmail: 'amit@enterprises.com',
    },
    {
        id: '3',
        title: 'Excel export for reports',
        description: 'Allow downloading reports in Excel format',
        category: 'Feature',
        upvotes: 24,
        status: 'In progress',
        createdAt: new Date('2024-02-20'),
        userEmail: 'priya@startupxyz.in',
    },
    {
        id: '4',
        title: 'Bulk email notifications',
        description: 'Send email notifications for bulk verification results',
        category: 'Feature',
        upvotes: 18,
        status: 'Done',
        createdAt: new Date('2024-01-10'),
        userEmail: 'rajesh@techcorp.com',
    },
];

export const mockTestimonials: AdminTestimonial[] = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        company: 'TechCorp India',
        rating: 5,
        text: 'Excellent service! Saved us hours of manual verification work.',
        createdAt: new Date('2024-03-15'),
        approved: true,
    },
    {
        id: '2',
        name: 'Priya Sharma',
        company: 'StartupXYZ',
        rating: 4,
        text: 'Great platform, very easy to use. Would love to see more features.',
        createdAt: new Date('2024-03-10'),
        approved: true,
    },
    {
        id: '3',
        name: 'Anonymous User',
        company: 'Test Company',
        rating: 2,
        text: 'This is a test testimonial that should not be approved.',
        createdAt: new Date('2024-03-20'),
        approved: false,
    },
    {
        id: '4',
        name: 'Amit Patel',
        company: 'Patel Enterprises',
        rating: 5,
        text: 'Outstanding support team and reliable service. Highly recommended!',
        createdAt: new Date('2024-03-18'),
        approved: true,
    },
];
