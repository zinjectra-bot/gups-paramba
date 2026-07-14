/* Navigation & smooth scroll logic */
export function initNavigation() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
      }
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => navMenu.classList.remove('active'));
    });
  }

  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href') || '';
      const targetId = href.startsWith('#') ? href.substring(1) : null;

      if (targetId === 'admin') {
        e.preventDefault();
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        if (navMenu) navMenu.classList.remove('active');
        // admin panel opener is handled in admin module via global function on window
        if (window.openAdminPanel && typeof window.openAdminPanel === 'function') {
          window.openAdminPanel();
        }
        return;
      }

      e.preventDefault();
      navLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
      if (navMenu) navMenu.classList.remove('active');

      if (targetId) {
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          const header = document.querySelector('header');
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = targetSection.offsetTop - headerHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });
}

export function initHeaderScrollEffect() {
  const header = document.querySelector('header');
  if (!header) return;
  if (window.innerWidth <= 768) return;

  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    lastScrollTop = scrollTop;
  });
}