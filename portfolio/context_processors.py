from django.conf import settings


def current_language(request):
    """Context processor that provides current language info to templates."""
    lang_code = request.LANGUAGE_CODE if hasattr(request, 'LANGUAGE_CODE') else settings.LANGUAGE_CODE
    current_lang = None
    for code, name in settings.LANGUAGES:
        if code == lang_code:
            current_lang = {'code': code, 'name': name}
            break
    return {
        'current_language': current_lang,
        'available_languages': settings.LANGUAGES,
    }