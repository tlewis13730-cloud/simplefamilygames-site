(() => {
  const body = document.body;
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const paletteButtons = [...document.querySelectorAll("[data-set-theme]")];
  const themeMeta = document.querySelector('meta[name="theme-color"]');

  const readSavedTheme = () => {
    try {
      const saved = window.localStorage.getItem("sfg-theme");
      return saved === "candy" || saved === "neon" ? saved : "neon";
    } catch {
      return "neon";
    }
  };

  const saveTheme = (theme) => {
    try {
      window.localStorage.setItem("sfg-theme", theme);
    } catch {
      // The theme still works for this visit when storage is unavailable.
    }
  };

  const applyTheme = (theme, persist = true) => {
    const nextTheme = theme === "candy" ? "candy" : "neon";
    body.dataset.theme = nextTheme;

    if (themeToggle) {
      const targetName = nextTheme === "neon" ? "Candy Pop" : "Neon Energy";
      themeToggle.setAttribute("aria-label", `Switch to ${targetName} colors`);
      if (themeLabel) themeLabel.textContent = targetName;
    }

    paletteButtons.forEach((button) => {
      const selected = button.dataset.setTheme === nextTheme;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    if (themeMeta) {
      themeMeta.setAttribute("content", nextTheme === "neon" ? "#031426" : "#ffe4f7");
    }

    if (persist) saveTheme(nextTheme);
  };

  applyTheme(readSavedTheme(), false);

  themeToggle?.addEventListener("click", () => {
    applyTheme(body.dataset.theme === "neon" ? "candy" : "neon");
  });

  paletteButtons.forEach((button) => {
    button.addEventListener("click", () => applyTheme(button.dataset.setTheme));
  });

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const gameCards = [...document.querySelectorAll("[data-categories]")];
  const filterStatus = document.querySelector("[data-filter-status]");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      let visibleCount = 0;

      filterButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });

      gameCards.forEach((card) => {
        const categories = (card.dataset.categories || "").split(" ");
        const visible = filter === "all" || categories.includes(filter);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (filterStatus) {
        const label = button.textContent.replace(/\d+/g, "").trim();
        filterStatus.textContent =
          filter === "all"
            ? `Showing all ${visibleCount} games`
            : `Showing ${visibleCount} ${label} game${visibleCount === 1 ? "" : "s"}`;
      }
    });
  });

  const menuButton = document.querySelector("[data-menu-button]");
  const siteNav = document.querySelector("[data-site-nav]");

  const closeMenu = () => {
    body.classList.remove("nav-open");
    menuButton?.setAttribute("aria-expanded", "false");
  };

  menuButton?.addEventListener("click", () => {
    const open = body.classList.toggle("nav-open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  siteNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeMenu();
  });
})();
