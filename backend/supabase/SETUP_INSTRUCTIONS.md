# 🚀 Ravono Supabase Backend Setup Instructions

## Step 1: Execute Database Schema

### Option A: Via Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://uacgbxkjnlxkjmqdgbvq.supabase.co
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy the entire content from `/app/backend/supabase/schema.sql`
5. Paste it into the SQL Editor
6. Click **"Run"** button

✅ This will create:
- All 16 tables
- RLS policies
- Database triggers
- Cron job functions
- Indexes

### Option B: Via Supabase CLI

```bash
supabase db push
```

---

## Step 2: Setup Storage Buckets

Go to **Storage** in Supabase Dashboard and create 3 buckets:

### 1. `reports` Bucket
- **Purpose:** Store PDF reports
- **Public:** No (Private)
- **File Size Limit:** 10 MB
- **Allowed MIME types:** `application/pdf`

**RLS Policies:**
```sql
-- Allow authenticated users to read their org's reports
CREATE POLICY "Users can read own org reports"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'reports' AND
  (storage.foldername(name))[1] IN (
    SELECT org_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Allow authenticated users to upload reports
CREATE POLICY "Users can upload reports"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'reports' AND
  (storage.foldername(name))[1] IN (
    SELECT org_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);
```

### 2. `branding` Bucket
- **Purpose:** Store company logos (white-label)
- **Public:** Yes (Public read)
- **File Size Limit:** 2 MB
- **Allowed MIME types:** `image/png, image/jpeg, image/svg+xml`

**RLS Policies:**
```sql
-- Allow public read
CREATE POLICY "Public can read branding"
ON storage.objects FOR SELECT
USING (bucket_id = 'branding');

-- Allow authenticated users to upload their org's branding
CREATE POLICY "Users can upload branding"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'branding' AND
  (storage.foldername(name))[1] IN (
    SELECT org_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);
```

### 3. `bulk-uploads` Bucket
- **Purpose:** Store CSV files for bulk verification
- **Public:** No (Private)
- **File Size Limit:** 5 MB
- **Allowed MIME types:** `text/csv, application/vnd.ms-excel`

**RLS Policies:**
```sql
-- Allow authenticated users to read their org's uploads
CREATE POLICY "Users can read own org uploads"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'bulk-uploads' AND
  (storage.foldername(name))[1] IN (
    SELECT org_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);

-- Allow authenticated users to upload
CREATE POLICY "Users can upload CSV"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'bulk-uploads' AND
  (storage.foldername(name))[1] IN (
    SELECT org_id::text FROM public.profiles WHERE user_id = auth.uid()
  )
);
```

---

## Step 3: Setup Cron Jobs

Go to **Database → Cron Jobs** in Supabase Dashboard:

### Job 1: Monthly Credit Reset
- **Schedule:** `0 0 1 * *` (1st of every month at 00:00)
- **Function:** `reset_monthly_credits()`
- **Command:**
```sql
SELECT public.reset_monthly_credits();
```

### Job 2: Yearly Credit Reset
- **Schedule:** `0 0 * * *` (Daily at 00:00 to check renewal dates)
- **Function:** `reset_yearly_credits()`
- **Command:**
```sql
SELECT public.reset_yearly_credits();
```

### Job 3: Expired Report Cleanup
- **Schedule:** `0 2 * * *` (Daily at 02:00)
- **Function:** `cleanup_expired_reports()`
- **Command:**
```sql
SELECT public.cleanup_expired_reports();
```

### Job 4: Low Credit Notifications
- **Schedule:** `0 9 * * *` (Daily at 09:00)
- **Function:** `send_low_credit_alerts()`
- **Command:**
```sql
SELECT public.send_low_credit_alerts();
```

---

## Step 4: Enable Email Auth

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Configure email templates:
   - **Confirm Signup**
   - **Reset Password**
   - **Magic Link**

4. **SMTP Settings (Using Brevo):**
   - Host: `smtp-relay.brevo.com`
   - Port: `587`
   - Username: `8ef0ee001@smtp-brevo.com`
   - Password: `xsmtpsib-5b0fa867acffd5ee2fbd74da57b5b211fc0acde15b127ba8ee4a598d065f0dcc-313VNvIzemg9WNR4`
   - Sender Email: `info@ravonovendor.co.in`
   - Sender Name: `Ravono Vendor Compliance`

---

## Step 5: Verify Setup

Run this test script:

```bash
cd /app/backend
python supabase/test_connection.py
```

This will:
✅ Test Supabase connection
✅ Verify all tables exist
✅ Check RLS policies
✅ Validate default plans

---

## Step 6: Deploy Edge Functions

```bash
cd /app/backend/supabase/functions
supabase functions deploy verify-vendor
supabase functions deploy generate-risk-summary
supabase functions deploy generate-pdf
supabase functions deploy save-to-drive
supabase functions deploy process-bulk-job
```

---

## 🔒 Security Checklist

- ✅ RLS enabled on all tables
- ✅ Service role key stored securely in .env
- ✅ Storage buckets have proper access policies
- ✅ Cron jobs scheduled
- ✅ SMTP configured for auth emails

---

## 📊 Database Status

After setup, you should have:

| Component | Count | Status |
|-----------|-------|--------|
| Tables | 16 | ✅ |
| RLS Policies | 30+ | ✅ |
| Triggers | 3 | ✅ |
| Functions | 8+ | ✅ |
| Cron Jobs | 4 | ✅ |
| Storage Buckets | 3 | ⏳ |
| Edge Functions | 5 | ⏳ |

---

## 🆘 Troubleshooting

### Issue: Tables not created
**Solution:** Check SQL Editor for syntax errors. Run schema line by line.

### Issue: RLS blocking queries
**Solution:** Ensure user is authenticated and has proper org_id in profiles table.

### Issue: Cron jobs not running
**Solution:** Check Database → Cron Jobs → Logs for errors.

### Issue: Storage upload fails
**Solution:** Verify bucket exists and RLS policies are correctly applied.

---

## Next Steps

1. ✅ Setup database schema
2. ⏳ Create storage buckets
3. ⏳ Setup cron jobs
4. ⏳ Deploy Edge Functions
5. ⏳ Integrate with frontend
6. ⏳ Test end-to-end flows

---

**Need Help?** Check Supabase docs: https://supabase.com/docs
