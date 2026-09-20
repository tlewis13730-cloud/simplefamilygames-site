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
  const gameSearch = document.querySelector("[data-game-search]");
  const noResults = document.querySelector("[data-no-results]");
  let activeFilter = "all";

  const activeFilterLabel = () => {
    const button = filterButtons.find(
      (candidate) => candidate.dataset.filter === activeFilter,
    );
    return button?.textContent.replace(/\d+/g, "").trim() || "All";
  };

  const applyGameFilters = () => {
    const query = (gameSearch?.value || "").trim().toLocaleLowerCase();
    let visibleCount = 0;

    gameCards.forEach((card) => {
      const categories = (card.dataset.categories || "").split(" ");
      const matchesCategory =
        activeFilter === "all" || categories.includes(activeFilter);
      const matchesQuery =
        !query || card.textContent.toLocaleLowerCase().includes(query);
      const visible = matchesCategory && matchesQuery;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    if (noResults) noResults.hidden = visibleCount !== 0;

    if (filterStatus) {
      const noun = visibleCount === 1 ? "game" : "games";
      const category = activeFilterLabel();
      if (query) {
        const categoryPrefix = activeFilter === "all" ? "" : `${category} `;
        filterStatus.textContent = `Showing ${visibleCount} ${categoryPrefix}${noun} matching “${gameSearch.value.trim()}”`;
      } else {
        filterStatus.textContent =
          activeFilter === "all"
            ? `Showing all ${visibleCount} games`
            : `Showing ${visibleCount} ${category} ${noun}`;
      }
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter || "all";

      filterButtons.forEach((candidate) => {
        const active = candidate === button;
        candidate.classList.toggle("active", active);
        candidate.setAttribute("aria-pressed", String(active));
      });

      applyGameFilters();
    });
  });

  gameSearch?.addEventListener("input", applyGameFilters);

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
