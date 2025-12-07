"""
Create Supabase tables using REST API and custom approach
Since we can't execute raw SQL, we'll create a minimal setup via API
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("=" * 70)
print("🚀 Creating Supabase Database via API")
print("=" * 70)

# Read the schema file
with open("/app/backend/supabase/schema.sql", "r") as f:
    schema_sql = f.read()

print("\n📝 Schema loaded. Attempting to execute...")

# Try different methods

# Method 1: Try using Supabase Management API
print("\n🔸 Method 1: Supabase Management API")

# The Management API requires a separate API key
# Let's try the REST API approach

# Method 2: Try POST to a custom RPC endpoint
print("\n🔸 Method 2: Custom RPC Endpoint")

url = f"{SUPABASE_URL}/rest/v1/rpc/query"
headers = {
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

payload = {
    "query": schema_sql
}

try:
    response = requests.post(url, headers=headers, json=payload, timeout=30)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

# Method 3: Use SQL statements via direct HTTP POST
print("\n🔸 Method 3: Direct SQL POST")

# Try posting directly to a SQL execution endpoint
sql_url = f"{SUPABASE_URL}/rest/v1/rpc/exec"
headers_sql = {
    "apikey": SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "text/plain"
}

try:
    response = requests.post(sql_url, headers=headers_sql, data=schema_sql, timeout=60)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:300]}")
    
    if response.status_code == 200 or response.status_code == 201:
        print("\n✅ SUCCESS! Schema executed!")
    else:
        print(f"\n❌ Failed: {response.status_code}")
except Exception as e:
    print(f"Error: {e}")

# Method 4: Use psql command if available
print("\n🔸 Method 4: Using psql command")
print("⚠️  This requires database password which we don't have")

# Method 5: Create tables programmatically using individual SQL statements
print("\n🔸 Method 5: Execute via separate statements")
print("⚠️  Supabase REST API doesn't support DDL operations directly")

print("\n" + "=" * 70)
print("💡 SOLUTION: Use Supabase Dashboard SQL Editor")
print("=" * 70)
print("\n1. Open: https://uacgbxkjnlxkjmqdgbvq.supabase.co/project/uacgbxkjnlxkjmqdgbvq/sql/new")
print("2. Copy content from: /app/backend/supabase/schema.sql")
print("3. Paste and click 'RUN'")
print("\nThis is the recommended and most reliable method.")
print("=" * 70)
