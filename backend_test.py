#!/usr/bin/env python3
"""
Comprehensive Backend Test Suite for Ravono Vendor Compliance Platform
Tests all API endpoints with proper authentication and error handling
"""

import requests
import json
import csv
import io
import time
from typing import Dict, Any, Optional

class RavonoBackendTester:
    def __init__(self, base_url: str = "http://localhost:8001"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.access_token = None
        self.test_results = []
        
    def log_result(self, test_name: str, success: bool, details: str, response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
        
    def test_health_check(self):
        """Test 1: Health Check"""
        try:
            response = requests.get(f"{self.api_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, f"Status: {data['status']}", data)
                else:
                    self.log_result("Health Check", False, f"Unexpected status: {data.get('status')}", data)
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Health Check", False, f"Connection error: {str(e)}")
    
    def test_plans_api(self):
        """Test 2: Plans API"""
        try:
            response = requests.get(f"{self.api_url}/plans", timeout=10)
            if response.status_code == 200:
                plans = response.json()
                if isinstance(plans, list) and len(plans) >= 4:
                    plan_names = [plan.get('name', plan.get('code', 'Unknown')) for plan in plans]
                    self.log_result("Plans API", True, f"Found {len(plans)} plans: {', '.join(plan_names)}", plans)
                else:
                    self.log_result("Plans API", False, f"Expected 4+ plans, got {len(plans) if isinstance(plans, list) else 'non-list'}", plans)
            else:
                self.log_result("Plans API", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Plans API", False, f"Request error: {str(e)}")
    
    def test_signup(self):
        """Test 3: User Signup"""
        signup_params = {
            "email": "test@ravono.com",
            "password": "Test@1234",
            "name": "Test User",
            "org_name": "Test Organization"
        }
        
        try:
            response = requests.post(f"{self.api_url}/auth/signup", params=signup_params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("user") and data.get("session"):
                    self.log_result("User Signup", True, f"User created: {data['user'].get('email')}", data)
                else:
                    self.log_result("User Signup", False, "Missing user or session in response", data)
            else:
                # User might already exist, which is acceptable for testing
                if "already registered" in response.text.lower() or "user already exists" in response.text.lower():
                    self.log_result("User Signup", True, "User already exists (acceptable for testing)", response.json())
                else:
                    self.log_result("User Signup", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("User Signup", False, f"Request error: {str(e)}")
    
    def test_signin(self):
        """Test 4: User Signin"""
        signin_data = {
            "email": "test@ravono.com",
            "password": "Test@1234"
        }
        
        try:
            response = requests.post(f"{self.api_url}/auth/signin", data=signin_data, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("session") and data["session"].get("access_token"):
                    self.access_token = data["session"]["access_token"]
                    self.log_result("User Signin", True, f"Login successful, token obtained", {"user_email": data.get("user", {}).get("email")})
                else:
                    self.log_result("User Signin", False, "No access token in response", data)
            else:
                self.log_result("User Signin", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("User Signin", False, f"Request error: {str(e)}")
    
    def get_auth_headers(self) -> Dict[str, str]:
        """Get authorization headers"""
        if not self.access_token:
            return {}
        return {"Authorization": f"Bearer {self.access_token}"}
    
    def test_dashboard_stats(self):
        """Test 5: Dashboard Stats (requires auth)"""
        if not self.access_token:
            self.log_result("Dashboard Stats", False, "No access token available")
            return
            
        try:
            response = requests.get(f"{self.api_url}/dashboard/stats", headers=self.get_auth_headers(), timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["credits_remaining", "verifications_this_month"]
                if all(field in data for field in required_fields):
                    self.log_result("Dashboard Stats", True, f"Stats retrieved: {data}", data)
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Dashboard Stats", False, f"Missing fields: {missing}", data)
            elif response.status_code == 401:
                self.log_result("Dashboard Stats", False, "Authentication failed - invalid token")
            else:
                self.log_result("Dashboard Stats", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Dashboard Stats", False, f"Request error: {str(e)}")
    
    def test_credits_balance(self):
        """Test 6: Credits Balance (requires auth)"""
        if not self.access_token:
            self.log_result("Credits Balance", False, "No access token available")
            return
            
        try:
            response = requests.get(f"{self.api_url}/credits/balance", headers=self.get_auth_headers(), timeout=10)
            if response.status_code == 200:
                data = response.json()
                if "current_balance" in data:
                    self.log_result("Credits Balance", True, f"Balance: {data['current_balance']}", data)
                else:
                    self.log_result("Credits Balance", False, "No current_balance in response", data)
            elif response.status_code == 401:
                self.log_result("Credits Balance", False, "Authentication failed - invalid token")
            else:
                self.log_result("Credits Balance", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Credits Balance", False, f"Request error: {str(e)}")
    
    def test_vendor_verification(self):
        """Test 7: Vendor Verification (requires auth)"""
        if not self.access_token:
            self.log_result("Vendor Verification", False, "No access token available")
            return
            
        verification_data = {
            "type": "GST",
            "vendor_name": "Test Company Pvt Ltd",
            "vendor_data": {
                "gstin": "29ABCDE1234F1Z5",
                "notes": "Test verification"
            }
        }
        
        try:
            response = requests.post(
                f"{self.api_url}/verify/vendor", 
                json=verification_data, 
                headers=self.get_auth_headers(), 
                timeout=30
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("report_id") and data.get("verification_id"):
                    self.report_id = data["report_id"]  # Store for PDF test
                    self.log_result("Vendor Verification", True, f"Verification created: {data['report_id']}", data)
                else:
                    self.log_result("Vendor Verification", False, "Missing report_id or verification_id", data)
            elif response.status_code == 401:
                self.log_result("Vendor Verification", False, "Authentication failed")
            elif response.status_code == 402:
                self.log_result("Vendor Verification", False, "Insufficient credits")
            elif response.status_code == 502:
                self.log_result("Vendor Verification", False, "Plan API integration error (expected in test environment)")
            else:
                self.log_result("Vendor Verification", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Vendor Verification", False, f"Request error: {str(e)}")
    
    def test_reports_list(self):
        """Test 8: Reports List (requires auth)"""
        if not self.access_token:
            self.log_result("Reports List", False, "No access token available")
            return
            
        try:
            response = requests.get(f"{self.api_url}/reports", headers=self.get_auth_headers(), timeout=10)
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    self.log_result("Reports List", True, f"Found {len(data)} reports", {"count": len(data)})
                else:
                    self.log_result("Reports List", False, "Response is not a list", data)
            elif response.status_code == 401:
                self.log_result("Reports List", False, "Authentication failed")
            else:
                self.log_result("Reports List", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Reports List", False, f"Request error: {str(e)}")
    
    def test_pdf_generation(self):
        """Test 9: PDF Generation (requires auth and report_id)"""
        if not self.access_token:
            self.log_result("PDF Generation", False, "No access token available")
            return
            
        if not hasattr(self, 'report_id'):
            self.log_result("PDF Generation", False, "No report_id available from verification test")
            return
            
        try:
            response = requests.get(
                f"{self.api_url}/reports/{self.report_id}/pdf", 
                headers=self.get_auth_headers(), 
                timeout=30
            )
            if response.status_code == 200:
                if response.headers.get('content-type') == 'application/pdf':
                    self.log_result("PDF Generation", True, f"PDF generated successfully ({len(response.content)} bytes)")
                else:
                    self.log_result("PDF Generation", False, f"Wrong content type: {response.headers.get('content-type')}")
            elif response.status_code == 401:
                self.log_result("PDF Generation", False, "Authentication failed")
            elif response.status_code == 404:
                self.log_result("PDF Generation", False, "Report not found")
            else:
                self.log_result("PDF Generation", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("PDF Generation", False, f"Request error: {str(e)}")
    
    def test_bulk_upload(self):
        """Test 10: Bulk Upload (requires auth)"""
        if not self.access_token:
            self.log_result("Bulk Upload", False, "No access token available")
            return
            
        # Create test CSV content
        csv_content = """vendor_name,gstin,type
Test Vendor 1,29ABCDE1234F1Z5,GST
Test Vendor 2,29ABCDE1234F1Z6,GST"""
        
        try:
            files = {
                'file': ('test_vendors.csv', csv_content, 'text/csv')
            }
            data = {
                'job_name': 'Test Bulk Upload'
            }
            
            response = requests.post(
                f"{self.api_url}/bulk-upload", 
                files=files,
                data=data,
                headers=self.get_auth_headers(), 
                timeout=30
            )
            if response.status_code == 200:
                data = response.json()
                if data.get("job_id") and data.get("total_rows"):
                    self.log_result("Bulk Upload", True, f"Job created: {data['job_id']} with {data['total_rows']} rows", data)
                else:
                    self.log_result("Bulk Upload", False, "Missing job_id or total_rows", data)
            elif response.status_code == 401:
                self.log_result("Bulk Upload", False, "Authentication failed")
            else:
                self.log_result("Bulk Upload", False, f"HTTP {response.status_code}: {response.text}")
        except Exception as e:
            self.log_result("Bulk Upload", False, f"Request error: {str(e)}")
    
    def test_error_handling(self):
        """Test 11: Error Handling"""
        # Test unauthorized access
        try:
            response = requests.get(f"{self.api_url}/dashboard/stats", timeout=10)
            if response.status_code == 401:
                self.log_result("Error Handling - Unauthorized", True, "Correctly returned 401 for unauthorized access")
            else:
                self.log_result("Error Handling - Unauthorized", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling - Unauthorized", False, f"Request error: {str(e)}")
        
        # Test invalid data
        if self.access_token:
            try:
                invalid_data = {"invalid": "data"}
                response = requests.post(
                    f"{self.api_url}/verify/vendor", 
                    json=invalid_data, 
                    headers=self.get_auth_headers(), 
                    timeout=10
                )
                if response.status_code in [400, 422]:  # Bad request or validation error
                    self.log_result("Error Handling - Invalid Data", True, f"Correctly returned {response.status_code} for invalid data")
                else:
                    self.log_result("Error Handling - Invalid Data", False, f"Expected 400/422, got {response.status_code}")
            except Exception as e:
                self.log_result("Error Handling - Invalid Data", False, f"Request error: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting Ravono Backend API Tests...")
        print("=" * 60)
        
        # Basic tests (no auth required)
        self.test_health_check()
        self.test_plans_api()
        
        # Authentication tests
        self.test_signup()
        self.test_signin()
        
        # Authenticated tests
        if self.access_token:
            self.test_dashboard_stats()
            self.test_credits_balance()
            self.test_vendor_verification()
            self.test_reports_list()
            self.test_pdf_generation()
            self.test_bulk_upload()
        
        # Error handling tests
        self.test_error_handling()
        
        # Summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result["success"])
        failed = len(self.test_results) - passed
        
        print(f"Total Tests: {len(self.test_results)}")
        print(f"✅ Passed: {passed}")
        print(f"❌ Failed: {failed}")
        print(f"Success Rate: {(passed/len(self.test_results)*100):.1f}%")
        
        if failed > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  • {result['test']}: {result['details']}")
        
        print("\n" + "=" * 60)

if __name__ == "__main__":
    tester = RavonoBackendTester()
    tester.run_all_tests()