if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

const revealItems = document.querySelectorAll(".reveal");
const whatsappButton = document.querySelector(".floating-whatsapp");
const heroCarousel = document.querySelector("[data-hero-carousel]");
let whatsappNotificationPlayed = false;
let whatsappAudioContext = null;

revealItems.forEach((item, index) => {
  const group = item.closest(".reveal-group");
  if (group) {
    const siblings = Array.from(group.querySelectorAll(".reveal"));
    const groupIndex = siblings.indexOf(item);
    item.style.setProperty("--reveal-delay", `${groupIndex * 90}ms`);
    return;
  }

  item.style.setProperty("--reveal-delay", `${Math.min(index * 35, 180)}ms`);
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -70px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (heroCarousel) {
  const heroVisual = heroCarousel.closest(".hero-visual");
  const heroSlides = Array.from(heroCarousel.querySelectorAll("[data-hero-slide]"));
  const previousButton = heroVisual?.querySelector("[data-hero-prev]");
  const nextButton = heroVisual?.querySelector("[data-hero-next]");
  let activeHeroSlide = heroSlides.findIndex((slide) => slide.classList.contains("is-active"));
  let heroCarouselTimer = null;

  if (activeHeroSlide < 0) activeHeroSlide = 0;

  function showHeroSlide(nextIndex) {
    if (heroSlides.length < 2) return;

    const currentSlide = heroSlides[activeHeroSlide];
    const nextSlide = heroSlides[(nextIndex + heroSlides.length) % heroSlides.length];
    if (!currentSlide || !nextSlide || currentSlide === nextSlide) return;

    currentSlide.classList.add("is-exiting");
    currentSlide.classList.remove("is-active");
    nextSlide.classList.add("is-active");
    window.setTimeout(() => currentSlide.classList.remove("is-exiting"), 760);
    activeHeroSlide = heroSlides.indexOf(nextSlide);
  }

  function restartHeroCarousel() {
    window.clearInterval(heroCarouselTimer);
    heroCarouselTimer = window.setInterval(() => showHeroSlide(activeHeroSlide + 1), 6200);
  }

  previousButton?.addEventListener("click", () => {
    showHeroSlide(activeHeroSlide - 1);
    restartHeroCarousel();
  });

  nextButton?.addEventListener("click", () => {
    showHeroSlide(activeHeroSlide + 1);
    restartHeroCarousel();
  });

  restartHeroCarousel();
}

function getWhatsappAudioContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;

  if (!whatsappAudioContext || whatsappAudioContext.state === "closed") {
    whatsappAudioContext = new AudioContext();
  }

  return whatsappAudioContext;
}

function playWhatsappNotification() {
  if (whatsappNotificationPlayed) return;

  const audioContext = getWhatsappAudioContext();
  if (!audioContext || audioContext.state === "suspended") return;

  whatsappNotificationPlayed = true;

  const now = audioContext.currentTime;
  const notes = [
    { frequency: 880, start: 0, duration: .08 },
    { frequency: 1175, start: .11, duration: .12 },
  ];

  notes.forEach((note) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(note.frequency, now + note.start);
    gain.gain.setValueAtTime(0, now + note.start);
    gain.gain.linearRampToValueAtTime(.055, now + note.start + .01);
    gain.gain.exponentialRampToValueAtTime(.001, now + note.start + note.duration);

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now + note.start);
    oscillator.stop(now + note.start + note.duration + .02);
  });

  window.setTimeout(() => audioContext.close(), 620);
}

function unlockWhatsappNotification() {
  const audioContext = getWhatsappAudioContext();
  if (!audioContext) return;

  audioContext.resume().then(() => {
    window.setTimeout(playWhatsappNotification, 3000);
  }).catch(() => {});
}

if (whatsappButton) {
  window.setTimeout(playWhatsappNotification, 3000);
  window.addEventListener("pointerdown", unlockWhatsappNotification, { once: true });
  window.addEventListener("keydown", unlockWhatsappNotification, { once: true });
}

let galleries = {
  residencial: {
    title: "Obras residênciais",
    images: [
      {
        src: "assets/images/pexels-alef-morais-336305364-34277690.jpg",
        alt: "Residência contemporânea com fachada em madeira, vidro e pedra",
        caption: "Residência contemporânea com materiais naturais e fachada marcante.",
      },
      {
        src: "assets/images/pexels-alaritammsalu-27390096.jpg",
        alt: "Detalhe de casa residencial com acabamento externo",
        caption: "Leitura de fachada, implantação e acabamento externo.",
      },
      {
        src: "assets/images/pexels-amar-35120035.jpg",
        alt: "Detalhe arquitetônico residencial",
        caption: "Composição arquitetônica e cuidado com volumetria.",
      },
      {
        src: "assets/images/pexels-artbovich-7598378.jpg",
        alt: "Ambiente residencial com acabamento contemporaneo",
        caption: "Ambientes finalizados com atenção à experiência de uso.",
      },
    ],
  },
  execucao: {
    title: "Execução em campo",
    images: [
      {
        src: "assets/images/pexels-construccion-total-2464540-12222682.jpg",
        alt: "Obra em alvenaria com equipe em execução",
        caption: "Alvenaria, estrutura e organização de materiais no canteiro.",
      },
      {
        src: "assets/images/pexels-construccion-total-2464540-32291649.jpg",
        alt: "Canteiro de obras com estrutura em execução",
        caption: "Controle das etapas e evolução física da obra.",
      },
      {
        src: "assets/images/pexels-d-goug-211350543-37175980.jpg",
        alt: "Casa em construção com andaimes",
        caption: "Fase externa com estrutura, fachada e acompanhamento técnico.",
      },
      {
        src: "assets/images/pexels-francesco-ungaro-15798784.jpg",
        alt: "Edifício em construção com linhas urbanas",
        caption: "Estruturas urbanas e obras de maior porte.",
      },
    ],
  },
  reformas: {
    title: "Reformas e ampliações",
    images: [
      {
        src: "assets/images/pexels-mikael-blomkvist-8961555.jpg",
        alt: "Equipe trabalhando em reforma residencial",
        caption: "Reforma residencial com equipe, materiais e etapas coordenadas.",
      },
      {
        src: "assets/images/pexels-mikael-blomkvist-8961557.jpg",
        alt: "Profissional analisando projeto em obra",
        caption: "Acompanhamento técnico e conferência de soluções.",
      },
      {
        src: "assets/images/pexels-tahaasamett-12527642.jpg",
        alt: "Detalhe de ambiente em obra",
        caption: "Intervenções planejadas para adaptar e valorizar o espaço.",
      },
      {
        src: "assets/images/pexels-francesco-ungaro-15798786.jpg",
        alt: "Arquitetura urbana com detalhes de fachada",
        caption: "Referências visuais para acabamentos e soluções de fachada.",
      },
    ],
  },
};

const modal = document.querySelector("#gallery-modal");
const modalTitle = document.querySelector("#gallery-title");
const modalImage = document.querySelector("#gallery-image");
const modalCaption = document.querySelector("#gallery-caption");
const thumbs = document.querySelector("#gallery-thumbs");
const galleryTriggers = document.querySelectorAll("[data-gallery]");
let activeGallery = null;
let activeIndex = 0;
let openGalleryByName = () => {};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function workSubtitle(work) {
  return [work.category, work.stage, work.city].filter(Boolean).join(" · ");
}

function renderFeaturedWork(work) {
  const container = document.querySelector("#featured-work");
  if (!container || !work) return;

  container.innerHTML = `
    <img src="${work.image}" alt="${escapeHtml(work.imageAlt)}">
    <div class="project-feature-copy">
      <p class="eyebrow">Destaque</p>
      <h3>${escapeHtml(work.title)}</h3>
      <p>${escapeHtml(work.description || workSubtitle(work) || "Obra acompanhada pela AZA Engenharia e Construção.")}</p>
    </div>
  `;
}

function renderWorksList(works) {
  const container = document.querySelector("#works-list");
  if (!container) return;

  if (!works.length) {
    container.innerHTML = '<div class="empty-state">Nenhuma obra publicada no momento.</div>';
    return;
  }

  container.innerHTML = works.map((work) => `
    <figure class="reveal work-item is-visible">
      <button class="work-trigger" type="button" data-gallery="${work.id}" aria-label="Abrir galeria de ${escapeHtml(work.title)}">
        <img src="${work.image}" alt="${escapeHtml(work.imageAlt)}">
        <figcaption>
          <strong>${escapeHtml(work.title)}</strong>
          <span>${escapeHtml(work.description || workSubtitle(work) || "Galeria da obra.")}</span>
        </figcaption>
      </button>
    </figure>
  `).join("");

  container.querySelectorAll("[data-gallery]").forEach((trigger) => {
    trigger.addEventListener("click", () => openGalleryByName(trigger.dataset.gallery));
  });
}

function renderWorksMosaic(works) {
  const container = document.querySelector("#works-mosaic");
  if (!container) return;

  const images = works.flatMap((work) => (
    work.images.length
      ? work.images.map((image) => ({ ...image, work }))
      : [{ src: work.image, alt: work.imageAlt, work }]
  )).slice(0, 4);

  if (!images.length) return;

  container.innerHTML = images.map((image, index) => `
    <img class="reveal is-visible${index === 0 ? " mosaic-tall" : ""}${index === 3 ? " mosaic-wide" : ""}" src="${image.src}" alt="${escapeHtml(image.alt || image.work.title)}">
  `).join("");
}

function updateWorksGalleries(works) {
  galleries = works.reduce((acc, work) => {
    const images = work.images.length
      ? work.images
      : [{ src: work.image, alt: work.imageAlt, caption: work.description || work.title }];

    acc[work.id] = {
      title: work.title,
      images: images.map((image) => ({
        src: image.src,
        alt: image.alt || work.title,
        caption: image.caption || work.description || workSubtitle(work) || work.title,
      })),
    };

    return acc;
  }, {});
}

async function initWorksFromSupabase() {
  const hasWorksPage = document.querySelector("#works-list");
  if (!hasWorksPage || !window.AZA_DATA?.loadPublishedWorks) return;

  try {
    const works = await window.AZA_DATA.loadPublishedWorks();
    const featured = works.find((work) => work.featured) || works[0];
    updateWorksGalleries(works);
    renderFeaturedWork(featured);
    renderWorksList(works);
    renderWorksMosaic(works);
  } catch (error) {
    const container = document.querySelector("#works-list");
    if (container) {
      container.innerHTML = `<div class="empty-state">Não foi possível carregar as obras agora. <small>${escapeHtml(error.message)}</small></div>`;
    }
  }
}

if (modal && modalTitle && modalImage && modalCaption && thumbs) {
function renderGalleryImage(index) {
  if (!activeGallery) return;

  activeIndex = (index + activeGallery.images.length) % activeGallery.images.length;
  const image = activeGallery.images[activeIndex];
  modalImage.src = image.src;
  modalImage.alt = image.alt;
  modalCaption.textContent = image.caption;

  thumbs.querySelectorAll(".gallery-thumb").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", buttonIndex === activeIndex);
  });
}

function openGallery(galleryName) {
  activeGallery = galleries[galleryName];
  if (!activeGallery) return;

  modalTitle.textContent = activeGallery.title;
  thumbs.innerHTML = "";

  activeGallery.images.forEach((image, index) => {
    const button = document.createElement("button");
    button.className = "gallery-thumb";
    button.type = "button";
    button.setAttribute("aria-label", `Abrir imagem ${index + 1}`);
    button.innerHTML = `<img src="${image.src}" alt="">`;
    button.addEventListener("click", () => renderGalleryImage(index));
    thumbs.appendChild(button);
  });

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  renderGalleryImage(0);
  modal.querySelector(".gallery-close").focus();
}

openGalleryByName = openGallery;

function closeGallery() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalImage.src = "";
}

galleryTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openGallery(trigger.dataset.gallery));
});

document.querySelectorAll("[data-gallery-close]").forEach((button) => {
  button.addEventListener("click", closeGallery);
});

document.querySelector("[data-gallery-prev]").addEventListener("click", () => {
  renderGalleryImage(activeIndex - 1);
});

document.querySelector("[data-gallery-next]").addEventListener("click", () => {
  renderGalleryImage(activeIndex + 1);
});

document.addEventListener("keydown", (event) => {
  if (!modal.classList.contains("is-open")) return;
  if (event.key === "Escape") closeGallery();
  if (event.key === "ArrowLeft") renderGalleryImage(activeIndex - 1);
  if (event.key === "ArrowRight") renderGalleryImage(activeIndex + 1);
});
}

initWorksFromSupabase();
window.setInterval(initWorksFromSupabase, 45000);
window.addEventListener("focus", initWorksFromSupabase);
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) initWorksFromSupabase();
});
