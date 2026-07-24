// ============================================================
// Khojimatov Anvarjon — Portfolio interactions
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---- i18n Translation System ---- */
  let currentLang = localStorage.getItem('portfolio_lang') || 'en';

  async function loadTranslations(lang) {
    try {
      const response = await fetch(`/static/portfolio/locales/${lang}.json`);
      if (!response.ok) throw new Error('Translation not found');
      return await response.json();
    } catch (e) {
      // Fallback to English
      const fallback = await fetch('/static/portfolio/locales/en.json');
      return await fallback.json();
    }
  }

  async function applyTranslations(lang) {
    const translations = await loadTranslations(lang);
    document.documentElement.lang = lang;

    // Translate elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (translations[key]) {
        el.innerHTML = translations[key];
      }
    });

    // Translate placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (translations[key]) {
        el.placeholder = translations[key];
      }
    });

    // Update active lang option in dropdown
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active-lang', btn.dataset.lang === lang);
    });

    // Update dropdown button label
    const labelEl = document.getElementById('currentLangLabel');
    if (labelEl) {
      labelEl.textContent = lang.toUpperCase();
    }
  }

  window.switchLanguage = async function (lang) {
    currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);
    await applyTranslations(lang);
    closeLangMenu();
  };

  window.toggleLangMenu = function (e) {
    e.stopPropagation();
    const menu = document.getElementById('langMenu');
    menu.classList.toggle('open');
  };

  function closeLangMenu() {
    const menu = document.getElementById('langMenu');
    menu.classList.remove('open');
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    const switcher = document.querySelector('.lang-switcher');
    if (switcher && !switcher.contains(e.target)) {
      closeLangMenu();
    }
  });

  // Apply saved language on load
  applyTranslations(currentLang);

  /* ---- Uptime value animation ---- */
  const uptimeEl = document.querySelector('.uptime-val');
  if (uptimeEl) {
    let current = 99.8;
    const min = 97.0;
    const max = 99.9;
    const step = 0.1;

    function changeUptime() {
      const direction = Math.random() > 0.5 ? 1 : -1;
      current = current + direction * step;
      if (current > max) current = max - step * 2;
      if (current < min) current = min + step * 2;
      uptimeEl.textContent = current.toFixed(1) + '%';
    }

    setInterval(changeUptime, 2000);
  }

  /* ---- Hero role typing effect ---- */
  const roles = [
    'Python Backend Engineer',
    'System Integrator',
    'REST API Architect',
    'Automation Engineer'
  ];
  const roleEl = document.getElementById('heroRole');

  if (roleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const typeLoop = () => {
      const current = roles[roleIndex];
      const textNode = deleting
        ? current.substring(0, charIndex - 1)
        : current.substring(0, charIndex + 1);

      roleEl.textContent = textNode;
      charIndex = deleting ? charIndex - 1 : charIndex + 1;

      let delay = deleting ? 40 : 70;

      if (!deleting && charIndex === current.length) {
        delay = 1600;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 300;
      }
      setTimeout(typeLoop, delay);
    };
    typeLoop();
  } else if (roleEl) {
    roleEl.textContent = roles[0];
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---- Active nav link on scroll (index page only) ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-custom .nav-link');

  // Only run scroll spy on the index page (has section[id] elements)
  if (sections.length > 0) {
    const indexPage = document.getElementById('home');
    if (indexPage) {
      const onScroll = () => {
        let current = 'home';
        sections.forEach(section => {
          const sectionTop = section.offsetTop - 120;
          if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
          }
        });
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          // Only update links that point to hash anchors on this page
          if (href && href.startsWith('#')) {
            link.classList.toggle('active', href === `#${current}`);
          }
        });
      };
      window.addEventListener('scroll', onScroll);
      onScroll();
    }
  }

  /* ---- Contact form submission (AJAX) ---- */
  const form = document.getElementById('contactForm');
  const alertContainer = document.getElementById('formAlertContainer');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent page refresh

      const formData = new FormData(form);
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      // Disable button while sending
      btn.textContent = 'Yuborilmoqda...';
      btn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
        });

        const data = await response.json();

        if (alertContainer) {
          // Load translations for the alert message
          const translations = await loadTranslations(currentLang);

          if (data.success) {
            alertContainer.innerHTML = `
              <div class="alert-form alert-success-custom" role="alert">
                <i class="bi bi-check-circle-fill"></i> ${translations['contact_success'] || data.message}
              </div>
            `;
            form.reset();
          } else {
            alertContainer.innerHTML = `
              <div class="alert-form alert-error-custom" role="alert">
                <i class="bi bi-exclamation-circle-fill"></i> ${translations['contact_error'] || data.message}
              </div>
            `;
          }
          // Scroll to the alert message
          alertContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (error) {
        if (alertContainer) {
          const translations = await loadTranslations(currentLang);
          alertContainer.innerHTML = `
            <div class="alert-form alert-error-custom" role="alert">
              <i class="bi bi-exclamation-circle-fill"></i> ${translations['contact_error_generic'] || 'An error occurred. Please try again.'}
            </div>
          `;
        }
      } finally {
        // Re-enable button
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  }

});