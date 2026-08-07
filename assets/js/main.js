/* ============================================================
   SANMAN YOJANA — main.js (Funeral Scheme)
   Header, mobile nav, reveal-on-scroll, counters,
   form validation, back-to-top, SITE-driven content.
   English is the primary language (LANG = "en").
   ============================================================ */

(function () {
  "use strict";

  /* Primary language: English first, then Marathi, then Hindi.
     User preference is stored in localStorage. */
  var LANG = localStorage.getItem("sy_lang") || "en";

  /* pick the right string out of {en, mr, hi} objects in config.js */
  function pick(v) {
    if (v == null) return "";
    return typeof v === "object" ? (v[LANG] || v.en || "") : v;
  }

  function digits(s) { return String(s).replace(/[^\d+]/g, ""); }

  /* ---------- 1. SITE-driven text, links & images ---------- */

  function wireSite() {
    if (typeof SITE === "undefined") return;

    /* text: <span data-site="phone"> */
    document.querySelectorAll("[data-site]").forEach(function (el) {
      var val = SITE[el.dataset.site];
      if (val != null) el.textContent = pick(val);
    });

    /* tel: / mailto: / map / whatsapp */
    document.querySelectorAll('[data-link="phone"]').forEach(function (a) {
      a.href = "tel:" + digits(SITE.phone);
    });
    document.querySelectorAll('[data-link="email"]').forEach(function (a) {
      a.href = "mailto:" + SITE.email;
    });
    document.querySelectorAll('[data-link="map"]').forEach(function (a) {
      a.href = SITE.mapLink;
    });
    ["whatsapp", "facebook", "instagram", "youtube", "threads"].forEach(function (k) {
      document.querySelectorAll('[data-link="' + k + '"]').forEach(function (a) {
        a.href = (SITE.social && SITE.social[k]) || "#";
      });
    });

    /* logo */
    document.querySelectorAll("[data-logo]").forEach(function (img) {
      img.onerror = function () {
        var box = this.parentElement;
        this.remove();
        if (box && !box.querySelector(".logo-fallback")) {
          var s = document.createElement("span");
          s.className = "logo-fallback font-head font-bold text-white text-xl leading-none";
          s.textContent = "स"; /* स */
          box.appendChild(s);
        }
      };
      img.src = SITE.logo;
    });

    /* embedded map */
    var map = document.getElementById("mapFrame");
    if (map && SITE.mapEmbed) map.src = SITE.mapEmbed;

    /* current year */
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- 2. Optional i18n (only if i18n.js is loaded) ---------- */

  function applyI18n() {
    if (typeof I18N === "undefined") return;
    var dict = I18N[LANG] || I18N.en || {};
    var t = function (k) { return dict[k] || (I18N.en && I18N.en[k]) || ""; };

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = t(el.dataset.i18n); if (v) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = t(el.dataset.i18nHtml); if (v) el.innerHTML = v.replace(/\n/g, "<br>");
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = t(el.dataset.i18nPh); if (v) el.setAttribute("placeholder", v);
    });
  }

  function setLang(lang) {
    LANG = lang;
    localStorage.setItem("sy_lang", lang);
    document.documentElement.lang = lang;
    wireSite();
    applyI18n();
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.lang === lang);
    });
    document.querySelectorAll(".lang-current").forEach(function (el) {
      el.textContent = lang.toUpperCase();
    });
  }
  window.setLang = setLang;

  /* ---------- 3. Header & mobile menu ---------- */

  function initHeader() {
    var header = document.getElementById("siteHeader");
    if (header) {
      var onScroll = function () {
        header.classList.toggle("shadow-lg", window.scrollY > 24);
        header.classList.toggle("backdrop-blur", window.scrollY > 24);
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    var btn = document.getElementById("menuBtn");
    var menu = document.getElementById("mobileMenu");
    if (btn && menu) {
      var close = function () {
        menu.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        btn.querySelector(".ico-open").classList.remove("hidden");
        btn.querySelector(".ico-close").classList.add("hidden");
      };
      btn.addEventListener("click", function () {
        var open = menu.classList.toggle("open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
        btn.querySelector(".ico-open").classList.toggle("hidden", open);
        btn.querySelector(".ico-close").classList.toggle("hidden", !open);
      });
      menu.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", close);
      });
    }

    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        setLang(b.dataset.lang);
        var wrap = b.closest(".lang-switch");
        if (wrap) {
          wrap.classList.remove("open");
          var t = wrap.querySelector(".lang-toggle");
          if (t) t.setAttribute("aria-expanded", "false");
        }
      });
      b.classList.toggle("active", b.dataset.lang === LANG);
    });

    document.querySelectorAll(".lang-current").forEach(function (el) {
      el.textContent = LANG.toUpperCase();
    });
  }

  function initLangSwitch() {
    document.querySelectorAll(".lang-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var wrap = btn.closest(".lang-switch");
        var isOpen = wrap.classList.contains("open");
        document.querySelectorAll(".lang-switch.open").forEach(function (w) {
          w.classList.remove("open");
          var t = w.querySelector(".lang-toggle");
          if (t) t.setAttribute("aria-expanded", "false");
        });
        if (!isOpen) {
          wrap.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });

    document.addEventListener("click", function () {
      document.querySelectorAll(".lang-switch.open").forEach(function (w) {
        w.classList.remove("open");
        var t = w.querySelector(".lang-toggle");
        if (t) t.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- 3b. Active nav item (current page only) ---------- */

  function initActiveNav() {
    var file = (location.pathname.split("/").pop() || "").toLowerCase();
    if (!file) file = "index.html";

    var same = function (a) {
      var href = (a.getAttribute("href") || "").split("#")[0].split("/").pop().toLowerCase();
      if (!href) href = "index.html";
      return href === file;
    };

    /* desktop links: underline only the current page */
    document.querySelectorAll("#siteHeader .nav-link").forEach(function (a) {
      var on = same(a);
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });

    /* mobile menu links */
    document.querySelectorAll("#mobileMenu .mnav-link").forEach(function (a) {
      var on = same(a);
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  /* ---------- 4. Reveal on scroll ---------- */

  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("show"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("show"); io.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 5. Counters ---------- */

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;

    var run = function (el) {
      var target = +el.dataset.count, dur = 1500, t0 = performance.now();
      var step = function (now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.35 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 6. Accordion (FAQ) ---------- */

  function initAccordion() {
    document.querySelectorAll(".acc").forEach(function (acc) {
      var head = acc.querySelector(".acc-head");
      if (!head) return;
      head.addEventListener("click", function () {
        var open = acc.classList.contains("open");
        document.querySelectorAll(".acc.open").forEach(function (o) { o.classList.remove("open"); });
        if (!open) acc.classList.add("open");
      });
    });
  }

  /* ---------- 6b. Back to top ---------- */

  function initToTop() {
    var btn = document.getElementById("toTop");
    if (!btn) return;

    var onScroll = function () {
      btn.classList.toggle("show", window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- 7. Enquiry form ---------- */

  function initForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var box = document.getElementById("formMsg");

    var setErr = function (name, msg) {
      var input = form.querySelector('[name="' + name + '"]');
      var slot = form.querySelector('[data-err="' + name + '"]');
      if (input) input.classList.add("err");
      if (slot) { slot.textContent = msg; slot.classList.remove("hidden"); }
    };
    var clear = function () {
      form.querySelectorAll(".field").forEach(function (i) { i.classList.remove("err"); });
      form.querySelectorAll("[data-err]").forEach(function (e) { e.classList.add("hidden"); });
    };

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      clear();
      if (box) box.classList.add("hidden");

      var name = form.fullname.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var ok = true;

      if (name.length < 2) { setErr("fullname", "Please enter your full name."); ok = false; }
      if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) {
        setErr("phone", "Enter a valid 10-digit mobile number."); ok = false;
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        setErr("email", "Enter a valid email address."); ok = false;
      }
      if (message && message.length < 10) { setErr("message", "Please write at least 10 characters."); ok = false; }

      if (!ok) {
        var first = form.querySelector(".field.err");
        if (first) first.focus();
        return;
      }

      /* No backend yet — show a local confirmation.
         To send for real, replace this block with a fetch() to
         Formspree / Google Apps Script / your own API. */
      if (box) {
        box.className = "mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-800";
        box.textContent = "Thank you. Your message has been noted — we will call you back shortly. For anything urgent, please call " + (typeof SITE !== "undefined" ? SITE.phone : "") + ".";
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      form.reset();
    });

    form.querySelectorAll(".field").forEach(function (i) {
      i.addEventListener("input", function () {
        i.classList.remove("err");
        var slot = form.querySelector('[data-err="' + i.name + '"]');
        if (slot) slot.classList.add("hidden");
      });
    });
  }

  /* ---------- 8. Back-to-top button ---------- */

  function initToTop() {
    var btn = document.getElementById("toTop");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "toTop";
      btn.type = "button";
      btn.className = "to-top";
      btn.setAttribute("aria-label", "Back to top");
      btn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/></svg>';
      document.body.appendChild(btn);
    }
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    var toggle = function () { btn.classList.toggle("show", window.scrollY > 500); };
    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  }

  /* ---------- 9. Reading progress bar ---------- */

  function initProgress() {
    var bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);
    var update = function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- Boot ---------- */

  document.addEventListener("DOMContentLoaded", function () {
    document.documentElement.lang = LANG;
    wireSite();
    applyI18n();
    initHeader();
    initLangSwitch();
    initActiveNav();
    initReveal();
    initCounters();
    initAccordion();
    initToTop();
    initProgress();
    initForm();
  });
})();
