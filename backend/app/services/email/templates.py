# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Branded Transactional Email Templates (HTML & Plain Text)
# ==============================================================================

import html
from typing import Tuple, Optional


def _base_email_layout(title: str, content_html: str) -> str:
    """
    Standard branded GenesisConnect email container layout.
    Features Genesis industrial navy & amber theme, modern responsive typography,
    and official corporate footer.
    """
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{html.escape(title)}</title>
  <style>
    body {{
      margin: 0;
      padding: 0;
      background-color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }}
    .email-container {{
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
    }}
    .header {{
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      padding: 28px 32px;
      border-bottom: 3px solid #d97706;
    }}
    .header h1 {{
      margin: 0;
      color: #ffffff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.025em;
    }}
    .header p {{
      margin: 4px 0 0;
      color: #fbbf24;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }}
    .content {{
      padding: 32px;
    }}
    .badge {{
      display: inline-block;
      padding: 4px 10px;
      background-color: #fef3c7;
      color: #92400e;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 16px;
    }}
    .summary-card {{
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 16px 20px;
      margin: 20px 0;
    }}
    .summary-card table {{
      width: 100%;
      border-collapse: collapse;
    }}
    .summary-card td {{
      padding: 6px 0;
      font-size: 13px;
      vertical-align: top;
    }}
    .summary-card .label {{
      color: #64748b;
      font-weight: 600;
      width: 35%;
    }}
    .summary-card .value {{
      color: #0f172a;
      font-weight: 500;
    }}
    .footer {{
      background-color: #f1f5f9;
      padding: 20px 32px;
      border-top: 1px solid #e2e8f0;
      font-size: 11px;
      color: #64748b;
      line-height: 1.6;
    }}
    .footer a {{
      color: #d97706;
      text-decoration: none;
    }}
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Genesis Power Equipments</h1>
      <p>GenesisConnect — Industrial Power Systems</p>
    </div>
    <div class="content">
      {content_html}
    </div>
    <div class="footer">
      <strong>Genesis Power Equipments Pvt. Ltd.</strong><br>
      Leading Industrial Power Protection, UPS Systems & Static Voltage Stabilizers.<br>
      Website: <a href="https://genesispower.in">genesispower.in</a> &bull; Support: support@genesispower.in
    </div>
  </div>
</body>
</html>"""


# ==============================================================================
# 1. CUSTOMER QUOTE CONFIRMATION
# ==============================================================================
def render_quote_confirmation_email(
    customer_name: str,
    reference_id: str,
    product_name: Optional[str] = None,
    quantity: Optional[str] = None,
    created_at_str: Optional[str] = None,
) -> Tuple[str, str, str]:
    """
    Returns (subject, html_body, text_body) for customer quote request confirmation.
    """
    clean_name = html.escape(customer_name)
    clean_ref = html.escape(reference_id)
    clean_prod = html.escape(product_name or "Industrial Power Equipment")
    clean_qty = html.escape(quantity or "As specified")
    clean_time = html.escape(created_at_str or "Just now")

    subject = f"Quote Request Received [{reference_id}] — Genesis Power Equipments"

    content = f"""
      <div class="badge">Reference ID: {clean_ref}</div>
      <h2 style="margin-top: 0; color: #0f172a; font-size: 18px;">Thank You, {clean_name}!</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        We have successfully received your quotation request for Genesis industrial power solutions.
        Our commercial engineering team is reviewing your requirements and will prepare an official commercial quote.
      </p>

      <div class="summary-card">
        <table>
          <tr>
            <td class="label">Reference ID</td>
            <td class="value"><strong>{clean_ref}</strong></td>
          </tr>
          <tr>
            <td class="label">Equipment Model</td>
            <td class="value">{clean_prod}</td>
          </tr>
          <tr>
            <td class="label">Quantity</td>
            <td class="value">{clean_qty}</td>
          </tr>
          <tr>
            <td class="label">Submitted</td>
            <td class="value">{clean_time}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        A technical sales consultant will reach out via email or phone within 1 business day.
        If you have urgent technical questions, please contact our desk at +91 44 2496 0524.
      </p>
    """

    text = f"""GENESIS POWER EQUIPMENTS PVT. LTD.
Quote Request Confirmation

Dear {customer_name},

Thank you for contacting Genesis Power Equipments. We have received your quotation request.

Reference ID: {reference_id}
Equipment: {product_name or "Industrial Power Equipment"}
Quantity: {quantity or "As specified"}
Submitted: {created_at_str or "Just now"}

Our commercial team will review your application and provide an official quotation within 1 business day.

Genesis Power Equipments Pvt. Ltd.
support@genesispower.in | https://genesispower.in
"""
    return subject, _base_email_layout(subject, content), text


# ==============================================================================
# 2. CUSTOMER CUSTOMIZED REQUIREMENT CONFIRMATION
# ==============================================================================
def render_custom_requirement_confirmation_email(
    customer_name: str,
    reference_id: str,
    product_category: Optional[str] = None,
    capacity: Optional[str] = None,
    has_attachment: bool = False,
    created_at_str: Optional[str] = None,
) -> Tuple[str, str, str]:
    """
    Returns (subject, html_body, text_body) for customer customized requirement confirmation.
    """
    clean_name = html.escape(customer_name)
    clean_ref = html.escape(reference_id)
    clean_prod = html.escape(product_category or "Custom Industrial Power Solution")
    clean_cap = html.escape(capacity or "Engineering Specification")
    clean_time = html.escape(created_at_str or "Just now")
    attachment_note = "Yes (Document safely uploaded to technical vault)" if has_attachment else "None"

    subject = f"Customized Requirement Received [{reference_id}] — Genesis Power Equipments"

    content = f"""
      <div class="badge">Reference ID: {clean_ref}</div>
      <h2 style="margin-top: 0; color: #0f172a; font-size: 18px;">Engineering Requirement Received</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Dear {clean_name}, thank you for submitting your custom electrical architecture specifications to Genesis Power Equipments.
        Our Senior Application Engineers have received your project parameters and will evaluate the sizing, topology, and battery autonomy requirements.
      </p>

      <div class="summary-card">
        <table>
          <tr>
            <td class="label">Reference ID</td>
            <td class="value"><strong>{clean_ref}</strong></td>
          </tr>
          <tr>
            <td class="label">System Classification</td>
            <td class="value">{clean_prod}</td>
          </tr>
          <tr>
            <td class="label">Rated Capacity</td>
            <td class="value">{clean_cap}</td>
          </tr>
          <tr>
            <td class="label">Specification Attachment</td>
            <td class="value">{attachment_note}</td>
          </tr>
          <tr>
            <td class="label">Submitted</td>
            <td class="value">{clean_time}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        Our electrical design desk will review your load specifications and contact you to discuss technical feasibility and custom engineering drawings.
      </p>
    """

    text = f"""GENESIS POWER EQUIPMENTS PVT. LTD.
Customized Requirement Confirmation

Dear {customer_name},

Thank you for submitting your custom electrical architecture specifications.

Reference ID: {reference_id}
Classification: {product_category or "Custom Industrial Power Solution"}
Capacity: {capacity or "Engineering Specification"}
Technical Attachment: {attachment_note}
Submitted: {created_at_str or "Just now"}

Our application engineering team will review your parameters and follow up shortly.

Genesis Power Equipments Pvt. Ltd.
support@genesispower.in | https://genesispower.in
"""
    return subject, _base_email_layout(subject, content), text


# ==============================================================================
# 3. CUSTOMER CONTACT MESSAGE CONFIRMATION
# ==============================================================================
def render_contact_confirmation_email(
    customer_name: str,
    reference_id: str,
    subject_line: Optional[str] = None,
    created_at_str: Optional[str] = None,
) -> Tuple[str, str, str]:
    """
    Returns (subject, html_body, text_body) for general contact enquiry receipt.
    """
    clean_name = html.escape(customer_name)
    clean_ref = html.escape(reference_id)
    clean_subj = html.escape(subject_line or "General Technical Inquiry")
    clean_time = html.escape(created_at_str or "Just now")

    subject = f"Message Received [{reference_id}] — Genesis Power Equipments"

    content = f"""
      <div class="badge">Reference ID: {clean_ref}</div>
      <h2 style="margin-top: 0; color: #0f172a; font-size: 18px;">Thank You for Contacting Us</h2>
      <p style="font-size: 14px; line-height: 1.6; color: #334155;">
        Dear {clean_name}, we have received your message regarding "<strong>{clean_subj}</strong>".
        Our customer support team has queued your inquiry and will respond promptly.
      </p>

      <div class="summary-card">
        <table>
          <tr>
            <td class="label">Inquiry Reference</td>
            <td class="value"><strong>{clean_ref}</strong></td>
          </tr>
          <tr>
            <td class="label">Subject</td>
            <td class="value">{clean_subj}</td>
          </tr>
          <tr>
            <td class="label">Date</td>
            <td class="value">{clean_time}</td>
          </tr>
        </table>
      </div>

      <p style="font-size: 13px; color: #64748b; line-height: 1.5;">
        If your request is time-critical, please contact our Chennai regional facility directly at +91 44 2496 0524.
      </p>
    """

    text = f"""GENESIS POWER EQUIPMENTS PVT. LTD.
Inquiry Receipt Confirmation

Dear {customer_name},

We have received your message regarding "{subject_line or 'General Technical Inquiry'}".

Reference ID: {reference_id}
Submitted: {created_at_str or "Just now"}

Our customer support desk will respond shortly.

Genesis Power Equipments Pvt. Ltd.
support@genesispower.in | https://genesispower.in
"""
    return subject, _base_email_layout(subject, content), text


# ==============================================================================
# 4. ADMIN INTERNAL NOTIFICATION
# ==============================================================================
def render_admin_notification_email(
    enquiry_type: str,
    reference_id: str,
    customer_name: str,
    company_name: Optional[str],
    email: str,
    phone: str,
    summary_details: dict,
    created_at_str: Optional[str] = None,
) -> Tuple[str, str, str]:
    """
    Returns (subject, html_body, text_body) to notify sales and operations administrators
    about newly received customer submissions.
    """
    clean_type = html.escape(enquiry_type)
    clean_ref = html.escape(reference_id)
    clean_name = html.escape(customer_name)
    clean_comp = html.escape(company_name or "Not Specified")
    clean_email = html.escape(email)
    clean_phone = html.escape(phone)
    clean_time = html.escape(created_at_str or "Just now")

    subject = f"[New Enquiry] {enquiry_type} from {customer_name} ({clean_comp}) [{reference_id}]"

    detail_rows = ""
    for k, v in summary_details.items():
        if v:
            detail_rows += f"""
              <tr>
                <td class="label">{html.escape(str(k))}</td>
                <td class="value">{html.escape(str(v))}</td>
              </tr>
            """

    content = f"""
      <div class="badge" style="background-color: #fee2e2; color: #991b1b;">New Customer Lead</div>
      <h2 style="margin-top: 0; color: #0f172a; font-size: 18px;">New {clean_type} Submitted</h2>
      <p style="font-size: 13px; color: #475569;">
        A new customer enquiry has been registered in the GenesisConnect database and requires review in the Admin Portal.
      </p>

      <div class="summary-card">
        <table>
          <tr>
            <td class="label">Reference ID</td>
            <td class="value"><strong>{clean_ref}</strong></td>
          </tr>
          <tr>
            <td class="label">Customer Contact</td>
            <td class="value">{clean_name}</td>
          </tr>
          <tr>
            <td class="label">Company / Facility</td>
            <td class="value">{clean_comp}</td>
          </tr>
          <tr>
            <td class="label">Email Address</td>
            <td class="value"><a href="mailto:{clean_email}">{clean_email}</a></td>
          </tr>
          <tr>
            <td class="label">Telephone</td>
            <td class="value"><a href="tel:{clean_phone}">{clean_phone}</a></td>
          </tr>
          <tr>
            <td class="label">Timestamp</td>
            <td class="value">{clean_time}</td>
          </tr>
          {detail_rows}
        </table>
      </div>

      <p style="font-size: 12px; color: #64748b;">
        Please log into the GenesisConnect Admin Dashboard to manage lifecycle state and generate quotes.
      </p>
    """

    text = f"""GENESISCONNECT ADMIN ALERT
New {enquiry_type} Received

Reference ID: {reference_id}
Customer: {customer_name}
Company: {company_name or 'N/A'}
Email: {email}
Phone: {phone}
Submitted: {created_at_str or 'Just now'}

Details:
{chr(10).join(f"- {k}: {v}" for k, v in summary_details.items() if v)}

Log in to the GenesisConnect Admin Console to respond.
"""
    return subject, _base_email_layout(subject, content), text
