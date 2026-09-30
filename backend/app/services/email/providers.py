# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Email Providers: Base, Console/Simulated, SMTP, and Resend
# ==============================================================================

import logging
import smtplib
from abc import ABC, abstractmethod
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional, List, Dict, Any
from app.core.config import settings
from app.services.email.exceptions import (
    EmailDeliveryError,
    EmailConfigurationError,
)

logger = logging.getLogger("genesisconnect.email")


class BaseEmailProvider(ABC):
    """Abstract interface defining the contract for transactional email dispatchers."""

    @abstractmethod
    def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None,
        from_email: Optional[str] = None,
    ) -> bool:
        """Sends a transactional email. Returns True on success, raises EmailDeliveryError on failure."""
        pass


class ConsoleEmailProvider(BaseEmailProvider):
    """
    Console & In-Memory email provider for local development and hermetic test suites.
    Records dispatched emails in an internal list for test assertions without network calls.
    """

    def __init__(self) -> None:
        self.sent_emails: List[Dict[str, Any]] = []

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None,
        from_email: Optional[str] = None,
    ) -> bool:
        sender = from_email or settings.EMAIL_FROM
        email_record = {
            "from": sender,
            "to": to_email,
            "subject": subject,
            "html_body": html_body,
            "text_body": text_body or "",
        }
        self.sent_emails.append(email_record)
        logger.info(
            f"[EMAIL DISPATCHED - SIMULATED] From: '{sender}' | To: '{to_email}' | Subject: '{subject}'"
        )
        return True

    def clear(self) -> None:
        self.sent_emails.clear()


class SMTPEmailProvider(BaseEmailProvider):
    """
    Standard SMTP email provider supporting TLS authentication.
    """

    def __init__(
        self,
        host: Optional[str] = None,
        port: Optional[int] = None,
        user: Optional[str] = None,
        password: Optional[str] = None,
        use_tls: Optional[bool] = None,
    ) -> None:
        self.host = host or settings.SMTP_HOST
        self.port = port or settings.SMTP_PORT
        self.user = user if user is not None else settings.SMTP_USER
        self.password = password if password is not None else settings.SMTP_PASSWORD
        self.use_tls = use_tls if use_tls is not None else settings.SMTP_USE_TLS

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None,
        from_email: Optional[str] = None,
    ) -> bool:
        sender = from_email or settings.EMAIL_FROM

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = sender
        msg["To"] = to_email

        if text_body:
            msg.attach(MIMEText(text_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        try:
            with smtplib.SMTP(self.host, self.port, timeout=10) as server:
                if self.use_tls:
                    server.starttls()
                if self.user and self.password:
                    server.login(self.user, self.password)
                server.sendmail(sender, [to_email], msg.as_string())
            logger.info(f"SMTP email successfully sent to {to_email} (Subject: {subject})")
            return True
        except Exception as e:
            logger.error(f"SMTP delivery failed to {to_email}: {e}")
            raise EmailDeliveryError(f"SMTP delivery failure: {str(e)}")


class ResendEmailProvider(BaseEmailProvider):
    """
    HTTP REST API provider using Resend service.
    """

    def __init__(self, api_key: Optional[str] = None) -> None:
        self.api_key = api_key or settings.EMAIL_API_KEY
        if not self.api_key:
            logger.warning("Resend API key is not configured.")

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_body: str,
        text_body: Optional[str] = None,
        from_email: Optional[str] = None,
    ) -> bool:
        if not self.api_key:
            raise EmailConfigurationError("Cannot dispatch via Resend: EMAIL_API_KEY is not set.")

        import httpx

        sender = from_email or settings.EMAIL_FROM
        payload: Dict[str, Any] = {
            "from": sender,
            "to": [to_email],
            "subject": subject,
            "html": html_body,
        }
        if text_body:
            payload["text"] = text_body

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                resp = client.post(
                    "https://api.resend.com/emails",
                    json=payload,
                    headers=headers,
                )
                if resp.status_code >= 400:
                    raise EmailDeliveryError(
                        f"Resend API returned {resp.status_code}: {resp.text}"
                    )
            logger.info(f"Resend email dispatched successfully to {to_email}")
            return True
        except Exception as e:
            logger.error(f"Resend dispatch error: {e}")
            raise EmailDeliveryError(f"Resend API failed: {str(e)}")
