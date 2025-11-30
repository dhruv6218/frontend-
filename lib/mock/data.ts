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
        id: "rep_1",
        title: "Vendor Compliance Report - Q3",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        url: "#"
    },
    {
        id: "rep_2",
        title: "Vendor Risk Assessment - Neo Components",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        url: "#"
    }
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
