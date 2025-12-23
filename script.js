// Footer év
document.getElementById('year').textContent = new Date().getFullYear();

// Carousel logic: mindig 3 kép látszik, 5s auto, végtelenített
(function () {
  const carousel = document.querySelector('.carousel');
  const viewport = carousel.querySelector('.viewport');
  const track = carousel.querySelector('.track');
  const prevBtn = carousel.querySelector('.prev');
  const nextBtn = carousel.querySelector('.next');

  const groupSize = 3;
  let index = 0;
  let autoTimer = null;

  // --- 1) EREDETI ELEMEK ---
  const items = Array.from(track.querySelectorAll('.ref-item'));
  const totalItems = items.length;
  const totalGroups = Math.ceil(totalItems / groupSize);

  // --- 2) KLÓNOK HOZZÁADÁSA A VÉGÉRE ---
  const clones = items.slice(0, groupSize).map(item => item.cloneNode(true));
  clones.forEach(clone => track.appendChild(clone));

  // --- 3) TRANSZFORM FRISSÍTÉSE ---
  function updateTransform(animate = true) {
    const vw = viewport.clientWidth;
    const offset = index * vw;

    track.style.transition = animate ? 'transform 0.6s ease' : 'none';
    track.style.transform = `translate3d(-${offset}px, 0, 0)`;
  }

  // --- 4) KÖVETKEZŐ CSOPORT ---
  function next() {
    index++;
    updateTransform(true);

    // Ha elértük a klónokat → visszaugrás az eredeti első csoporthoz
    if (index === totalGroups) {
      setTimeout(() => {
        index = 0;
        updateTransform(false);
      }, 600);
    }
  }

  // --- 5) ELŐZŐ CSOPORT ---
  function prev() {
    if (index === 0) {
      // Ugrás a klónokhoz (láthatatlanul)
      index = totalGroups;
      updateTransform(false);

      // majd animált visszalépés
      requestAnimationFrame(() => {
        index = totalGroups - 1;
        updateTransform(true);
      });
      return;
    }

    index--;
    updateTransform(true);
  }

  // --- 6) AUTO ---
  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, 5000);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  }

  // --- 7) GOMBOK ---
  nextBtn.addEventListener('click', () => { next(); startAuto(); });
  prevBtn.addEventListener('click', () => { prev(); startAuto(); });

  // --- 8) RESIZE ---
  window.addEventListener('resize', () => updateTransform(false));

  // --- 9) HOVER ---
  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  // --- 10) INIT ---
  updateTransform(false);
  startAuto();
})();

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
        to_email: 'tician1209@gmail.com'
      };

      const res = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
      setStatus('Üzenet elküldve. Köszönöm a megkeresést!');
      form.reset();
    } catch (err) {
      console.error(err);
      setStatus('Hoppá, nem sikerült elküldeni. Próbáld újra, vagy írj közvetlenül: tician1209@gmail.com', true);
    }
  });
})();
