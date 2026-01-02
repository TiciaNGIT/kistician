// --- Smooth scroll ---
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').substring(1);
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


// --- CAROUSEL: gombok + auto (10s) + végtelen jobbra (clone) + 3/2/1 responsive ---
document.querySelectorAll('.carousel-wrapper').forEach(wrapper => {
  const container = wrapper.querySelector('.carousel-container');
  const track = wrapper.querySelector('.carousel-track');
  const btnLeft = wrapper.querySelector('.carousel-btn.left');
  const btnRight = wrapper.querySelector('.carousel-btn.right');

  if (!container || !track || !btnLeft || !btnRight) return;

  let autoInterval = null;
  let isAnimating = false;

  // Eredeti itemek (clonok nélkül)
  let originals = Array.from(track.querySelectorAll('.carousel-item'));

  if (originals.length === 0) return;

  // state
  let index = 0;         // aktuális "első látható" elem indexe az ORIGINALS-ben
  let headClones = 0;    // mennyi clon van előre beszúrva
  let tailClones = 0;    // mennyi clon van a végére
  let perView = 3;       // 3/2/1
  let slideW = 0;

  function visibleCount() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function stopAuto() {
    if (autoInterval) {
      clearInterval(autoInterval);
      autoInterval = null;
    }
  }

  function startAuto() {
    stopAuto();
    autoInterval = setInterval(() => {
      next();
    }, 10000);
  }

  function resetAuto() {
    startAuto();
  }

  function clearClones() {
    // töröljük a régi clonokat (újraépítéshez)
    track.querySelectorAll('.carousel-item[data-clone="1"]').forEach(el => el.remove());
  }

  function buildClones() {
    clearClones();

    // frissítsük az originals listát (hátha közben változott)
    originals = Array.from(track.querySelectorAll('.carousel-item:not([data-clone="1"])'));

    perView = Math.min(visibleCount(), originals.length);

    headClones = perView;
    tailClones = perView;

    // Prepend: utolsó perView elem clonja
    const head = originals.slice(-perView).map(node => {
      const c = node.cloneNode(true);
      c.setAttribute('data-clone', '1');
      return c;
    });

    // Append: első perView elem clonja
    const tail = originals.slice(0, perView).map(node => {
      const c = node.cloneNode(true);
      c.setAttribute('data-clone', '1');
      return c;
    });

    // beszúrás DOM-ba
    head.forEach(c => track.insertBefore(c, track.firstChild));
    tail.forEach(c => track.appendChild(c));
  }

  function setSizes() {
    // container szélesség / perView = egy item szélessége
    const w = container.clientWidth;
    slideW = Math.floor(w / perView);

    // minden item (eredeti + clone) fix szélességet kap
    const allItems = Array.from(track.querySelectorAll('.carousel-item'));
    allItems.forEach(it => {
      it.style.flex = `0 0 ${slideW}px`;
      it.style.maxWidth = `${slideW}px`;
    });
  }

  function setTransition(on) {
    track.style.transition = on ? 'transform 0.5s ease' : 'none';
  }

  function translateToCurrent(animate) {
    // A track elején headClones darab clone van, ezért +headClones offset
    const offsetIndex = index + headClones;
    setTransition(animate);
    track.style.transform = `translateX(-${offsetIndex * slideW}px)`;
  }

  function jumpWithoutFlash(newIndex) {
    index = newIndex;
    translateToCurrent(false);
    // következő frame-ben visszakapcsoljuk az animot, hogy a következő lépés animált legyen
    requestAnimationFrame(() => setTransition(true));
  }

  function next() {
    if (isAnimating) return;
    isAnimating = true;

    index++;
    translateToCurrent(true);

    // ha kimentünk a végén túl (végtelen jobbra), visszaugrunk elejére
    if (index >= originals.length) {
      // megvárjuk a transition végét, majd ugrás anim nélkül
      setTimeout(() => {
        jumpWithoutFlash(0);
        isAnimating = false;
      }, 520);
      return;
    }

    setTimeout(() => { isAnimating = false; }, 520);
  }

  function prev() {
    if (isAnimating) return;
    isAnimating = true;

    index--;
    translateToCurrent(true);

    // ha balra kimentünk a kezdés elé, ugorjunk az originals végére
    if (index < 0) {
      setTimeout(() => {
        jumpWithoutFlash(originals.length - 1);
        isAnimating = false;
      }, 520);
      return;
    }

    setTimeout(() => { isAnimating = false; }, 520);
  }

  // Gombok
  btnRight.addEventListener('click', () => {
    resetAuto();
    next();
  });

  btnLeft.addEventListener('click', () => {
    resetAuto();
    prev();
  });

  // Init / resize újraépítés (mert 3/2/1 változhat)
  function rebuild(keepIndex = true) {
    const current = index;
    buildClones();
    setSizes();

    // ha kevesebb elem van, mint perView, index legyen 0
    if (!keepIndex || current >= originals.length) index = 0;
    else index = current;

    translateToCurrent(false);
    setTransition(true);
  }

  window.addEventListener('resize', () => {
    // resize-nál újraépítjük a clonokat + méretezést
    rebuild(true);
  });

  // Start
  rebuild(false);
  startAuto();
});
