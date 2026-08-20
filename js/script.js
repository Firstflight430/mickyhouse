const SHOP = {
  name: "Micky House",
  phone: "REPLACE_WITH_PHONE",
  whatsapp: "REPLACE_WITH_WHATSAPP",
  address: "Orderly Bazar, Varanasi, Uttar Pradesh",
  mapsUrl: "REPLACE_WITH_GOOGLE_MAPS_URL"
};

const PRODUCTS = [
  { name: "Arduino-compatible development board", cat: "Microcontrollers", desc: "Ideal for beginner robotics and electronics projects.", img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
  { name: "Jumper wires", cat: "Electronics", desc: "Useful for breadboards, prototyping and quick connections.", img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80" },
  { name: "DC motors", cat: "Motors", desc: "For wheels, moving models and small build projects.", img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80" },
  { name: "Servo motor", cat: "Motors", desc: "Useful for controlled movement in robotics builds.", img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" },
  { name: "LEDs", cat: "Electronics", desc: "Bright indicators for learning and decoration.", img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80" },
  { name: "Resistors", cat: "Electronics", desc: "Core components for safe and stable circuits.", img: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=80" },
  { name: "Breadboard", cat: "Electronics", desc: "Build circuits without soldering.", img: "https://images.unsplash.com/photo-1498079022511-d15614cb1b51?auto=format&fit=crop&w=1200&q=80" },
  { name: "Switches", cat: "Electronics", desc: "For simple on/off control in projects.", img: "https://images.unsplash.com/photo-1522243711169-3ccf8f5ae8f2?auto=format&fit=crop&w=1200&q=80" },
  { name: "Battery holders", cat: "Electronics", desc: "Convenient power source for projects.", img: "https://images.unsplash.com/photo-1518085250887-2f903c200fee?auto=format&fit=crop&w=1200&q=80" },
  { name: "Connecting wires", cat: "Electronics", desc: "Flexible wires for project assembly.", img: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1200&q=80" },
  { name: "School project materials", cat: "DIY", desc: "Boards, sticks, foam and more for models.", img: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80" },
  { name: "Chart paper", cat: "Stationery", desc: "Presentation sheets for school work.", img: "https://images.unsplash.com/photo-1515191107209-c28698631303?auto=format&fit=crop&w=1200&q=80" },
  { name: "Craft foam", cat: "Art & Craft", desc: "Soft sheets for decoration and model making.", img: "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&w=1200&q=80" },
  { name: "Decorative materials", cat: "Decoratives", desc: "Ribbons, trims, stickers and accents.", img: "https://images.unsplash.com/photo-1464972685798-37d2b7fcbf10?auto=format&fit=crop&w=1200&q=80" },
  { name: "Sketch pens", cat: "Stationery", desc: "Colorful pens for notes and art.", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80" },
  { name: "Art supplies", cat: "Art & Craft", desc: "Useful materials for drawing and creative work.", img: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80" },
  { name: "Model-making materials", cat: "DIY", desc: "Components for creative and educational models.", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80" }
];

const filters = ["All","Stationery","Art & Craft","Decoratives","DIY","Electronics","Microcontrollers","Motors","Robotics"];

const grid = document.getElementById("productGrid");
const search = document.getElementById("searchInput");
const filterWrap = document.getElementById("filters");
const toast = document.querySelector(".toast");
const toTop = document.querySelector(".to-top");
const nav = document.querySelector(".site-nav");

document.querySelectorAll(".menu-toggle").forEach(btn => {
  btn?.addEventListener("click", () => nav.classList.toggle("open"));
});

const showToast = (message) => {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
};

const whatsappUrl = (msg) => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(msg)}`;

function observeReveals() {
  const els = document.querySelectorAll(".reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(el => io.observe(el));
}

function bindWhatsAppButtons() {
  document.querySelectorAll(".ask-whatsapp,.ask-project,.ask-project-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const prod = btn.dataset.product || btn.textContent.trim();
      window.open(whatsappUrl(`Hi ${SHOP.name}, I’m interested in ${prod}. Is it available?`), "_blank");
      showToast("Opening WhatsApp…");
    });
  });
}

function renderProducts() {
  if (!grid) return;
  const q = (search?.value || "").toLowerCase();
  const active = document.querySelector(".filter-btn.active")?.dataset.cat || "All";

  grid.innerHTML = PRODUCTS.filter(p => {
    const matchesCat = active === "All" || p.cat === active;
    const matchesSearch = (p.name + p.desc + p.cat).toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  }).map(p => `
    <article class="product-card reveal">
      <img loading="lazy" alt="${p.name}" src="${p.img}">
      <div class="meta">
        <strong>${p.name}</strong>
        <span>${p.cat}</span>
      </div>
      <p>${p.desc}</p>
      <a class="btn btn-secondary ask-whatsapp" data-product="${p.name}" href="#">Ask on WhatsApp</a>
    </article>
  `).join("");

  observeReveals();
  bindWhatsAppButtons();
}

function buildFilters() {
  if (!filterWrap) return;
  filterWrap.innerHTML = filters.map((f, i) => `
    <button class="filter-btn ${i === 0 ? "active" : ""}" data-cat="${f}">${f}</button>
  `).join("");

  filterWrap.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    document.querySelectorAll(".filter-btn").forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    renderProducts();
  });
}

document.querySelectorAll(".contact-form").forEach(form => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const msg = `Hi ${SHOP.name},\nName: ${data.get("name")}\nPhone: ${data.get("phone")}\nNeed: ${data.get("subject")}\nMessage: ${data.get("message")}`;
    window.open(whatsappUrl(msg), "_blank");
    showToast("Opening WhatsApp enquiry…");
  });
});

window.addEventListener("scroll", () => {
  if (toTop) toTop.classList.toggle("show", window.scrollY > 500);
});

toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

search?.addEventListener("input", renderProducts);

buildFilters();
renderProducts();
bindWhatsAppButtons();
observeReveals();
