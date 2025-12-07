# 🚀 Ravono Backend - Quick Setup Guide

## ⚡ 5-Minute Setup (Recommended)

### Step 1: Execute Database Schema (2 minutes)

1. **Open Supabase SQL Editor:**
   ```
   https://uacgbxkjnlxkjmqdgbvq.supabase.co/project/uacgbxkjnlxkjmqdgbvq/sql/new
   ```

2. **Copy & Paste:**
   - Open `/app/backend/supabase/schema.sql`
   - Copy ALL content (Ctrl+A, Ctrl+C)
   - Paste into SQL Editor
   - Click **"RUN"** (or Ctrl+Enter)

3. **Verify:**
   - You should see "Success. No rows returned"
   - Go to "Table Editor" - you should see 16 new tables

✅ **Done!** All tables, triggers, RLS policies, and cron functions are created.

---

### Step 2: Create Storage Buckets (1 minute)

Run this Python script:

```bash
cd /app/backend
python supabase/setup_storage.py
```

Or manually:
1. Go to **Storage** in Supabase Dashboard
2. Create 3 buckets:
   - `reports` (Private, 10MB limit, PDF only)
   - `branding` (Public, 2MB limit, Images only  
   - `bulk-uploads` (Private, 5MB limit, CSV only)

---

### Step 3: Setup Cron Jobs (2 minutes)

1. Go to **Database → Cron Jobs** in Supabase
2. Add 4 cron jobs:

**Job 1: Monthly Credit Reset**
```sql
SELECT public.reset_monthly_credits();
```
Schedule: `0 0 1 * *` (1st of month at midnight)

**Job 2: Yearly Credit Reset**
```sql
SELECT public.reset_yearly_credits();
```
Schedule: `0 0 * * *` (Daily at midnight)

**Job 3: Expired Report Cleanup**
```sql
SELECT public.cleanup_expired_reports();
```
Schedule: `0 2 * * *` (Daily at 2 AM)

**Job 4: Low Credit Notifications**
```sql
SELECT public.send_low_credit_alerts();
```
Schedule: `0 9 * * *` (Daily at 9 AM)

---

## ✅ Verification

Run the test script:

```bash
cd /app/backend
python supabase/test_connection.py
```

You should see:
- ✅ Connection successful
- ✅ All 16 tables exist
- ✅ 4 subscription plans loaded

---

## 🚀 Start Backend Server

```bash
cd /app/backend
python server.py
```

Server will start at: `http://0.0.0.0:8001`

Test it:
```bash
curl http://localhost:8001/api/health
```

---

## 🔥 Alternative: Automated Setup (If you have DB password)

If you have the Supabase database password:

1. Get it from: **Settings → Database → Connection String**
2. Export it:
   ```bash
   export DB_PASSWORD="your_password_here"
   ```
3. Run:
   ```bash
   cd /app/backend
   python supabase/auto_setup_with_password.py
   ```

---

## 📊 What Gets Created

### Tables (16):
1. orgs - Organizations
2. profiles - User profiles  
3. plans - Subscription plans (4 pre-loaded)
4. subscriptions - Active subscriptions
5. credits - Credit balances
6. credit_logs - Credit audit trail
7. vendors - Vendor database
8. verifications - Verification records
9. reports - Generated reports
10. branding_settings - White-label settings
11. jobs - Bulk upload jobs
12. integrations - Google Drive, etc.
13. suggestions - Feature suggestions
14. testimonials - User testimonials
15. notifications - In-app notifications
16. audit_logs - System audit trail

### Storage Buckets (3):
- `reports` - PDF reports
- `branding` - Company logos
- `bulk-uploads` - CSV files

### Cron Jobs (4):
- Monthly credit reset
- Yearly credit reset
- Expired report cleanup
- Low credit notifications

### Security:
- ✅ RLS enabled on all tables
- ✅ Multi-tenant isolation
- ✅ Auto-signup triggers
- ✅ Admin bypass policies

---

## 🆘 Troubleshooting

**Issue: "Table does not exist"**
- Solution: Execute schema.sql in SQL Editor

**Issue: "Permission denied"**
- Solution: Check RLS policies, ensure user is authenticated

**Issue: "Storage bucket not found"**
- Solution: Create storage buckets manually or run setup_storage.py

**Issue: "Cron job not running"**
- Solution: Check Logs in Database → Cron Jobs

---

## 📞 Need Help?

Check the detailed setup instructions:
- `/app/backend/supabase/SETUP_INSTRUCTIONS.md`

Or run diagnostics:
```bash
python supabase/test_connection.py
```

---

**Total Setup Time: ~5 minutes** ⚡
