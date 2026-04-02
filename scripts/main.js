/* ===== PRELOADER ===== */
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
  setTimeout(() => preloader.classList.add('hidden'), 800);
});

/* ===== SCROLL PROGRESS + TOPBAR ===== */
const scrollProgress = document.getElementById('scrollProgress');
const topbar = document.getElementById('topbar');

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  scrollProgress.style.width = `${(scrollTop / docHeight) * 100}%`;
  topbar.classList.toggle('scrolled', scrollTop > 80);
}, { passive: true });

/* ===== PARTICLES CANVAS ===== */
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

function makeParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.4 + 0.3,
    vx: (Math.random() - 0.5) * 0.22,
    vy: (Math.random() - 0.5) * 0.22,
    opacity: Math.random() * 0.45 + 0.08,
  };
}
for (let i = 0; i < 100; i++) particles.push(makeParticle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(63,215,255,${p.opacity})`;
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== MOBILE MENU ===== */
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (menuToggle && menu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('click', () => {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ===== MODAL ===== */
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');

function openModal(modalidade) {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (modalidade) {
    const sel = document.getElementById('modalidade');
    if (sel) sel.value = modalidade;
  }
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

const openTriggers = ['openModal', 'openModalHero', 'openModalCta'];
openTriggers.forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', () => openModal());
});

document.querySelectorAll('.open-modal-class').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.dataset.modalidade));
});

document.querySelectorAll('.open-modal-price').forEach((btn) => {
  btn.addEventListener('click', () => openModal());
});

if (modalClose) modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

/* ===== WHATSAPP FORM SUBMIT ===== */
function buildMsg(nome, tel, mod, turno) {
  let m = `Olá! Quero agendar minha *aula experimental gratuita* na Foccus Academia! 🏋️\n\n`;
  m += `*Nome:* ${nome}\n`;
  m += `*Telefone:* ${tel}\n`;
  m += `*Modalidade:* ${mod}\n`;
  if (turno) m += `*Turno preferido:* ${turno}\n`;
  m += `\nAguardo o contato!`;
  return encodeURIComponent(m);
}

function setupForm(formId, ids) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = ids.required.map((id) => document.getElementById(id));
    let valid = true;
    fields.forEach((f) => {
      if (!f || !f.value.trim()) {
        if (f) f.classList.add('error');
        valid = false;
      } else {
        f.classList.remove('error');
      }
    });
    if (!valid) return;

    const turnoEl = document.getElementById(ids.turno);
    const msg = buildMsg(
      document.getElementById(ids.nome).value,
      document.getElementById(ids.tel).value,
      document.getElementById(ids.mod).value,
      turnoEl ? turnoEl.value : ''
    );
    window.open(
      `https://api.whatsapp.com/send/?phone=5562999945388&text=${msg}&type=phone_number&app_absent=0`,
      '_blank'
    );
    closeModal();
    form.reset();
  });
}

setupForm('experimentalForm', { required: ['nome', 'telefone', 'modalidade'], nome: 'nome', tel: 'telefone', mod: 'modalidade', turno: 'turno' });
setupForm('inlineForm', { required: ['nome2', 'telefone2', 'modalidade2'], nome: 'nome2', tel: 'telefone2', mod: 'modalidade2', turno: 'turno2' });

/* ===== SCROLL REVEAL ===== */
const revealItems = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
revealItems.forEach((item) => revealObserver.observe(item));

/* ===== COUNTERS ===== */
const counters = document.querySelectorAll('.counter');
const counterObs = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const decimals = Number(el.dataset.decimal || 0);
      const divisor = decimals ? Math.pow(10, decimals) : 1;
      const duration = 1500;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const value = (ease * target) / divisor;
        el.textContent = decimals ? value.toFixed(decimals) : Math.floor(value).toLocaleString('pt-BR');
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = decimals ? (target / divisor).toFixed(decimals) : target.toLocaleString('pt-BR');
        }
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
counters.forEach((c) => counterObs.observe(c));

/* ===== PHONE MASK ===== */
document.querySelectorAll('input[type="tel"]').forEach((input) => {
  input.addEventListener('input', () => {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) {
      v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 2) {
      v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    }
    input.value = v;
  });
});
