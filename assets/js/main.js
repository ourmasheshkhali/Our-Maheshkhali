/* =========================================================
   OUR MAHESHKHALI — MAIN.JS
   Cinematic Loading + Complete Website
========================================================= */

/* =========================================================
   1. CINEMATIC LOADING SCREEN — SCENE MANAGEMENT
========================================================= */

const scenes = [
  { id: "sceneQuran",     duration: 6000 },  /* Quranic Intro — 6s */
  { id: "sceneBD",        duration: 4000 },  /* Bangladesh Map — 4s */
  { id: "sceneDhkCtg",    duration: 4500 },  /* Dhaka → Chattogram — 4.5s */
  { id: "sceneCtgCox",    duration: 4500 },  /* Chattogram → Cox's Bazar — 4.5s */
  { id: "sceneOcean",     duration: 4000 },  /* Bay of Bengal — 4s */
  { id: "sceneMhk",       duration: 4000 },  /* Maheshkhali Island — 4s */
  { id: "sceneMap3d",     duration: 6000 },  /* 3D Map + 8 Unions — 6s */
  { id: "sceneFinal",     duration: 4000 }   /* Final Welcome — 4s */
];

const loader = document.getElementById("loader");
const flFill = document.getElementById("flFill");
const flPercent = document.getElementById("flPercent");

let currentScene = 0;
let sceneTimer = null;
let progress = 0;

/* Progress Bar Animate */
function animateProgress(startVal, endVal, duration) {
  const startTime = performance.now();
  const start = startVal;
  const diff = endVal - start;

  function step(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = t < 0.5
      ? 2 * t * t
      : 1 - Math.pow(-2 * t + 2, 2) / 2;

    progress = start + diff * eased;

    if (flFill) flFill.style.width = progress + "%";
    if (flPercent) flPercent.textContent = Math.floor(progress) + "%";

    if (t < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

/* Show a Scene */
function showScene(index) {
  document.querySelectorAll(".scene").forEach(s => s.classList.remove("active"));

  const scene = scenes[index];
  if (!scene) return;

  const el = document.getElementById(scene.id);
  if (el) el.classList.add("active");

  /* Progress calculation */
  const totalDuration = scenes.reduce((a, s) => a + s.duration, 0);
  const startProgress = (scenes.slice(0, index).reduce((a, s) => a + s.duration, 0) / totalDuration) * 100;
  const endProgress = ((scenes.slice(0, index + 1).reduce((a, s) => a + s.duration, 0)) / totalDuration) * 100;

  animateProgress(startProgress, endProgress, scene.duration);
}

/* Next Scene */
function nextScene() {
  currentScene++;
  if (currentScene >= scenes.length) {
    finishLoading();
    return;
  }
  showScene(currentScene);

  sceneTimer = setTimeout(nextScene, scenes[currentScene].duration);
}

/* Finish Loading */
function finishLoading() {
  if (flFill) flFill.style.width = "100%";
  if (flPercent) flPercent.textContent = "100%";

  setTimeout(() => {
    if (loader) loader.classList.add("hide");
    document.body.style.overflow = "";
  }, 800);
}

/* Start Cinematic Journey */
if (loader) {
  document.body.style.overflow = "hidden";
  showScene(0);
  sceneTimer = setTimeout(nextScene, scenes[0].duration);
}

/* Skip on ESC */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && loader && !loader.classList.contains("hide")) {
    if (sceneTimer) clearTimeout(sceneTimer);
    finishLoading();
  }
});


/* =========================================================
   2. LIVE DATE + TIME
========================================================= */

function updateDateTime() {
  const now = new Date();

  const dateStr = now.toLocaleDateString("bn-BD", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const timeStr = now.toLocaleTimeString("bn-BD", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

  const dateEl = document.getElementById("liveDate");
  const timeEl = document.getElementById("liveTime");

  if (dateEl) dateEl.textContent = "📅 " + dateStr;
  if (timeEl) timeEl.textContent = "🕐 " + timeStr;
}
updateDateTime();
setInterval(updateDateTime, 1000);


/* =========================================================
   3. YEAR AUTO
========================================================= */

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();


/* =========================================================
   4. TOAST NOTIFICATION
========================================================= */

const toastContainer = document.getElementById("toastContainer");

function showToast(message, type = "", duration = 3000) {
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  toastContainer.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 50);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, duration);
}
window.showToast = showToast;


/* =========================================================
   5. THEME TOGGLE
========================================================= */

const themeBtn = document.getElementById("themeBtn");

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    if (themeBtn) themeBtn.textContent = "☀️ Light";
  } else {
    document.body.classList.remove("dark");
    if (themeBtn) themeBtn.textContent = "🌙 Dark";
  }
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeBtn.textContent = isDark ? "☀️ Light" : "🌙 Dark";
    if (typeof showToast === "function") {
      showToast(isDark ? "🌙 Dark Mode চালু" : "☀️ Light Mode চালু");
    }
  });
}
loadTheme();


/* =========================================================
   6. LANGUAGE TOGGLE
========================================================= */

const langBtn = document.getElementById("langBtn");
let currentLang = localStorage.getItem("lang") || "bn";

const translations = {
  bn: {
    home: "🏠 হোম", about: "ℹ️ পরিচিতি", tourism: "🌴 পর্যটন",
    education: "🎓 শিক্ষা", health: "🏥 স্বাস্থ্য", business: "🏪 ব্যবসা",
    products: "🛍️ পণ্য", map: "🗺️ ম্যাপ", emergency: "🚨 জরুরি"
  },
  en: {
    home: "🏠 Home", about: "ℹ️ About", tourism: "🌴 Tourism",
    education: "🎓 Education", health: "🏥 Health", business: "🏪 Business",
    products: "🛍️ Products", map: "🗺️ Map", emergency: "🚨 Emergency"
  }
};

function updateLanguage() {
  const navLinks = document.querySelectorAll(".main-nav > .nav-link");
  const keys = ["home", "about", "tourism", "education", "health",
                "business", "products", "map", "emergency"];

  navLinks.forEach((link, index) => {
    if (keys[index] && translations[currentLang][keys[index]]) {
      link.textContent = translations[currentLang][keys[index]];
    }
  });

  if (langBtn) {
    langBtn.textContent = currentLang === "bn"
      ? "🌐 বাংলা | English"
      : "🌐 English | বাংলা";
  }
  document.documentElement.lang = currentLang;
}

if (langBtn) {
  langBtn.addEventListener("click", () => {
    currentLang = currentLang === "bn" ? "en" : "bn";
    localStorage.setItem("lang", currentLang);
    updateLanguage();
    if (typeof showToast === "function") {
      showToast(currentLang === "bn" ? "🇧🇩 ভাষা: বাংলা" : "🇬🇧 Language: English");
    }
  });
}
updateLanguage();


/* =========================================================
   7. SEARCH MODAL
========================================================= */

const searchModal = document.getElementById("searchModal");
const searchBackdrop = document.getElementById("searchBackdrop");
const searchClose = document.getElementById("searchClose");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResults = document.getElementById("searchResults");

const searchData = [
  { icon: "🏘️", name: "Dhalghata Union", link: "pages/about.html#dhalghata" },
  { icon: "🏘️", name: "Matarbari Union", link: "pages/about.html#matarbari" },
  { icon: "🏘️", name: "Kalarmarchhara Union", link: "pages/about.html#kalarmarchhara" },
  { icon: "🏘️", name: "Shaplapur Union", link: "pages/about.html#shaplapur" },
  { icon: "🏘️", name: "Hoanak Union", link: "pages/about.html#hoanak" },
  { icon: "🏘️", name: "Bara Maheshkhali Union", link: "pages/about.html#bara-maheshkhali" },
  { icon: "🏘️", name: "Kutubjom Union", link: "pages/about.html#kutubjom" },
  { icon: "🏘️", name: "Chhota Maheshkhali Union", link: "pages/about.html#chhota-maheshkhali" },
  { icon: "🛕", name: "Adinath Temple", link: "pages/tourism.html#adinath" },
  { icon: "⛰️", name: "Mainak Hill", link: "pages/tourism.html#mainak" },
  { icon: "🏝️", name: "Sonadia Island", link: "pages/tourism.html#sonadia" },
  { icon: "🏖️", name: "Charpata Beach", link: "pages/tourism.html#beaches" },
  { icon: "🏥", name: "Upazila Health Complex", link: "pages/health.html#hospital" },
  { icon: "🎓", name: "Maheshkhali College", link: "pages/education.html#college" },
  { icon: "🏪", name: "Business Directory", link: "pages/business.html" },
  { icon: "🛍️", name: "Local Products", link: "pages/local-products.html" },
  { icon: "🚨", name: "Emergency Contacts", link: "pages/emergency.html" },
  { icon: "🗺️", name: "Map & Locations", link: "pages/map.html" }
];

function openSearch() {
  if (!searchModal) return;
  searchModal.classList.add("open");
  searchModal.setAttribute("aria-hidden", "false");
  setTimeout(() => searchInput && searchInput.focus(), 100);
}

function closeSearch() {
  if (!searchModal) return;
  searchModal.classList.remove("open");
  searchModal.setAttribute("aria-hidden", "true");
  if (searchInput) searchInput.value = "";
  if (searchResults) searchResults.innerHTML = '<p class="search-hint">Type something to search...</p>';
}

if (searchBtn) searchBtn.addEventListener("click", openSearch);
if (searchClose) searchClose.addEventListener("click", closeSearch);
if (searchBackdrop) searchBackdrop.addEventListener("click", closeSearch);

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query.length === 0) {
      searchResults.innerHTML = '<p class="search-hint">Type something to search...</p>';
      return;
    }

    const matches = searchData.filter(item =>
      item.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = '<p class="search-hint">❌ No results found</p>';
      return;
    }

    searchResults.innerHTML = matches.map(item =>
      `<a class="search-result-item" href="${item.link}">${item.icon} ${item.name}</a>`
    ).join("");
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchModal?.classList.contains("open")) closeSearch();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openSearch();
  }
});


/* =========================================================
   8. EMERGENCY MODAL
========================================================= */

const emergencyModal = document.getElementById("emergencyModal");
const emergencyBackdrop = document.getElementById("emergencyBackdrop");
const emergencyClose = document.getElementById("emergencyClose");
const emergencyBtn = document.getElementById("emergencyBtn");

function openEmergency() {
  if (!emergencyModal) return;
  emergencyModal.classList.add("open");
  emergencyModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeEmergency() {
  if (!emergencyModal) return;
  emergencyModal.classList.remove("open");
  emergencyModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (emergencyBtn) emergencyBtn.addEventListener("click", openEmergency);
if (emergencyClose) emergencyClose.addEventListener("click", closeEmergency);
if (emergencyBackdrop) emergencyBackdrop.addEventListener("click", closeEmergency);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && emergencyModal?.classList.contains("open")) {
    closeEmergency();
  }
});


/* =========================================================
   9. MOBILE MENU
========================================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

function toggleMobileMenu() {
  if (!mobileNav) return;
  const isOpen = mobileNav.classList.toggle("open");
  mobileMenuBtn.classList.toggle("active", isOpen);
  mobileNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
}

function closeMobileMenu() {
  if (!mobileNav) return;
  mobileNav.classList.remove("open");
  mobileMenuBtn.classList.remove("active");
  mobileNav.setAttribute("aria-hidden", "true");
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });
}

document.addEventListener("click", (e) => {
  if (!mobileNav?.classList.contains("open")) return;
  if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
    closeMobileMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMobileMenu();
});

if (mobileNav) {
  mobileNav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
  });
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMobileMenu();
});


/* =========================================================
   10. SMOOTH SCROLL
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId === "#" || targetId.length < 2) return;

    const targetEl = document.querySelector(targetId);
    if (!targetEl) return;

    e.preventDefault();
    const headerHeight = 80;
    const targetPosition = targetEl.offsetTop - headerHeight;

    window.scrollTo({ top: targetPosition, behavior: "smooth" });
  });
});


/* =========================================================
   11. JSON DATA LOADING
========================================================= */

async function loadJSON(path) {
  try {
    const isPages = window.location.pathname.includes("/pages/");
    const fullPath = isPages ? "../" + path : path;
    const response = await fetch(fullPath);
    if (!response.ok) throw new Error("Failed to load " + fullPath);
    return await response.json();
  } catch (err) {
    console.error("❌ JSON Load Error:", path, err);
    return [];
  }
}


/* =========================================================
   12. RENDER FUNCTIONS
========================================================= */

async function renderUnions() {
  const grid = document.querySelector(".union-grid");
  if (!grid) return;
  const unions = await loadJSON("data/unions.json");
  if (unions.length === 0) return;

  grid.innerHTML = unions.map(u => `
    <a href="${u.link}" class="union-card">
      <span class="union-icon">${u.icon}</span>
      <h3>${u.name}</h3>
      <p class="union-bn">${u.nameBn} ইউনিয়ন</p>
      <p class="union-desc">${u.desc}</p>
      <span class="union-more">View Details →</span>
    </a>
  `).join("");
}

async function renderTourism() {
  const grid = document.querySelector("#tourism .card-grid");
  if (!grid) return;
  const items = await loadJSON("data/tourism.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(t => `
    <a href="${t.link}" class="card">
      <span class="card-icon">${t.icon}</span>
      <h3>${t.name}</h3>
      <p>${t.desc}</p>
      <span class="card-more">Explore →</span>
    </a>
  `).join("");
}

async function renderEducation() {
  const grid = document.querySelector("#education .card-grid");
  if (!grid) return;
  const items = await loadJSON("data/education.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(item => `
    <a href="${item.link}" class="card">
      <span class="card-icon">${item.icon}</span>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <span class="card-more">View →</span>
    </a>
  `).join("");
}

async function renderHealth() {
  const grid = document.querySelector("#health .card-grid");
  if (!grid) return;
  const items = await loadJSON("data/health.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(item => `
    <a href="${item.link}" class="card">
      <span class="card-icon">${item.icon}</span>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <span class="card-more">View →</span>
    </a>
  `).join("");
}

async function renderBusiness() {
  const grid = document.querySelector("#business .card-grid");
  if (!grid) return;
  const items = await loadJSON("data/business.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(item => `
    <a href="${item.link}" class="card">
      <span class="card-icon">${item.icon}</span>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <span class="card-more">View →</span>
    </a>
  `).join("");
}

async function renderProducts() {
  const grid = document.querySelector("#products .card-grid");
  if (!grid) return;
  const items = await loadJSON("data/products.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(item => `
    <a href="${item.link}" class="card">
      <span class="card-icon">${item.icon}</span>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <span class="card-more">View →</span>
    </a>
  `).join("");
}

async function renderGallery() {
  const grid = document.querySelector(".gallery-grid");
  if (!grid) return;
  const items = await loadJSON("data/gallery.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(item => `
    <div class="gallery-item">
      <div class="gallery-placeholder">${item.icon}</div>
      <p>${item.name}</p>
    </div>
  `).join("");
}

async function renderEmergency() {
  const grid = document.querySelector(".emergency-grid");
  if (!grid) return;
  const items = await loadJSON("data/emergency.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(e => `
    <div class="emergency-card">
      <span class="emergency-icon">${e.icon}</span>
      <h3>${e.name}</h3>
      <strong>${e.number}</strong>
      <p>${e.desc}</p>
    </div>
  `).join("");
}

async function renderNews() {
  const grid = document.querySelector(".news-grid");
  if (!grid) return;
  const items = await loadJSON("data/news.json");
  if (items.length === 0) return;

  grid.innerHTML = items.map(n => `
    <article class="news-card">
      <span class="news-category">${n.category}</span>
      <h3>${n.title}</h3>
      <p>${n.summary}</p>
      <div class="news-meta">
        <span>📅 ${n.date}</span>
        <span>${n.status}</span>
      </div>
    </article>
  `).join("");
}


/* =========================================================
   13. INIT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  renderUnions();
  renderTourism();
  renderEducation();
  renderHealth();
  renderBusiness();
  renderProducts();
  renderGallery();
  renderEmergency();
  renderNews();
});


/* =========================================================
   14. WELCOME TOAST
========================================================= */

window.addEventListener("load", () => {
  const totalSceneDuration = scenes.reduce((a, s) => a + s.duration, 0);
  setTimeout(() => {
    if (!sessionStorage.getItem("welcomeShown")) {
      showToast("🌴 Welcome to OUR MAHESHKHALI", "success", 4000);
      sessionStorage.setItem("welcomeShown", "true");
    }
  }, totalSceneDuration + 1500);
});


/* =========================================================
   15. LOG
========================================================= */

console.log("🌴 OUR MAHESHKHALI loaded");
console.log("👨‍💻 Developed by Badsha Solyman");
console.log("⚓ Merchant Mariner • Founder • Web Developer");