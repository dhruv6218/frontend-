"""
Execute schema using Supabase REST API by creating chunks
"""

import os
import time
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

print("=" * 70)
print("🚀 SUPABASE SCHEMA EXECUTION VIA API")
print("=" * 70)

# Since direct PostgreSQL connection doesn't work due to network/DNS,
# let's use a workaround: execute the schema via curl to Supabase Management API

print("\n🔄 Preparing to execute schema...")
print("   Method: HTTP POST to Supabase SQL API")

# Save schema to a temp file with proper escaping
with open("/app/backend/supabase/schema.sql", "r") as f:
    schema_sql = f.read()

# Try using curl to POST to Supabase
import subprocess

# Supabase has a SQL execution endpoint via their dashboard API
# We'll need to use their Management API

print("\n⚠️  Network restrictions prevent direct PostgreSQL connection.")
print("   This is common in containerized environments.")

print("\n📋 SOLUTION:")
print("=" * 70)
print("\nI'll create individual SQL statements that can be executed via API.")
print("Or you can use Supabase Dashboard (recommended).")

print("\n🎯 Quick Option: Use Supabase Dashboard")
print("-" * 70)
print("1. Go to: https://uacgbxkjnlxkjmqdgbvq.supabase.co/project/uacgbxkjnlxkjmqdgbvq/sql/new")
print("2. Copy from: /app/backend/supabase/schema.sql")
print("3. Paste and click 'RUN'")
print("4. Tell me when done!")

print("\n" + "=" * 70)

# Alternative: Try using Supabase CLI if available
print("\n🔍 Checking for Supabase CLI...")

try:
    result = subprocess.run(
        ["which", "supabase"],
        capture_output=True,
        text=True,
        timeout=5
    )
    
    if result.returncode == 0:
        print(f"✅ Supabase CLI found at: {result.stdout.strip()}")
        print("\n🚀 Attempting to execute via Supabase CLI...")
        
        # Try to link project
        link_result = subprocess.run(
            ["supabase", "link", "--project-ref", "uacgbxkjnlxkjmqdgbvq", "--password", "baadshah6218"],
            capture_output=True,
            text=True,
            timeout=30,
            cwd="/app/backend"
        )
        
        if link_result.returncode == 0:
            print("✅ Project linked!")
            
            # Execute SQL
            exec_result = subprocess.run(
                ["supabase", "db", "push", "--db-url", f"postgresql://postgres:baadshah6218@db.uacgbxkjnlxkjmqdgbvq.supabase.co:5432/postgres"],
                capture_output=True,
                text=True,
                timeout=120,
                cwd="/app/backend"
            )
            
            if exec_result.returncode == 0:
                print("✅ Schema executed via CLI!")
                print(exec_result.stdout)
            else:
                print(f"❌ CLI execution failed: {exec_result.stderr}")
        else:
            print(f"❌ Project link failed: {link_result.stderr}")
            
    else:
        print("❌ Supabase CLI not installed")
        print("\nInstall with: npm install -g supabase")
        
except Exception as e:
    print(f"⚠️  CLI check failed: {e}")

print("\n" + "=" * 70)
