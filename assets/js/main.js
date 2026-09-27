/* =========================================================
   OUR MAHESHKHALI — MAIN.JS
   Complete — Fixed
========================================================= */

/* =========================================================
   1. LOADING SCREEN
========================================================= */

const loadingMessages = [
  "Initializing Maheshkhali...",
  "Loading Digital Platform...",
  "Loading Information...",
  "Loading Community...",
  "Loading Services...",
  "Loading Tourism...",
  "Preparing Your Experience..."
];

const loader = document.getElementById("loader");
const loaderFill = document.getElementById("loaderFill");
const loaderPercent = document.getElementById("loaderPercent");
const loaderMsg = document.getElementById("loaderMsg");

let progress = 0;

if (loader) {
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 11;

    if (progress >= 100) {
      progress = 100;
      clearInterval(loadingInterval);

      loaderFill.style.width = "100%";
      loaderPercent.textContent = "100%";
      loaderMsg.textContent = "Welcome to OUR MAHESHKHALI 🌴";

      setTimeout(() => {
        loader.classList.add("hide");
      }, 1500);
      return;
    }

    loaderFill.style.width = progress + "%";
    loaderPercent.textContent = Math.floor(progress) + "%";

    const msgIndex = Math.min(
      Math.floor(progress / 15),
      loadingMessages.length - 1
    );
    loaderMsg.textContent = loadingMessages[msgIndex];
  }, 220);
}


/* =========================================================
   2. LIVE DATE + TIME
========================================================= */

function updateDateTime() {
  const now = new Date();

  const dateStr = now.toLocaleDateString("bn-BD", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const timeStr = now.toLocaleTimeString("bn-BD", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
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
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


/* =========================================================
   4. TOAST NOTIFICATION SYSTEM (সবার আগে define)
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
    home: "🏠 হোম",
    about: "ℹ️ পরিচিতি",
    tourism: "🌴 পর্যটন",
    education: "🎓 শিক্ষা",
    health: "🏥 স্বাস্থ্য",
    business: "🏪 ব্যবসা",
    products: "🛍️ পণ্য",
    map: "🗺️ ম্যাপ",
    emergency: "🚨 জরুরি"
  },
  en: {
    home: "🏠 Home",
    about: "ℹ️ About",
    tourism: "🌴 Tourism",
    education: "🎓 Education",
    health: "🏥 Health",
    business: "🏪 Business",
    products: "🛍️ Products",
    map: "🗺️ Map",
    emergency: "🚨 Emergency"
  }
};

function updateLanguage() {
  const navLinks = document.querySelectorAll(".nav-link");
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
      showToast(currentLang === "bn"
        ? "🇧🇩 ভাষা পরিবর্তন: বাংলা"
        : "🇬🇧 Language changed: English");
    }
  });
}

updateLanguage();


/* =========================================================
   7. SEARCH MODAL
========================================================= */

const searchModal    = document.getElementById("searchModal");
const searchBackdrop = document.getElementById("searchBackdrop");
const searchClose    = document.getElementById("searchClose");
const searchInput    = document.getElementById("searchInput");
const searchBtn      = document.getElementById("searchBtn");
const searchResults  = document.getElementById("searchResults");

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
  { icon: "🏖️", name: "Charpata Sea Beach", link: "pages/tourism.html#beaches" },
  { icon: "🏥", name: "Upazila Health Complex", link: "pages/health.html#hospital" },
  { icon: "🎓", name: "Maheshkhali College", link: "pages/education.html#college" },
  { icon: "🏪", name: "Local Business Directory", link: "pages/business.html" },
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
  if (searchResults) {
    searchResults.innerHTML =
      '<p class="search-hint">Type something to search...</p>';
  }
}

if (searchBtn) searchBtn.addEventListener("click", openSearch);
if (searchClose) searchClose.addEventListener("click", closeSearch);
if (searchBackdrop) searchBackdrop.addEventListener("click", closeSearch);

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (query.length === 0) {
      searchResults.innerHTML =
        '<p class="search-hint">Type something to search...</p>';
      return;
    }

    const matches = searchData.filter(item =>
      item.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.innerHTML =
        '<p class="search-hint">❌ No results found</p>';
      return;
    }

    searchResults.innerHTML = matches.map(item => `
      <a class="search-result-item" href="${item.link}">
        ${item.icon} ${item.name}
      </a>
    `).join("");
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && searchModal?.classList.contains("open")) {
    closeSearch();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openSearch();
  }
});


/* =========================================================
   8. EMERGENCY MODAL
========================================================= */

const emergencyModal    = document.getElementById("emergencyModal");
const emergencyBackdrop = document.getElementById("emergencyBackdrop");
const emergencyClose    = document.getElementById("emergencyClose");
const emergencyBtn      = document.getElementById("emergencyBtn");

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
   9. MOBILE MENU TOGGLE
========================================================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav     = document.getElementById("mobileNav");

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
   10. BACK TO TOP
========================================================= */

const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (!backToTopBtn) return;

  if (window.scrollY > 400) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
});

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


/* =========================================================
   11. SMOOTH SCROLL
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

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });
});


/* =========================================================
   12. JSON DATA LOADING SYSTEM (Fixed Path)
========================================================= */

async function loadJSON(path) {
  try {
    // pages/ ফোল্ডারে থাকলে ../ যোগ করুন
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
   13. RENDER FUNCTIONS
========================================================= */

// UNIONS
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

// TOURISM
async function renderTourism() {
  const grid = document.querySelector("#tourism .card-grid, #tourismGrid");
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

// EDUCATION
async function renderEducation() {
  const grid = document.querySelector("#education .card-grid, #educationGrid");
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

// HEALTH
async function renderHealth() {
  const grid = document.querySelector("#health .card-grid, #healthGrid");
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

// BUSINESS
async function renderBusiness() {
  const grid = document.querySelector("#business .card-grid, #businessGrid");
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

// PRODUCTS
async function renderProducts() {
  const grid = document.querySelector("#products .card-grid, #productsGrid");
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

// GALLERY
async function renderGallery() {
  const grid = document.querySelector(".gallery-grid, #galleryGrid");
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

// EMERGENCY
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

// NEWS
async function renderNews() {
  const grid = document.querySelector(".news-grid, #newsGrid");
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
   14. ALL RENDER ON DOM READY
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
   15. WELCOME TOAST
========================================================= */

window.addEventListener("load", () => {
  setTimeout(() => {
    if (!sessionStorage.getItem("welcomeShown")) {
      showToast("🌴 Welcome to OUR MAHESHKHALI", "success", 4000);
      sessionStorage.setItem("welcomeShown", "true");
    }
  }, 2500);
});


/* =========================================================
   END
========================================================= */

console.log("🌴 OUR MAHESHKHALI loaded");
console.log("👨‍💻 Developed by Badsha Solyman");
console.log("⚓ Merchant Mariner • Founder • Web Developer");