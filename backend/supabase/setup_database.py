"""
Script to setup complete Supabase database schema
Run this to create all 16 tables, triggers, RLS policies, and functions
"""

import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase credentials
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def setup_database():
    """Execute the complete database schema"""
    
    print("🚀 Connecting to Supabase...")
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    print("📖 Reading schema.sql...")
    with open("/app/backend/supabase/schema.sql", "r") as f:
        schema_sql = f.read()
    
    print("⚙️ Executing schema...")
    
    # Split the schema into individual statements
    statements = schema_sql.split(";")
    
    success_count = 0
    error_count = 0
    
    for i, statement in enumerate(statements):
        statement = statement.strip()
        if not statement or statement.startswith("--"):
            continue
            
        try:
            # Execute via Supabase REST API's RPC or direct SQL
            supabase.postgrest.rpc("exec_sql", {"query": statement}).execute()
            success_count += 1
            print(f"✅ Statement {i+1} executed successfully")
        except Exception as e:
            error_count += 1
            print(f"❌ Error in statement {i+1}: {str(e)[:100]}")
    
    print(f"\n{'='*50}")
    print(f"✅ Success: {success_count} statements")
    print(f"❌ Errors: {error_count} statements")
    print(f"{'='*50}\n")
    
    if error_count == 0:
        print("🎉 Database schema setup completed successfully!")
    else:
        print("⚠️ Schema setup completed with some errors. Please check the logs above.")
    
    # Verify tables
    print("\n🔍 Verifying tables...")
    try:
        result = supabase.table("plans").select("*").execute()
        print(f"✅ Tables verified. Found {len(result.data)} plans in database.")
        for plan in result.data:
            print(f"   - {plan['name']}: {plan['monthly_credits']} credits/month")
    except Exception as e:
        print(f"❌ Table verification failed: {e}")

if __name__ == "__main__":
    setup_database()
