"""
Razorpay Payment Integration Service
Handles subscription payments, plan upgrades, and webhooks
"""

import razorpay
import os
from typing import Dict, Any
from datetime import datetime, timedelta

class RazorpayService:
    def __init__(self):
        self.key_id = os.getenv("RAZORPAY_KEY_ID")
        self.key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        self.client = razorpay.Client(auth=(self.key_id, self.key_secret))
    
    def create_order(self, amount: int, currency: str = "INR", notes: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Create a Razorpay order
        
        Args:
            amount: Amount in paise (₹100 = 10000 paise)
            currency: Currency code (default: INR)
            notes: Additional metadata
        
        Returns:
            Order details including order_id
        """
        order_data = {
            "amount": amount,
            "currency": currency,
            "payment_capture": 1,  # Auto-capture payment
        }
        
        if notes:
            order_data["notes"] = notes
        
        order = self.client.order.create(data=order_data)
        return order
    
    def create_subscription(
        self,
        plan_id: str,
        customer_email: str,
        customer_name: str,
        org_id: str
    ) -> Dict[str, Any]:
        """
        Create a Razorpay subscription
        
        Args:
            plan_id: Ravono plan code (STARTER, PRO, BUSINESS)
            customer_email: Customer email
            customer_name: Customer name
            org_id: Organization ID
        
        Returns:
            Subscription details
        """
        # Map Ravono plans to prices (monthly in paise)
        plan_prices = {
            "STARTER": 49900,  # ₹499
            "PRO": 149900,     # ₹1499
            "BUSINESS": 299900  # ₹2999
        }
        
        amount = plan_prices.get(plan_id, 0)
        
        if amount == 0:
            raise ValueError(f"Invalid plan: {plan_id}")
        
        # Create order for first payment
        order = self.create_order(
            amount=amount,
            notes={
                "plan_id": plan_id,
                "org_id": org_id,
                "customer_email": customer_email,
            }
        )
        
        return {
            "order_id": order["id"],
            "amount": amount,
            "currency": "INR",
            "key": self.key_id,
            "name": "Ravono Vendor Compliance",
            "description": f"{plan_id} Plan Subscription",
            "prefill": {
                "name": customer_name,
                "email": customer_email,
            },
            "notes": {
                "plan_id": plan_id,
                "org_id": org_id,
            },
        }
    
    def verify_payment(self, razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        """
        Verify payment signature
        
        Args:
            razorpay_order_id: Order ID from Razorpay
            razorpay_payment_id: Payment ID from Razorpay
            razorpay_signature: Signature from Razorpay
        
        Returns:
            True if signature is valid
        """
        try:
            self.client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            return True
        except razorpay.errors.SignatureVerificationError:
            return False
    
    def get_payment_details(self, payment_id: str) -> Dict[str, Any]:
        """Get payment details by payment ID"""
        return self.client.payment.fetch(payment_id)
    
    def create_refund(self, payment_id: str, amount: int = None) -> Dict[str, Any]:
        """
        Create a refund
        
        Args:
            payment_id: Payment ID to refund
            amount: Amount to refund (optional, defaults to full amount)
        
        Returns:
            Refund details
        """
        data = {}
        if amount:
            data["amount"] = amount
        
        return self.client.payment.refund(payment_id, data)
