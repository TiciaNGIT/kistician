document.addEventListener("DOMContentLoaded", () => {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const navClose = document.getElementById("navClose");
    const navDrawer = document.querySelector(".nav-drawer");
    const navBackdrop = document.getElementById("navBackdrop");
    const navLinks = document.querySelectorAll(".nav-links a");

    // Menü megnyitása
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener("click", () => {
            navDrawer.classList.add("open");
            document.body.style.overflow = "hidden"; // Ne görögjön a háttér
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

    // Aktív menüpont jelölése és bezárás kattintáskor
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    
    navLinks.forEach(link => {
        // Ha rákattintanak egy linkre, zárjuk be a menüt (fontos egyoldalas navigációnál)
        link.addEventListener("click", () => {
            navDrawer.classList.remove("open");
            document.body.style.overflow = "";
        });

        // Aktív osztály hozzáadása
        if (link.getAttribute("href") === currentFile) {
            link.classList.add("active");
        }
    });
});