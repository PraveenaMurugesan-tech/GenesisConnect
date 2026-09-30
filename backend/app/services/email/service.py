# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# High-Level Email Notification Service Orchestrator
# ==============================================================================

import logging
from typing import Optional, Dict, Any
from app.core.config import settings
from app.services.email.providers import (
    BaseEmailProvider,
    ConsoleEmailProvider,
    SMTPEmailProvider,
    ResendEmailProvider,
)
from app.services.email.templates import (
    render_quote_confirmation_email,
    render_custom_requirement_confirmation_email,
    render_contact_confirmation_email,
    render_admin_notification_email,
)

logger = logging.getLogger("genesisconnect.email")


class EmailService:
    """
    Central email service managing customer confirmations and internal admin notifications.
    Delegates transmission to configured provider (Console, SMTP, Resend) while ensuring
    email delivery failures NEVER roll back or abort enquiry persistence.
    """

    def __init__(self, provider: Optional[BaseEmailProvider] = None) -> None:
        if provider:
            self.provider = provider
        else:
            self.provider = self._create_provider()

    def _create_provider(self) -> BaseEmailProvider:
        prov = (settings.EMAIL_PROVIDER or "console").lower().strip()
        if prov == "smtp":
            logger.info("Initializing SMTP email provider.")
            return SMTPEmailProvider()
        elif prov == "resend":
            logger.info("Initializing Resend API email provider.")
            return ResendEmailProvider()
        else:
            logger.info("Initializing Console/Simulated email provider.")
            return ConsoleEmailProvider()

    def set_provider(self, provider: BaseEmailProvider) -> None:
        """Allows swapping email provider at runtime (e.g. in test suites)."""
        self.provider = provider

    def send_quote_confirmation(
        self,
        customer_name: str,
        customer_email: str,
        reference_id: str,
        product_name: Optional[str] = None,
        quantity: Optional[str] = None,
        created_at_str: Optional[str] = None,
        raise_on_error: bool = False,
    ) -> bool:
        """
        Sends quotation acknowledgment email to prospective customer.
        Returns True on success, False on failure.
        """
        if not settings.EMAIL_ENABLED:
            logger.info("Email dispatch is globally disabled in configuration.")
            return False

        try:
            subject, html_body, text_body = render_quote_confirmation_email(
                customer_name=customer_name,
                reference_id=reference_id,
                product_name=product_name,
                quantity=quantity,
                created_at_str=created_at_str,
            )
            return self.provider.send_email(
                to_email=customer_email,
                subject=subject,
                html_body=html_body,
                text_body=text_body,
            )
        except Exception as e:
            logger.error(
                f"Failed to send quote confirmation email to '{customer_email}': {e}",
                exc_info=True,
            )
            if raise_on_error:
                raise
            return False

    def send_custom_requirement_confirmation(
        self,
        customer_name: str,
        customer_email: str,
        reference_id: str,
        product_category: Optional[str] = None,
        capacity: Optional[str] = None,
        has_attachment: bool = False,
        created_at_str: Optional[str] = None,
        raise_on_error: bool = False,
    ) -> bool:
        """
        Sends engineering receipt confirmation for complex custom specifications.
        """
        if not settings.EMAIL_ENABLED:
            return False

        try:
            subject, html_body, text_body = render_custom_requirement_confirmation_email(
                customer_name=customer_name,
                reference_id=reference_id,
                product_category=product_category,
                capacity=capacity,
                has_attachment=has_attachment,
                created_at_str=created_at_str,
            )
            return self.provider.send_email(
                to_email=customer_email,
                subject=subject,
                html_body=html_body,
                text_body=text_body,
            )
        except Exception as e:
            logger.error(
                f"Failed to send custom requirement confirmation to '{customer_email}': {e}",
                exc_info=True,
            )
            if raise_on_error:
                raise
            return False

    def send_contact_confirmation(
        self,
        customer_name: str,
        customer_email: str,
        reference_id: str,
        subject_line: Optional[str] = None,
        created_at_str: Optional[str] = None,
        raise_on_error: bool = False,
    ) -> bool:
        """
        Sends general contact inquiry receipt confirmation.
        """
        if not settings.EMAIL_ENABLED:
            return False

        try:
            subject, html_body, text_body = render_contact_confirmation_email(
                customer_name=customer_name,
                reference_id=reference_id,
                subject_line=subject_line,
                created_at_str=created_at_str,
            )
            return self.provider.send_email(
                to_email=customer_email,
                subject=subject,
                html_body=html_body,
                text_body=text_body,
            )
        except Exception as e:
            logger.error(
                f"Failed to send contact receipt email to '{customer_email}': {e}",
                exc_info=True,
            )
            if raise_on_error:
                raise
            return False

    def send_admin_notification(
        self,
        enquiry_type: str,
        reference_id: str,
        customer_name: str,
        email: str,
        phone: str,
        summary_details: Dict[str, Any],
        company_name: Optional[str] = None,
        created_at_str: Optional[str] = None,
        raise_on_error: bool = False,
    ) -> bool:
        """
        Notifies configured Genesis operations/sales desk about new incoming leads.
        """
        if not settings.EMAIL_ENABLED or not settings.ADMIN_NOTIFICATION_EMAIL:
            return False

        try:
            subject, html_body, text_body = render_admin_notification_email(
                enquiry_type=enquiry_type,
                reference_id=reference_id,
                customer_name=customer_name,
                company_name=company_name,
                email=email,
                phone=phone,
                summary_details=summary_details,
                created_at_str=created_at_str,
            )
            return self.provider.send_email(
                to_email=settings.ADMIN_NOTIFICATION_EMAIL,
                subject=subject,
                html_body=html_body,
                text_body=text_body,
            )
        except Exception as e:
            logger.error(
                f"Failed to dispatch admin notification for '{reference_id}': {e}",
                exc_info=True,
            )
            if raise_on_error:
                raise
            return False


email_service = EmailService()
