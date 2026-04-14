// ===== SHARED SCRIPTS FOR ALL PAGES =====

// --- Navbar scroll effect ---
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  function updateNav() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
      navbar.classList.remove('transparent');
    } else {
      navbar.classList.remove('scrolled');
      navbar.classList.add('transparent');
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// --- Hamburger menu ---
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.querySelectorAll('span').forEach((s, i) => {
      if (isOpen) {
        if (i === 0) s.style.transform = 'rotate(45deg) translate(5px,5px)';
        if (i === 1) s.style.opacity = '0';
        if (i === 2) s.style.transform = 'rotate(-45deg) translate(5px,-5px)';
      } else {
        s.style.transform = '';
        s.style.opacity = '';
      }
    });
  });

  // Close on link click
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => {
        s.style.transform = '';
        s.style.opacity = '';
      });
    });
  });
}

// --- Intersection Observer for fade-in animations ---
function initFadeIn() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// --- Parallax hero ---
function initParallax() {
  const heroBg = document.querySelector('.page-hero-bg, .hero-bg');
  if (!heroBg) return;
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    heroBg.style.transform = `translateY(${scroll * 0.35}px)`;
  }, { passive: true });
}

// --- Counter animation ---
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  function update() {
    start += step;
    if (start < target) {
      el.textContent = Math.floor(start).toLocaleString();
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.counter));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
}

// --- Active nav link ---
function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- Page hero load animation ---
function initHeroAnim() {
  const hero = document.querySelector('.page-hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }
}

// --- Smooth image loading ---
function initImgLazyLoad() {
  const imgs = document.querySelectorAll('img[data-src]');
  if (!imgs.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  imgs.forEach(img => observer.observe(img));
}

// --- Filter pills ---
function initFilterPills() {
  document.querySelectorAll('.filter-pills').forEach(group => {
    group.querySelectorAll('.pill').forEach(pill => {
      pill.addEventListener('click', () => {
        group.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;
        const targetGroup = pill.closest('section') || document;
        targetGroup.querySelectorAll('[data-category]').forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.style.animation = 'fadeIn 0.4s ease';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  });
}

// --- Accordion ---
function initAccordions() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.accordion-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// --- Tab Switcher ---
function initTabs() {
  document.querySelectorAll('.tab-group').forEach(group => {
    const tabs = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        group.querySelector(`[data-panel="${target}"]`)?.classList.add('active');
      });
    });
  });
}

// --- Tooltip ---
function initTooltips() {
  document.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const tip = document.createElement('div');
      tip.className = 'tooltip';
      tip.textContent = el.dataset.tooltip;
      document.body.appendChild(tip);
      const rect = el.getBoundingClientRect();
      tip.style.cssText = `
        position:fixed;top:${rect.top - 40}px;left:${rect.left + rect.width/2}px;
        transform:translateX(-50%);background:rgba(26,10,59,0.95);color:#fff;
        padding:6px 12px;border-radius:8px;font-size:0.8rem;z-index:9999;
        white-space:nowrap;pointer-events:none;opacity:0;transition:opacity 0.2s;
      `;
      setTimeout(() => tip.style.opacity = '1', 10);
      el._tooltip = tip;
    });
    el.addEventListener('mouseleave', () => {
      if (el._tooltip) { el._tooltip.remove(); el._tooltip = null; }
    });
  });
}

// ========== INIT ALL ==========
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initFadeIn();
  initParallax();
  initCounters();
  setActiveNav();
  initHeroAnim();
  initImgLazyLoad();
  initFilterPills();
  initAccordions();
  initTabs();
  initTooltips();
});
