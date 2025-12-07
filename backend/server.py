"""
Ravono Vendor Compliance Platform - FastAPI Backend Server
Integrated with Supabase database and external verification APIs
"""

from fastapi import FastAPI, HTTPException, Depends, Header, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from typing import Optional, Dict, Any, List
from pydantic import BaseModel
from datetime import datetime, timezone, timedelta
import os
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client
import httpx

load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="Ravono Vendor Compliance API",
    description="Backend API for Indian vendor verification and compliance",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Plan API credentials
PLAN_API_BASE_URL = os.getenv("PLAN_API_BASE_URL")
PLAN_API_USER_ID = os.getenv("PLAN_API_USER_ID")
PLAN_API_PASSWORD = os.getenv("PLAN_API_PASSWORD")
PLAN_API_TOKEN = os.getenv("PLAN_API_TOKEN")

# Perplexity API
PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY")

# =============================================
# PYDANTIC MODELS
# =============================================

class UserProfile(BaseModel):
    id: str
    user_id: str
    org_id: str
    name: str
    phone: Optional[str] = None
    role: str = "member"
    is_admin: bool = False

class VerificationRequest(BaseModel):
    type: str  # GST, PAN, AADHAAR, BANK, etc.
    vendor_name: str
    vendor_data: Dict[str, Any]  # Contains ID numbers, etc.

class VerificationResponse(BaseModel):
    verification_id: str
    report_id: str
    status: str
    risk_level: str
    summary: str

# =============================================
# HELPER FUNCTIONS
# =============================================

def get_user_from_token(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """Extract and validate user from JWT token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        # Verify token with Supabase
        user = supabase.auth.get_user(token)
        return user.user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

def get_org_id(user_id: str) -> str:
    """Get organization ID for a user"""
    try:
        result = supabase.table("profiles").select("org_id").eq("user_id", user_id).single().execute()
        return result.data["org_id"]
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"User profile not found: {str(e)}")

def check_credits(org_id: str) -> bool:
    """Check if org has sufficient credits"""
    try:
        result = supabase.table("credits").select("current_balance").eq("org_id", org_id).single().execute()
        return result.data["current_balance"] > 0
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking credits: {str(e)}")

def deduct_credits(org_id: str, amount: int = 1) -> bool:
    """Deduct credits from org"""
    try:
        # Get current balance
        result = supabase.table("credits").select("current_balance").eq("org_id", org_id).single().execute()
        current_balance = result.data["current_balance"]
        
        if current_balance < amount:
            return False
        
        # Update balance
        new_balance = current_balance - amount
        supabase.table("credits").update({"current_balance": new_balance}).eq("org_id", org_id).execute()
        
        return True
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deducting credits: {str(e)}")

async def call_plan_api(verification_type: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Call Plan API for verification"""
    
    # Map verification types to Plan API endpoints
    endpoint_map = {
        "GST": "/Ekyc/GstDetailsAndVerify",
        "PAN": "/Ekyc/PanVerification",
        "AADHAAR": "/Ekyc/AdharVerification",
        "BANK": "/Ekyc/BankVerification",
        "CIN": "/Ekyc/CinVerification",
        "DIN": "/Ekyc/DinVerification",
        # Add more mappings as needed
    }
    
    endpoint = endpoint_map.get(verification_type)
    if not endpoint:
        raise HTTPException(status_code=400, detail=f"Unsupported verification type: {verification_type}")
    
    url = f"{PLAN_API_BASE_URL}{endpoint}"
    
    headers = {
        "TokenID": PLAN_API_TOKEN,
        "ApiUserID": PLAN_API_USER_ID,
        "ApiPassword": PLAN_API_PASSWORD,
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers, timeout=30.0)
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"Plan API error: {str(e)}")

async def generate_ai_risk_summary(verification_data: Dict[str, Any]) -> Dict[str, str]:
    """Generate AI risk summary using Perplexity"""
    
    prompt = f"""
    Analyze the following Indian vendor verification data and provide a comprehensive risk assessment:
    
    Verification Data: {verification_data}
    
    Please provide:
    1. Risk Level (LOW, MEDIUM, or HIGH)
    2. Key Findings (2-3 bullet points)
    3. Red Flags (if any)
    4. Recommended Actions
    
    Format the response as JSON with keys: risk_level, key_findings, red_flags, recommendations
    """
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.perplexity.ai/chat/completions",
                headers={
                    "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-sonar-small-128k-online",
                    "messages": [
                        {"role": "system", "content": "You are an expert in Indian vendor compliance and risk assessment."},
                        {"role": "user", "content": prompt}
                    ]
                },
                timeout=30.0
            )
            response.raise_for_status()
            result = response.json()
            
            # Extract content from Perplexity response
            ai_content = result["choices"][0]["message"]["content"]
            
            return {
                "risk_level": "MEDIUM",  # Parse from AI response
                "summary": ai_content
            }
    except Exception as e:
        # Fallback if AI fails
        return {
            "risk_level": "MEDIUM",
            "summary": f"Verification completed. Please review the data manually. (AI summary unavailable: {str(e)})"
        }

# =============================================
# API ROUTES
# =============================================

@app.get("/")
def read_root():
    return {
        "message": "Ravono Vendor Compliance API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# =============================================
# AUTH ROUTES
# =============================================

@app.post("/api/auth/signup")
async def signup(email: str, password: str, name: str, org_name: Optional[str] = None):
    """Sign up a new user"""
    try:
        # Create user in Supabase Auth
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "name": name,
                    "org_name": org_name or email
                }
            }
        })
        
        return {
            "message": "User created successfully",
            "user": response.user,
            "session": response.session
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Signup failed: {str(e)}")

@app.post("/api/auth/signin")
async def signin(email: str, password: str):
    """Sign in an existing user"""
    try:
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        return {
            "message": "Login successful",
            "user": response.user,
            "session": response.session
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Login failed: {str(e)}")

@app.get("/api/auth/user")
async def get_current_user(authorization: str = Header(None)):
    """Get current authenticated user"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    # Get full profile
    profile = supabase.table("profiles").select("*").eq("user_id", user.id).single().execute()
    
    return {
        "user": user,
        "profile": profile.data
    }

# =============================================
# VERIFICATION ROUTES
# =============================================

@app.post("/api/verify/vendor", response_model=VerificationResponse)
async def verify_vendor(request: VerificationRequest, authorization: str = Header(None)):
    """Verify a vendor using Plan API and generate AI report"""
    
    # Authenticate user
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    # Check credits
    if not check_credits(org_id):
        raise HTTPException(status_code=402, detail="Insufficient credits. Please upgrade your plan.")
    
    try:
        # Step 1: Call Plan API for verification
        plan_api_response = await call_plan_api(request.type, request.vendor_data)
        
        # Step 2: Create/update vendor record
        vendor_data = {
            "org_id": org_id,
            "name": request.vendor_name,
            request.type.lower(): request.vendor_data.get(request.type.lower())
        }
        
        vendor_result = supabase.table("vendors").insert(vendor_data).execute()
        vendor_id = vendor_result.data[0]["id"]
        
        # Step 3: Store verification record
        verification_data = {
            "org_id": org_id,
            "vendor_id": vendor_id,
            "type": request.type,
            "raw_request": request.vendor_data,
            "raw_response": plan_api_response,
            "status": "success",
            "performed_by": user.id
        }
        
        verification_result = supabase.table("verifications").insert(verification_data).execute()
        verification_id = verification_result.data[0]["id"]
        
        # Step 4: Generate AI risk summary
        ai_summary = await generate_ai_risk_summary(plan_api_response)
        
        # Step 5: Create report
        report_data = {
            "org_id": org_id,
            "vendor_id": vendor_id,
            "verification_id": verification_id,
            "summary_text": ai_summary["summary"],
            "risk_level": ai_summary["risk_level"],
            "expires_at": (datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0) + 
                          timedelta(days=7)).isoformat()
        }
        
        report_result = supabase.table("reports").insert(report_data).execute()
        report_id = report_result.data[0]["id"]
        
        # Step 6: Deduct credits
        deduct_credits(org_id, 1)
        
        # Step 7: Log audit trail
        supabase.table("audit_logs").insert({
            "org_id": org_id,
            "actor_id": user.id,
            "action": "VERIFY_VENDOR",
            "target_type": "VENDOR",
            "target_id": vendor_id,
            "details": {"type": request.type, "vendor_name": request.vendor_name}
        }).execute()
        
        return VerificationResponse(
            verification_id=verification_id,
            report_id=report_id,
            status="success",
            risk_level=ai_summary["risk_level"],
            summary=ai_summary["summary"]
        )
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Verification failed: {str(e)}")

# =============================================
# CREDIT ROUTES
# =============================================

@app.get("/api/credits/balance")
async def get_credit_balance(authorization: str = Header(None)):
    """Get current credit balance"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    result = supabase.table("credits").select("*").eq("org_id", org_id).single().execute()
    
    return result.data

# =============================================
# DASHBOARD ROUTES
# =============================================

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(authorization: str = Header(None)):
    """Get dashboard statistics"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    # Get credits
    credits = supabase.table("credits").select("current_balance, monthly_limit").eq("org_id", org_id).single().execute()
    
    # Get verifications count (this month)
    verifications = supabase.table("verifications").select("id", count="exact").eq("org_id", org_id).execute()
    
    # Get reports count
    reports = supabase.table("reports").select("id", count="exact").eq("org_id", org_id).execute()
    
    # Get high risk vendors count
    high_risk = supabase.table("reports").select("id", count="exact").eq("org_id", org_id).eq("risk_level", "HIGH").execute()
    
    return {
        "credits_remaining": credits.data["current_balance"],
        "credits_total": credits.data["monthly_limit"],
        "verifications_this_month": verifications.count,
        "total_reports": reports.count,
        "high_risk_vendors": high_risk.count
    }

@app.get("/api/reports")
async def get_reports(authorization: str = Header(None)):
    """Get all reports for the organization"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    result = supabase.table("reports")\
        .select("*, vendors(*), verifications(*)")\
        .eq("org_id", org_id)\
        .order("created_at", desc=True)\
        .execute()
    
    return result.data

@app.get("/api/reports/{report_id}")
async def get_report_detail(report_id: str, authorization: str = Header(None)):
    """Get detailed report"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    result = supabase.table("reports")\
        .select("*, vendors(*), verifications(*)")\
        .eq("id", report_id)\
        .eq("org_id", org_id)\
        .single()\
        .execute()
    
    return result.data

@app.get("/api/reports/{report_id}/pdf")
async def generate_report_pdf(report_id: str, authorization: str = Header(None)):
    """Generate PDF for a report"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    try:
        # Get report data
        report = supabase.table("reports")\
            .select("*, vendors(*), verifications(*)")\
            .eq("id", report_id)\
            .eq("org_id", org_id)\
            .single()\
            .execute()
        
        if not report.data:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Get branding settings
        branding = supabase.table("branding_settings")\
            .select("*")\
            .eq("org_id", org_id)\
            .single()\
            .execute()
        
        branding_data = branding.data if branding.data else {}
        
        # Import PDF generator
        from services.pdf_generator import PDFReportGenerator
        
        generator = PDFReportGenerator(branding=branding_data)
        
        # Generate PDF
        pdf_content = generator.generate_report(
            vendor_data=report.data["vendors"],
            verification_data=report.data["verifications"],
            ai_summary={"risk_level": report.data.get("risk_level", "MEDIUM"), "summary": report.data.get("summary_text", "")},
            report_id=report_id
        )
        
        # Save PDF to storage
        file_path = f"{org_id}/{report_id}.pdf"
        supabase.storage.from_("reports").upload(
            file_path,
            pdf_content,
            {"content-type": "application/pdf"}
        )
        
        # Update report with PDF URL
        pdf_url = supabase.storage.from_("reports").get_public_url(file_path)
        supabase.table("reports").update({"pdf_url": pdf_url}).eq("id", report_id).execute()
        
        # Return PDF
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=report_{report_id}.pdf"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

# =============================================
# PLANS ROUTES
# =============================================

@app.get("/api/plans")
async def get_plans():
    """Get all subscription plans"""
    result = supabase.table("plans").select("*").eq("is_active", True).execute()
    return result.data

# =============================================
# PAYMENT ROUTES (RAZORPAY)
# =============================================

@app.post("/api/payment/create-order")
async def create_payment_order(plan_code: str, authorization: str = Header(None)):
    """Create Razorpay order for plan purchase"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    try:
        # Get user profile
        profile = supabase.table("profiles").select("name").eq("user_id", user.id).single().execute()
        
        from services.razorpay_service import RazorpayService
        razorpay_service = RazorpayService()
        
        order_data = razorpay_service.create_subscription(
            plan_id=plan_code,
            customer_email=user.email,
            customer_name=profile.data["name"],
            org_id=org_id
        )
        
        return order_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

@app.post("/api/payment/verify")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    plan_code: str,
    authorization: str = Header(None)
):
    """Verify payment and update subscription"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    try:
        from services.razorpay_service import RazorpayService
        razorpay_service = RazorpayService()
        
        # Verify signature
        is_valid = razorpay_service.verify_payment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        )
        
        if not is_valid:
            raise HTTPException(status_code=400, detail="Invalid payment signature")
        
        # Get plan details
        plan = supabase.table("plans").select("*").eq("code", plan_code).single().execute()
        
        if not plan.data:
            raise HTTPException(status_code=404, detail="Plan not found")
        
        # Update subscription
        # First, deactivate old subscriptions
        supabase.table("subscriptions").update({"status": "cancelled"}).eq("org_id", org_id).execute()
        
        # Create new subscription
        new_subscription = {
            "org_id": org_id,
            "plan_id": plan.data["id"],
            "status": "active",
            "billing_cycle": "monthly",
            "start_at": datetime.now(timezone.utc).isoformat(),
            "renewal_at": (datetime.now(timezone.utc) + timedelta(days=30)).isoformat(),
            "razorpay_subscription_id": razorpay_payment_id,
        }
        
        supabase.table("subscriptions").insert(new_subscription).execute()
        
        # Update credits
        supabase.table("credits").update({
            "current_balance": plan.data["monthly_credits"],
            "monthly_limit": plan.data["monthly_credits"],
        }).eq("org_id", org_id).execute()
        
        # Log audit
        supabase.table("audit_logs").insert({
            "org_id": org_id,
            "actor_id": user.id,
            "action": "PLAN_UPGRADE",
            "target_type": "SUBSCRIPTION",
            "details": {"plan": plan_code, "payment_id": razorpay_payment_id}
        }).execute()
        
        return {
            "success": True,
            "message": f"Successfully upgraded to {plan_code} plan",
            "credits": plan.data["monthly_credits"]
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Payment verification failed: {str(e)}")

# =============================================
# GOOGLE DRIVE INTEGRATION ROUTES
# =============================================

@app.get("/api/integrations/google-drive/auth-url")
async def get_google_drive_auth_url(authorization: str = Header(None)):
    """Get Google Drive OAuth authorization URL"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    try:
        from services.google_drive_service import GoogleDriveService
        drive_service = GoogleDriveService()
        
        auth_url = drive_service.get_authorization_url(state=org_id)
        
        return {"authorization_url": auth_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate auth URL: {str(e)}")

@app.post("/api/integrations/google-drive/connect")
async def connect_google_drive(code: str, authorization: str = Header(None)):
    """Connect Google Drive with authorization code"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    try:
        from services.google_drive_service import GoogleDriveService
        drive_service = GoogleDriveService()
        
        # Exchange code for tokens
        tokens = drive_service.exchange_code_for_tokens(code)
        
        # Store tokens in integrations table (encrypted in production)
        supabase.table("integrations").update({
            "google_drive_connected": True,
            "google_email": tokens["email"],
            "google_token_encrypted": tokens["access_token"],  # Should encrypt in production
            "google_refresh_token_encrypted": tokens["refresh_token"],
        }).eq("org_id", org_id).execute()
        
        # Log audit
        supabase.table("audit_logs").insert({
            "org_id": org_id,
            "actor_id": user.id,
            "action": "GOOGLE_DRIVE_CONNECTED",
            "target_type": "INTEGRATION",
            "details": {"email": tokens["email"]}
        }).execute()
        
        return {
            "success": True,
            "email": tokens["email"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect Google Drive: {str(e)}")

@app.post("/api/reports/{report_id}/save-to-drive")
async def save_report_to_drive(report_id: str, authorization: str = Header(None)):
    """Save report PDF to Google Drive"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    try:
        # Get report
        report = supabase.table("reports").select("*, vendors(*)").eq("id", report_id).eq("org_id", org_id).single().execute()
        
        if not report.data:
            raise HTTPException(status_code=404, detail="Report not found")
        
        # Get Google Drive integration
        integration = supabase.table("integrations").select("*").eq("org_id", org_id).single().execute()
        
        if not integration.data or not integration.data.get("google_drive_connected"):
            raise HTTPException(status_code=400, detail="Google Drive not connected")
        
        # Get PDF content
        pdf_url = report.data.get("pdf_url")
        if not pdf_url:
            # Generate PDF first
            await generate_report_pdf(report_id, authorization)
            report = supabase.table("reports").select("*").eq("id", report_id).single().execute()
            pdf_url = report.data.get("pdf_url")
        
        # Download PDF from storage
        file_path = f"{org_id}/{report_id}.pdf"
        pdf_content = supabase.storage.from_("reports").download(file_path)
        
        # Upload to Drive
        from services.google_drive_service import GoogleDriveService
        drive_service = GoogleDriveService()
        
        vendor_name = report.data.get("vendors", {}).get("name", "Unknown")
        file_name = f"Ravono_Report_{vendor_name}_{report_id[:8]}.pdf"
        
        drive_result = drive_service.upload_file(
            file_content=pdf_content,
            file_name=file_name,
            mime_type="application/pdf",
            access_token=integration.data["google_token_encrypted"],
            refresh_token=integration.data.get("google_refresh_token_encrypted"),
        )
        
        # Update report with Drive file ID
        supabase.table("reports").update({
            "drive_file_id": drive_result["file_id"]
        }).eq("id", report_id).execute()
        
        # Log audit
        supabase.table("audit_logs").insert({
            "org_id": org_id,
            "actor_id": user.id,
            "action": "REPORT_SAVED_TO_DRIVE",
            "target_type": "REPORT",
            "target_id": report_id,
            "details": {"file_id": drive_result["file_id"]}
        }).execute()
        
        return {
            "success": True,
            "file_id": drive_result["file_id"],
            "web_view_link": drive_result["web_view_link"]
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save to Drive: {str(e)}")

# =============================================
# BULK UPLOAD ROUTES
# =============================================

@app.post("/api/bulk-upload")
async def create_bulk_upload_job(
    file: UploadFile = File(...),
    job_name: str = "",
    authorization: str = Header(None)
):
    """Create bulk verification job from CSV"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    try:
        # Validate file type
        if not file.filename.endswith('.csv'):
            raise HTTPException(status_code=400, detail="Only CSV files are allowed")
        
        # Read CSV content
        csv_content = await file.read()
        
        # Upload to storage
        file_path = f"{org_id}/{uuid.uuid4()}.csv"
        supabase.storage.from_("bulk-uploads").upload(
            file_path,
            csv_content,
            {"content-type": "text/csv"}
        )
        
        file_url = supabase.storage.from_("bulk-uploads").get_public_url(file_path)
        
        # Parse CSV to count rows
        import csv
        from io import StringIO
        
        csv_string = csv_content.decode('utf-8')
        csv_reader = csv.DictReader(StringIO(csv_string))
        rows = list(csv_reader)
        
        # Create job record
        job_data = {
            "org_id": org_id,
            "user_id": user.id,
            "type": "BULK_VERIFY",
            "job_name": job_name or file.filename,
            "file_url": file_url,
            "status": "pending",
            "total_count": len(rows),
            "success_count": 0,
            "error_count": 0,
        }
        
        job = supabase.table("jobs").insert(job_data).execute()
        
        # Log audit
        supabase.table("audit_logs").insert({
            "org_id": org_id,
            "actor_id": user.id,
            "action": "BULK_UPLOAD_CREATED",
            "target_type": "JOB",
            "target_id": job.data[0]["id"],
            "details": {"total_rows": len(rows)}
        }).execute()
        
        return {
            "success": True,
            "job_id": job.data[0]["id"],
            "total_rows": len(rows)
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk upload failed: {str(e)}")

@app.get("/api/bulk-upload/jobs")
async def get_bulk_jobs(authorization: str = Header(None)):
    """Get all bulk upload jobs for organization"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    result = supabase.table("jobs").select("*").eq("org_id", org_id).order("created_at", desc=True).execute()
    
    return result.data

@app.get("/api/bulk-upload/jobs/{job_id}")
async def get_bulk_job_detail(job_id: str, authorization: str = Header(None)):
    """Get bulk job details"""
    user = get_user_from_token(authorization)
    org_id = get_org_id(user.id)
    
    result = supabase.table("jobs").select("*").eq("id", job_id).eq("org_id", org_id).single().execute()
    
    return result.data

# =============================================
# START SERVER
# =============================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
