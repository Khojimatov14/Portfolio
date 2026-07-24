// ============================================================
// Khojimatov Anvarjon — Portfolio interactions
// ============================================================

/* ---- i18n Translation System ---- */
(function () {
  let currentLang = localStorage.getItem('portfolio_lang') || 'en';

  async function loadTranslations(lang) {
    try {
      const response = await fetch('/static/portfolio/locales/' + lang + '.json');
      if (!response.ok) throw new Error('Translation not found');
      return await response.json();
    } catch (e) {
      const fallback = await fetch('/static/portfolio/locales/en.json');
      return await fallback.json();
    }
  }

  async function applyTranslations(lang) {
    const translations = await loadTranslations(lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (translations[key]) {
        el.innerHTML = translations[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (translations[key]) {
        el.placeholder = translations[key];
      }
    });

    document.querySelectorAll('.lang-option').forEach(function (btn) {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active-lang');
      } else {
        btn.classList.remove('active-lang');
      }
    });

    var labelEl = document.getElementById('currentLangLabel');
    if (labelEl) {
      labelEl.textContent = lang.toUpperCase();
    }
  }

  function closeLangMenu() {
    var menu = document.getElementById('langMenu');
    if (menu) menu.classList.remove('open');
  }

  // Expose to global scope for inline onclick handlers
  window.switchLanguage = async function (lang) {
    currentLang = lang;
    localStorage.setItem('portfolio_lang', lang);
    await applyTranslations(lang);
    closeLangMenu();
  };

  window.toggleLangMenu = function (e) {
    e.stopPropagation();
    var menu = document.getElementById('langMenu');
    if (menu) menu.classList.toggle('open');
  };

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    var switcher = document.querySelector('.lang-switcher');
    if (switcher && !switcher.contains(e.target)) {
      closeLangMenu();
    }
  });

  // Apply saved language on load
  applyTranslations(currentLang);
})();

/* ---- Uptime value animation ---- */
(function () {
  var uptimeEl = document.querySelector('.uptime-val');
  if (!uptimeEl) return;
  var current = 99.8;
  var min = 97.0;
  var max = 99.9;
  var step = 0.1;

  function changeUptime() {
    var direction = Math.random() > 0.5 ? 1 : -1;
    current = current + direction * step;
    if (current > max) current = max - step * 2;
    if (current < min) current = min + step * 2;
    uptimeEl.textContent = current.toFixed(1) + '%';
  }

  setInterval(changeUptime, 2000);
})();

/* ---- Hero role typing effect ---- */
(function () {
  var roles = [
    'Python Backend Engineer',
    'System Integrator',
    'REST API Architect',
    'Automation Engineer'
  ];
  var roleEl = document.getElementById('heroRole');
  if (!roleEl || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (roleEl) roleEl.textContent = roles[0];
    return;
  }

  var roleIndex = 0;
  var charIndex = 0;
  var deleting = false;

  function typeLoop() {
    var current = roles[roleIndex];
    var textNode = deleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    roleEl.textContent = textNode;
    charIndex = deleting ? charIndex - 1 : charIndex + 1;

    var delay = deleting ? 40 : 70;

    if (!deleting && charIndex === current.length) {
      delay = 1600;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 300;
    }
    setTimeout(typeLoop, delay);
  }
  typeLoop();
})();

/* ---- Scroll reveal ---- */
(function () {
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
})();

/* ---- Active nav link on scroll (index page only) ---- */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.navbar-custom .nav-link');
  if (sections.length === 0) return;

  function onScroll() {
    var current = 'home';
    sections.forEach(function (section) {
      var sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        if (href === '#' + current) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();
})();

/* ---- Contact form submission (AJAX) ---- */
(function () {
  var form = document.getElementById('contactForm');
  var alertContainer = document.getElementById('formAlertContainer');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    var formData = new FormData(form);
    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    var currentLang = localStorage.getItem('portfolio_lang') || 'en';

    btn.textContent = 'Sending...';
    btn.disabled = true;

    try {
      var response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      });

      var data = await response.json();

      if (alertContainer) {
        var translations = await loadTranslationsFallback(currentLang);
        if (data.success) {
          alertContainer.innerHTML =
            '<div class="alert-form alert-success-custom" role="alert">' +
            '<i class="bi bi-check-circle-fill"></i> ' + (translations['contact_success'] || data.message) +
            '</div>';
          form.reset();
        } else {
          alertContainer.innerHTML =
            '<div class="alert-form alert-error-custom" role="alert">' +
            '<i class="bi bi-exclamation-circle-fill"></i> ' + (translations['contact_error'] || data.message) +
            '</div>';
        }
        alertContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (error) {
      if (alertContainer) {
        alertContainer.innerHTML =
          '<div class="alert-form alert-error-custom" role="alert">' +
          '<i class="bi bi-exclamation-circle-fill"></i> An error occurred. Please try again.' +
          '</div>';
      }
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });

  async function loadTranslationsFallback(lang) {
    try {
      var resp = await fetch('/static/portfolio/locales/' + lang + '.json');
      if (!resp.ok) throw new Error('fail');
      return await resp.json();
    } catch (e) {
      var fallback = await fetch('/static/portfolio/locales/en.json');
      return await fallback.json();
    }
  }
})();