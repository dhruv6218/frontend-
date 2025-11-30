// Structured sample data for Home Page: logos, features, testimonials, pricing, blog
// All values are placeholders. Replace or bind to your data source later.

export type TrustedLogo = { name: string; alt: string };
export type StatItem = { icon: string; label: string; value: number; suffix?: string; prefix?: string };
export type ValueProp = { icon: string; title: string; description: string };
export type FeatureCard = { icon: string; title: string; description: string };
export type Testimonial = { name: string; role: string; rating: number; quote: string; avatarUrl?: string };
export type PricingPlan = {
  id: string;
  name: string;
  priceINR: number;
  priceUSD: number;
  period: string;
  features: string[];
  cta: string;
  popular?: boolean;
};
export type BlogPost = { slug: string; title: string; excerpt: string; href: string };

export const TRUSTED_LOGOS: TrustedLogo[] = [
  { name: "Acme Group", alt: "Trusted by Acme Group" },
  { name: "ZenBank", alt: "Trusted by ZenBank" },
  { name: "Nova Retail", alt: "Trusted by Nova Retail" },
  { name: "IndusManufacture", alt: "Trusted by IndusManufacture" },
];

export const STATS: StatItem[] = [
  { icon: "heroicons:building-library-20-solid", label: "Govt API", value: 8, suffix: "+" },
  { icon: "heroicons:check-badge-20-solid", label: "Verified Data Sources", value: 12, suffix: "+" },
  { icon: "heroicons:clock-20-solid", label: "API Uptime: 99%", value: 99, suffix: "%" },
  { icon: "heroicons:star-20-solid", label: "Avg. Customer Rating", value: 4.7, suffix: "/5" }
];

export const VALUE_PROPS: ValueProp[] = [
  { icon: "material-symbols:verified-user-rounded", title: "100% Compliant", description: "Aligned with latest Indian regulations." },
  { icon: "material-symbols:speed-rounded", title: "Lightning Fast", description: "Verifications in seconds, not days." },
  { icon: "material-symbols:lock-rounded", title: "Bank-Grade Security", description: "Your data is encrypted and safe." }
];

export const FEATURES: FeatureCard[] = [
  { icon: "material-symbols:shield", title: "GST Verification", description: "Instant GSTIN lookup and validation." },
  { icon: "material-symbols:analytics", title: "AI Fraud Analytics", description: "Detect anomalies with machine intelligence." },
  { icon: "solar:document-bold-duotone", title: "Downloadable Reports", description: "PDF reports ready to share in clicks." },
  { icon: "material-symbols:cloud-upload", title: "Bulk Upload", description: "CSV/Excel-based batch verification." },
  { icon: "ri:team-line", title: "Team Management", description: "Invite teammates, manage roles and access." },
  { icon: "material-symbols:api-rounded", title: "API Access", description: "Integrate verification into your systems." }
];

export const TESTIMONIALS: Testimonial[] = [
  { name: "Aarav Sharma", role: "Compliance Lead, FinServe", rating: 5, quote: "Support fixed my issue fast! We saved 16+ hours weekly." },
  { name: "Priya Iyer", role: "Ops Manager, Nova Retail", rating: 4, quote: "Onboarding vendors is now a breeze." },
  { name: "Rahul Mehta", role: "Head of Procurement, IndusManufacture", rating: 5, quote: "Accurate, fast, and the reports look great." },
  { name: "Sanya Kapoor", role: "Risk Analyst, Zenith Bank", rating: 5, quote: "The fraud flags are spot on." }
];

// Updated pricing to match requested content exactly (INR focus)
export const PRICING: PricingPlan[] = [
  {
    id: "freelancer",
    name: "Freelancer Plan",
    priceINR: 399,
    priceUSD: 5,
    period: "month",
    features: [
      "Best for: Freelancers, solo professionals, consultants.",
      "Get 25 verifications per month for all document types (GST, PAN, Aadhaar, Bank, Passport, MCA/CIN, DIN).",
      "Instant branded PDF report downloads for every verification.",
      "Basic AI fraud analysis to spot common compliance risks and mismatches.",
      "Email support with 24–48h response.",
      "1 user login (ideal for individuals).",
      "No hidden fees, no setup cost. Cancel anytime, upgrade instantly.",
      "Data securely stored; access history anytime."
    ],
    cta: "Get Started"
  },
  {
    id: "small-business",
    name: "Small Business Plan",
    priceINR: 1199,
    priceUSD: 15,
    period: "month",
    features: [
      "Best for: Startups, small teams, growing agencies.",
      "100 verifications/month, all document types supported.",
      "Advanced AI fraud analysis and risk scoring.",
      "Bulk upload via CSV (up to 100 rows in one click).",
      "White-label report with your own logo branding.",
      "3 team members included. Role management enabled.",
      "Priority email support (same/next business day).",
      "Longer data retention for your records (1 year)."
    ],
    cta: "Choose Small Business",
    popular: true
  },
  {
    id: "professional",
    name: "Professional Plan",
    priceINR: 2199,
    priceUSD: 28,
    period: "month",
    features: [
      "Best for: Businesses with multi-person compliance, regular onboarding/workflow needs.",
      "Up to 300 verifications/month.",
      "Bulk upload up to 500 rows at once. Fast turnaround.",
      "Full branding: change logo, company name, and colors on all reports.",
      "Team collaboration with 5 users. Assign roles and monitor activity.",
      "API access (1,000 calls/month) for integration with your own systems.",
      "Advanced analytics dashboard for tracking usage and risks.",
      "Email & phone support with expert guidance.",
      "2 years of data retention."
    ],
    cta: "Choose Professional"
  },
  {
    id: "business",
    name: "Business Plan",
    priceINR: 3999,
    priceUSD: 50,
    period: "month",
    features: [
      "Best for: Large organizations, consultancies, BPOs.",
      "1,000 verifications/month. All document types, compliance checks.",
      "Highest-level AI fraud detection algorithms.",
      "Bulk upload: up to 2,000 rows.",
      "Team feature: 15 members, advanced permissions, centralized credit pool.",
      "Complete white-labeling (logo, footer, custom disclaimers, domain).",
      "Webhook integrations for automated workflows.",
      "Dedicated account manager & phone priority support.",
      "3 years data retention for audits and legal needs."
    ],
    cta: "Choose Business"
  },
  {
    id: "enterprise",
    name: "Enterprise Plan – Custom Pricing",
    priceINR: 0,
    priceUSD: 0,
    period: "month",
    features: [
      "Made for: MNCs, multi-office firms, banks, enterprise procurement.",
      "Unlimited verifications, infinite team members, custom onboarding, and reporting process.",
      "All document types, compliance modules, custom field mapping.",
      "Dedicated, advanced integrations (SSO, SAML, custom API/webhook, ERP).",
      "Dedicated SLA, security certifications, and audit logs.",
      "Dedicated support team, 24x7, escalation protocols.",
      "Custom data retention and compliance options as per your need.",
      "Custom white-labeling, advanced analytics, full automation."
    ],
    cta: "Talk to Sales"
  }
];

// Curated blog highlights updated to reflect new posts
export const BLOG: BlogPost[] = [
  {
    slug: "gst-vendor-verification-step-by-step-guide-for-indian-smbs",
    title: "GST Vendor Verification: Step-by-Step Guide for Indian SMBs",
    excerpt: "GST verification is essential for preventing fraud and ensuring every vendor meets Indian tax compliance.",
    href: "/blog/gst-vendor-verification-step-by-step-guide-for-indian-smbs"
  },
  {
    slug: "how-freelancers-and-consultants-can-automate-vendor-compliance",
    title: "How Freelancers & Consultants Can Automate Vendor Compliance",
    excerpt: "Automate vendor verification, save hours, and deliver premium service using SaaS tools like Ravono.",
    href: "/blog/how-freelancers-and-consultants-can-automate-vendor-compliance"
  },
  {
    slug: "pan-verification-avoiding-costly-mistakes-in-vendor-onboarding",
    title: "PAN Verification: Avoiding Costly Mistakes in Vendor Onboarding",
    excerpt: "Why PAN verification is non-negotiable and how it works—including methods and a practical checklist.",
    href: "/blog/pan-verification-avoiding-costly-mistakes-in-vendor-onboarding"
  }
];
