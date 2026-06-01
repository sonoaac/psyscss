const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const desktopLinks = document.querySelectorAll(".nav-tabs a[data-section]");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const sections = document.querySelectorAll("section[id]");

function closeMobileMenu() {
  menuBtn.classList.remove("active");
  mobileMenu.classList.remove("active");
  menuBtn.setAttribute("aria-expanded", "false");
}

function setActiveSection(sectionId) {
  desktopLinks.forEach((link) => {
    const isActive = link.dataset.section === sectionId;
    link.classList.toggle("active", isActive);
    link.toggleAttribute("aria-current", isActive);
  });
}

menuBtn.addEventListener("click", () => {
  const isOpen = menuBtn.classList.toggle("active");
  mobileMenu.classList.toggle("active", isOpen);
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

mobileLinks.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleSection) {
      setActiveSection(visibleSection.target.id);
    }
  },
  {
    rootMargin: "-35% 0px -45% 0px",
    threshold: [0.2, 0.4, 0.6],
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});
