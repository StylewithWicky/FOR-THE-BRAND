import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_receipt_email(recipient_email: str, invoice_num: str, amount: float, receipt_num: str):
    sender = os.getenv("SMTP_SENDER")
    password = os.getenv("SMTP_PASSWORD")
    server_host = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    server_port = int(os.getenv("SMTP_PORT", 587))
    
    if not sender or not password:
        print("Notification skipped: SMTP environment configurations are missing.")
        return

    msg = MIMEMultipart()
    msg["From"] = f"Billing System <{sender}>"
    msg["To"] = recipient_email
    msg["Subject"] = f"Payment Received: Invoice #{invoice_num}"

  
    html = f"""
    <html>
      <body style="font-family: sans-serif; color: #111; max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #eee;">
        <h2 style="border-bottom: 2px solid #000; padding-bottom: 10px;">PAYMENT CONFIRMED</h2>
        <p>Hi there,</p>
        <p>Thank you for your payment. Your transaction has been successfully processed automatically via M-Pesa.</p>
        <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
          <tr style="background: #f9f9f9;"><td style="padding: 8px;"><b>Invoice Number:</b></td><td style="padding: 8px; text-align: right;">#{invoice_num}</td></tr>
          <tr><td style="padding: 8px;"><b>M-Pesa Receipt:</b></td><td style="padding: 8px; text-align: right; font-family: monospace;">{receipt_num}</td></tr>
          <tr style="background: #f9f9f9; font-size: 1.2em; font-weight: bold;"><td style="padding: 8px;">Amount Paid:</td><td style="padding: 8px; text-align: right; color: #008000;">KES {amount:,.2f}</td></tr>
        </table>
        <p style="font-size: 0.85em; color: #666; margin-top: 30px; text-align: center;">This is an automated operational system ledger artifact.</p>
      </body>
    </html>
    """
    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP(server_host, server_port) as server:
            server.starttls()
            server.login(sender, password)
            server.sendmail(sender, recipient_email, msg.as_string())
            print(f"Receipt email successfully dispatched to {recipient_email}")
    except Exception as e:
        print(f"Failed to execute background receipt delivery: {str(e)}")