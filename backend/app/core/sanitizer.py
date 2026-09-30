# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Text Input Sanitization & Anti-Injection Filters
# ==============================================================================

import re
from typing import Optional


# Regex pattern to identify and strip HTML tags and script elements
SCRIPT_TAG_PATTERN = re.compile(
    r"<\s*(script|iframe|object|embed|applet|style|meta|link|svg|math)[^>]*>.*?</\s*\1\s*>",
    re.IGNORECASE | re.DOTALL,
)
HTML_TAG_PATTERN = re.compile(r"<[^>]+>", re.IGNORECASE)
JAVASCRIPT_URI_PATTERN = re.compile(r"javascript\s*:", re.IGNORECASE)
DATA_URI_SCRIPT_PATTERN = re.compile(r"data\s*:\s*text/html", re.IGNORECASE)
CONTROL_CHAR_PATTERN = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def sanitize_input_text(value: Optional[str]) -> Optional[str]:
    """
    Sanitizes user-provided text inputs:
    - Removes null bytes and forbidden ASCII control characters.
    - Strips executable script blocks (<script>, <iframe>, <svg>, <object>).
    - Removes embedded HTML tags to treat customer input strictly as plain text.
    - Eliminates pseudo-protocol vectors ('javascript:', 'data:text/html').
    - Trims extraneous whitespace.
    """
    if value is None:
        return None

    if not isinstance(value, str):
        return value

    # 1. Remove control characters & null bytes
    cleaned = CONTROL_CHAR_PATTERN.sub("", value)

    # 2. Strip dangerous script / active content blocks
    cleaned = SCRIPT_TAG_PATTERN.sub("", cleaned)

    # 3. Strip remaining HTML markup tags
    cleaned = HTML_TAG_PATTERN.sub("", cleaned)

    # 4. Neutralize javascript: pseudo-protocol URIs
    cleaned = JAVASCRIPT_URI_PATTERN.sub("", cleaned)
    cleaned = DATA_URI_SCRIPT_PATTERN.sub("", cleaned)

    return cleaned.strip()
