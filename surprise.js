// Animaciones para la página de sorpresa - Optimizado para móviles

// Configuración del observador de intersección
const observerOptions = {
  threshold: 0.15, // Activar antes en móviles
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "0";
      entry.target.style.transform = "translateY(20px)";

      setTimeout(() => {
        entry.target.style.transition =
          "opacity 0.6s ease-out, transform 0.6s ease-out";
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }, 100);

      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Inicializar animaciones de scroll
function initSurpriseAnimations() {
  const surpriseScreen = document.getElementById("surprise-screen");

  if (!surpriseScreen.classList.contains("hidden")) {
    const elementsToAnimate = surpriseScreen.querySelectorAll(".fade-in");
    elementsToAnimate.forEach((el) => observer.observe(el));

    // Reinicializar iconos de Lucide
    lucide.createIcons();
  }
}

// Observar cambios en la pantalla de sorpresa
const surpriseScreenObserver = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "attributes" && mutation.attributeName === "class") {
      const surpriseScreen = document.getElementById("surprise-screen");
      if (!surpriseScreen.classList.contains("hidden")) {
        setTimeout(() => {
          initSurpriseAnimations();
        }, 500);
      }
    }
  });
});

// Inicializar cuando el DOM esté listo
window.addEventListener("DOMContentLoaded", () => {
  const surpriseScreen = document.getElementById("surprise-screen");
  if (surpriseScreen) {
    surpriseScreenObserver.observe(surpriseScreen, { attributes: true });
  }
});

// Efecto parallax suave (deshabilitado en móviles para mejor rendimiento)
let ticking = false;
const isMobile = window.innerWidth < 768;

function updateParallax() {
  if (isMobile) {
    ticking = false;
    return; // Desactivar parallax en móviles
  }

  const surpriseScreen = document.getElementById("surprise-screen");

  if (!surpriseScreen || surpriseScreen.classList.contains("hidden")) {
    ticking = false;
    return;
  }

  const scrolled = window.pageYOffset;
  const parallaxElements = surpriseScreen.querySelectorAll(".float");

  parallaxElements.forEach((el, index) => {
    const speed = 0.03 + index * 0.01;
    const yPos = -(scrolled * speed);
    el.style.transform = `translateY(${yPos}px)`;
  });

  ticking = false;
}

if (!isMobile) {
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });
}
