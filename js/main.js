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

const galleries = {
  residencial: {
    title: "Obras residenciais",
    images: [
      {
        src: "assets/images/pexels-alef-morais-336305364-34277690.jpg",
        alt: "Residencia contemporanea com fachada em madeira, vidro e pedra",
        caption: "Residencia contemporanea com materiais naturais e fachada marcante.",
      },
      {
        src: "assets/images/pexels-alaritammsalu-27390096.jpg",
        alt: "Detalhe de casa residencial com acabamento externo",
        caption: "Leitura de fachada, implantação e acabamento externo.",
      },
      {
        src: "assets/images/pexels-amar-35120035.jpg",
        alt: "Detalhe arquitetonico residencial",
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
        alt: "Canteiro de obras com estrutura em execucao",
        caption: "Controle das etapas e evolução física da obra.",
      },
      {
        src: "assets/images/pexels-d-goug-211350543-37175980.jpg",
        alt: "Casa em construção com andaimes",
        caption: "Fase externa com estrutura, fachada e acompanhamento técnico.",
      },
      {
        src: "assets/images/pexels-francesco-ungaro-15798784.jpg",
        alt: "Edificio em construcao com linhas urbanas",
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
