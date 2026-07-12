const AZA_SUPABASE_URL = "https://ulwhmtpduzxjbkqrqesd.supabase.co";
const AZA_SUPABASE_KEY = "sb_publishable_LLQAnzzF3WFr1Ln5iWPIlw_dtWb3QPH";
const AZA_MEDIA_BUCKET = "aza-media";

async function supabaseGet(path) {
  const response = await fetch(`${AZA_SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      apikey: AZA_SUPABASE_KEY,
      Authorization: `Bearer ${AZA_SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Erro ${response.status}`);
  }

  return response.json();
}

function mediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;

  return `${AZA_SUPABASE_URL}/storage/v1/object/public/${AZA_MEDIA_BUCKET}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

function normalizeWork(record, imagesByWork) {
  const images = (imagesByWork.get(record.id) || [])
    .slice()
    .sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  const cover = images.find((image) => image.is_cover) || images[0];

  return {
    id: record.id,
    code: record.code || "",
    title: record.title || "Obra sem título",
    status: record.status || "published",
    featured: Boolean(record.featured),
    category: record.category || "Obra",
    city: record.city || "",
    stage: record.stage || "",
    area: Number(record.area || 0),
    description: record.description || "",
    image: mediaUrl(cover?.image_url) || "assets/images/pexels-alef-morais-336305364-34277690.jpg",
    imageAlt: cover?.alt_text || record.title || "",
    images: images.map((image) => ({
      src: mediaUrl(image.image_url),
      alt: image.alt_text || record.title || "",
      caption: image.alt_text || record.description || record.title || "",
    })),
  };
}

async function loadPublishedWorks() {
  const [works, images] = await Promise.all([
    supabaseGet("works?status=eq.published&select=*&order=featured.desc,created_at.desc"),
    supabaseGet("works_images?select=*&order=sort_order.asc,created_at.asc"),
  ]);

  const publishedIds = new Set(works.map((work) => work.id));
  const imagesByWork = new Map();

  images
    .filter((image) => publishedIds.has(image.work_id))
    .forEach((image) => {
      const list = imagesByWork.get(image.work_id) || [];
      list.push(image);
      imagesByWork.set(image.work_id, list);
    });

  return works.map((work) => normalizeWork(work, imagesByWork));
}

window.AZA_DATA = {
  loadPublishedWorks,
  mediaUrl,
};
