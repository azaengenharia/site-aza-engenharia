if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  window.scrollTo(0, 0);
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
    title: "Obra residencial",
    images: [
      {
        src: "assets/images/obra-residencial-placa.png",
        alt: "Obra residencial com placa da AZA Engenharia",
        caption: "Registro da obra residencial com placa de acompanhamento.",
      },
      {
        src: "https://images.pexels.com/photos/28885519/pexels-photo-28885519.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Casa residencial em reforma com andaimes",
        caption: "Casa em etapa de obra e reforma.",
      },
      {
        src: "https://images.pexels.com/photos/13366868/pexels-photo-13366868.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Casa em construção em área residencial",
        caption: "Estrutura residencial em andamento.",
      },
      {
        src: "https://images.pexels.com/photos/5317154/pexels-photo-5317154.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Ambiente residencial em reforma",
        caption: "Preparação interna para reforma.",
      },
      {
        src: "https://images.pexels.com/photos/6474477/pexels-photo-6474477.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Pintura de ambiente residencial",
        caption: "Acabamento e pintura de ambiente.",
      },
      {
        src: "https://images.pexels.com/photos/3616757/pexels-photo-3616757.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Materiais de reforma em um cômodo",
        caption: "Materiais organizados para etapa de acabamento.",
      },
    ],
  },
  terreno: {
    title: "Terreno e início de obra",
    images: [
      {
        src: "assets/images/terreno-obra-aza.png",
        alt: "Terreno com placa da AZA Engenharia",
        caption: "Terreno com identificação da obra.",
      },
      {
        src: "https://images.pexels.com/photos/5985391/pexels-photo-5985391.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Canteiro de obras urbano",
        caption: "Preparação e desenvolvimento de canteiro.",
      },
      {
        src: "https://images.pexels.com/photos/18411324/pexels-photo-18411324.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Construção vertical em andamento",
        caption: "Estrutura em execução.",
      },
      {
        src: "https://images.pexels.com/photos/6285154/pexels-photo-6285154.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Profissionais analisando planta de obra",
        caption: "Planejamento e conferência de projeto.",
      },
      {
        src: "https://images.pexels.com/photos/6285151/pexels-photo-6285151.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Profissional com capacete revisando plantas",
        caption: "Acompanhamento técnico das etapas.",
      },
      {
        src: "https://images.pexels.com/photos/3932298/pexels-photo-3932298.jpeg?auto=compress&cs=tinysrgb&w=1200&h=820&fit=crop",
        alt: "Capacete e plantas de obra sobre mesa",
        caption: "Documentação, planejamento e gestão da obra.",
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
