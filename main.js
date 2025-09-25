// Tab functionality
const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".tab-content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});

// Carousel functionality
class TechStackCarousel {
  constructor() {
    this.track = document.getElementById("carouselTrack");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");
    this.indicators = document.getElementById("indicators");
    this.cards = this.track.querySelectorAll(".techstack-card");

    this.currentIndex = 0;
    this.cardWidth = 300; // card width + gap
    this.visibleCards = 3;
    this.maxIndex = Math.max(0, this.cards.length - this.visibleCards);

    this.init();
  }

  init() {
    this.createIndicators();
    this.updateCarousel();
    this.bindEvents();
  }

  createIndicators() {
    const indicatorCount = Math.ceil(this.cards.length / this.visibleCards);
    this.indicators.innerHTML = "";

    for (let i = 0; i < indicatorCount; i++) {
      const indicator = document.createElement("div");
      indicator.className = "indicator";
      indicator.addEventListener("click", () =>
        this.goToSlide(i * this.visibleCards)
      );
      this.indicators.appendChild(indicator);
    }
  }

  bindEvents() {
    this.prevBtn.addEventListener("click", () => this.prevSlide());
    this.nextBtn.addEventListener("click", () => this.nextSlide());

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    this.track.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      isDragging = true;
      this.track.style.cursor = "grabbing";
    });

    this.track.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    this.track.addEventListener("mouseup", (e) => {
      if (!isDragging) return;
      isDragging = false;
      this.track.style.cursor = "grab";

      const deltaX = e.clientX - startX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          this.prevSlide();
        } else {
          this.nextSlide();
        }
      }
    });

    this.track.addEventListener("mouseleave", () => {
      isDragging = false;
      this.track.style.cursor = "grab";
    });
  }

  updateCarousel() {
    const translateX = -this.currentIndex * this.cardWidth;
    this.track.style.transform = `translateX(${translateX}px)`;

    // Update button states
    this.prevBtn.disabled = this.currentIndex === 0;
    this.nextBtn.disabled = this.currentIndex >= this.maxIndex;

    // Update indicators
    const indicators = this.indicators.querySelectorAll(".indicator");
    indicators.forEach((indicator, index) => {
      const isActive =
        Math.floor(this.currentIndex / this.visibleCards) === index;
      indicator.classList.toggle("active", isActive);
    });

    // Add animation to visible cards
    this.cards.forEach((card, index) => {
      const isVisible =
        index >= this.currentIndex &&
        index < this.currentIndex + this.visibleCards;
      card.style.opacity = isVisible ? "1" : "0.7";
      card.style.transform = isVisible ? "scale(1)" : "scale(0.9)";
    });
  }

  nextSlide() {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  prevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  goToSlide(index) {
    this.currentIndex = Math.min(Math.max(0, index), this.maxIndex);
    this.updateCarousel();
  }
}

// Initialize carousel when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new TechStackCarousel();

  // --- Handle deep-linking to a specific Portfolio tab via hash ---
  const activateTab = (name) => {
    if (!name) return;
    const valid = ["projects", "certificates", "techstack"];
    if (!valid.includes(name)) return;

    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    document.querySelector(`.tab[data-tab="${name}"]`)?.classList.add("active");
    document.getElementById(name)?.classList.add("active");

    // ensure portfolio is in view
    document
      .getElementById("portfolio")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleHash = () => {
    const h = window.location.hash || "";
    let tabName = null;

    // Support #portfolio/projects
    if (h.startsWith("#portfolio/")) {
      tabName = h.split("/")[1] || null;
    }
    // Also support #portfolio?tab=projects
    else if (h.includes("tab=")) {
      tabName = h.split("tab=")[1] || null;
    }

    if (tabName) activateTab(tabName);
  };

  // on initial load
  handleHash();

  // when clicking links that change the hash after load
  window.addEventListener("hashchange", handleHash);
});
