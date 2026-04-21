document.addEventListener("DOMContentLoaded", () => {
  const THEME_KEY = "portfolio-theme";

  function syncThemeToggleAria() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    const mode = document.documentElement.getAttribute("data-theme") || "light";
    toggle.setAttribute(
      "aria-label",
      mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
    );
  }

  if (!document.documentElement.getAttribute("data-theme")) {
    document.documentElement.setAttribute("data-theme", "light");
  }
  syncThemeToggleAria();

  document.getElementById("theme-toggle")?.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch (e) {
      /* ignore */
    }
    syncThemeToggleAria();
  });

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const sectionIds = ["home", "about", "gallery", "skills", "projects", "contact"];

  function setActiveLink(id) {
    navLinks.forEach((link) => {
      const isMatch = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isMatch);

      if (isMatch) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function getCurrentSection() {
    const checkpoint = window.innerHeight * 0.35;
    let currentId = "home";
    let smallestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const distance = Math.abs(rect.top - checkpoint);

      if (rect.top <= checkpoint && rect.bottom >= checkpoint && distance < smallestDistance) {
        smallestDistance = distance;
        currentId = section.id;
      }
    });

    return currentId;
  }

  function updateActiveOnScroll() {
    const currentSection = getCurrentSection();
    setActiveLink(currentSection);

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) {
      setActiveLink("contact");
    }
  }

  setActiveLink("home");
  updateActiveOnScroll();

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

  window.addEventListener("scroll", updateActiveOnScroll, { passive: true });
  window.addEventListener("resize", updateActiveOnScroll);

  const revealItems = document.querySelectorAll("#about .reveal");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      galleryItems.forEach((item) => {
        const category = item.dataset.category;

        if (filter === "all" || category === filter) {
          item.classList.remove("hide");
        } else {
          item.classList.add("hide");
        }
      });
    });
  });
});