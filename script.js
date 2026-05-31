/* ============================================================
   CODEZATECH — SCRIPT.JS
   Features: Particle Canvas, Cursor, Loader, Scroll Animations,
             Counter, Navbar, Mobile Menu, Form
   ============================================================ */

// ─── LOADER ──────────────────────────────────────────────────
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loaderScreen');
        if (loader) loader.classList.add('hidden');
    }, 2000);
});


function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}
// ─── CURSOR ──────────────────────────────────────────────────
const cursorGlow = document.getElementById('cursorGlow');
if (cursorGlow) {
    document.addEventListener('mousemove', e => {
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseleave', () => cursorGlow.style.opacity = '0');
    document.addEventListener('mouseenter', () => cursorGlow.style.opacity = '1');
}

// ─── PARTICLE CANVAS ─────────────────────────────────────────
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 0.3;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.color = Math.random() > 0.5 ? '14,165,233' : '6,182,212';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
    }
}

function initParticles(count = 90) {
    particles = [];
    for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(14,165,233,${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── NAVBAR ───────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

// Mobile Menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
}

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (navLink) {
            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ─── SCROLL REVEAL ────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
    revealObserver.observe(el);
});

// ─── COUNTER ANIMATION ────────────────────────────────────────
// function animateCounter(el, target, duration = 2000) {
//     const start = performance.now();
//     const update = (time) => {
//         const elapsed = time - start;
//         const progress = Math.min(elapsed / duration, 1);
//         const ease = 1 - Math.pow(1 - progress, 3);
//         el.textContent = Math.floor(ease * target);
//         if (progress < 1) requestAnimationFrame(update);
//     };
//     requestAnimationFrame(update);
// }

// const counterObserver = new IntersectionObserver((entries) => {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             const el = entry.target;
//             const target = parseInt(el.dataset.count);
//             animateCounter(el, target);
//             counterObserver.unobserve(el);
//         }
//     });
// }, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-count]').forEach(el => counterObserver.observe(el));

// ─── CONTACT FORM ─────────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.textContent = 'Sending...';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Send Message';
            btn.disabled = false;
            if (formSuccess) formSuccess.classList.add('show');
            contactForm.reset();
            setTimeout(() => formSuccess.classList.remove('show'), 4000);
        }, 1200);
    });
}

// ─── SMOOTH SCROLL FOR ALL NAV LINKS ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─── TILT EFFECT ON SERVICE CARDS ────────────────────────────
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotX = ((y - cy) / cy) * -6;
        const rotY = ((x - cx) / cx) * 6;
        card.style.transform = `translateY(-8px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ─── PARALLAX HERO ORBS ──────────────────────────────────────
const orbs = document.querySelectorAll('.hero-orb');
window.addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const mx = (e.clientX / w - 0.5) * 2;
    const my = (e.clientY / h - 0.5) * 2;
    orbs.forEach((orb, i) => {
        const factor = (i + 1) * 15;
        orb.style.transform = `translate(${mx * factor}px, ${my * factor}px)`;
    });
});


document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll('[data-slider]').forEach(function(slider) {
    var track = slider.querySelector('.fs-slides');
    var slides = track.children;
    var dotsEl = slider.querySelector('.fs-dots');
    var current = 0;
    var total = slides.length;

    // Reset dots container in case of re-execution
    dotsEl.innerHTML = '';

    var dots = Array.from({length: total}, function(_, i) {
      var d = document.createElement('button');
      d.className = 'fs-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', 'Slide ' + (i + 1));
      d.onclick = function(e) { 
        e.preventDefault();
        go(i); 
      };
      dotsEl.appendChild(d);
      return d;
    });

    function go(n) {
      current = (n + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function(d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    slider.querySelector('.fs-prev').onclick = function(e) { 
      e.preventDefault();
      go(current - 1); 
    };
    slider.querySelector('.fs-next').onclick = function(e) { 
      e.preventDefault();
      go(current + 1); 
    };

    /* Touch/swipe support */
    var startX = 0;
    slider.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) go(current + (diff > 0 ? 1 : -1));
    }, { passive: true });
  });
});

const form = document.getElementById("contactForm");
const successMessage = document.getElementById("formSuccess");

form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const formData = new FormData(form);

  const response = await fetch(form.action, {
    method: "POST",
    body: formData
  });

  const result = await response.json();

  if (result.success) {
    successMessage.style.display = "flex";
    form.reset();

    setTimeout(() => {
      successMessage.style.display = "none";
    }, 5000);

  } else {
    alert("Failed to send message!");
  }
});
