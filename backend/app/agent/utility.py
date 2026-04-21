
import os

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import smtplib



EMAIL_SENDER   = os.getenv("EMAIL_SENDER", "f2022266397@umt.edu.pk")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD", "Musa125@")
SMTP_HOST      = "smtp.gmail.com"
SMTP_PORT      = 587





def _send_confirmation_email(
    to_email: str,
    customer_name: str,
    booking_id: str,
    hall_name: str,
    event_date: str,
    event_type: str,
    guests: int,
) -> str:
    """Send HTML confirmation email via Gmail SMTP."""
    html_body = f"""
    <html><body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:auto">
      <div style="background:#2c3e50;padding:20px;text-align:center">
        <h1 style="color:#fff;margin:0">🎉 Booking Confirmed!</h1>
      </div>
      <div style="padding:30px;background:#f9f9f9">
        <p>Dear <strong>{customer_name}</strong>,</p>
        <p>Your hall booking has been successfully confirmed. Here are your details:</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0">
          <tr style="background:#ecf0f1">
            <td style="padding:10px;border:1px solid #ddd"><strong>Booking ID</strong></td>
            <td style="padding:10px;border:1px solid #ddd">{booking_id}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd"><strong>Hall Name</strong></td>
            <td style="padding:10px;border:1px solid #ddd">{hall_name}</td>
          </tr>
          <tr style="background:#ecf0f1">
            <td style="padding:10px;border:1px solid #ddd"><strong>Event Type</strong></td>
            <td style="padding:10px;border:1px solid #ddd">{event_type}</td>
          </tr>
          <tr>
            <td style="padding:10px;border:1px solid #ddd"><strong>Event Date</strong></td>
            <td style="padding:10px;border:1px solid #ddd">{event_date}</td>
          </tr>
          <tr style="background:#ecf0f1">
            <td style="padding:10px;border:1px solid #ddd"><strong>Guests</strong></td>
            <td style="padding:10px;border:1px solid #ddd">{guests}</td>
          </tr>
        </table>
        <p>Thank you for booking with us. Please contact us if you need any changes.</p>
        <p style="color:#888;font-size:12px">ShadiHall.pk — Lahore's Premier Booking Platform</p>
      </div>
    </body></html>
    """

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"✅ Booking Confirmed — {hall_name} on {event_date} [{booking_id}]"
        msg["From"]    = EMAIL_SENDER
        msg["To"]      = to_email
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.ehlo()
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.sendmail(EMAIL_SENDER, to_email, msg.as_string())

        return "sent"
    except Exception as e:
        return f"failed ({e})"

