// script.js
window.addEventListener("DOMContentLoaded", () => {
  // =========================
  // CONTACT FORM
  // =========================
  const form = document.getElementById("contactForm");
  const statusEl = document.getElementById("formStatus");
  const sendBtn = document.getElementById("sendBtn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !subject || !message) {
      statusEl.textContent = "Kérlek, tölts ki minden mezőt.";
      statusEl.className = "text-yellow-500";
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Küldés...";

    try {
      // Példa: backend endpoint (állítsd be a saját szerveredhez)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (!res.ok) throw new Error("Hiba történt.");

      statusEl.textContent = "Siker! Az üzenetet megkaptam.";
      statusEl.className = "text-green-500";
      form.reset();
    } catch {
      statusEl.textContent = "Nem sikerült elküldeni.";
      statusEl.className = "text-red-500";
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = "Küldés";
    }
  });

  // =========================
  // SLIDER CONTROL
  // =========================
  // A slider folyamatosan megy, nincs hover vagy touch szüneteltetés.
  // Ha később szeretnél mobilon is megállítást, itt lehetne kezelni.
});
