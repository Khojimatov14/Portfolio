# Python xavfsiz va ixcham imidjidan foydalanamiz
FROM python:3.11-slim

# Muhit o'zgaruvchilari
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Ishchi katalogni belgilash
WORKDIR /app

# Tizim paketlarini yangilash va kerakli kutubxonalarni o'rnatish
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Bog'liqliklarni nusxalash va o'rnatish
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Loyiha fayllarini nusxalash
COPY . /app/

# Statik fayllarni yig'ish (collectstatic) va databaseni migratsiya qilish skripti uchun tayyorgarlik
RUN python manage.py collectstatic --noinput

# Portni ochish
EXPOSE 8000

# Gunicorn orqali ilovani ishga tushirish
CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]