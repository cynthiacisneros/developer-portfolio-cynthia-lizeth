(function () {
  "use strict";

  var SECTION_IDS = ["home", "about", "skills", "projects", "contact"];

  function initLegacyMultiPageNav() {
    var navItems = document.querySelectorAll(".nav-menu .nav-item");
    if (!navItems.length) return;

    var page = window.location.pathname.split("/").pop() || "index.html";
    var hrefs = [
      "index.html",
      "about.html",
      "skills.html",
      "projects.html",
      "creativeinterests.html",
      "contact.html",
    ];
    var idx = Math.max(0, hrefs.indexOf(page));
    navItems.forEach(function (link, i) {
      link.classList.toggle("active", i === idx);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var body = document.body;
    if (!body.classList.contains("page-single")) {
      initLegacyMultiPageNav();
      return;
    }

    var header = document.querySelector(".site-header--single");
    var nav = document.querySelector(".nav-menu");
    var homeEl = document.getElementById("home");
    if (!header || !nav || !homeEl) return;

    var links = nav.querySelectorAll('a[href^="#"]');
    var observer = null;

    function getHeaderHeight() {
      return Math.round(header.getBoundingClientRect().height);
    }

    function setActive(id) {
      links.forEach(function (link) {
        var href = link.getAttribute("href");
        link.classList.toggle("active", href === "#" + id);
      });
    }

    function updatePastHero() {
      body.classList.toggle("past-hero", window.scrollY > homeEl.offsetHeight - 80);
    }

    function onIntersect(entries) {
      var bestId = null;
      var bestRatio = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.intersectionRatio >= bestRatio) {
          bestRatio = entry.intersectionRatio;
          bestId = entry.target.id;
        }
      });
      if (bestId) setActive(bestId);
    }

    function buildObserver() {
      if (observer) observer.disconnect();
      var h = getHeaderHeight();
      observer = new IntersectionObserver(onIntersect, {
        root: null,
        rootMargin: "-" + h + "px 0px -38% 0px",
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 1],
      });
      SECTION_IDS.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }

    buildObserver();
    window.addEventListener(
      "resize",
      function () {
        buildObserver();
      },
      { passive: true }
    );

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href");
        if (!href || href.charAt(0) !== "#") return;
        var id = href.slice(1);
        var target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (history.replaceState) {
          history.replaceState(null, "", href);
        }
        setActive(id);
      });
    });

    window.addEventListener(
      "scroll",
      function () {
        updatePastHero();
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 32) {
          setActive("contact");
        }
      },
      { passive: true }
    );

    updatePastHero();

    var hash = window.location.hash.replace(/^#/, "");
    if (hash && SECTION_IDS.indexOf(hash) !== -1) {
      requestAnimationFrame(function () {
        var el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActive(hash);
      });
    } else {
      setActive("home");
    }
  });
})();
