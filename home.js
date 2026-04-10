const navItems = document.querySelectorAll(".nav-item");

function syncNavActive() {
    let page = window.location.pathname.split("/").pop();
    if (!page) {
        page = "index.html";
    }

    const hrefs = [
        "index.html",
        "about.html",
        "skills.html",
        "projects.html",
        "creativeinterests.html",
        "contact.html",
    ];

    const idx = Math.max(0, hrefs.indexOf(page));

    navItems.forEach((link, i) => {
        link.classList.toggle("active", i === idx);
    });
}

function bindNavClick() {
    navItems.forEach((item) => {
        item.addEventListener("click", () => {
            navItems.forEach((link) => link.classList.remove("active"));
            item.classList.add("active");
        });
    });
}

function initSinglePageNav() {
    const sectionIds = ["hero", "about", "skills", "projects", "contact"];

    function updatePastHero() {
        const hero = document.getElementById("hero");
        if (!hero) return;
        document.body.classList.toggle("past-hero", window.scrollY > hero.offsetHeight - 72);
    }

    function updateActiveFromScroll() {
        const headerOffset = 110;
        let activeIndex = 0;
        for (let i = sectionIds.length - 1; i >= 0; i--) {
            const el = document.getElementById(sectionIds[i]);
            if (!el) continue;
            if (el.getBoundingClientRect().top <= headerOffset) {
                activeIndex = i;
                break;
            }
        }
        navItems.forEach((link, i) => link.classList.toggle("active", i === activeIndex));
    }

    function onScroll() {
        updatePastHero();
        updateActiveFromScroll();
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    bindNavClick();

    const hash = window.location.hash.replace("#", "");
    if (hash && sectionIds.includes(hash)) {
        requestAnimationFrame(() => {
            const el = document.getElementById(hash);
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
            const idx = sectionIds.indexOf(hash);
            navItems.forEach((link, i) => link.classList.toggle("active", i === idx));
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.body.classList.contains("page-single")) {
        initSinglePageNav();
    } else {
        syncNavActive();
        bindNavClick();
    }
});
