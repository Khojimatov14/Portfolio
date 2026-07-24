"""
Telegram notification utility for contact form messages.
"""
import logging
import requests

from django.conf import settings

logger = logging.getLogger(__name__)


def send_telegram_notification(name, email, subject, message):
    """
    Send a notification to Telegram when a new contact message is received.
    Returns True if successful, False otherwise.
    """
    bot_token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    if not bot_token or not chat_id:
        logger.warning("Telegram not configured: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing")
        return False

    text = (
        f"📩 *New Contact Message*\n"
        f"━━━━━━━━━━━━━━━━\n"
        f"👤 *Name:* {name}\n"
        f"📧 *Email:* {email}\n"
        f"📎 *Subject:* {subject or '(no subject)'}\n"
        f"💬 *Message:* {message}\n"
        f"━━━━━━━━━━━━━━━━\n"
        f"🕐 {__import__('django.utils.timezone').utils.timezone.now():%Y-%m-%d %H:%M}"
    )

    try:
        response = requests.post(
            f"https://api.telegram.org/bot{bot_token}/sendMessage",
            json={
                "chat_id": chat_id,
                "text": text,
                "parse_mode": "Markdown",
            },
            timeout=10,
        )
        if response.status_code == 200:
            logger.info("Telegram notification sent successfully")
            return True
        else:
            logger.error(f"Telegram API error: {response.status_code} - {response.text}")
            return False
    except requests.RequestException as e:
        logger.error(f"Failed to send Telegram notification: {e}")
        return False