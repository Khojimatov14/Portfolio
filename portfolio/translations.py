import json
import os
from django.conf import settings


def load_translations(lang_code):
    """Load translations from a JSON file for the given language code."""
    file_path = os.path.join(settings.BASE_DIR, 'portfolio', 'static', 'portfolio', 'locales', f'{lang_code}.json')
    default_path = os.path.join(settings.BASE_DIR, 'portfolio', 'static', 'portfolio', 'locales', 'en.json')

    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    elif os.path.exists(default_path):
        with open(default_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def t(key, lang_code):
    """Translate a key for the given language code."""
    translations = load_translations(lang_code)
    return translations.get(key, key)