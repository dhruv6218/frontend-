"""
Setup Supabase database by executing SQL via REST API
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def execute_sql(sql: str):
    """Execute SQL via Supabase REST API"""
    url = f"{SUPABASE_URL}/rest/v1/rpc/exec_sql"
    headers = {
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, headers=headers, json={"query": sql})
    return response

def setup_database():
    """Read and execute schema.sql"""
    print("🚀 Setting up Supabase database...")
    print("=" * 60)
    
    # Read schema
    with open("/app/backend/supabase/schema.sql", "r") as f:
        schema_sql = f.read()
    
    print("\n📝 Schema loaded. Executing via REST API...")
    print("\n⚠️  NOTE: This method may not work for all statements.")
    print("          If you see errors, please use Supabase Dashboard SQL Editor instead.")
    print("          Copy/paste /app/backend/supabase/schema.sql into SQL Editor and run.")
    print("\n" + "=" * 60)
    
    # Try to execute
    try:
        response = execute_sql(schema_sql)
        if response.status_code == 200:
            print("✅ Schema executed successfully!")
        else:
            print(f"❌ Error: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
            print("\n" + "=" * 60)
            print("⚠️  RECOMMENDED APPROACH:")
            print("   1. Go to: https://uacgbxkjnlxkjmqdgbvq.supabase.co")
            print("   2. Click 'SQL Editor' in left sidebar")
            print("   3. Click 'New Query'")
            print("   4. Copy entire /app/backend/supabase/schema.sql")
            print("   5. Paste and click 'Run'")
            print("=" * 60)
    except Exception as e:
        print(f"❌ Exception: {str(e)}")
        print("\n" + "=" * 60)
        print("⚠️  MANUAL SETUP REQUIRED:")
        print("   Please execute schema.sql manually via Supabase Dashboard.")
        print("=" * 60)

if __name__ == "__main__":
    setup_database()
