import markdown as md
from django import template
from django.utils.safestring import mark_safe

register = template.Library()


@register.filter(name='markdown')
def markdown_format(text):
    """Convert Markdown text to HTML."""
    return mark_safe(md.markdown(text, extensions=['fenced_code', 'codehilite', 'tables']))