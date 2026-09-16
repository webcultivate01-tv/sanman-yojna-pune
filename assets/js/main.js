/* ============================================================
   SANMAN YOJANA — main.js (Funeral Scheme)
   Header, mobile nav, reveal-on-scroll, counters,
   form validation, SITE-driven content.
   English is the primary language (LANG = "en").
   ============================================================ */

(function () {
  "use strict";

  /* Primary language: English first, then Marathi, then Hindi.
     User preference is stored in localStorage.

     Reading it is wrapped: a browser with cookies/site data blocked throws on
     the property access itself, and this file is one IIFE — an exception here
     used to leave the whole site with no JavaScript at all. The value is also
     checked against the three languages that exist, so a stale or hand-edited
     entry cannot end up in <html lang>. */
  var LANGS = ["en", "mr", "hi"];
  var LANG = "en";
  try {
    var saved = localStorage.getItem("sy_lang");
    if (saved && LANGS.indexOf(saved) !== -1) LANG = saved;
  } catch (e) { /* storage unavailable — English it is */ }

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
    ["whatsapp", "facebook", "instagram", "youtube"].forEach(function (k) {
      document.querySelectorAll('[data-link="' + k + '"]').forEach(function (a) {
        a.href = (SITE.social && SITE.social[k]) || "#";
      });
    });

    /* logo — WebP first, then the PNG for anything too old to decode it,
       then the typed mark if neither file is reachable.
       wireSite() runs again on every language switch, so the src is only
       written when it would actually change: re-writing it forced a decode
       each time, and once the PNG fallback was in place a second write put
       the unreadable WebP back and the next error tore the image out. */
    document.querySelectorAll("[data-logo]").forEach(function (img) {
      if (img.dataset.fellBack) return;

      var fail = function () {
        if (SITE.logoFallback && !img.dataset.fellBack) {
          img.dataset.fellBack = "1";
          img.src = SITE.logoFallback;
          return;
        }
        var box = img.parentElement;
        img.remove();
        if (box && !box.querySelector(".logo-fallback")) {
          var s = document.createElement("span");
          s.className = "logo-fallback font-head font-bold text-amber-800 text-xl leading-none";
          s.textContent = "स"; /* स */
          box.appendChild(s);
        }
      };

      img.onerror = fail;
      if (img.getAttribute("src") !== SITE.logo) img.src = SITE.logo;

      /* The src is already in the markup, so the browser may have finished —
         and failed — before this handler existed. A finished image with no
         intrinsic width is one that did not decode; the error event for it is
         long gone, so the fallback is run by hand. */
      if (img.complete && img.naturalWidth === 0) fail();
    });

    /* embedded map — same guard: assigning src again reloads the whole Google
       Maps frame, which is a fresh third-party fetch on every language switch */
    var map = document.getElementById("mapFrame");
    if (map && SITE.mapEmbed && map.getAttribute("src") !== SITE.mapEmbed) {
      map.src = SITE.mapEmbed;
    }

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
      var v = t(el.dataset.i18nHtml); if (v) el.innerHTML = v.replace(/\n\n/g, '<br><span class="block h-2" aria-hidden="true"></span>').replace(/\n/g, "<br>");
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var v = t(el.dataset.i18nPh); if (v) el.setAttribute("placeholder", v);
    });

    /* attribute-only strings — alt text, screen-reader labels, tooltips and
       the <meta name="description"> content, none of which are text nodes */
    [
      ["data-i18n-alt",     "i18nAlt",     "alt"],
      ["data-i18n-aria",    "i18nAria",    "aria-label"],
      ["data-i18n-title",   "i18nTitle",   "title"],
      ["data-i18n-content", "i18nContent", "content"]
    ].forEach(function (map) {
      document.querySelectorAll("[" + map[0] + "]").forEach(function (el) {
        var v = t(el.dataset[map[1]]); if (v) el.setAttribute(map[2], v);
      });
    });
  }

  /* ---------- 2b. Titles that must stay on one line: shrink to fit ----------
     Titles vary a lot in length (in every language the site supports), so instead
     of wrapping to a second line or clipping with an ellipsis, each one's font
     size is scaled down just enough that it still reads in full on a single line.
     A title that already contains a hard <br> (the two-line social-work heading)
     is treated as one line per segment — each segment must fit on its own row,
     so the font is scaled to whichever segment is tightest. */

  var _fitCanvas;

  function fitOneLine(el) {
    el.style.fontSize = "";
    var available = el.clientWidth;
    if (available <= 0) return;
    var cs = getComputedStyle(el);
    var base = parseFloat(cs.fontSize);
    var needed;
    if (el.querySelector("br")) {
      var segments = el.innerHTML.split(/<br\s*\/?>/i).map(function (seg) {
        var tmp = document.createElement("div");
        tmp.innerHTML = seg;
        return tmp.textContent.trim();
      }).filter(Boolean);
      _fitCanvas = _fitCanvas || document.createElement("canvas");
      var ctx = _fitCanvas.getContext("2d");
      ctx.font = cs.fontStyle + " " + cs.fontWeight + " " + base + "px " + cs.fontFamily;
      needed = Math.max.apply(null, segments.map(function (s) { return ctx.measureText(s).width; }));
    } else {
      needed = el.scrollWidth;
    }
    if (needed > available) {
      el.style.fontSize = (base * available / needed) + "px";
    }
  }

  function fitOneLineTitles() {
    document.querySelectorAll(
      ".gov-companies-list li span:last-child, .svc-teaser-title, .sx-why-title, .sw-title"
    ).forEach(fitOneLine);
  }

  function setLang(lang) {
    LANG = lang;
    /* Safari in private browsing, and any browser with site data switched
       off, throws on write. The switch itself must still work. */
    try { localStorage.setItem("sy_lang", lang); } catch (e) {}
    document.documentElement.lang = lang;
    wireSite();
    applyI18n();
    fitOneLineTitles();
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
    var slow = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var io = new IntersectionObserver(function (entries) {
      /* A wide screen brings a whole row of service cards past the line in one
         batch. Those are dealt out one after another so the row fills in card
         by card instead of landing all at once; everything else shows at once. */
      var n = 0;
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        io.unobserve(el);
        var wait = !slow && el.classList.contains("svc-teaser") ? n++ * 90 : 0;
        if (wait) setTimeout(function () { el.classList.add("show"); }, wait);
        else el.classList.add("show");
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 5. Counters ---------- */

  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!els.length) return;

    var run = function (el) {
      /* a page may start its own counters inline, long before this file runs —
         those mark themselves and must not be restarted from zero here */
      if (el.dataset.counted) return;
      el.dataset.counted = "1";
      var target = +el.dataset.count, dur = 900, t0 = performance.now();
      var step = function (now) {
        var p = Math.min((now - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("en-IN");
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    if (!("IntersectionObserver" in window)) { els.forEach(run); return; }
    /* threshold 0 — the count starts on the number's first visible pixel */
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0 });
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

  /* ---------- 7. Enquiry form ---------- */

  /* Submissions are recorded in this Google Form (owner: Sanman Yojana):
     https://docs.google.com/forms/d/e/1FAIpQLSdMNWOcTdjvlsYJHMsu9UWZMmcmjxwxEWBjekErX0hCgMbjDg/viewform */
  var GFORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSdMNWOcTdjvlsYJHMsu9UWZMmcmjxwxEWBjekErX0hCgMbjDg/formResponse";
  var GFORM_ENTRIES = {
    fullname: "entry.2005620554",
    phone: "entry.860816428",
    email: "entry.1045781291",
    village: "entry.1065046570",
    message: "entry.1166974658"
  };

  /* no-cors gives an opaque response, so a resolved promise is the only signal
     that the POST left the browser — and a rejected one is a genuine failure
     (offline, DNS, Google unreachable). A request that never answers used to
     leave the submit button disabled for the rest of the visit, so it is given
     a ceiling of its own. */
  var GFORM_TIMEOUT = 12000;

  function submitToGoogleForm(values) {
    var body = new URLSearchParams();
    Object.keys(GFORM_ENTRIES).forEach(function (key) {
      body.append(GFORM_ENTRIES[key], values[key] || "");
    });

    var opts = { method: "POST", mode: "no-cors", body: body };
    var ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
    if (ctrl) opts.signal = ctrl.signal;

    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (done) return;
        done = true;
        if (ctrl) { try { ctrl.abort(); } catch (e) {} }
        reject(new Error("timeout"));
      }, GFORM_TIMEOUT);

      fetch(GFORM_ACTION, opts).then(function (r) {
        if (done) return;
        done = true; clearTimeout(timer); resolve(r);
      }, function (err) {
        if (done) return;
        done = true; clearTimeout(timer); reject(err);
      });
    });
  }

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

    /* read a field by name — a form missing one of them must not take the
       whole submit handler down with a TypeError */
    var val = function (n) {
      var el = form.elements[n];
      return el && typeof el.value === "string" ? el.value.trim() : "";
    };

    var sending = false;

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (sending) return;
      clear();
      if (box) box.classList.add("hidden");

      var name = val("fullname");
      var phone = val("phone");
      var email = val("email");
      var village = val("village");
      var message = val("message");
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

      var submitBtn = form.querySelector('button[type="submit"]');
      sending = true;
      if (submitBtn) submitBtn.disabled = true;

      var tel = (typeof SITE !== "undefined" && SITE.phone) ? SITE.phone : "";

      var finish = function (delivered) {
        sending = false;
        if (submitBtn) submitBtn.disabled = false;
        if (!box) return;
        if (delivered) {
          box.className = "mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-green-800";
          box.textContent = "Thank you. Your message has been noted — we will call you back shortly. For anything urgent, please call " + tel + ".";
        } else {
          /* The message never left the browser. Saying "we will call you back"
             here would leave a family waiting on a call that was never
             requested, so the form is kept filled in and the phone number is
             offered instead. */
          box.className = "mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5 text-sm text-red-800";
          box.textContent = "We could not send your message just now — please check your internet connection and try again, or call us directly on " + tel + ".";
        }
        box.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      submitToGoogleForm({ fullname: name, phone: phone, email: email, village: village, message: message })
        .then(function () { finish(true); form.reset(); },
              function () { finish(false); });
    });

    form.querySelectorAll(".field").forEach(function (i) {
      i.addEventListener("input", function () {
        i.classList.remove("err");
        var slot = form.querySelector('[data-err="' + i.name + '"]');
        if (slot) slot.classList.add("hidden");
      });
    });
  }

  /* ---------- Boot ---------- */

  /* Every widget is started on its own. They used to run as one statement
     list, so a single missing element anywhere — one page shipped without a
     menu icon, one browser without a constructor — threw and took every
     later widget on the page down with it: no language switch, no reveal, no
     enquiry form. A failure is now contained to the one thing that failed. */
  function safe(name, fn) {
    try { fn(); }
    catch (e) {
      if (window.console && console.error) console.error("[sanman] " + name + " failed:", e);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    /* stands down the reveal-on-scroll failsafe in the page <head> — this file
       arrived, so the observer will do the work */
    document.documentElement.setAttribute("data-sy-booted", "1");
    document.documentElement.lang = LANG;
    safe("wireSite", wireSite);
    safe("applyI18n", applyI18n);
    safe("initHeader", initHeader);
    safe("initLangSwitch", initLangSwitch);
    safe("initActiveNav", initActiveNav);
    safe("initReveal", initReveal);
    safe("initCounters", initCounters);
    safe("initAccordion", initAccordion);
    safe("initForm", initForm);
    safe("fitOneLineTitles", fitOneLineTitles);

    /* the web font may still be loading at DOMContentLoaded — its metrics
       differ from the fallback font, so re-measure once it's actually in use */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { safe("fitOneLineTitles", fitOneLineTitles); });
    }

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () { safe("fitOneLineTitles", fitOneLineTitles); }, 150);
    });
  });
})();
