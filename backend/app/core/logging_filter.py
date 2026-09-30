# ==============================================================================
# Genesis Power Equipments Pvt. Ltd. — GenesisConnect
# Security Logging Filter: Redacts Secrets, Passwords, Tokens & Credentials
# ==============================================================================

import re
import logging


class SensitiveDataMaskingFilter(logging.Filter):
    """
    Log filter that masks sensitive tokens, passwords, database credentials,
    and API keys from log records across the entire application runtime.
    """

    PATTERNS = [
        # Bearer tokens (JWTs)
        (re.compile(r"Bearer\s+([A-Za-z0-9\-_\.]*)", re.IGNORECASE), r"Bearer [REDACTED_TOKEN]"),
        # JSON password fields
        (re.compile(r'("password"\s*:\s*)"([^"]+)"', re.IGNORECASE), r'\1"[REDACTED_PASSWORD]"'),
        # URL parameters password
        (re.compile(r"(password=)([^&\s]+)", re.IGNORECASE), r"\1[REDACTED]"),
        # Database URIs with credentials (e.g. postgresql://user:pass@host:5432/db)
        (re.compile(r"(://[^:]+:)([^@]+)(@)", re.IGNORECASE), r"\1***\3"),
        # API keys / secret keys in JSON
        (re.compile(r'("(?:secret_key|api_key|supabase_key)"\s*:\s*)"([^"]+)"', re.IGNORECASE), r'\1"[REDACTED_KEY]"'),
        # Authorization header in dicts
        (re.compile(r"('Authorization':\s*'Bearer\s+)[^']+'", re.IGNORECASE), r"\1[REDACTED]'"),
    ]

    def filter(self, record: logging.LogRecord) -> bool:
        if isinstance(record.msg, str):
            masked = record.msg
            for pattern, replacement in self.PATTERNS:
                masked = pattern.sub(replacement, masked)
            record.msg = masked

        # Also mask string arguments if passed as parameters
        if record.args:
            new_args = []
            for arg in record.args:
                if isinstance(arg, str):
                    clean_arg = arg
                    for pattern, replacement in self.PATTERNS:
                        clean_arg = pattern.sub(replacement, clean_arg)
                    new_args.append(clean_arg)
                else:
                    new_args.append(arg)
            record.args = tuple(new_args)

        return True
