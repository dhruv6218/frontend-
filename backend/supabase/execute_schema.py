"""
Execute Supabase schema using direct PostgreSQL connection
"""

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Connection string
DATABASE_URL = "postgresql://postgres:baadshah6218@db.uacgbxkjnlxkjmqdgbvq.supabase.co:5432/postgres"

print("=" * 70)
print("🚀 EXECUTING SUPABASE SCHEMA")
print("=" * 70)

try:
    # Connect to database
    print("\n📡 Connecting to Supabase PostgreSQL...")
    conn = psycopg2.connect(DATABASE_URL)
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    print("✅ Connected successfully!")
    
    # Read schema file
    print("\n📖 Reading schema.sql...")
    with open("/app/backend/supabase/schema.sql", "r") as f:
        schema_sql = f.read()
    
    print(f"✅ Schema loaded ({len(schema_sql)} characters)")
    
    # Execute schema
    print("\n⚙️ Executing SQL schema...")
    print("   (This may take 30-60 seconds...)")
    
    cursor.execute(schema_sql)
    
    print("✅ Schema executed successfully!")
    
    # Verify tables
    print("\n🔍 Verifying tables...")
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
    """)
    
    tables = cursor.fetchall()
    print(f"✅ Found {len(tables)} tables:")
    for table in tables:
        print(f"   - {table[0]}")
    
    # Check plans
    print("\n📊 Checking subscription plans...")
    cursor.execute("SELECT code, name, price_monthly, monthly_credits FROM public.plans ORDER BY price_monthly;")
    plans = cursor.fetchall()
    
    print(f"✅ Found {len(plans)} plans:")
    for plan in plans:
        print(f"   - {plan[1]} ({plan[0]}): ₹{plan[2]}/mo, {plan[3]} credits")
    
    # Close connection
    cursor.close()
    conn.close()
    
    print("\n" + "=" * 70)
    print("🎉 DATABASE SETUP COMPLETE!")
    print("=" * 70)
    print("\nAll tables, triggers, RLS policies, and functions are ready!")
    print("\nNext steps:")
    print("1. Setup storage buckets")
    print("2. Configure cron jobs")
    print("3. Start backend server")
    print("=" * 70)
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")
    print("\nPlease check:")
    print("1. Database password is correct")
    print("2. Network connectivity to Supabase")
    print("3. Database permissions")
    exit(1)
