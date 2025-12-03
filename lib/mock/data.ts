export const MOCK_USERS = [
    {
        id: "user_1",
        email: "admin@example.com",
        name: "Admin User",
        role: "admin",
        credits: 100,
        plan_id: "plan_pro",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
    },
    {
        id: "user_2",
        email: "user@example.com",
        name: "Regular User",
        role: "user",
        credits: 5,
        plan_id: "plan_basic",
        avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
    }
];

export const MOCK_VERIFICATIONS = [
    {
        id: "verif_1",
        type: "gst",
        status: "completed",
        payload: { gstin: "27AABCU9603R1ZX" },
        result: {
            status: "success",
            details: { legal_name: "ACME Corp", status: "Active" }
        },
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: "verif_2",
        type: "pan",
        status: "processing",
        payload: { pan: "ABCDE1234F" },
        created_at: new Date().toISOString()
    }
];

export const MOCK_REPORTS = [
    {
        id: "RPT-1023",
        vendor: "Shree Logistics Pvt Ltd",
        type: "All-in-One",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        risk_level: 18,
        status: "Active",
        expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
        pdf_url: null,
        drive_file_id: null
    },
    {
        id: "RPT-1022",
        vendor: "Neo Components",
        type: "PAN",
        created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
        risk_level: 74,
        status: "Active",
        expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
        pdf_url: null,
        drive_file_id: null
    },
    {
        id: "RPT-1021",
        vendor: "Apex Supplies",
        type: "Bank",
        created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days ago - expired
        risk_level: 16,
        status: "Expired",
        expires_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // expired
        pdf_url: null,
        drive_file_id: null
    }
];

export const MOCK_VENDORS = [
    { id: "vendor_1", name: "Shree Logistics Pvt Ltd", risk_level: 7, status: "Low Risk" },
    { id: "vendor_2", name: "Apex Supplies", risk_level: 18, status: "Low Risk" },
    { id: "vendor_3", name: "Neo Components", risk_level: 74, status: "High Risk" },
    { id: "vendor_4", name: "Kamal Traders", risk_level: 12, status: "Low Risk" },
    { id: "vendor_5", name: "Bright Textiles", risk_level: 22, status: "Medium Risk" },
    { id: "vendor_6", name: "High Risk Corp", risk_level: 85, status: "High Risk" },
];

export const MOCK_POSTS = [
    {
        id: "post_1",
        slug: "vendor-compliance-guide",
        title: "The Ultimate Guide to Vendor Compliance",
        content: "Vendor compliance is critical for modern businesses. It ensures that your suppliers meet your standards and regulations...",
        image: "https://storage.googleapis.com/cosmic-project-image-assets/images/8e59d1f8-6b5d-4575-9fe3-4956de864bf4/logo.jpg",
        date: new Date().toISOString(),
        tags: ["compliance", "guide"],
        company: "Ravono"
    },
    {
        id: "post_2",
        slug: "fraud-prevention-tips",
        title: "5 Tips for Preventing Vendor Fraud",
        content: "Fraud prevention starts with verification. Here are 5 tips to keep your business safe...",
        image: "https://storage.googleapis.com/cosmic-project-image-assets/images/79aa3ba9-d63f-4809-917e-d4732ea12325/pic.jpg",
        date: new Date().toISOString(),
        tags: ["fraud", "security"],
        company: "Ravono"
    }
];
