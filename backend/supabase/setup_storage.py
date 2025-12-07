"""
Setup Supabase Storage Buckets
Creates all required storage buckets for the application
"""

import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

def setup_storage_buckets():
    """Create all required storage buckets"""
    
    print("=" * 70)
    print("📦 Ravono Storage Buckets Setup")
    print("=" * 70)
    
    supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    
    buckets_config = [
        {
            "id": "reports",
            "name": "reports",
            "public": False,
            "file_size_limit": 10485760,  # 10 MB
            "allowed_mime_types": ["application/pdf"]
        },
        {
            "id": "branding",
            "name": "branding",
            "public": True,
            "file_size_limit": 2097152,  # 2 MB
            "allowed_mime_types": ["image/png", "image/jpeg", "image/svg+xml", "image/webp"]
        },
        {
            "id": "bulk-uploads",
            "name": "bulk-uploads",
            "public": False,
            "file_size_limit": 5242880,  # 5 MB
            "allowed_mime_types": ["text/csv", "application/vnd.ms-excel", "application/csv"]
        }
    ]
    
    print("\n🔍 Checking existing buckets...")
    
    try:
        existing_buckets = supabase.storage.list_buckets()
        existing_names = [b["name"] for b in existing_buckets]
        print(f"   Found {len(existing_buckets)} existing bucket(s): {existing_names}")
    except Exception as e:
        print(f"   ⚠️  Could not list buckets: {e}")
        existing_names = []
    
    print("\n🚀 Creating buckets...")
    
    created_count = 0
    skipped_count = 0
    error_count = 0
    
    for bucket in buckets_config:
        bucket_id = bucket["id"]
        
        if bucket_id in existing_names:
            print(f"   ⏩ '{bucket_id}' - Already exists (skipped)")
            skipped_count += 1
            continue
        
        try:
            # Create bucket
            supabase.storage.create_bucket(
                bucket_id,
                options={
                    "public": bucket["public"],
                    "file_size_limit": bucket["file_size_limit"],
                    "allowed_mime_types": bucket["allowed_mime_types"]
                }
            )
            
            visibility = "Public" if bucket["public"] else "Private"
            size_mb = bucket["file_size_limit"] / 1024 / 1024
            
            print(f"   ✅ '{bucket_id}' - Created ({visibility}, {size_mb}MB limit)")
            created_count += 1
            
        except Exception as e:
            print(f"   ❌ '{bucket_id}' - Error: {str(e)[:80]}")
            error_count += 1
    
    print("\n" + "=" * 70)
    print("📊 Summary:")
    print(f"   ✅ Created: {created_count}")
    print(f"   ⏩ Skipped: {skipped_count}")
    print(f"   ❌ Errors: {error_count}")
    print("=" * 70)
    
    if created_count + skipped_count == len(buckets_config):
        print("\n🎉 All storage buckets are ready!")
        return True
    else:
        print("\n⚠️  Some buckets could not be created. Check errors above.")
        return False

if __name__ == "__main__":
    success = setup_storage_buckets()
    exit(0 if success else 1)
