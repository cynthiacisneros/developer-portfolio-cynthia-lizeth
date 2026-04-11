document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const sectionIds = ["home", "about", "skills", "projects", "contact"];

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

  setActiveLink("home");

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visibleSections.length > 0) {
        setActiveLink(visibleSections[0].target.id);
      }
    },
    {
      threshold: [0.35, 0.5, 0.7],
      rootMargin: "-20% 0px -45% 0px",
    }
  );

  sections.forEach((section) => observer.observe(section));

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      const id = href.slice(1);
      if (sectionIds.indexOf(id) === -1) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (history.replaceState) {
        history.replaceState(null, "", href);
      }
      setActiveLink(id);
    });
  });

  const hash = window.location.hash.replace(/^#/, "");
  if (hash && sectionIds.indexOf(hash) !== -1 && document.getElementById(hash)) {
    requestAnimationFrame(() => {
      document.getElementById(hash).scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveLink(hash);
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40) {
        setActiveLink("contact");
      }
    },
    { passive: true }
  );
});
