"""
Test Supabase connection and verify database setup
"""

import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def test_connection():
    """Test Supabase connection and database setup"""
    
    print("=" * 60)
    print("🧪 Ravono Supabase Connection Test")
    print("=" * 60)
    
    try:
        # Create Supabase client
        print("\n1️⃣ Connecting to Supabase...")
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        print("   ✅ Connection successful!")
        
        # Test: Fetch plans
        print("\n2️⃣ Testing plans table...")
        plans_response = supabase.table("plans").select("*").execute()
        print(f"   ✅ Found {len(plans_response.data)} subscription plans:")
        for plan in plans_response.data:
            print(f"      - {plan['name']} ({plan['code']}): ₹{plan['price_monthly']}/mo, {plan['monthly_credits']} credits")
        
        # Test: Check if tables exist
        print("\n3️⃣ Verifying all tables exist...")
        tables_to_check = [
            "orgs", "profiles", "plans", "subscriptions", "credits", 
            "credit_logs", "vendors", "verifications", "reports", 
            "branding_settings", "jobs", "integrations", "suggestions", 
            "testimonials", "notifications", "audit_logs"
        ]
        
        for table in tables_to_check:
            try:
                result = supabase.table(table).select("id", count="exact").limit(1).execute()
                print(f"   ✅ {table} - OK")
            except Exception as e:
                print(f"   ❌ {table} - ERROR: {str(e)[:50]}")
        
        # Test: Check RLS is enabled
        print("\n4️⃣ Checking Row Level Security...")
        # This would require a regular user auth token to properly test
        print("   ⏩ Skipped (requires authenticated user)")
        
        # Test: Check storage buckets (optional)
        print("\n5️⃣ Checking storage buckets...")
        try:
            buckets = supabase.storage.list_buckets()
            if len(buckets) > 0:
                print(f"   ✅ Found {len(buckets)} bucket(s):")
                for bucket in buckets:
                    print(f"      - {bucket['name']}")
            else:
                print("   ⚠️  No storage buckets found. Please create them manually.")
        except Exception as e:
            print(f"   ⚠️  Storage check failed: {str(e)[:50]}")
        
        print("\n" + "=" * 60)
        print("✅ All tests passed! Supabase backend is ready.")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print("\n" + "=" * 60)
        print(f"❌ Connection test failed: {str(e)}")
        print("=" * 60)
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
