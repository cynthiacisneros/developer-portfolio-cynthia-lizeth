document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const sectionIds = ["home", "about", "skills", "projects", "inspires", "contact"];

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

  function initScrollReveals() {
    const sections = document.querySelectorAll("main section.scroll-reveal");
    if (!sections.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sections.forEach((el) => el.classList.add("scroll-reveal--visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal--visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -32px 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));
  }

  initScrollReveals();
});