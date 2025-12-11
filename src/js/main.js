// * Mobile Menu

document.addEventListener("DOMContentLoaded", function () {
  const menu = document.querySelector("[data-menu]");
  const openBtn = document.querySelector("[data-menu-open]");

  if (!menu || !openBtn) return;

  const closeTriggers = menu.querySelectorAll("[data-menu-close]");
  const menuLinks = menu.querySelectorAll("[data-menu-link]");

  const openMenu = () => {
    menu.classList.add("mobile-menu--open");
    document.body.classList.add("no-scroll");
    openBtn.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
  };

  const closeMenu = () => {
    menu.classList.remove("mobile-menu--open");
    document.body.classList.remove("no-scroll");
    openBtn.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
  };

  openBtn.addEventListener("click", () => {
    const isOpen = menu.classList.contains("mobile-menu--open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeTriggers.forEach((btn) => {
    btn.addEventListener("click", closeMenu);
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMenu();
    }
  });
});
