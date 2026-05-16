import os
import base64
import requests
from datetime import datetime
from fastapi import HTTPException

class MpesaService:
    def __init__(self):
        self.env = os.getenv("MPESA_ENV", "sandbox")
        self.base_url = "https://sandbox.safaricom.co.ke" if self.env == "sandbox" else "https://api.safaricom.co.ke"
        self.consumer_key = os.getenv("MPESA_CONSUMER_KEY")
        self.consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
        self.shortcode = os.getenv("MPESA_SHORTCODE")
        self.passkey = os.getenv("MPESA_PASSKEY")
        self.callback_url = os.getenv("MPESA_CALLBACK_URL")

    def get_access_token(self) -> str:
        """Fetches active OAuth security access token from Safaricom endpoints"""
        url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
        try:
            res = requests.get(url, auth=(self.consumer_key, self.consumer_secret), timeout=10)
            res.raise_for_status()
            return res.json().get("access_token")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Safaricom Auth Refused: {str(e)}")

    def send_stk_push(self, phone_number: str, amount: int, invoice_num: str) -> dict:
        token = self.get_access_token()
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        
        password_str = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_str.encode()).decode("utf-8")

        headers = {"Authorization": f"Bearer {token}"}
        payload = {
            "BusinessShortCode": self.shortcode,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": amount,
            "PartyA": phone_number,
            "PartyB": self.shortcode,
            "PhoneNumber": phone_number,
            "CallBackURL": self.callback_url,
            "AccountReference": invoice_num,
            "TransactionDesc": f"Payment for Invoice {invoice_num}"
        }

        url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
        try:
            res = requests.post(url, json=payload, headers=headers, timeout=10)
            res.raise_for_status()
            return res.json()
        except Exception as e:
            error_msg = getattr(e, 'response', None)
            detail = error_msg.text if error_msg else str(e)
            raise HTTPException(status_code=502, detail=f"STK Transmission Error: {detail}")