document.addEventListener("DOMContentLoaded", () => {
    const drawer = document.querySelector(".nav-drawer");
    const openBtn = document.querySelector("#hamburgerBtn");
    const closeBtn = document.querySelector("#navClose");
    const backdrop = document.querySelector(".backdrop");

    // Menü nyitás/zárás
    const toggleMenu = (open) => {
        drawer.classList.toggle("open", open);
        document.body.style.overflow = open ? "hidden" : "";
    };

    openBtn?.addEventListener("click", () => toggleMenu(true));
    closeBtn?.addEventListener("click", () => toggleMenu(false));
    backdrop?.addEventListener("click", () => toggleMenu(false));

    // Aktív menüpont aláhúzása a fájlnév alapján
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        if (link.getAttribute("href") === currentFile) {
            link.classList.add("active");
        }
    });

    // Karusszel kezelő
    document.querySelectorAll("[data-carousel]").forEach(carousel => {
        const track = carousel.querySelector(".carousel-track");
        const slides = Array.from(carousel.querySelectorAll(".carousel-slide"));
        const dotsContainer = carousel.parentElement.querySelector(".dots");

        if (!track || slides.length === 0) return;

        let index = 0;

        const update = (newIndex) => {
            index = (newIndex + slides.length) % slides.length;
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Pöttyök frissítése
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll(".dot");
                dots.forEach((d, i) => d.classList.toggle("active", i === index));
            }
        };

        // Pöttyök létrehozása dinamikusan
        if (dotsContainer) {
            dotsContainer.innerHTML = "";
            slides.forEach((_, i) => {
                const dot = document.createElement("div");
                dot.className = "dot" + (i === 0 ? " active" : "");
                dot.addEventListener("click", () => update(i));
                dotsContainer.appendChild(dot);
            });
        }

        // Swipe (legyintés) funkció mobilra
        let startX = 0;
        carousel.addEventListener("touchstart", (e) => startX = e.touches[0].clientX, {passive: true});
        carousel.addEventListener("touchend", (e) => {
            let endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) update(index + 1); // Balra húz -> Következő
            if (startX - endX < -50) update(index - 1); // Jobbra húz -> Előző
        });

        // Automata léptetés 5 másodpercenként
        setInterval(() => update(index + 1), 5000);
    });
});