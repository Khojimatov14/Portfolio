from django.contrib import admin

from portfolio.models import Skill, SkillCategory, Project, ContactMessage, VisitorLog, BlogPost

@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'order')
    ordering = ['order']

@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category',)

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_live', 'created_at')
    list_filter = ('is_live',)

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'created_at')
    list_filter = ('created_at',)

@admin.register(VisitorLog)
class VisitorLogAdmin(admin.ModelAdmin):
    list_display = ('ip_address', 'country', 'city', 'page', 'visited_at')
    list_filter = ('country', 'visited_at')

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'is_published', 'created_at')
    list_filter = ('is_published', 'created_at')
    prepopulated_fields = {'slug': ('title',)}
    search_fields = ('title', 'excerpt')