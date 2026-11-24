(() => {
  const WA = '5511985664874';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WhatsApp
  $$('.wa').forEach(el => {
    const msg = el.dataset.msg || 'Olá! Conheci a Débora Cakes pelo site e gostaria de saber mais sobre os produtos e encomendas.';
    el.href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    el.target = '_blank'; el.rel = 'noopener';
  });

  // Imagens ausentes: mostra placeholder elegante
  $$('img').forEach(img => {
    const fail = () => { const p = img.closest('.ph'); if (p) p.classList.add('no-img'); else if (img.classList.contains('logo-img')) img.remove(); };
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  // Título do hero palavra por palavra
  const h1 = $('.split');
  h1.innerHTML = h1.textContent.trim().split(' ').map((w, i) => `<span class="w"><span style="--i:${i}">${w}</span></span>`).join(' ');

  // Confeitos caindo
  const colors = ['#D99AA6', '#E8D5C0', '#593B35', '#F7E8E8', '#D99AA6'];
  if (!reduce) {
    const box = $('#sprinkles');
    for (let i = 0; i < 22; i++) {
      const s = document.createElement('i');
      s.className = 'sp';
      s.style.cssText = `left:${Math.random() * 100}%;background:${colors[i % 5]};animation-duration:${9 + Math.random() * 10}s;animation-delay:${-Math.random() * 18}s;transform:rotate(${Math.random() * 180}deg)`;
      box.appendChild(s);
    }
  }

  // Menu mobile
  const burger = $('#burger'), nav = $('#nav');
  const toggle = open => { burger.classList.toggle('open', open); nav.classList.toggle('open', open); burger.setAttribute('aria-expanded', open); };
  burger.addEventListener('click', () => toggle(!nav.classList.contains('open')));
  $$('.nav a').forEach(a => a.addEventListener('click', () => toggle(false)));

  // Header, barra de progresso e parallax
  const header = $('#header'), bar = $('#progress'), hero = $('#heroImg');
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle('scrolled', y > 40);
    bar.style.width = (y / max * 100) + '%';
    if (!reduce && y < innerHeight) hero.style.transform = `scale(1) translateY(${y * .06}px)`;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Revelação ao rolar (com cascata nos grupos)
  $$('.cards,.gallery').forEach(g => $$('.reveal', g).forEach((el, i) => el.style.setProperty('--rd', i * .12 + 's')));
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  // Cards: inclinação 3D sutil
  if (!reduce && matchMedia('(hover:hover)').matches) {
    $$('.card').forEach(c => {
      c.addEventListener('mousemove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transition = 'box-shadow .4s'; c.style.transform = `perspective(900px) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateY(-6px)`;
      });
      c.addEventListener('mouseleave', () => { c.style.transition = 'transform .6s, box-shadow .4s'; c.style.transform = ''; });
    });
  }

  // Galeria: lightbox
  const lb = $('#lightbox'), lbImg = $('img', lb);
  $$('.g').forEach(g => g.addEventListener('click', () => {
    const img = $('img', g); if (g.classList.contains('no-img')) return;
    lbImg.src = img.src; lbImg.alt = img.alt; lb.classList.add('show');
  }));
  lb.addEventListener('click', () => lb.classList.remove('show'));
  addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('show'));

  // Horários: destaca hoje e mostra aberto/fechado (fuso de São Paulo)
  const sp = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
  const day = sp.getDay(), now = sp.getHours() * 60 + sp.getMinutes();
  const sched = { 0: [600, 1080], 1: [540, 1260], 2: [540, 1260], 3: [540, 1260], 4: [540, 1260], 5: [540, 1470], 6: [540, 1470] };
  const [o, c] = sched[day], [, pc] = sched[(day + 6) % 7];
  const open = (now >= o && now < c) || (pc > 1440 && now < pc - 1440);
  $(`#hoursList li[data-d="${day}"]`).classList.add('today');
  const st = $('#status'); st.classList.toggle('open', open);
  st.textContent = open ? 'Estamos abertos agora' : 'Fechados no momento';

  $('#year').textContent = new Date().getFullYear();
})();
