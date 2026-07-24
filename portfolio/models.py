from django.db import models


class SkillCategory(models.Model):
    name = models.CharField(max_length=100)
    order = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "Skill Categories"
        ordering = ['order']

    def __str__(self):
        return self.name


class Skill(models.Model):
    category = models.ForeignKey(SkillCategory, related_name='skills', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    icon_class = models.CharField(max_length=100, help_text="Bootstrap icon class (e.g., bi-python)")

    def __str__(self):
        return self.name


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.URLField(blank=True, null=True, help_text="Image URL")
    link = models.URLField(blank=True, null=True)
    github_link = models.URLField(blank=True, null=True)
    tags = models.CharField(max_length=200, help_text="Comma separated tags")
    is_live = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def tags_list(self):
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name} - {self.email}"


class VisitorLog(models.Model):
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, default='')
    city = models.CharField(max_length=100, blank=True, default='')
    user_agent = models.TextField(blank=True, default='')
    referrer = models.URLField(blank=True, default='')
    page = models.CharField(max_length=255, blank=True, default='/')
    visited_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-visited_at']
        verbose_name = "Visitor Log"
        verbose_name_plural = "Visitor Logs"

    def __str__(self):
        return f"{self.ip_address} - {self.country} - {self.visited_at:%Y-%m-%d %H:%M}"


class BlogPost(models.Model):
    title = models.CharField(max_length=250)
    slug = models.SlugField(unique=True, help_text="URL identifier (e.g., 'django-rest-api-tips')")
    excerpt = models.TextField(help_text="Short summary shown in blog list")
    content = models.TextField(help_text="Full blog post content (Markdown supported)")
    image = models.URLField(blank=True, null=True, help_text="Cover image URL")
    tags = models.CharField(max_length=200, blank=True, help_text="Comma separated tags")
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Blog Post"
        verbose_name_plural = "Blog Posts"

    def tags_list(self):
        return [tag.strip() for tag in self.tags.split(',') if tag.strip()]

    def __str__(self):
        return self.title