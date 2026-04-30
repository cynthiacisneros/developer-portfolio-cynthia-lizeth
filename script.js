document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const sectionIds = ["home", "projects", "skills", "about", "inspires", "contact"];

  const supportsTilt =
    window.matchMedia &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
    !(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  if (supportsTilt) {
    document.querySelectorAll(".project-card[data-tilt]").forEach((card) => {
      const maxTilt = 6;

      function setTilt(e) {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const tiltY = (x - 0.5) * (maxTilt * 2);
        const tiltX = (0.5 - y) * (maxTilt * 2);

        card.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
        card.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
      }

      card.addEventListener("mouseenter", () => {
        card.classList.add("tilt-active");
      });

      card.addEventListener("mousemove", setTilt);

      card.addEventListener("mouseleave", () => {
        card.classList.remove("tilt-active");
        card.style.removeProperty("--tilt-x");
        card.style.removeProperty("--tilt-y");
      });
    });
  }

  function setActiveLink(id) {
    const page = (window.location.pathname.split("/").pop() || "").toLowerCase();
    const isProjectsPage = page === "projects.html";

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const hash = href.includes("#") ? href.slice(href.indexOf("#")) : "";
      const isHashMatch = hash === `#${id}`;
      const isProjectsMatch =
        id === "projects" && isProjectsPage && href.toLowerCase().endsWith("projects.html");

      const isMatch = isHashMatch || isProjectsMatch;
      link.classList.toggle("active", isMatch);

      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  setActiveLink("home");
  // Avoid per-scroll layout work (getBoundingClientRect on every section).
  // We'll use an IntersectionObserver instead to keep scrolling smooth.

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const id = href.slice(1);
      if (!sectionIds.includes(id)) return;

      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      if (history.replaceState) {
        history.replaceState(null, "", href);
      }

      setActiveLink(id);
    });
  });

  const hash = window.location.hash.replace(/^#/, "");
  if (hash && sectionIds.includes(hash) && document.getElementById(hash)) {
    requestAnimationFrame(() => {
      document.getElementById(hash).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setActiveLink(hash);
    });
  }

  function initActiveSectionObserver() {
    if (!("IntersectionObserver" in window)) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];

        if (visible?.target?.id) {
          setActiveLink(visible.target.id);
        }
      },
      {
        // Treat a section as "current" once its top is in the upper-middle viewport.
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  initActiveSectionObserver();
});