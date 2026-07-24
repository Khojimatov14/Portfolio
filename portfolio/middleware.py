import json
import logging
import urllib.request
from django.utils.deprecation import MiddlewareMixin
from .models import VisitorLog

logger = logging.getLogger(__name__)

GEO_IP_CACHE = {}

def get_geo_info(ip):
    """Get country and city from ip-api.com with simple in-memory cache."""
    # Skip private IPs
    if ip in ('127.0.0.1', 'localhost', '::1') or ip.startswith(('10.', '172.16.', '172.17.', '172.18.', '172.19.',
                                                                   '172.20.', '172.21.', '172.22.', '172.23.',
                                                                   '172.24.', '172.25.', '172.26.', '172.27.',
                                                                   '172.28.', '172.29.', '172.30.', '172.31.',
                                                                   '192.168.')):
        return '', ''

    if ip in GEO_IP_CACHE:
        return GEO_IP_CACHE[ip]

    try:
        url = f'http://ip-api.com/json/{ip}?fields=country,city'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=2) as response:
            data = json.loads(response.read().decode())
            if data.get('country'):
                result = (data.get('country', ''), data.get('city', ''))
                GEO_IP_CACHE[ip] = result
                return result
    except Exception as e:
        logger.warning(f'GeoIP lookup failed for {ip}: {e}')

    return '', ''

class VisitorLogMiddleware(MiddlewareMixin):
    """Log every page visit with IP, country, user-agent, referrer."""

    def process_request(self, request):
        # Only log GET requests to actual pages (skip static files, admin, etc.)
        if request.method != 'GET':
            return

        path = request.path_info

        # Skip static/media/admin files
        skip_prefixes = ('/static/', '/media/', '/admin/', '/__debug__/')
        if any(path.startswith(p) for p in skip_prefixes):
            return

        # Get IP
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR', '')

        # Get country/city
        country, city = get_geo_info(ip)

        # Save to database
        try:
            VisitorLog.objects.create(
                ip_address=ip,
                country=country,
                city=city,
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
                referrer=request.META.get('HTTP_REFERER', '')[:500],
                page=path[:255],
            )
        except Exception as e:
            logger.error(f'Failed to save visitor log: {e}')