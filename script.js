// Footer év
document.getElementById('year').textContent = new Date().getFullYear();

// Carousel logic: mindig 3 kép látszik, 5s auto, nem végtelenített
(function () {
  const carousel = document.querySelector('.carousel');
  const viewport = carousel.querySelector('.viewport');
  const track = carousel.querySelector('.track');
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');

  const GAP = parseFloat(getComputedStyle(track).getPropertyValue('--gap')) || 16;

  let index = 0; // group index (0-based), minden csoportban 3 kép
  let autoTimer = null;

  function getItems() {
    return Array.from(track.querySelectorAll('.ref-item'));
  }

  function getGroupsCount() {
    const items = getItems();
    const groupSize = 3;
    return Math.max(1, Math.ceil(items.length / groupSize));
  }

  function updateTransform() {
    const vw = viewport.clientWidth;
    const offset = index * vw;
    track.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }

  function goTo(idx) {
    const max = getGroupsCount() - 1;
    index = Math.min(Math.max(0, idx), max);
    updateTransform();
  }

  function next() {
    const max = getGroupsCount() - 1;
    if (index < max) {
      index += 1;
    } else {
      index = 0; // visszaugrik az első csoporthoz
    }
    updateTransform();
  }

  function prev() {
    const max = getGroupsCount() - 1;
    if (index > 0) {
      index -= 1;
    } else {
      index = max; // visszaugrik az utolsó csoporthoz
    }
    updateTransform();
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 5000); // 5s auto-advance
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  // Controls
  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  // Resize handler
  window.addEventListener('resize', () => {
    updateTransform();
  });

  // Pause auto on hover
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // Init
  updateTransform();
  startAuto();
})();

// EmailJS init
document.addEventListener('DOMContentLoaded', function () {
  emailjs.init("2Ww1GKEzSl5RmuiTV");
});

// Contact form with EmailJS
(function () {
  const form = document.getElementById('contact-form');
  const statusEl = document.querySelector('.form-status');

  function setStatus(msg, isError = false) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? '#e53935' : '#bdbdbd';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus('Kérlek töltsd ki az összes mezőt.', true);
      return;
    }

    setStatus('Küldés folyamatban...');

    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        message: message,
        to_email: "tician1209@gmail.com"
      };

      const res = await emailjs.send(
        "service_xrh59zf",
        "template_q657ztr",
        templateParams
      );

      setStatus('Üzenet elküldve. Köszönöm a megkeresést!');
      form.reset();

    } catch (err) {
      console.error(err);
      setStatus('Hiba történt. Írj közvetlenül: tician1209@gmail.com', true);
    }
  });
})();