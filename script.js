// ניווט פעיל ופתיחת תפריט מובייל
const navToggle = document.querySelector(".nav-toggle");
const navList = document.getElementById("primary-menu");
if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// הדגשת קישור ניווט לפי גלילה
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-list a");
const makeActive = (id) => {
  navLinks.forEach((a) =>
    a.classList.toggle("active", a.getAttribute("href") === `#${id}`)
  );
};
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        makeActive(entry.target.id);
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px", threshold: 0.1 }
);
sections.forEach((s) => observer.observe(s));

// גלילה חלקה
document.addEventListener("click", (e) => {
  const target = e.target;
  if (target instanceof Element && target.matches('a[href^="#"]')) {
    const href = target.getAttribute("href");
    if (!href || href.length < 2) return;
    const el = document.querySelector(href);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    if (navList && navList.classList.contains("open")) {
      navList.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  }
});

// אימות טופס בסיסי + הודעות אינליין
const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const phoneOk = /^0\d{1}-?\d{7}|^0\d{8,9}$/.test(phone);
    const nameInput = form.querySelector('input[name="name"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const nameErr = form.querySelector('[data-error="name"]');
    const phoneErr = form.querySelector('[data-error="phone"]');
    const successMsg = form.querySelector(".form-success");

    // איפוס הודעות
    nameErr && (nameErr.textContent = "");
    phoneErr && (phoneErr.textContent = "");
    successMsg && (successMsg.textContent = "");
    nameInput?.setAttribute("aria-invalid", "false");
    phoneInput?.setAttribute("aria-invalid", "false");

    let hasError = false;
    if (!name) {
      if (nameErr) nameErr.textContent = "נא להזין שם מלא.";
      nameInput?.setAttribute("aria-invalid", "true");
      hasError = true;
    }
    if (!phoneOk) {
      if (phoneErr) phoneErr.textContent = "נא להזין טלפון תקין בפורמט ישראלי.";
      phoneInput?.setAttribute("aria-invalid", "true");
      hasError = true;
    }
    if (hasError) return;

    // ניתן להחליף בשליחה ל-API/Email service
    successMsg && (successMsg.textContent = "תודה! נחזור אליכם בהקדם.");
    form.reset();
  });
}

// שנה דינמית בפוטר
document.getElementById("year")?.append(String(new Date().getFullYear()));

// מצב תצוגה: מתג ושמירת העדפה
const htmlEl = document.documentElement;
const themeToggleButton = document.querySelector(".theme-toggle");
const storedTheme = localStorage.getItem("theme");
if (storedTheme === "light" || storedTheme === "dark") {
  htmlEl.setAttribute("data-theme", storedTheme);
  if (themeToggleButton) {
    themeToggleButton.setAttribute(
      "aria-pressed",
      String(storedTheme === "dark")
    );
    themeToggleButton.textContent = storedTheme === "dark" ? "🌙" : "🌞";
  }
}
if (themeToggleButton) {
  themeToggleButton.addEventListener("click", () => {
    const current = htmlEl.getAttribute("data-theme") || "light";
    const next = current === "light" ? "dark" : "light";
    htmlEl.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    themeToggleButton.setAttribute("aria-pressed", String(next === "dark"));
    themeToggleButton.textContent = next === "dark" ? "🌙" : "🌞";
  });
}
