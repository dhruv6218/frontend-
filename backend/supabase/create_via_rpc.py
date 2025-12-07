"""
Create database schema by executing SQL statements via Supabase RPC
We'll create a helper function first, then use it to execute the schema
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("=" * 70)
print("🚀 ALTERNATIVE METHOD: Browser-based Setup")
print("=" * 70)

print("\n⚠️  Due to network restrictions in this container,")
print("   I cannot execute SQL directly against Supabase.")

print("\n📋 RECOMMENDED SOLUTION:")
print("=" * 70)

instructions = """
1. Open this URL in your browser:
   https://uacgbxkjnlxkjmqdgbvq.supabase.co/project/uacgbxkjnlxkjmqdgbvq/sql/new

2. You'll see a SQL Editor. Click "New Query"

3. Copy the ENTIRE content from this file:
   /app/backend/supabase/schema.sql
   
   (You can view it with: cat /app/backend/supabase/schema.sql)

4. Paste into the SQL Editor

5. Click the green "RUN" button (bottom right)

6. You should see: "Success. No rows returned"

7. Click "Table Editor" in left sidebar to verify 16 tables were created

8. Come back here and type: "done" or "executed"

Then I will continue with:
- ✅ Setting up storage buckets
- ✅ Configuring cron jobs  
- ✅ Testing the database
- ✅ Starting backend server
- ✅ Integrating frontend
"""

print(instructions)

print("\n" + "=" * 70)
print("💡 WHY THIS HAPPENS:")
print("=" * 70)
print("The container environment has DNS/network restrictions that prevent")
print("direct database connections. This is a security feature.")
print("The browser-based method works because it goes through Supabase's")
print("web interface which handles authentication differently.")
print("=" * 70)

# Create a simple one-liner for easy copy-paste
print("\n📝 QUICK COPY-PASTE:")
print("-" * 70)
print("1. URL: https://uacgbxkjnlxkjmqdgbvq.supabase.co/project/uacgbxkjnlxkjmqdgbvq/sql/new")
print("2. File to copy: /app/backend/supabase/schema.sql")
print("3. Action: Paste in SQL Editor → Click RUN")
print("4. Reply here: 'done'")
print("-" * 70)

# Try one more alternative: Using Supabase's HTTP SQL endpoint (if exists)
print("\n🔄 Attempting HTTP-based SQL execution...")

# Some Supabase projects have this enabled
sql_api_url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"

headers = {
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "application/json"
}

# Read schema
with open("/app/backend/supabase/schema.sql", "r") as f:
    schema_sql = f.read()

payload = {
    "sql": schema_sql
}

try:
    print(f"   Trying: {sql_api_url}")
    response = requests.post(sql_api_url, headers=headers, json=payload, timeout=60)
    
    if response.status_code == 200 or response.status_code == 201:
        print("✅ SUCCESS! Schema executed via HTTP!")
        print("\n🔍 Verifying...")
        
        # Check if tables exist
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        
        try:
            result = supabase.table("plans").select("*").execute()
            print(f"✅ Database verified! Found {len(result.data)} plans.")
            print("\n🎉 Setup complete via HTTP method!")
        except:
            print("⚠️  HTTP execution may have partially worked. Please verify in dashboard.")
    else:
        print(f"❌ HTTP method not available: {response.status_code}")
        print(f"   Response: {response.text[:200]}")
        
except Exception as e:
    print(f"❌ HTTP execution failed: {str(e)[:100]}")

print("\n" + "=" * 70)
