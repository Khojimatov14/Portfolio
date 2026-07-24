from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse

from portfolio.models import ContactMessage, Project, Skill, SkillCategory, BlogPost
from portfolio.telegram_notifier import send_telegram_notification


def index(request):
    skill_categories = SkillCategory.objects.prefetch_related('skills').all()
    projects = Project.objects.filter(is_live=True)

    social_links = [
        {'name': 'GitHub', 'icon': 'bi-github', 'url': 'https://github.com/khojimatov'},
        {'name': 'LinkedIn', 'icon': 'bi-linkedin', 'url': 'https://linkedin.com/in/khojimatov'},
        {'name': 'Telegram', 'icon': 'bi-telegram', 'url': 'https://t.me/khojimatov'},
    ]

    if request.method == 'POST' and request.headers.get('x-requested-with') == 'XMLHttpRequest':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject', '')
        message_text = request.POST.get('message')

        if name and email and message_text:
            ContactMessage.objects.create(
                name=name,
                email=email,
                subject=subject,
                message=message_text,
            )
            send_telegram_notification(name, email, subject, message_text)
            return JsonResponse({'success': True, 'message': 'Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.'})
        else:
            return JsonResponse({'success': False, 'message': 'Iltimos, barcha majburiy maydonlarni to\'ldiring.'})

    context = {
        'skill_categories': skill_categories,
        'projects': projects,
        'social_links': social_links,
    }
    return render(request, 'portfolio/index.html', context)


def blog_list(request):
    posts = BlogPost.objects.filter(is_published=True)
    context = {
        'posts': posts,
    }
    return render(request, 'portfolio/blog_list.html', context)


def blog_detail(request, slug):
    post = get_object_or_404(BlogPost, slug=slug, is_published=True)
    recent_posts = BlogPost.objects.filter(is_published=True).exclude(id=post.id)[:3]
    context = {
        'post': post,
        'recent_posts': recent_posts,
    }
    return render(request, 'portfolio/blog_detail.html', context)