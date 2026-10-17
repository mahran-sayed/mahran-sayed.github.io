/* Portfolio app: hash router + views. Everything is driven by config.js. */
(function () {
  "use strict";

  var C = window.SITE_CONFIG || {};
  var esc = window.MD.esc;
  var root = document.documentElement;
  var app = document.getElementById("app");
  var flow = null;
  var rotTimer = null;

  /* ------------------------------------------------------------ icons */
  var I = {
    folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    ext: '<path d="M7 17L17 7M8 7h9v9"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6L7 7M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    download: '<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
    printer: '<path d="M7 8V3h10v5M6 17H4v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6h-2"/><path d="M7 14h10v7H7z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    wing: '<path d="M2 14c4-6 12-8 20-4-6 1-9 5-20 4z"/><path d="M8 12.5l9-1.5"/>',
    wave: '<path d="M2 9c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0M2 15c2.5-3 4.5 3 7 0s4.5 3 7 0 4.5 3 6 0"/>',
    orbit: '<ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/><circle cx="12" cy="12" r="2.6"/>',
    code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.9 6.6 19.7l1.1-6.1L3.2 9.4l6.1-.8z"/>',
    github: "F:M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
    linkedin: "F:M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
    youtube: "F:M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6z",
  };

  function icon(name, size) {
    var d = I[name] || I.file;
    size = size || 20;
    if (d.indexOf("F:") === 0) {
      return '<svg class="ico" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + d.slice(2) + '"/></svg>';
    }
    return '<svg class="ico" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + "</svg>";
  }

  /* ------------------------------------------------------------ theme */
  function hexToRgb(h) {
    h = (h || "").replace("#", "");
    if (h.length === 3) h = h.replace(/(.)/g, "$1$1");
    var n = parseInt(h, 16);
    return isNaN(n) ? "56,225,255" : [(n >> 16) & 255, (n >> 8) & 255, n & 255].join(",");
  }

  function currentMode() { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; }

  function applyTheme(mode) {
    var T = C.theme || {};
    root.setAttribute("data-theme", mode);
    var a = mode === "dark" ? T.accent || "#38e1ff" : T.accentLight || "#0b6bcb";
    var b = mode === "dark" ? T.accent2 || "#ffb454" : T.accent2Light || "#c4620a";
    root.style.setProperty("--accent", a);
    root.style.setProperty("--accent-rgb", hexToRgb(a));
    root.style.setProperty("--accent-2", b);
    root.style.setProperty("--accent-2-rgb", hexToRgb(b));
    root.style.setProperty("--flow-a", a);
    root.style.setProperty("--flow-b", b);
    root.style.setProperty("--flow-body", mode === "dark" ? "#0a1222" : "#ffffff");
    var tc = document.querySelector('meta[name="theme-color"]');
    if (tc) tc.setAttribute("content", mode === "dark" ? "#05080f" : "#f4f7fc");
    var btn = document.getElementById("theme-toggle");
    if (btn) btn.innerHTML = icon(mode === "dark" ? "sun" : "moon", 18);
    if (flow) flow.refreshColors();
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("theme"); } catch (e) {}
    applyTheme(saved || (C.theme && C.theme.defaultMode) || "dark");
    document.getElementById("theme-toggle").addEventListener("click", function () {
      var next = currentMode() === "dark" ? "light" : "dark";
      try { localStorage.setItem("theme", next); } catch (e) {}
      applyTheme(next);
    });
  }

  /* ---------------------------------------------------------- helpers */
  function projectBySlug(slug) { return (C.projects || []).filter(function (p) { return p.slug === slug; })[0]; }
  function postBySlug(slug) { return (C.posts || []).filter(function (p) { return p.slug === slug; })[0]; }
  function sortedPosts() { return (C.posts || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }); }
  function fmtDate(d) {
    var dt = new Date(d + "T00:00:00");
    if (isNaN(dt)) return esc(d);
    return dt.toLocaleDateString("en-GB", { year: "numeric", month: "short", day: "numeric" });
  }
  function projUrl(p, file) { return "content/projects/" + p.slug + "/" + file; }
  function postUrl(p, file) { return "content/blog/" + p.slug + "/" + file; }
  var CAT_ICON = { Hydrodynamics: "wave", Space: "orbit", Aeronautics: "wing", "Open source": "github" };

  function linkAttrs(url) { return /^https?:/i.test(url) ? ' target="_blank" rel="noopener"' : ""; }

  function projectCard(p) {
    var cover = p.cover ? '<img class="card-cover" src="' + esc(projUrl(p, p.cover)) + '" alt="" loading="lazy">' : "";
    return '<a class="card reveal" href="#/portfolio/' + esc(p.slug) + '">' + cover + '<span class="card-shade"></span>' +
      '<span class="card-icon">' + icon(p.icon || CAT_ICON[p.category] || "file", 26) + "</span>" +
      '<span class="card-body"><span class="card-meta">' + esc(p.category || "") + (p.year ? " &middot; " + esc(p.year) : "") + "</span>" +
      '<span class="card-title">' + esc(p.title) + '</span><span class="card-sub">' + esc(p.subtitle || "") + "</span></span></a>";
  }

  function postCard(p) {
    var cover = p.cover ? '<img src="' + esc(postUrl(p, p.cover)) + '" alt="" loading="lazy">' : "";
    return '<a class="post-card reveal" href="#/blog/' + esc(p.slug) + '"><div class="post-cover">' + cover + "</div>" +
      '<div class="post-body"><span class="chip chip-accent">' + esc(p.tag || "") + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.summary || "") +
      '</p><span class="post-date">' + fmtDate(p.date) + "</span></div></a>";
  }

  function socialButtons() {
    return (C.social || []).map(function (s) {
      var cls = "social-btn social-" + esc(s.icon || "link");
      return '<a class="' + cls + '" href="' + esc(s.url) + '"' + linkAttrs(s.url) + ">" + icon(s.icon || "ext", 22) +
        '<span class="sb-text"><span class="sb-label">' + esc(s.label) + "</span>" + (s.text ? '<span class="sb-sub">' + esc(s.text) + "</span>" : "") + "</span></a>";
    }).join("");
  }

  function socialIcons() {
    return (C.social || []).map(function (s) {
      return '<a class="icon-btn" href="' + esc(s.url) + '"' + linkAttrs(s.url) + ' aria-label="' + esc(s.label) + '" title="' + esc(s.label) + '">' + icon(s.heroIcon || s.icon || "ext", 20) + "</a>";
    }).join("");
  }

  function sectionHead(kicker, title, sub) {
    return '<header class="section-head reveal"><span class="kicker">' + esc(kicker) + "</span><h2>" + esc(title) + "</h2>" + (sub ? "<p>" + esc(sub) + "</p>" : "") + "</header>";
  }

  /* ------------------------------------------------------------ views */
  function viewHome() {
    var H = C.hero || {}, P = C.profile || {};
    var feat = (C.featuredProjects || []).map(projectBySlug).filter(Boolean);
    var cap = C.capabilities || {};
    var books = C.books || {};
    var hues = [196, 28, 160, 216, 44, 262, 8, 128];

    var html = '<section class="hero"><div class="hero-flow" aria-hidden="true"></div><div class="container hero-inner">' +
      '<p class="kicker hero-kicker">' + esc(H.kicker || "") + "</p>" +
      '<h1 class="hero-name">' + esc(H.name || C.site.name) + "</h1>" +
      '<p class="hero-rot">Currently thinking about <span class="rot-word">' + esc((H.rotating || [""])[0]) + '</span><span class="caret"></span></p>' +
      '<p class="hero-tag">' + esc(H.tagline || "") + "</p>" +
      '<div class="hero-cta"><a class="btn btn-primary" href="#/portfolio">View portfolio ' + icon("arrow", 18) + '</a><a class="btn btn-ghost" href="#/resume">Resume</a>' +
      '<span class="hero-social">' + socialIcons() + "</span></div>" +
      (P.location ? '<p class="hero-meta">' + icon("pin", 14) + " " + esc(P.location.toUpperCase()) + (P.coords ? " &nbsp; " + esc(P.coords) : "") + "</p>" : "") +
      "</div></section>";

    // about
    html += '<section class="section" id="about"><div class="container">' + sectionHead("01 / About", "About Me") +
      '<div class="about reveal"><div class="avatar"><span class="avatar-mono">' + esc(P.monogram || "") + '</span>' +
      (P.photo ? '<img src="' + esc(P.photo) + '" alt="' + esc(P.fullName || "") + '" class="avatar-img">' : "") + "</div>" +
      '<div class="about-text"><h3>My name is ' + esc(P.fullName || "") + '</h3><p class="mono-sub">' + esc(P.headline || "") + "</p>" +
      (P.about || []).map(function (t) { return "<p>" + esc(t).replace(/\*\*(.+?)\*\*/g, '<mark class="hl">$1</mark>') + "</p>"; }).join("") + "</div></div>" +
      '<div class="focus-grid">' + (P.focus || []).map(function (f) {
        return '<div class="focus reveal"><span class="focus-ico">' + icon(f.icon, 26) + "</span><h4>" + esc(f.title) + "</h4><p>" + esc(f.text) + "</p></div>";
      }).join("") + "</div></div></section>";

    // my work
    html += '<section class="section"><div class="container">' + sectionHead("02 / Navigate", "My Work") +
      '<div class="work-grid">' +
      '<a class="work-tile reveal" href="#/resume"><span class="wt-label"><i>.</i>resume</span><span class="wt-text">Experience, education, skills and certificates.</span>' + icon("arrow", 22) + "</a>" +
      '<a class="work-tile reveal" href="#/portfolio"><span class="wt-label"><i>.</i>portfolio</span><span class="wt-text">Hydrodynamics, space systems and UAV projects.</span>' + icon("arrow", 22) + "</a>" +
      '<a class="work-tile reveal" href="#/blog"><span class="wt-label"><i>.</i>blog</span><span class="wt-text">Notes on fluids, flight and space.</span>' + icon("arrow", 22) + "</a>" +
      "</div></div></section>";

    // featured
    if (feat.length) {
      html += '<section class="section"><div class="container">' + sectionHead("03 / Selected", "Featured Projects") +
        '<div class="grid-cards">' + feat.map(projectCard).join("") + '</div><p class="more reveal"><a class="link-arrow" href="#/portfolio">All projects ' + icon("arrow", 16) + "</a></p></div></section>";
    }

    // capabilities
    if (cap.items && cap.items.length) {
      html += '<section class="section"><div class="container">' + sectionHead("04 / Capabilities", cap.title || "Capabilities") +
        '<div class="panel reveal"><div class="panel-bar"><span></span><span></span><span></span><em>hydrodynamics.log</em></div><ol class="spec-list">' +
        cap.items.map(function (t, i) { return "<li><b>" + String(i + 1).padStart(2, "0") + "</b><span>" + esc(t) + "</span></li>"; }).join("") + "</ol></div></div></section>";
    }

    // books
    if (books.items && books.items.length) {
      html += '<section class="section"><div class="container">' + sectionHead("05 / Library", books.title || "Books", books.subtitle) +
        '<div class="book-grid">' + books.items.map(function (b, i) {
          return '<div class="book reveal" style="--hue:' + hues[i % hues.length] + '"><span class="spine"></span><div><h4>' + esc(b.title) + "</h4><p>" + esc(b.author) + '</p><span class="chip">' + esc(b.tag || "") + "</span></div></div>";
        }).join("") + "</div></div></section>";
    }

    // contact
    html += '<section class="section" id="contact"><div class="container">' + sectionHead("06 / Contact", "Get in Touch", "Open to hydrodynamics, CFD and aerospace conversations.") +
      '<div class="social-grid reveal">' + socialButtons() + "</div></div></section>";

    return { html: html, title: C.site.title, after: initHome };
  }

  function initHome() {
    var host = document.querySelector(".hero-flow");
    if (host && C.theme && C.theme.flowAnimation !== false && window.HeroFlow) flow = window.HeroFlow.create(host, { scenes: C.theme.heroScenes, cycleSeconds: C.theme.heroCycleSeconds });
    var words = (C.hero && C.hero.rotating) || [];
    var el = document.querySelector(".rot-word");
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (el && words.length > 1 && !reduce) {
      var i = 0;
      rotTimer = setInterval(function () {
        el.classList.add("out");
        setTimeout(function () { i = (i + 1) % words.length; el.textContent = words[i]; el.classList.remove("out"); }, 280);
      }, 2600);
    }
    var img = document.querySelector(".avatar-img");
    if (img) { img.addEventListener("error", function () { img.remove(); var a = document.querySelector(".avatar"); if (a) a.classList.add("no-img"); }); }
  }

  function viewResume() {
    var R = C.resume || {}, P = C.profile || {};
    var mailPersonal = (C.social || []).filter(function (s) { return s.icon === "mail"; });
    var li = (C.social || []).filter(function (s) { return s.icon === "linkedin" || s.icon === "github"; });

    var actions = R.pdf
      ? '<a class="btn btn-primary" href="' + esc(R.pdf) + '" download>' + icon("download", 18) + " Download PDF</a>"
      : '<button class="btn btn-primary" id="print-btn">' + icon("printer", 18) + " Print / Save as PDF</button>";

    var html = '<div class="container page resume"><header class="resume-head reveal"><div><span class="kicker">RESUME</span><h1>' + esc(P.fullName) + "</h1><p class=\"mono-sub\">" + esc(P.headline) + "</p>" +
      '<ul class="contact-row"><li>' + icon("pin", 16) + " " + esc(P.location) + "</li>" +
      mailPersonal.map(function (s) { return '<li>' + icon("mail", 16) + ' <a href="' + esc(s.url) + '">' + esc(s.text || s.label) + "</a></li>"; }).join("") +
      li.map(function (s) { return "<li>" + icon(s.icon, 16) + ' <a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.label) + "</a></li>"; }).join("") + "</ul></div>" +
      '<div class="resume-actions no-print">' + actions + "</div></header>";

    html += '<p class="summary reveal">' + esc(R.summary || "") + "</p>";

    html += '<div class="resume-cols"><div class="resume-main">';

    html += '<section class="r-sec reveal"><h2>Experience</h2><div class="timeline">' + (R.experience || []).map(function (x) {
      return '<article class="tl-item"><div class="tl-head"><h3>' + esc(x.role) + '</h3><span class="period">' + esc(x.period) + "</span></div>" +
        '<div class="org">' + (x.orgUrl ? '<a href="' + esc(x.orgUrl) + '" target="_blank" rel="noopener">' + esc(x.org) + "</a>" : esc(x.org)) + "</div>" +
        ((x.bullets || []).length ? "<ul>" + x.bullets.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>" : "") + "</article>";
    }).join("") + "</div></section>";

    if ((R.volunteering || []).length) {
      html += '<section class="r-sec reveal"><h2>Volunteering &amp; Community</h2><div class="timeline">' + R.volunteering.map(function (v) {
        return '<article class="tl-item"><div class="tl-head"><h3>' + (v.url ? '<a href="' + esc(v.url) + '" target="_blank" rel="noopener">' + esc(v.role) + "</a>" : esc(v.role)) + '</h3><span class="period">' + esc(v.period) + "</span></div><p>" + esc(v.text) + "</p></article>";
      }).join("") + "</div></section>";
    }

    if ((R.projects || []).length) {
      html += '<section class="r-sec reveal"><h2>Selected Projects</h2><ul class="proj-list">' + R.projects.map(function (p) {
        var inner = p.slug ? '<a href="#/portfolio/' + esc(p.slug) + '">' + esc(p.title) + "</a>" : esc(p.title);
        return "<li>" + inner + '<span class="period">' + esc(p.year) + "</span></li>";
      }).join("") + "</ul></section>";
    }
    html += "</div>";

    html += '<aside class="resume-side">';
    html += '<section class="r-sec reveal"><h2>Education</h2>' + (R.education || []).map(function (e) {
      return '<div class="edu"><h3>' + esc(e.degree) + "</h3><p>" + esc(e.school) + '</p><span class="period">' + esc(e.period) + "</span><p class=\"note\">" + esc(e.note || "") + "</p></div>";
    }).join("") + "</section>";
    html += '<section class="r-sec reveal"><h2>Skills</h2>' + (R.skills || []).map(function (s) {
      return '<div class="skill-group"><h4>' + esc(s.group) + '</h4><div class="chips">' + s.items.map(function (i) { return '<span class="chip">' + esc(i) + "</span>"; }).join("") + "</div></div>";
    }).join("") + "</section>";
    html += '<section class="r-sec reveal"><h2>Certificates</h2><ul class="plain">' + (R.certifications || []).map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul></section>";
    html += '<section class="r-sec reveal"><h2>Languages</h2><ul class="plain lang">' + (R.languages || []).map(function (l) { return "<li><span>" + esc(l.name) + "</span><em>" + esc(l.level) + "</em></li>"; }).join("") + "</ul></section>";
    html += "</aside></div></div>";

    return {
      html: html, title: "Resume | " + C.site.name,
      after: function () { var b = document.getElementById("print-btn"); if (b) b.addEventListener("click", function () { window.print(); }); },
    };
  }

  function viewPortfolio() {
    var Pf = C.portfolio || {};
    var cats = [];
    (C.projects || []).forEach(function (p) { if (p.category && cats.indexOf(p.category) < 0) cats.push(p.category); });
    var html = '<div class="container page"><header class="page-head reveal"><span class="kicker">' + esc((Pf.title || "Portfolio").toUpperCase()) + "</span><h1>" + esc(Pf.title || "Portfolio") + "</h1><p>" + esc(Pf.intro || "") + "</p>" +
      (Pf.summaryPdf ? '<a class="btn btn-ghost" href="' + esc(Pf.summaryPdf) + '" target="_blank" rel="noopener">' + icon("download", 18) + " " + esc(Pf.summaryPdfLabel || "Summary PDF") + "</a>" : "") + "</header>" +
      '<div class="chips filters reveal"><button class="chip chip-btn active" data-f="">All</button>' + cats.map(function (c) { return '<button class="chip chip-btn" data-f="' + esc(c) + '">' + esc(c) + "</button>"; }).join("") + "</div>" +
      '<div class="grid-cards" id="proj-grid">' + (C.projects || []).map(projectCard).join("") + "</div></div>";
    return {
      html: html, title: (Pf.title || "Portfolio") + " | " + C.site.name,
      after: function () {
        var chips = document.querySelectorAll(".filters .chip-btn");
        chips.forEach(function (ch) {
          ch.addEventListener("click", function () {
            chips.forEach(function (x) { x.classList.remove("active"); }); ch.classList.add("active");
            var f = ch.getAttribute("data-f");
            var list = (C.projects || []).filter(function (p) { return !f || p.category === f; });
            var g = document.getElementById("proj-grid"); g.innerHTML = list.map(projectCard).join(""); g.querySelectorAll(".reveal").forEach(function (e) { e.classList.add("in"); });
          });
        });
      },
    };
  }

  function notice(msg) { return '<div class="container page"><div class="notice">' + msg + "</div></div>"; }

  function contentError(err, path) {
    if (location.protocol === "file:") {
      return notice("<strong>Open the site through a web server.</strong> Browsers block reading <code>.md</code> files from <code>file://</code>. Run <code>python -m http.server</code> in this folder and open <code>http://localhost:8000</code>, or publish with GitHub Pages.");
    }
    return notice("Could not load <code>" + esc(path) + "</code> (" + esc(String(err.message || err)) + "). Check that the file exists and that the <code>slug</code> in <code>config.js</code> matches the folder name.");
  }

  function loadMd(path) {
    if (location.protocol === "file:") return Promise.reject(new Error("file protocol"));
    return fetch(path, { cache: "no-cache" }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.text(); });
  }

  function neighbours(list, slug) {
    var i = list.map(function (x) { return x.slug; }).indexOf(slug);
    return { prev: i > 0 ? list[i - 1] : null, next: i >= 0 && i < list.length - 1 ? list[i + 1] : null };
  }

  function viewProject(slug) {
    var p = projectBySlug(slug);
    if (!p) return Promise.resolve({ html: notice("Project not found: <code>" + esc(slug) + '</code>. <a href="#/portfolio">Back to portfolio</a>'), title: "Not found" });
    var path = projUrl(p, "index.md");
    return loadMd(path).then(function (md) {
      var body = window.MD.render(md, "content/projects/" + p.slug + "/");
      var nb = neighbours(C.projects, slug);
      var html = '<div class="container page narrow"><nav class="crumbs reveal"><a href="#/portfolio">PORTFOLIO</a><span>&gt;</span><b>' + esc(p.title.toUpperCase()) + "</b></nav>" +
        '<header class="doc-head reveal"><h1>' + esc(p.title) + '</h1><p class="meta">' + esc(p.category || "") + (p.year ? " &middot; " + esc(p.year) : "") + "</p>" +
        '<div class="chips">' + (p.tags || []).map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div>" +
        ((p.links || []).length ? '<div class="doc-links">' + p.links.map(function (l) { return '<a class="btn btn-ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " " + icon("ext", 16) + "</a>"; }).join("") + "</div>" : "") + "</header>" +
        '<article class="prose reveal">' + body + "</article>" + pager(nb, "portfolio") + "</div>";
      return { html: html, title: p.title + " | " + C.site.name, prose: true };
    }).catch(function (err) { return { html: contentError(err, path), title: "Error" }; });
  }

  function pager(nb, section) {
    return '<nav class="pager"><span>' + (nb.prev ? '<a href="#/' + section + "/" + esc(nb.prev.slug) + '">&larr; ' + esc(nb.prev.title) + "</a>" : "") + "</span><span>" + (nb.next ? '<a href="#/' + section + "/" + esc(nb.next.slug) + '">' + esc(nb.next.title) + " &rarr;</a>" : "") + "</span></nav>";
  }

  function viewBlog() {
    var B = C.blog || {};
    var posts = sortedPosts();
    var tags = [];
    posts.forEach(function (p) { if (p.tag && tags.indexOf(p.tag) < 0) tags.push(p.tag); });
    var html = '<div class="container page"><header class="page-head reveal"><span class="kicker">BLOG</span><h1>' + esc(B.title || "Blog") + "</h1><p>" + esc(B.intro || "") + "</p></header>" +
      '<div class="chips filters reveal"><button class="chip chip-btn active" data-f="">All</button>' + tags.map(function (t) { return '<button class="chip chip-btn" data-f="' + esc(t) + '">' + esc(t) + "</button>"; }).join("") + "</div>" +
      '<div class="post-list" id="post-list">' + posts.map(postCard).join("") + "</div></div>";
    return {
      html: html, title: (B.title || "Blog") + " | " + C.site.name,
      after: function () {
        var chips = document.querySelectorAll(".filters .chip-btn");
        chips.forEach(function (ch) {
          ch.addEventListener("click", function () {
            chips.forEach(function (x) { x.classList.remove("active"); }); ch.classList.add("active");
            var f = ch.getAttribute("data-f");
            var g = document.getElementById("post-list");
            g.innerHTML = posts.filter(function (p) { return !f || p.tag === f; }).map(postCard).join("");
            g.querySelectorAll(".reveal").forEach(function (e) { e.classList.add("in"); });
          });
        });
      },
    };
  }

  function viewPost(slug) {
    var p = postBySlug(slug);
    if (!p) return Promise.resolve({ html: notice("Post not found: <code>" + esc(slug) + '</code>. <a href="#/blog">Back to blog</a>'), title: "Not found" });
    var path = postUrl(p, "index.md");
    return loadMd(path).then(function (md) {
      var body = window.MD.render(md, "content/blog/" + p.slug + "/");
      var mins = Math.max(1, Math.round(md.split(/\s+/).length / 200));
      var nb = neighbours(sortedPosts(), slug);
      var html = '<div class="container page narrow"><nav class="crumbs reveal"><a href="#/blog">BLOG</a><span>&gt;</span><b>' + esc(p.title.toUpperCase().slice(0, 48)) + "</b></nav>" +
        (p.cover ? '<div class="post-hero reveal"><img src="' + esc(postUrl(p, p.cover)) + '" alt=""></div>' : "") +
        '<header class="doc-head reveal"><span class="chip chip-accent">' + esc(p.tag || "") + "</span><h1>" + esc(p.title) + '</h1><p class="meta">' + fmtDate(p.date) + " &middot; " + mins + " min read</p></header>" +
        '<article class="prose reveal">' + body + "</article>" + pager(nb, "blog") + "</div>";
      return { html: html, title: p.title + " | " + C.site.name, prose: true };
    }).catch(function (err) { return { html: contentError(err, path), title: "Error" }; });
  }

  /* ----------------------------------------------------------- KaTeX */
  var katexP = null;
  function loadKatex() {
    if (katexP) return katexP;
    katexP = new Promise(function (res, rej) {
      var base = "assets/vendor/katex/";
      var l = document.createElement("link"); l.rel = "stylesheet"; l.href = base + "katex.min.css"; document.head.appendChild(l);
      var s1 = document.createElement("script"); s1.src = base + "katex.min.js";
      s1.onload = function () { var s2 = document.createElement("script"); s2.src = base + "contrib/auto-render.min.js"; s2.onload = res; s2.onerror = rej; document.head.appendChild(s2); };
      s1.onerror = rej; document.head.appendChild(s1);
    });
    return katexP;
  }
  function typeset(el) {
    if (!el.querySelector(".math")) return;
    loadKatex().then(function () {
      window.renderMathInElement(el, { delimiters: [{ left: "$$", right: "$$", display: true }, { left: "$", right: "$", display: false }], throwOnError: false });
    }).catch(function () {});
  }

  /* ---------------------------------------------------------- router */
  var io = null;
  function reveal() {
    var els = app.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    if (io) io.disconnect();
    io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.05 });
    els.forEach(function (e) { io.observe(e); });
  }

  function setActiveNav(section) {
    document.querySelectorAll(".nav-links a").forEach(function (a) { a.classList.toggle("active", a.getAttribute("data-s") === section); });
  }

  var token = 0;
  function route() {
    var my = ++token;
    var parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
    var section = parts[0] || "";
    var result;
    if (flow) { flow.destroy(); flow = null; }
    if (rotTimer) { clearInterval(rotTimer); rotTimer = null; }

    if (!section) result = viewHome();
    else if (section === "resume") result = viewResume();
    else if (section === "portfolio") result = parts[1] ? viewProject(parts[1]) : viewPortfolio();
    else if (section === "blog") result = parts[1] ? viewPost(parts[1]) : viewBlog();
    else result = { html: notice('Page not found. <a href="#/">Go home</a>'), title: "Not found" };

    Promise.resolve(result).then(function (r) {
      if (my !== token) return;
      app.innerHTML = r.html;
      document.title = r.title || C.site.title;
      setActiveNav(section);
      window.scrollTo(0, 0);
      app.classList.remove("view-in"); void app.offsetWidth; app.classList.add("view-in");
      if (r.after) r.after();
      reveal();
      typeset(app);
    });
  }

  /* ------------------------------------------------------------ init */
  function init() {
    initTheme();
    var meta = document.querySelector('meta[name="description"]');
    if (meta && C.site) meta.setAttribute("content", C.site.description || "");
    document.getElementById("brand-name").textContent = (C.site && C.site.name) || "";
    document.getElementById("foot").innerHTML = "&copy; " + new Date().getFullYear() + " " + esc((C.profile && C.profile.fullName) || "") + ((C.site && C.site.footer) ? " &middot; " + esc(C.site.footer) : "");
    window.addEventListener("hashchange", route);
    route();
  }
  init();
})();
