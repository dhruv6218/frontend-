-- =============================================
-- RAVONO VENDOR COMPLIANCE PLATFORM
-- Complete Database Schema for Supabase
-- 16 Tables with RLS, Triggers, and Indexes
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1. ORGANIZATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.orgs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    gstin TEXT,
    industry TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. PROFILES TABLE (User Profiles)
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'member',
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. PLANS TABLE (Subscription Plans)
-- =============================================
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- FREE, STARTER, PRO, BUSINESS
    name TEXT NOT NULL,
    price_monthly INTEGER NOT NULL DEFAULT 0,
    price_yearly INTEGER NOT NULL DEFAULT 0,
    monthly_credits INTEGER NOT NULL DEFAULT 0,
    yearly_credits INTEGER NOT NULL DEFAULT 0,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default plans
INSERT INTO public.plans (code, name, price_monthly, price_yearly, monthly_credits, yearly_credits, features) VALUES
('FREE', 'Free', 0, 0, 3, 36, '{"verifications": 3, "bulk_upload": false, "api_access": false, "white_label": false, "google_drive": false, "priority_support": false}'),
('STARTER', 'Starter', 499, 4990, 20, 240, '{"verifications": 20, "bulk_upload": true, "api_access": false, "white_label": false, "google_drive": false, "priority_support": false}'),
('PRO', 'Pro', 1499, 14990, 50, 600, '{"verifications": 50, "bulk_upload": true, "api_access": true, "white_label": false, "google_drive": true, "priority_support": true}'),
('BUSINESS', 'Business', 2999, 29990, 100, 1200, '{"verifications": 100, "bulk_upload": true, "api_access": true, "white_label": true, "google_drive": true, "priority_support": true}')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- 4. SUBSCRIPTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES public.plans(id) NOT NULL,
    status TEXT DEFAULT 'active', -- active, cancelled, expired
    billing_cycle TEXT DEFAULT 'monthly', -- monthly, yearly
    start_at TIMESTAMPTZ DEFAULT NOW(),
    end_at TIMESTAMPTZ,
    renewal_at TIMESTAMPTZ,
    razorpay_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 5. CREDITS TABLE (Credit Balance)
-- =============================================
CREATE TABLE IF NOT EXISTS public.credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE UNIQUE NOT NULL,
    current_balance INTEGER DEFAULT 0,
    monthly_limit INTEGER DEFAULT 0,
    last_reset_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 6. CREDIT_LOGS TABLE (Audit Trail)
-- =============================================
CREATE TABLE IF NOT EXISTS public.credit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- ADD, DEDUCT, RESET, ADMIN_ADJUSTMENT
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 7. VENDORS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    gstin TEXT,
    pan TEXT,
    aadhaar_masked TEXT,
    bank_account_last4 TEXT,
    cin TEXT,
    din TEXT,
    passport_no_masked TEXT,
    tan TEXT,
    tin TEXT,
    udyam TEXT,
    rc TEXT,
    upi TEXT,
    dl TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 8. VERIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- GST, PAN, AADHAAR, BANK, MCA, CIN, DIN, PASSPORT, TAN, TIN, UDYAM, RC, UPI, DL, CHALLAN
    raw_request JSONB,
    raw_response JSONB,
    status TEXT DEFAULT 'pending', -- pending, success, failed
    risk_level TEXT, -- LOW, MEDIUM, HIGH
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 9. REPORTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
    verification_id UUID REFERENCES public.verifications(id) ON DELETE CASCADE,
    summary_text TEXT, -- AI-generated summary from Perplexity
    risk_level TEXT, -- LOW, MEDIUM, HIGH
    pdf_url TEXT,
    drive_file_id TEXT,
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 10. BRANDING_SETTINGS TABLE (White-Label)
-- =============================================
CREATE TABLE IF NOT EXISTS public.branding_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE UNIQUE NOT NULL,
    enabled BOOLEAN DEFAULT FALSE,
    company_name TEXT,
    logo_light_url TEXT,
    logo_dark_url TEXT,
    primary_color TEXT DEFAULT '#3B82F6',
    accent_color TEXT DEFAULT '#10B981',
    report_title TEXT DEFAULT 'Vendor Compliance Verification Report',
    footer_text TEXT,
    support_email TEXT,
    support_phone TEXT,
    website TEXT,
    extra_disclaimer TEXT,
    hide_ravono_brand BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 11. JOBS TABLE (Bulk Upload)
-- =============================================
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL NOT NULL,
    type TEXT DEFAULT 'BULK_VERIFY',
    job_name TEXT,
    file_url TEXT,
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    total_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 12. INTEGRATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE UNIQUE NOT NULL,
    google_drive_connected BOOLEAN DEFAULT FALSE,
    google_email TEXT,
    google_token_encrypted TEXT,
    google_refresh_token_encrypted TEXT,
    auto_save_reports BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 13. SUGGESTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    category TEXT,
    details TEXT,
    status TEXT DEFAULT 'OPEN', -- OPEN, PLANNED, DONE, REJECTED
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 14. TESTIMONIALS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    company TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 15. NOTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- nullable for broadcast
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    channel TEXT DEFAULT 'in-app', -- in-app, email, both
    status TEXT DEFAULT 'unread', -- unread, read
    sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 16. AUDIT_LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.orgs(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL, -- LOGIN, VERIFY_VENDOR, GENERATE_REPORT, CHANGE_PLAN, etc.
    target_type TEXT, -- VENDOR, REPORT, USER, etc.
    target_id UUID,
    details JSONB,
    ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_org_id ON public.profiles(org_id);
CREATE INDEX idx_subscriptions_org_id ON public.subscriptions(org_id);
CREATE INDEX idx_credits_org_id ON public.credits(org_id);
CREATE INDEX idx_vendors_org_id ON public.vendors(org_id);
CREATE INDEX idx_verifications_org_id ON public.verifications(org_id);
CREATE INDEX idx_verifications_vendor_id ON public.verifications(vendor_id);
CREATE INDEX idx_reports_org_id ON public.reports(org_id);
CREATE INDEX idx_reports_expires_at ON public.reports(expires_at);
CREATE INDEX idx_jobs_org_id ON public.jobs(org_id);
CREATE INDEX idx_jobs_status ON public.jobs(status);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_audit_logs_org_id ON public.audit_logs(org_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Plans table is public (read-only)
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Plans are viewable by everyone" ON public.plans FOR SELECT USING (true);

-- Profiles: Users can only see their own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Orgs: Users can view their own org
CREATE POLICY "Users can view own org" ON public.orgs FOR SELECT USING (
    id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Users can update own org" ON public.orgs FOR UPDATE USING (
    id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Subscriptions: Org members can view
CREATE POLICY "Org members can view subscriptions" ON public.subscriptions FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Credits: Org members can view
CREATE POLICY "Org members can view credits" ON public.credits FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Credit Logs: Org members can view
CREATE POLICY "Org members can view credit logs" ON public.credit_logs FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Vendors: Org members can view and insert
CREATE POLICY "Org members can view vendors" ON public.vendors FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can insert vendors" ON public.vendors FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can update vendors" ON public.vendors FOR UPDATE USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Verifications: Org members can view and insert
CREATE POLICY "Org members can view verifications" ON public.verifications FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can insert verifications" ON public.verifications FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Reports: Org members can view and insert
CREATE POLICY "Org members can view reports" ON public.reports FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can insert reports" ON public.reports FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Branding Settings: Org members can view and update
CREATE POLICY "Org members can view branding" ON public.branding_settings FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can insert branding" ON public.branding_settings FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can update branding" ON public.branding_settings FOR UPDATE USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Jobs: Org members can view and insert
CREATE POLICY "Org members can view jobs" ON public.jobs FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can insert jobs" ON public.jobs FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Integrations: Org members can view and update
CREATE POLICY "Org members can view integrations" ON public.integrations FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can insert integrations" ON public.integrations FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Org members can update integrations" ON public.integrations FOR UPDATE USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Suggestions: Anyone can view approved, org members can insert
CREATE POLICY "Anyone can view suggestions" ON public.suggestions FOR SELECT USING (true);
CREATE POLICY "Org members can insert suggestions" ON public.suggestions FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Testimonials: Anyone can view approved
CREATE POLICY "Anyone can view approved testimonials" ON public.testimonials FOR SELECT USING (approved = true);
CREATE POLICY "Org members can insert testimonials" ON public.testimonials FOR INSERT WITH CHECK (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Notifications: Users can view their own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (
    user_id = auth.uid() OR user_id IS NULL
);

-- Audit Logs: Org members can view
CREATE POLICY "Org members can view audit logs" ON public.audit_logs FOR SELECT USING (
    org_id IN (SELECT org_id FROM public.profiles WHERE user_id = auth.uid())
);

-- Admin bypass policies
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can view all orgs" ON public.orgs FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- =============================================
-- DATABASE TRIGGERS
-- =============================================

-- Trigger: Auto-create org, profile, subscription, credits on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_org_id UUID;
    free_plan_id UUID;
BEGIN
    -- Create new organization
    INSERT INTO public.orgs (name) 
    VALUES (COALESCE(NEW.raw_user_meta_data->>'org_name', NEW.email))
    RETURNING id INTO new_org_id;

    -- Create profile
    INSERT INTO public.profiles (user_id, org_id, name, is_admin)
    VALUES (
        NEW.id, 
        new_org_id, 
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
        false
    );

    -- Get FREE plan ID
    SELECT id INTO free_plan_id FROM public.plans WHERE code = 'FREE' LIMIT 1;

    -- Create subscription (FREE plan)
    INSERT INTO public.subscriptions (org_id, plan_id, status, billing_cycle)
    VALUES (new_org_id, free_plan_id, 'active', 'monthly');

    -- Create credits entry (3 credits for FREE plan)
    INSERT INTO public.credits (org_id, current_balance, monthly_limit)
    VALUES (new_org_id, 3, 3);

    -- Create default integrations entry
    INSERT INTO public.integrations (org_id)
    VALUES (new_org_id);

    -- Create default branding settings
    INSERT INTO public.branding_settings (org_id, enabled)
    VALUES (new_org_id, false);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Log credit changes
CREATE OR REPLACE FUNCTION public.log_credit_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE' AND OLD.current_balance != NEW.current_balance) THEN
        INSERT INTO public.credit_logs (org_id, type, amount, balance_after, reason)
        VALUES (
            NEW.org_id,
            CASE 
                WHEN NEW.current_balance > OLD.current_balance THEN 'ADD'
                ELSE 'DEDUCT'
            END,
            ABS(NEW.current_balance - OLD.current_balance),
            NEW.current_balance,
            'System automatic log'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_credit_change
    AFTER UPDATE ON public.credits
    FOR EACH ROW EXECUTE FUNCTION public.log_credit_change();

-- Trigger: Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orgs_updated_at BEFORE UPDATE ON public.orgs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_credits_updated_at BEFORE UPDATE ON public.credits
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON public.vendors
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_branding_settings_updated_at BEFORE UPDATE ON public.branding_settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON public.integrations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =============================================
-- STORAGE BUCKETS (Run via Supabase Dashboard or API)
-- =============================================
-- Bucket: reports (for PDF files)
-- Bucket: branding (for logos)
-- Bucket: bulk-uploads (for CSV files)

-- =============================================
-- CRON JOBS (Setup via Supabase Dashboard -> Database -> Cron Jobs)
-- =============================================

-- Job 1: Monthly Credit Reset (1st of every month at 00:00 IST)
CREATE OR REPLACE FUNCTION public.reset_monthly_credits()
RETURNS void AS $$
BEGIN
    UPDATE public.credits c
    SET 
        current_balance = p.monthly_credits,
        last_reset_at = NOW()
    FROM public.subscriptions s
    JOIN public.plans p ON s.plan_id = p.id
    WHERE c.org_id = s.org_id 
        AND s.status = 'active'
        AND s.billing_cycle = 'monthly';

    -- Log the reset
    INSERT INTO public.credit_logs (org_id, type, amount, balance_after, reason)
    SELECT 
        c.org_id,
        'RESET',
        c.current_balance,
        c.current_balance,
        'Monthly credit reset'
    FROM public.credits c;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Job 2: Yearly Credit Reset (on renewal date)
CREATE OR REPLACE FUNCTION public.reset_yearly_credits()
RETURNS void AS $$
BEGIN
    UPDATE public.credits c
    SET 
        current_balance = p.yearly_credits,
        last_reset_at = NOW()
    FROM public.subscriptions s
    JOIN public.plans p ON s.plan_id = p.id
    WHERE c.org_id = s.org_id 
        AND s.status = 'active'
        AND s.billing_cycle = 'yearly'
        AND s.renewal_at <= NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Job 3: Expired Report Cleanup (Daily at 02:00 IST)
CREATE OR REPLACE FUNCTION public.cleanup_expired_reports()
RETURNS void AS $$
BEGIN
    -- Only delete reports that are expired and NOT saved to Google Drive
    DELETE FROM public.reports
    WHERE expires_at < NOW() 
        AND drive_file_id IS NULL;
    
    -- TODO: Also delete PDFs from Supabase Storage
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Job 4: Low Credit Notifications (Daily at 09:00 IST)
CREATE OR REPLACE FUNCTION public.send_low_credit_alerts()
RETURNS void AS $$
BEGIN
    INSERT INTO public.notifications (org_id, user_id, title, body, channel)
    SELECT 
        c.org_id,
        p.user_id,
        'Low Credit Balance',
        'Your credit balance is running low (' || c.current_balance || ' remaining). Consider upgrading your plan.',
        'both'
    FROM public.credits c
    JOIN public.profiles p ON c.org_id = p.org_id
    WHERE c.current_balance < 5
        AND NOT EXISTS (
            SELECT 1 FROM public.notifications n
            WHERE n.org_id = c.org_id 
                AND n.title = 'Low Credit Balance'
                AND n.sent_at > NOW() - INTERVAL '7 days'
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- UTILITY FUNCTIONS
-- =============================================

-- Function: Get org_id from user_id
CREATE OR REPLACE FUNCTION public.get_org_id(p_user_id UUID)
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT org_id FROM public.profiles WHERE user_id = p_user_id LIMIT 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Check if user has sufficient credits
CREATE OR REPLACE FUNCTION public.has_sufficient_credits(p_org_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (SELECT current_balance > 0 FROM public.credits WHERE org_id = p_org_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Deduct credits
CREATE OR REPLACE FUNCTION public.deduct_credits(p_org_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    SELECT current_balance INTO current_credits FROM public.credits WHERE org_id = p_org_id FOR UPDATE;
    
    IF current_credits < p_amount THEN
        RETURN FALSE;
    END IF;
    
    UPDATE public.credits 
    SET current_balance = current_balance - p_amount
    WHERE org_id = p_org_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- END OF SCHEMA
-- =============================================
