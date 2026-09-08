(function () {
  const header = document.querySelector(".header");
  const menuBtn = document.querySelector("[data-menu]");
  const nav = document.querySelector(".nav");
  if (!header || !menuBtn || !nav) return;

  function setOpen(open) {
    header.classList.toggle("is-open", open);
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }

  menuBtn.addEventListener("click", () => {
    setOpen(!header.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    const item = event.target.closest("a, button");
    if (!item) return;
    if (item.tagName === "A" && item.href) {
      const next = new URL(item.href, location.href);
      if (next.pathname !== location.pathname || next.search !== location.search) return;
    }
    setOpen(false);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1101px)").matches) setOpen(false);
  });
})();
