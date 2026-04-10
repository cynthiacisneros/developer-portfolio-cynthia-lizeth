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

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        navItems.forEach((link) => link.classList.remove("active"));
        item.classList.add("active");
    });
});

document.addEventListener("DOMContentLoaded", syncNavActive);
