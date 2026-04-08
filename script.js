(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.querySelector("[data-project-gallery]");
    if (!root) return;

    var filterButtons = root.querySelectorAll("[data-filter]");
    var cards = root.querySelectorAll(".project-card");
    var transitionMs = 340;

    function updateActiveButton(activeBtn) {
      filterButtons.forEach(function (btn) {
        var isActive = btn === activeBtn;
        btn.classList.toggle("filter-btn--active", isActive);
        btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    }

    function hideCard(card) {
      if (card.hasAttribute("hidden")) return;

      function finish() {
        card.setAttribute("hidden", "");
        card.classList.remove("project-card--hiding");
      }

      function onEnd(e) {
        if (e.propertyName !== "opacity") return;
        card.removeEventListener("transitionend", onEnd);
        finish();
      }

      card.classList.add("project-card--hiding");
      card.addEventListener("transitionend", onEnd);
      window.setTimeout(function () {
        card.removeEventListener("transitionend", onEnd);
        if (!card.hasAttribute("hidden")) finish();
      }, transitionMs + 80);
    }

    function showCard(card) {
      card.removeAttribute("hidden");
      card.classList.remove("project-card--hiding");
      card.classList.add("project-card--appear");
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () {
          card.classList.remove("project-card--appear");
        });
      });
    }

    function applyFilter(filter) {
      cards.forEach(function (card) {
        var cat = card.getAttribute("data-category");
        var match = filter === "all" || cat === filter;

        if (match) {
          if (card.hasAttribute("hidden")) {
            showCard(card);
          } else {
            card.classList.remove("project-card--hiding", "project-card--appear");
          }
        } else {
          hideCard(card);
        }
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var filter = btn.getAttribute("data-filter");
        if (!filter) return;
        updateActiveButton(btn);
        applyFilter(filter);
      });
    });

    var initial = root.querySelector(".filter-btn--active");
    if (initial) {
      updateActiveButton(initial);
      applyFilter(initial.getAttribute("data-filter") || "all");
    }
  });
})();
