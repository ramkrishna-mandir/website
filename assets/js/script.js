// =========================================================
// Shri Ramkrishna Mandir, Abgaon Khurd — Site Script
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- AOS (scroll animations) ----
  if (window.AOS) {
    AOS.init({ duration: 900, once: true, offset: 80 });
  }

  // ---- Mobile menu toggle ----
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      icon.classList.toggle('fa-bars', !isOpen);
      icon.classList.toggle('fa-xmark', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        const icon = menuToggle.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---- Back-to-top button ----
  const topBtn = document.getElementById('topBtn');
  if (topBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) topBtn.classList.add('show');
      else topBtn.classList.remove('show');
    });
    topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ---- Smooth scroll for in-page anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length < 2) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  // ---- Contact form: real submission (FormSubmit.co) + validation ----
  // NOTE: पहली बार सबमिट होने पर FormSubmit आपके ईमेल पर एक confirmation
  // link भेजेगा — उसे एक बार क्लिक करके activate करना होगा, उसके बाद
  // फॉर्म की सभी entries सीधे मंदिर के ईमेल पर पहुँचने लगेंगी।
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Honeypot spam check — bots fill hidden fields, humans don't.
      const honeypot = form.querySelector('input[name="_honey"]');
      if (honeypot && honeypot.value) {
        return; // silently drop likely-bot submissions
      }

      const phoneInput = form.querySelector('input[name="mobile"]');
      const phonePattern = /^[6-9]\d{9}$/; // Indian 10-digit mobile
      if (phoneInput && !phonePattern.test(phoneInput.value.trim())) {
        setStatus('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।', 'error');
        phoneInput.focus();
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalLabel = submitBtn ? submitBtn.textContent : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'भेजा जा रहा है...';
      }
      setStatus('', '');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          setStatus('🙏 धन्यवाद! आपका संदेश भेज दिया गया है। हम जल्द संपर्क करेंगे।', 'success');
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
      } catch (err) {
        setStatus('क्षमा करें, संदेश भेजने में समस्या हुई। कृपया फ़ोन या WhatsApp से संपर्क करें।', 'error');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
  }
});
