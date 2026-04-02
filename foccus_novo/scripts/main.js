/* ═══════════════════════════════════════
   FOCCUS ACADEMIA — main.js
   Interações e animações
═══════════════════════════════════════ */

(function () {
  'use strict';

  // ─── PRELOADER ───
  const preloader = document.getElementById('preloader');
  const preFill = document.getElementById('preFill');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    if (preFill) preFill.style.width = progress + '%';
  }, 80);

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('done');
      document.body.style.overflow = '';
      // trigger reveals on load
      revealCheck();
    }, 400);
  });

  document.body.style.overflow = 'hidden';

  // ─── SCROLL PROGRESS ───
  const scrollProg = document.getElementById('scrollProgress');
  const onScroll = () => {
    const s = document.documentElement;
    const scrolled = s.scrollTop / (s.scrollHeight - s.clientHeight);
    if (scrollProg) scrollProg.style.width = (scrolled * 100) + '%';
    // header
    const header = document.getElementById('header');
    if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── REVEAL ON SCROLL ───
  const revealEls = document.querySelectorAll('.reveal');
  const revealCheck = () => {
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) {
        el.classList.add('visible');
      }
    });
  };
  window.addEventListener('scroll', revealCheck, { passive: true });

  // ─── HAMBURGER ───
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', open);
      nav.classList.toggle('open');
    });
    nav.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', false);
        nav.classList.remove('open');
      });
    });
  }

  // ─── MODAL ───
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modModalidade = document.getElementById('m-mod');

  function openModal(modalidade) {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (modalidade && modModalidade) {
      modModalidade.value = modalidade;
    }
    setTimeout(() => {
      const first = modal.querySelector('input, select');
      if (first) first.focus();
    }, 100);
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Open modal buttons
  document.querySelectorAll('#openModal, .open-modal-btn, .nav-cta').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalidade = btn.dataset.modalidade || '';
      openModal(modalidade);
    });
  });

  // ─── FORM SUBMIT (modal) ───
  const modalForm = document.getElementById('modalForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = document.getElementById('m-nome')?.value.trim();
      const tel = document.getElementById('m-tel')?.value.trim();
      const cpf = document.getElementById('m-cpf')?.value.trim();
      const mod = document.getElementById('m-mod')?.value;
      const turno = document.getElementById('m-turno')?.value;

      if (!nome || !tel || !mod) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
      }

      const msg = encodeURIComponent(
        `Olá! Vim pelo site da Foccus e quero atendimento para matrícula.\n\n` +
        `*Nome:* ${nome}\n` +
        `*WhatsApp:* ${tel}\n` +
        `${cpf ? '*CPF:* ' + cpf + '\n' : ''}` +
        `*Interesse:* ${mod}\n` +
        `${turno ? '*Turno preferido:* ' + turno + '\n' : ''}` +
        `\nPode me orientar com os próximos passos?`
      );
      window.open(`https://api.whatsapp.com/send/?phone=5562999945388&text=${msg}`, '_blank');
      closeModal();
    });
  }

  // ─── PHONE MASK ───
  function phoneMask(e) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    else if (v.length > 5) v = v.replace(/^(\d{2})(\d{4})(\d*)$/, '($1) $2-$3');
    else if (v.length > 2) v = v.replace(/^(\d{2})(\d*)$/, '($1) $2');
    else if (v.length > 0) v = v.replace(/^(\d*)$/, '($1');
    e.target.value = v;
  }
  document.querySelectorAll('input[type="tel"]').forEach(el => el.addEventListener('input', phoneMask));

  function cpfMask(e) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 9) v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{0,2}).*$/, '$1.$2.$3-$4');
    else if (v.length > 6) v = v.replace(/^(\d{3})(\d{3})(\d{0,3}).*$/, '$1.$2.$3');
    else if (v.length > 3) v = v.replace(/^(\d{3})(\d{0,3}).*$/, '$1.$2');
    e.target.value = v;
  }
  const cpfInput = document.getElementById('m-cpf');
  if (cpfInput) cpfInput.addEventListener('input', cpfMask);

  // ─── COUNTERS ───
  function animateCounter(el) {
    const target = +el.dataset.target;
    const isDecimal = el.dataset.decimal;
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = ease * target;
      el.textContent = isDecimal ? val.toFixed(1) : Math.floor(val);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? target.toFixed(1) : target;
    }
    requestAnimationFrame(step);
  }

  // Trigger counters when hero stats visible
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        counters.forEach(animateCounter);
      }
    });
  }, { threshold: 0.3 });
  if (counters.length) counterObserver.observe(counters[0]);

  // ─── SMOOTH SCROLL for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });

})();
