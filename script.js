const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const headerPrev = document.getElementById("headerPrev");
const headerNext = document.getElementById("headerNext");
const desktopLinks = document.querySelectorAll(".nav-tabs a[data-section]");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const sections = document.querySelectorAll("section[id]");
const scrollSections = Array.from(document.querySelectorAll("section[id], .cta-strip, .site-footer"));
const revealItems = document.querySelectorAll(
  ".landing, .intro, main > .section, .card, .stat-card, .image-placeholder, .contact-form, .faq-list details, .map-placeholder, .cta-strip, .site-footer"
);
const parallaxImages = document.querySelectorAll(
  ".landing-photo, .hero-photo, .image-placeholder"
);
const mobileMotionQuery = window.matchMedia("(max-width: 767px)");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollFrame = null;

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

function getNearestSectionIndex() {
  const viewportAnchor = window.scrollY + window.innerHeight * 0.38;
  let nearestIndex = 0;
  let nearestDistance = Infinity;

  scrollSections.forEach((section, index) => {
    const distance = Math.abs(section.offsetTop - viewportAnchor);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  return nearestIndex;
}

function slideToSection(direction) {
  const currentIndex = getNearestSectionIndex();
  const nextIndex = Math.max(0, Math.min(scrollSections.length - 1, currentIndex + direction));

  scrollSections[nextIndex].scrollIntoView({
    behavior: "smooth",
    block: "start",
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

headerPrev.addEventListener("click", () => {
  slideToSection(-1);
});

headerNext.addEventListener("click", () => {
  slideToSection(1);
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

revealItems.forEach((item) => {
  item.classList.add("reveal");
  item.style.setProperty("--scroll-direction", item.dataset.scrollDirection || 1);
});

function updateScrollZoom() {
  scrollFrame = null;

  if (reducedMotionQuery.matches) {
    revealItems.forEach((item) => {
      item.style.removeProperty("--scroll-scale-x");
      item.style.removeProperty("--scroll-scale-y");
      item.style.removeProperty("--scroll-x");
      item.style.removeProperty("--scroll-y");
      item.style.removeProperty("--scroll-opacity");
    });

    parallaxImages.forEach((item) => {
      item.style.removeProperty("--image-scale");
      item.style.removeProperty("--image-frame-scale");
      item.style.removeProperty("--image-parallax-x");
      item.style.removeProperty("--image-parallax-y");
      item.style.removeProperty("--image-lift");
      item.style.removeProperty("--image-tilt-x");
      item.style.removeProperty("--image-tilt-y");
    });
    return;
  }

  if (!mobileMotionQuery.matches) {
    revealItems.forEach((item) => {
      item.style.removeProperty("--scroll-scale-x");
      item.style.removeProperty("--scroll-scale-y");
      item.style.removeProperty("--scroll-x");
      item.style.removeProperty("--scroll-y");
      item.style.removeProperty("--scroll-opacity");
    });
    return;
  }

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  const viewportCenter = viewportHeight / 2;

  parallaxImages.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distanceFromCenter = (itemCenter - viewportCenter) / viewportHeight;
    const clamped = Math.max(-1, Math.min(1, distanceFromCenter));
    const depth = index % 2 === 0 ? 1 : -1;
    const closeness = 1 - Math.min(1, Math.abs(clamped));

    item.style.setProperty("--image-scale", (1.08 + closeness * 0.16).toFixed(3));
    item.style.setProperty("--image-frame-scale", (0.97 + closeness * 0.05).toFixed(3));
    item.style.setProperty("--image-parallax-x", `${(-clamped * 18 * depth).toFixed(1)}px`);
    item.style.setProperty("--image-parallax-y", `${(-clamped * 54).toFixed(1)}px`);
    item.style.setProperty("--image-lift", `${(-clamped * 10).toFixed(1)}px`);
    item.style.setProperty("--image-tilt-x", `${(clamped * 7 * depth).toFixed(2)}deg`);
    item.style.setProperty("--image-tilt-y", `${(-clamped * 5).toFixed(2)}deg`);
  });

  if (!mobileMotionQuery.matches) {
    return;
  }

  revealItems.forEach((item, index) => {
    const rect = item.getBoundingClientRect();
    const itemCenter = rect.top + rect.height / 2;
    const distance = Math.abs(itemCenter - viewportCenter);
    const range = viewportCenter + rect.height / 2;
    const progress = Math.max(0, Math.min(1, 1 - distance / range));
    const direction = index % 2 === 0 ? -1 : 1;
    const verticalDirection = itemCenter < viewportCenter ? -1 : 1;

    item.style.setProperty("--scroll-scale-x", (0.9 + progress * 0.13).toFixed(3));
    item.style.setProperty("--scroll-scale-y", (0.86 + progress * 0.18).toFixed(3));
    item.style.setProperty("--scroll-x", `${(1 - progress) * 18 * direction}px`);
    item.style.setProperty("--scroll-y", `${(1 - progress) * 28 * verticalDirection}px`);
    item.style.setProperty("--scroll-opacity", (0.24 + progress * 0.76).toFixed(3));
  });
}

function requestScrollZoomUpdate() {
  if (scrollFrame) {
    return;
  }

  scrollFrame = window.requestAnimationFrame(updateScrollZoom);
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        if (!isMobile) {
          revealObserver.unobserve(entry.target);
        }
      } else if (isMobile) {
        entry.target.classList.remove("is-visible");
      }
    });
  },
  {
    rootMargin: "-8% 0px -12% 0px",
    threshold: [0.12, 0.32],
  }
);

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

updateScrollZoom();
window.addEventListener("scroll", requestScrollZoomUpdate, { passive: true });
window.addEventListener("resize", requestScrollZoomUpdate);
mobileMotionQuery.addEventListener("change", updateScrollZoom);
reducedMotionQuery.addEventListener("change", updateScrollZoom);
