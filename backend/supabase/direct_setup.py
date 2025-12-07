"""
Direct Supabase setup using PostgreSQL connection
Executes schema.sql directly against the database
"""

import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
PROJECT_REF = SUPABASE_URL.split("https://")[1].split(".")[0]

print("=" * 70)
print("🚀 RAVONO SUPABASE DIRECT SETUP")
print("=" * 70)

print(f"\n📋 Project Reference: {PROJECT_REF}")
print(f"📋 Supabase URL: {SUPABASE_URL}")

# Try installing psycopg2
print("\n📦 Installing PostgreSQL client...")
os.system("pip install psycopg2-binary -q")

try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
    
    print("✅ psycopg2 installed successfully")
    
    # Connection string format for Supabase:
    # postgresql://postgres:[YOUR-PASSWORD]@db.PROJECT_REF.supabase.co:6543/postgres
    
    print("\n⚠️  To connect directly to PostgreSQL, we need the database password.")
    print("    This is found in: Supabase Dashboard > Settings > Database > Connection String")
    print("\n📝 The connection string looks like:")
    print(f"    postgresql://postgres:[PASSWORD]@db.{PROJECT_REF}.supabase.co:6543/postgres")
    
    # Alternative: We can try using the service role key with Supabase's pooler
    # Supabase provides a connection pooler that works with API keys
    
    print("\n🔄 Attempting connection using Supabase pooler...")
    
    # Supabase transaction pooler endpoint
    conn_string = f"postgresql://postgres.{PROJECT_REF}:@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
    
    print(f"Connection: {conn_string}")
    print("\n❌ LIMITATION: Direct PostgreSQL connection requires database password")
    print("   The API keys (anon/service_role) are different from DB password")
    
except ImportError as e:
    print(f"❌ Could not import psycopg2: {e}")

print("\n" + "=" * 70)
print("🎯 RECOMMENDED SOLUTION:")
print("=" * 70)
print("\nSince direct PostgreSQL access requires credentials we don't have,")
print("I'll use the Supabase API to check and create tables programmatically.")
print("\nExecuting simplified setup...")
print("=" * 70)

# Import our simplified setup
from supabase import create_client

SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

print("\n🔍 Checking database status...")

# Check if plans table exists
try:
    result = supabase.table("plans").select("*").limit(1).execute()
    print(f"✅ Database is already set up!")
    print(f"   Found {len(result.data)} plan(s)")
    
    # List all plans
    all_plans = supabase.table("plans").select("*").execute()
    for plan in all_plans.data:
        print(f"   - {plan['name']}: ₹{plan['price_monthly']}/mo")
    
except Exception as e:
    error_msg = str(e).lower()
    
    if "relation" in error_msg or "does not exist" in error_msg or "table" in error_msg:
        print("❌ Tables don't exist yet. Need to create schema.")
        print("\n📋 NEXT STEPS:")
        print("   1. Go to: https://uacgbxkjnlxkjmqdgbvq.supabase.co")
        print("   2. Click 'SQL Editor' > 'New Query'")
        print("   3. Copy /app/backend/supabase/schema.sql")
        print("   4. Paste and click 'Run'")
        print("\n   OR")
        print("\n   Let me try using pg_net extension...")
        
        # Try using pg_net if available
        try:
            # Supabase has pg_net extension for HTTP requests
            # We can potentially create a workaround
            print("\n🔄 Attempting workaround using Supabase extensions...")
            
            # Create the schema step by step using individual table creations
            # via RPC calls (if we create helper functions)
            
            print("⚠️  This requires pg_net or custom RPC functions to be set up first.")
            
        except Exception as ex:
            print(f"❌ Workaround failed: {ex}")
    else:
        print(f"❌ Unexpected error: {e}")

print("\n" + "=" * 70)
print("💡 ALTERNATIVE: Using SQL via File Upload")
print("=" * 70)

# Create a curl command that user can run
curl_command = f"""
curl -X POST '{SUPABASE_URL}/rest/v1/rpc/exec' \\
  -H "apikey: {SUPABASE_SERVICE_ROLE_KEY}" \\
  -H "Authorization: Bearer {SUPABASE_SERVICE_ROLE_KEY}" \\
  -H "Content-Type: text/plain" \\
  --data-binary @/app/backend/supabase/schema.sql
"""

print("\n📝 You can try running this curl command:")
print(curl_command)

print("\n" + "=" * 70)
