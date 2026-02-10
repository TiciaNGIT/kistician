document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. HAMBURGER MENÜ KEZELÉSE ---
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navClose = document.getElementById("navClose");
    const navDrawer = document.querySelector(".nav-drawer");
    const navBackdrop = document.getElementById("navBackdrop");
    const navLinks = document.querySelectorAll(".nav-links a");

    // Menü megnyitása
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            navDrawer.classList.add("open");
            document.body.style.overflow = "hidden"; // Háttér görgetés letiltása
        });
    }

    // Menü bezárása (X gombbal)
    if (navClose) {
        navClose.addEventListener("click", () => {
            navDrawer.classList.remove("open");
            document.body.style.overflow = "";
        });
    }

    // Menü bezárása (háttérre kattintva)
    if (navBackdrop) {
        navBackdrop.addEventListener("click", () => {
            navDrawer.classList.remove("open");
            document.body.style.overflow = "";
        });
    }

    // --- 2. AKTÍV MENÜPONT JELÖLÉSE ---
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    navLinks.forEach(link => {
        // Ha rákattintanak egy linkre, zárjuk be a menüt
        link.addEventListener("click", () => {
            navDrawer.classList.remove("open");
            document.body.style.overflow = "";
        });

        // Ha a link az aktuális oldalra mutat, kap egy 'active' osztályt
        if (link.getAttribute("href") === currentFile) {
            link.classList.add("active");
        }
    });

    // --- 3. ÁRLISTA KARUSSZEL (CSAK KÉZI LAPOZÁS) ---
    const track = document.querySelector(".carousel-track");
    const slides = Array.from(document.querySelectorAll(".carousel-slide"));
    const dotsContainer = document.querySelector(".dots");

    if (track && slides.length > 0) {
        let currentIndex = 0;

        // Pöttyök generálása dinamikusan a képek száma alapján
        slides.forEach((_, index) => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            if (index === 0) dot.classList.add("active");
            dot.addEventListener("click", () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll(".dot");

        // Funkció a váltáshoz
        function goToSlide(index) {
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Pöttyök frissítése
            dots.forEach(d => d.classList.remove("active"));
            dots[currentIndex].classList.add("active");
        }

        // --- ÉRINTÉS (SWIPE) TÁMOGATÁS MOBILRA ---
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener("touchstart", (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener("touchend", (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // Minimum ennyit kell húzni a váltáshoz
            if (touchStartX - touchEndX > swipeThreshold) {
                // Húzás balra -> Következő kép
                if (currentIndex < slides.length - 1) {
                    goToSlide(currentIndex + 1);
                }
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // Húzás jobbra -> Előző kép
                if (currentIndex > 0) {
                    goToSlide(currentIndex - 1);
                }
            }
        }
    }
});