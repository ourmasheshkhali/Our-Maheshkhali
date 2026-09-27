/* ============================================================
   OUR MAHESHKHALI — COMPLETE MAIN JAVASCRIPT
   Author: Badsha Solyman
   Version: 6.0 — All-in-One
   Description: Loader, Theme, Language (i18n), Navigation,
                Search, Modals, Accessibility, Animations
============================================================ */

'use strict';

/* ============================================================
   1. UTILITY FUNCTIONS
============================================================ */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
const on = (el, ev, fn, opt = false) => el && el.addEventListener(ev, fn, opt);

function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function debounce(fn, wait = 200) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), wait);
  };
}

function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ============================================================
   2. TOAST NOTIFICATION (First — used by all others)
============================================================ */
function showToast(message, duration = 3000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const isDark = document.body.getAttribute('data-theme') === 'dark';

  const toast = document.createElement('div');
  toast.style.cssText = `
    padding: 14px 24px;
    background: ${isDark ? 'rgba(15, 20, 40, 0.98)' : 'rgba(255, 255, 255, 0.98)'};
    border: 1px solid rgba(212, 175, 55, 0.4);
    border-radius: 12px;
    color: ${isDark ? '#fff' : '#1a1a2e'};
    font-size: 0.85rem;
    font-family: 'Hind Siliguri', 'Inter', sans-serif;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.2);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    max-width: 300px;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    pointer-events: auto;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  const timeout = setTimeout(() => removeToast(toast), duration);

  on(toast, 'click', () => {
    clearTimeout(timeout);
    removeToast(toast);
  });
}

function removeToast(toast) {
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(20px)';
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, 400);
}

window.showToast = showToast;

/* ============================================================
   3. I18N — BILINGUAL SYSTEM (English ↔ বাংলা)
============================================================ */
const I18N = {
  STORAGE_KEY: 'omh-lang',
  DEFAULT: 'bn',
  current: 'bn',

  translations: {
    en: {
      search_placeholder: 'Search Maheshkhali...',
      login: 'Login',
      register: 'Register',
      profile: 'Profile',
      settings: 'Settings',
      nav_home: '🏠 Home',
      nav_about: 'ℹ️ About',
      nav_services: '🌴 Services',
      nav_information: '📊 Information',
      nav_news: '📰 News',
      nav_map: '🗺️ Map',
      nav_more: '⋯ More',
      nav_contact: '📞 Contact',
      sidebar_title: 'Quick Access',
      sidebar_home: '🏠 Home',
      sidebar_contents: '📑 Contents',
      sidebar_search: '🔍 Search',
      sidebar_favorites: '⭐ Favorites',
      sidebar_bookmarks: '🔖 Bookmarks',
      sidebar_recent: '🕘 Recently Viewed',
      sidebar_categories: '📂 Categories',
      sidebar_language: '🌐 Language',
      sidebar_settings: '⚙️ Settings',
      sidebar_help: '❓ Help',
      sidebar_contact: '📞 Contact',
      prev: 'Previous',
      next: 'Next',
      fab_top: 'Top',
      fab_bottom: 'Bottom',
      fab_search: 'Search',
      fab_language: 'Language',
      fab_menu: 'Menu',
      fab_share: 'Share',
      fab_favorite: 'Favorite',
      fab_bookmark: 'Bookmark',
      back_to_top: 'Back to Top',
      reading_progress: 'Reading Progress:',
      breadcrumb_home: 'Home',
      hero_eyebrow: '🌴 OUR MAHESHKHALI',
      hero_title_1: 'Maheshkhali —',
      hero_title_2: 'One Island, Many Stories.',
      hero_subtitle: 'An extraordinary island of nature, heritage, people and possibilities.',
      hero_desc: 'Explore the history, heritage, tourism, education, health, businesses, local products and community of Maheshkhali.',
      hero_btn_explore: 'Explore Maheshkhali',
      hero_btn_join: 'Join Community',
      hero_path_bd: '🇧🇩 Bangladesh',
      hero_path_cox: "📍 Cox's Bazar",
      hero_path_mhk: '🌴 Maheshkhali',
      unions_label: '🏘️ UNION DIRECTORY',
      unions_title: '8 Unions of Maheshkhali',
      unions_desc: 'Information about 8 unions of Maheshkhali Upazila.',
      about_label: '📖 ABOUT MAHESHKHALI',
      about_title: 'Discover Maheshkhali',
      about_desc: "Maheshkhali is an important island area of Cox's Bazar district.",
      about_est: 'Upazila Established',
      about_area: 'Area',
      about_unions: 'Unions',
      about_population: 'Population',
      about_read_more: 'Read Full Profile →',
      tourism_label: '🌴 TOURISM',
      tourism_title: 'Explore Maheshkhali',
      tourism_desc: 'Hills, sea, islands, temples, beaches and nature.',
      tourism_view_all: 'View All Tourism →',
      education_label: '🎓 EDUCATION',
      education_title: 'Education Directory',
      education_desc: 'Educational institutions and training centers.',
      health_label: '🏥 HEALTH',
      health_title: 'Health Services',
      health_desc: 'Health service related information.',
      business_label: '🏪 BUSINESS',
      business_title: 'Local Business Directory',
      business_desc: 'Local businesses and services.',
      products_label: '🛍️ LOCAL PRODUCTS',
      products_title: 'Products of Maheshkhali',
      products_desc: 'Traditional local products.',
      gallery_label: '📸 GALLERY',
      gallery_title: 'Maheshkhali in Pictures',
      gallery_desc: 'Photos of nature, history, people and culture.',
      gallery_view_all: 'Open Full Gallery →',
      news_label: '📰 NEWS',
      news_title: 'Latest Local Information',
      news_desc: 'Local news and information.',
      emergency_label: '🚨 EMERGENCY',
      emergency_title: 'Emergency Contacts',
      emergency_desc: 'Emergency numbers — verified information.',
      view_all: 'View All →',
      footer_tagline: 'One Island. One Community. One Platform.',
      footer_quick_links: '🔗 Quick Links',
      footer_emergency_info: '🚨 Emergency Information',
      footer_community: '👥 Community',
      footer_information: '📰 Information',
      footer_contact: '📞 Contact & Connect',
      footer_signature: "🌴 Our Maheshkhali — Everyone's Digital Platform",
      developed_by: 'Developed by',
      privacy: '🔒 Privacy Policy',
      terms: '📄 Terms & Conditions',
      disclaimer: '⚖️ Disclaimer',
      sitemap: '🗂️ Sitemap',
      help: '❓ Help',
      search_title: '🔎 Search Maheshkhali',
      search_hint: 'Type something to search...',
      emergency_subtitle: 'Bangladesh Emergency Numbers',
      notifications_title: '🔔 Notifications',
      notif_welcome: 'Welcome to OUR MAHESHKHALI',
      not_logged_in: 'Not logged in',
      a11y_title: '♿ Accessibility',
      a11y_increase_text: 'Increase Text Size',
      a11y_decrease_text: 'Decrease Text Size',
      a11y_reset_text: 'Reset Text Size',
      a11y_high_contrast: 'High Contrast',
      a11y_reduce_motion: 'Reduce Motion',
      a11y_dyslexia_font: 'Dyslexia Font',
      toast_lang_switched: 'Language switched to English',
      toast_dark_mode: 'Dark mode activated',
      toast_light_mode: 'Light mode activated',
      toast_welcome: 'Welcome to OUR MAHESHKHALI!',
      toast_copied: 'Copied to clipboard!',
      toast_shared: 'Shared successfully!',
      toast_favorite_added: 'Added to favorites!',
      toast_bookmark_added: 'Added to bookmarks!',
      toast_coming_soon: 'Coming soon!',
      about_maheshkhali: 'About Maheshkhali',
      history: 'History',
      geography: 'Geography',
      administration: 'Administration',
      tourism: 'Tourism',
      education: 'Education',
      health: 'Health',
      business: 'Business',
      products: 'Products',
      community: 'Community',
      emergency_numbers: 'Emergency Numbers',
      news: 'News',
      notices: 'Notices',
      events: 'Events',
      gallery: 'Gallery',
      members: 'Members',
      volunteer: 'Volunteer'
    },
    bn: {
      search_placeholder: 'মহেশখালী খুঁজুন...',
      login: 'লগইন',
      register: 'নিবন্ধন',
      profile: 'প্রোফাইল',
      settings: 'সেটিংস',
      nav_home: '🏠 হোম',
      nav_about: 'ℹ️ আমাদের সম্পর্কে',
      nav_services: '🌴 সেবাসমূহ',
      nav_information: '📊 তথ্য',
      nav_news: '📰 সংবাদ',
      nav_map: '🗺️ ম্যাপ',
      nav_more: '⋯ আরও',
      nav_contact: '📞 যোগাযোগ',
      sidebar_title: 'দ্রুত অ্যাক্সেস',
      sidebar_home: '🏠 হোম',
      sidebar_contents: '📑 সূচিপত্র',
      sidebar_search: '🔍 অনুসন্ধান',
      sidebar_favorites: '⭐ প্রিয়',
      sidebar_bookmarks: '🔖 বুকমার্ক',
      sidebar_recent: '🕘 সম্প্রতি দেখা',
      sidebar_categories: '📂 ক্যাটাগরি',
      sidebar_language: '🌐 ভাষা',
      sidebar_settings: '⚙️ সেটিংস',
      sidebar_help: '❓ সহায়তা',
      sidebar_contact: '📞 যোগাযোগ',
      prev: 'পূর্ববর্তী',
      next: 'পরবর্তী',
      fab_top: 'উপরে',
      fab_bottom: 'নিচে',
      fab_search: 'অনুসন্ধান',
      fab_language: 'ভাষা',
      fab_menu: 'মেনু',
      fab_share: 'শেয়ার',
      fab_favorite: 'প্রিয়',
      fab_bookmark: 'বুকমার্ক',
      back_to_top: 'উপরে ফিরে যান',
      reading_progress: 'পাঠের অগ্রগতি:',
      breadcrumb_home: 'হোম',
      hero_eyebrow: '🌴 আমাদের মহেশখালী',
      hero_title_1: 'মহেশখালী —',
      hero_title_2: 'এক দ্বীপ, অনেক গল্প।',
      hero_subtitle: 'প্রকৃতি, ঐতিহ্য, মানুষ ও সম্ভাবনার এক অনন্য দ্বীপ।',
      hero_desc: 'মহেশখালীর ইতিহাস, ঐতিহ্য, পর্যটন, শিক্ষা, স্বাস্থ্য, ব্যবসা, স্থানীয় পণ্য ও কমিউনিটি সম্পর্কে জানুন।',
      hero_btn_explore: 'মহেশখালী ঘুরে দেখুন',
      hero_btn_join: 'কমিউনিটিতে যোগ দিন',
      hero_path_bd: '🇧🇩 বাংলাদেশ',
      hero_path_cox: '📍 কক্সবাজার',
      hero_path_mhk: '🌴 মহেশখালী',
      unions_label: '🏘️ ইউনিয়ন ডিরেক্টরি',
      unions_title: 'মহেশখালীর ৮টি ইউনিয়ন',
      unions_desc: 'মহেশখালী উপজেলার ৮টি ইউনিয়নের তথ্য।',
      about_label: '📖 মহেশখালী সম্পর্কে',
      about_title: 'মহেশখালী আবিষ্কার করুন',
      about_desc: 'মহেশখালী কক্সবাজার জেলার একটি গুরুত্বপূর্ণ দ্বীপাঞ্চল।',
      about_est: 'উপজেলা সৃষ্টি',
      about_area: 'আয়তন',
      about_unions: 'ইউনিয়ন',
      about_population: 'জনসংখ্যা',
      about_read_more: 'সম্পূর্ণ প্রোফাইল পড়ুন →',
      tourism_label: '🌴 পর্যটন',
      tourism_title: 'মহেশখালী ঘুরে দেখুন',
      tourism_desc: 'পাহাড়, সমুদ্র, দ্বীপ, মন্দির, সৈকত ও প্রকৃতির সমন্বয়।',
      tourism_view_all: 'সব পর্যটন দেখুন →',
      education_label: '🎓 শিক্ষা',
      education_title: 'শিক্ষা ডিরেক্টরি',
      education_desc: 'শিক্ষা প্রতিষ্ঠান ও প্রশিক্ষণ কেন্দ্র।',
      health_label: '🏥 স্বাস্থ্য',
      health_title: 'স্বাস্থ্যসেবা',
      health_desc: 'স্বাস্থ্যসেবা সম্পর্কিত তথ্য।',
      business_label: '🏪 ব্যবসা',
      business_title: 'স্থানীয় ব্যবসা ডিরেক্টরি',
      business_desc: 'স্থানীয় ব্যবসা ও সেবা।',
      products_label: '🛍️ স্থানীয় পণ্য',
      products_title: 'মহেশখালীর পণ্য',
      products_desc: 'স্থানীয় ঐতিহ্যবাহী পণ্য।',
      gallery_label: '📸 গ্যালারি',
      gallery_title: 'ছবিতে মহেশখালী',
      gallery_desc: 'প্রকৃতি, ইতিহাস, মানুষ ও সংস্কৃতির ছবি।',
      gallery_view_all: 'সম্পূর্ণ গ্যালারি খুলুন →',
      news_label: '📰 সংবাদ',
      news_title: 'সর্বশেষ স্থানীয় তথ্য',
      news_desc: 'স্থানীয় সংবাদ ও তথ্য।',
      emergency_label: '🚨 জরুরি',
      emergency_title: 'জরুরি যোগাযোগ',
      emergency_desc: 'জরুরি নম্বর — যাচাইকৃত তথ্য।',
      view_all: 'সব দেখুন →',
      footer_tagline: 'এক দ্বীপ, এক কমিউনিটি, এক প্ল্যাটফর্ম।',
      footer_quick_links: '🔗 দ্রুত লিংক',
      footer_emergency_info: '🚨 জরুরি তথ্য',
      footer_community: '👥 কমিউনিটি',
      footer_information: '📰 তথ্য',
      footer_contact: '📞 যোগাযোগ',
      footer_signature: '🌴 আমাদের মহেশখালী — সবার ডিজিটাল প্ল্যাটফর্ম',
      developed_by: 'ডেভেলপ করেছেন',
      privacy: '🔒 গোপনীয়তা নীতি',
      terms: '📄 শর্তাবলী',
      disclaimer: '⚖️ দাবিত্যাগ',
      sitemap: '🗂️ সাইটম্যাপ',
      help: '❓ সহায়তা',
      search_title: '🔎 মহেশখালী খুঁজুন',
      search_hint: 'কিছু লিখে খুঁজুন...',
      emergency_subtitle: 'বাংলাদেশ জরুরি নম্বর',
      notifications_title: '🔔 বিজ্ঞপ্তি',
      notif_welcome: 'আমাদের মহেশখালীতে স্বাগতম',
      not_logged_in: 'লগইন করা হয়নি',
      a11y_title: '♿ অ্যাক্সেসিবিলিটি',
      a11y_increase_text: 'টেক্সট বড় করুন',
      a11y_decrease_text: 'টেক্সট ছোট করুন',
      a11y_reset_text: 'টেক্সট রিসেট করুন',
      a11y_high_contrast: 'হাই কনট্রাস্ট',
      a11y_reduce_motion: 'মোশন কমান',
      a11y_dyslexia_font: 'ডিসলেক্সিয়া ফন্ট',
      toast_lang_switched: 'ভাষা বাংলায় পরিবর্তিত হয়েছে',
      toast_dark_mode: 'ডার্ক মোড চালু হয়েছে',
      toast_light_mode: 'লাইট মোড চালু হয়েছে',
      toast_welcome: 'আমাদের মহেশখালীতে স্বাগতম!',
      toast_copied: 'ক্লিপবোর্ডে কপি হয়েছে!',
      toast_shared: 'সফলভাবে শেয়ার হয়েছে!',
      toast_favorite_added: 'প্রিয়তে যোগ হয়েছে!',
      toast_bookmark_added: 'বুকমার্কে যোগ হয়েছে!',
      toast_coming_soon: 'শীঘ্রই আসছে!',
      about_maheshkhali: 'মহেশখালী সম্পর্কে',
      history: 'ইতিহাস',
      geography: 'ভূগোল',
      administration: 'প্রশাসন',
      tourism: 'পর্যটন',
      education: 'শিক্ষা',
      health: 'স্বাস্থ্য',
      business: 'ব্যবসা',
      products: 'পণ্য',
      community: 'কমিউনিটি',
      emergency_numbers: 'জরুরি নম্বর',
      news: 'সংবাদ',
      notices: 'নোটিশ',
      events: 'ইভেন্ট',
      gallery: 'গ্যালারি',
      members: 'সদস্যবৃন্দ',
      volunteer: 'স্বেচ্ছাসেবক'
    }
  },

  init() {
    const saved = localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT;
    this.current = saved;
    document.body.setAttribute('data-lang', saved);
    document.documentElement.setAttribute('lang', saved);
    this.applyAll(saved);

    /* Footer lang buttons */
    $$('[data-lang-select]').forEach(btn => {
      on(btn, 'click', (e) => {
        e.preventDefault();
        this.setLanguage(btn.dataset.langSelect, true);
      });
    });
  },

  applyAll(lang) {
    $$('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const translation = this.get(key, lang);
      if (translation) el.textContent = translation;
    });

    $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const translation = this.get(key, lang);
      if (translation) el.setAttribute('placeholder', translation);
    });

    $$('[data-i18n-title]').forEach(el => {
      const key = el.dataset.i18nTitle;
      const translation = this.get(key, lang);
      if (translation) el.setAttribute('title', translation);
    });

    const flag = $('#langFlag');
    const text = $('#langText');
    if (flag) flag.textContent = lang === 'bn' ? '🇧🇩' : '🇬🇧';
    if (text) text.textContent = lang === 'bn' ? 'বাংলা' : 'English';

    $$('.footer-lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langSelect === lang);
    });
  },

  setLanguage(lang, notify = true) {
    if (!this.translations[lang]) return;
    this.current = lang;
    localStorage.setItem(this.STORAGE_KEY, lang);
    document.body.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    this.applyAll(lang);

    if (notify) {
      showToast(this.get('toast_lang_switched', lang));
    }

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  },

  toggle() {
    const next = this.current === 'bn' ? 'en' : 'bn';
    this.setLanguage(next, true);
  },

  get(key, lang) {
    const l = lang || this.current;
    return (this.translations[l] && this.translations[l][key]) ||
           (this.translations[this.DEFAULT] && this.translations[this.DEFAULT][key]) ||
           key;
  },

  t(key) { return this.get(key); }
};

/* ============================================================
   4. THEME CONTROLLER (Dark / Light)
============================================================ */
const Theme = {
  STORAGE_KEY: 'omh-theme',
  DEFAULT: 'dark',

  init() {
    this.btn = $('#themeBtn');
    const saved = localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT;
    this.apply(saved, false);
    on(this.btn, 'click', () => this.toggle());
  },

  toggle() {
    const current = document.body.getAttribute('data-theme') || this.DEFAULT;
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next, true);
  },

  apply(theme, notify = true) {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(this.STORAGE_KEY, theme);

    if (this.btn) this.btn.textContent = theme === 'dark' ? '🌙' : '☀️';

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0a1a2f' : '#FFF8E7');

    if (notify) {
      showToast(I18N.t(theme === 'dark' ? 'toast_dark_mode' : 'toast_light_mode'));
    }
  }
};

/* ============================================================
   5. LOADER CONTROLLER
============================================================ */
const Loader = {
  currentScene: 0,
  progress: 0,
  isComplete: false,

  scenes: [
    { id: 'sceneQuran',   duration: 4000 },
    { id: 'sceneBD',      duration: 3500 },
    { id: 'sceneDhkCtg',  duration: 3000 },
    { id: 'sceneCtgCox',  duration: 3000 },
    { id: 'sceneOcean',   duration: 3000 },
    { id: 'sceneMhk',     duration: 3500 },
    { id: 'sceneMap3d',   duration: 3500 },
    { id: 'sceneFinal',   duration: 4000 }
  ],

  init() {
    this.loader = $('#loader');
    this.flFill = $('#flFill');
    this.flPercent = $('#flPercent');

    if (!this.loader) { this.finish(); return; }

    document.body.style.overflow = 'hidden';
    this.animateProgress();
    setTimeout(() => this.runScene(), 500);
  },

  runScene() {
    if (this.currentScene >= this.scenes.length) { this.finish(); return; }
    this.showScene(this.currentScene);
    const duration = this.scenes[this.currentScene].duration;
    this.currentScene++;
    setTimeout(() => this.runScene(), duration);
  },

  showScene(index) {
    this.scenes.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) el.classList.remove('active');
    });
    const scene = document.getElementById(this.scenes[index].id);
    if (scene) scene.classList.add('active');
  },

  animateProgress() {
    this.progress = 0;
    const interval = setInterval(() => {
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
      } else {
        this.progress += Math.random() * 12;
        if (this.progress > 100) this.progress = 100;
      }
      const p = Math.floor(this.progress);
      if (this.flFill) this.flFill.style.width = p + '%';
      if (this.flPercent) this.flPercent.textContent = p + '%';
    }, 200);
  },

  finish() {
    if (this.isComplete) return;
    this.isComplete = true;

    if (this.flFill) this.flFill.style.width = '100%';
    if (this.flPercent) this.flPercent.textContent = '100%';

    setTimeout(() => {
      if (this.loader) {
        this.loader.classList.add('hidden');
        setTimeout(() => { this.loader.style.display = 'none'; }, 1000);
      }
      document.body.style.overflow = '';
      setTimeout(() => showToast(I18N.t('toast_welcome')), 500);
    }, 800);
  }
};

/* ============================================================
   6. DATE / TIME / DAY PART
============================================================ */
const DateTime = {
  init() {
    this.dateEl = $('#liveDate');
    this.timeEl = $('#liveTime');
    this.dayPartEl = $('#dayPart');
    this.update();
    setInterval(() => this.update(), 1000);
  },

  update() {
    const now = new Date();
    try {
      if (this.dateEl) this.dateEl.textContent = '📅 ' + now.toLocaleDateString('bn-BD', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      if (this.timeEl) this.timeEl.textContent = '🕐 ' + now.toLocaleTimeString('bn-BD', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    } catch (e) {
      if (this.dateEl) this.dateEl.textContent = '📅 ' + now.toDateString();
      if (this.timeEl) this.timeEl.textContent = '🕐 ' + now.toLocaleTimeString();
    }

    if (this.dayPartEl) {
      const h = now.getHours();
      let icon = '🌙';
      if (h >= 5 && h < 12) icon = '🌅';
      else if (h >= 12 && h < 17) icon = '☀️';
      else if (h >= 17 && h < 20) icon = '🌆';
      this.dayPartEl.textContent = icon;
    }
  }
};

/* ============================================================
   7. SCROLL PROGRESS
============================================================ */
const ScrollProgress = {
  init() {
    this.bar = $('#scrollProgressFill');
    this.readingProgress = $('#readingProgress');
    this.readingValue = $('#readingValue');
    this.progressRing = $('.progress-ring-circle');

    this.update = throttle(() => this.updateProgress(), 50);
    on(window, 'scroll', this.update);
    on(window, 'resize', this.update);
    this.updateProgress();
  },

  updateProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

    if (this.bar) this.bar.style.width = progress + '%';
    if (this.readingValue) this.readingValue.textContent = Math.round(progress) + '%';

    if (this.readingProgress) {
      if (progress > 5 && progress < 95) this.readingProgress.classList.add('visible');
      else this.readingProgress.classList.remove('visible');
    }

    if (this.progressRing) {
      const circumference = 2 * Math.PI * 20;
      this.progressRing.style.strokeDashoffset = circumference - (progress / 100) * circumference;
    }
  }
};

/* ============================================================
   8. BACK TO TOP + GO TO BOTTOM
============================================================ */
const ScrollControls = {
  init() {
    this.backToTop = $('#backToTop');

    on(this.backToTop, 'click', () => this.goTop());
    on($('#footerBackToTop'), 'click', () => this.goTop());

    on(window, 'scroll', throttle(() => this.toggleBackToTop(), 200));
  },

  toggleBackToTop() {
    if (!this.backToTop) return;
    if (window.scrollY > 400) this.backToTop.classList.add('visible');
    else this.backToTop.classList.remove('visible');
  },

  goTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); },

  goBottom() {
    const footer = $('#footer');
    if (footer) footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
};

/* ============================================================
   9. ACTIVE SECTION + PREV/NEXT
============================================================ */
const ActiveSection = {
  sections: [],
  current: 0,

  init() {
    this.sections = $$('section[data-section-name]');
    if (!this.sections.length) return;

    this.currentEl = $('#sectionCurrent');
    this.totalEl = $('#sectionTotal');
    this.nameEl = $('#sectionName');
    this.prevBtn = $('#prevBtn');
    this.nextBtn = $('#nextBtn');

    if (this.totalEl) this.totalEl.textContent = this.sections.length;

    this.detect = throttle(() => this.detectActive(), 150);
    on(window, 'scroll', this.detect);
    on(window, 'resize', this.detect);
    this.detectActive();

    on(this.prevBtn, 'click', () => this.goPrev());
    on(this.nextBtn, 'click', () => this.goNext());

    on(document, 'keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      if (e.key === 'PageDown' && e.shiftKey) { e.preventDefault(); this.goNext(); }
      if (e.key === 'PageUp' && e.shiftKey) { e.preventDefault(); this.goPrev(); }
    });
  },

  detectActive() {
    const scrollPos = window.scrollY + 150;
    let activeIndex = 0;
    this.sections.forEach((section, i) => {
      if (section.offsetTop <= scrollPos) activeIndex = i;
    });
    if (activeIndex !== this.current) {
      this.current = activeIndex;
      this.updateUI();
    }
  },

  updateUI() {
    const section = this.sections[this.current];
    if (!section) return;

    const index = this.current + 1;
    const name = section.dataset.sectionName || section.id;

    if (this.currentEl) this.currentEl.textContent = index;
    if (this.nameEl) this.nameEl.textContent = name;

    const sectionId = section.id;
    $$('.nav-link[data-section]').forEach(link => {
      link.classList.toggle('active', link.dataset.section === sectionId);
    });
    $$('.bottom-nav-item[data-section]').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });

    /* Breadcrumb */
    const bc = $('#breadcrumbInner');
    if (bc) {
      const homeText = I18N.t('breadcrumb_home');
      bc.innerHTML = `
        <a href="index.html" class="breadcrumb-item">
          <span>🏠</span>
          <span>${homeText}</span>
        </a>
        <span class="breadcrumb-sep">›</span>
        <span class="breadcrumb-item" style="color: var(--gold); font-weight: 700;">${name}</span>
      `;
    }

    if (this.prevBtn) this.prevBtn.disabled = this.current === 0;
    if (this.nextBtn) this.nextBtn.disabled = this.current === this.sections.length - 1;
  },

  goNext() {
    if (this.current < this.sections.length - 1) {
      this.sections[this.current + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  goPrev() {
    if (this.current > 0) {
      this.sections[this.current - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
};

/* ============================================================
   10. SIDEBAR
============================================================ */
const Sidebar = {
  init() {
    this.sidebar = $('#sidebar');
    this.backdrop = $('#sidebarBackdrop');

    on($('#sidebarToggle'), 'click', () => this.open());
    on($('#sidebarClose'), 'click', () => this.close());
    on(this.backdrop, 'click', () => this.close());
    on($('#fabMenuBtn'), 'click', () => { FAB.close(); this.open(); });
    on($('#bottomMenu'), 'click', () => this.open());

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.sidebar?.classList.contains('open')) this.close();
    });

    $$('.sidebar-link').forEach(link => {
      on(link, 'click', () => {
        if (window.innerWidth <= 1024) this.close();
      });
    });
  },

  open() {
    this.sidebar?.classList.add('open');
    this.backdrop?.classList.add('active');
    this.sidebar?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  },

  close() {
    this.sidebar?.classList.remove('open');
    this.backdrop?.classList.remove('active');
    this.sidebar?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

/* ============================================================
   11. FLOATING ACTION BAR
============================================================ */
const FAB = {
  init() {
    this.container = $('#fabContainer');
    on($('#fabMain'), 'click', () => this.toggle());
    on($('#fabTop'), 'click', () => { ScrollControls.goTop(); this.close(); });
    on($('#fabBottom'), 'click', () => { ScrollControls.goBottom(); this.close(); });
    on($('#fabSearch'), 'click', () => { this.close(); openSearch(); });
    on($('#fabLanguage'), 'click', () => { this.close(); I18N.toggle(); });
    on($('#fabShare'), 'click', () => { this.close(); this.share(); });
    on($('#fabFavorite'), 'click', () => { this.close(); showToast(I18N.t('toast_favorite_added')); });
    on($('#fabBookmark'), 'click', () => { this.close(); showToast(I18N.t('toast_bookmark_added')); });

    on(document, 'click', (e) => {
      if (this.container?.classList.contains('open')) {
        if (!this.container.contains(e.target)) this.close();
      }
    });
  },

  toggle() { this.container?.classList.toggle('open'); },
  close() { this.container?.classList.remove('open'); },

  async share() {
    const data = {
      title: 'OUR MAHESHKHALI',
      text: 'One Island. One Community. One Platform.',
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
        showToast(I18N.t('toast_shared'));
      } catch (e) {}
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast(I18N.t('toast_copied'));
      } catch (e) {
        showToast(I18N.t('toast_coming_soon'));
      }
    }
  }
};

/* ============================================================
   12. BOTTOM NAV
============================================================ */
const BottomNav = {
  init() {
    on($('#bottomSearch'), 'click', openSearch);
    on($('#bottomCategories'), 'click', () => showToast(I18N.t('toast_coming_soon')));
    on($('#bottomLanguage'), 'click', () => I18N.toggle());
  }
};

/* ============================================================
   13. NOTIFICATIONS & USER MENU
============================================================ */
const Notifications = {
  init() {
    this.panel = $('#notificationsPanel');
    this.btn = $('#notificationBtn');

    on(this.btn, 'click', (e) => {
      e.stopPropagation();
      this.toggle();
      UserMenu.close();
    });
    on($('#notificationsClose'), 'click', () => this.close());

    on(document, 'click', (e) => {
      if (this.panel?.classList.contains('active')) {
        if (!this.panel.contains(e.target) && !this.btn.contains(e.target)) this.close();
      }
    });
  },
  toggle() { this.panel?.classList.toggle('active'); },
  close() { this.panel?.classList.remove('active'); }
};

const UserMenu = {
  init() {
    this.menu = $('#userMenu');
    this.btn = $('#userBtn');

    on(this.btn, 'click', (e) => {
      e.stopPropagation();
      this.toggle();
      Notifications.close();
    });

    on(document, 'click', (e) => {
      if (this.menu?.classList.contains('active')) {
        if (!this.menu.contains(e.target) && !this.btn.contains(e.target)) this.close();
      }
    });
  },
  toggle() { this.menu?.classList.toggle('active'); },
  close() { this.menu?.classList.remove('active'); }
};

/* ============================================================
   14. ACCESSIBILITY
============================================================ */
const Accessibility = {
  settings: {
    textSize: 'normal',
    highContrast: false,
    reduceMotion: false,
    dyslexiaFont: false
  },

  init() {
    this.modal = $('#accessibilityModal');
    this.backdrop = $('#accessibilityBackdrop');

    on($('#accessibilityBtn'), 'click', () => this.open());
    on($('#accessibilityClose'), 'click', () => this.close());
    on(this.backdrop, 'click', () => this.close());

    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) this.close();
    });

    $$('.a11y-option').forEach(opt => {
      on(opt, 'click', () => this.applyAction(opt.dataset.a11y));
    });

    this.loadSettings();
  },

  open() {
    this.modal?.classList.add('active');
    this.modal?.setAttribute('aria-hidden', 'false');
  },
  close() {
    this.modal?.classList.remove('active');
    this.modal?.setAttribute('aria-hidden', 'true');
  },

  applyAction(action) {
    const body = document.body;
    switch (action) {
      case 'increase-text':
        body.classList.remove('a11y-small-text');
        if (body.classList.contains('a11y-large-text')) {
          body.classList.remove('a11y-large-text');
          body.classList.add('a11y-larger-text');
          this.settings.textSize = 'larger';
        } else if (!body.classList.contains('a11y-larger-text')) {
          body.classList.add('a11y-large-text');
          this.settings.textSize = 'large';
        }
        showToast('🔍 Text size increased');
        break;
      case 'decrease-text':
        body.classList.remove('a11y-large-text', 'a11y-larger-text');
        if (body.classList.contains('a11y-small-text')) {
          body.classList.remove('a11y-small-text');
          this.settings.textSize = 'normal';
        } else {
          body.classList.add('a11y-small-text');
          this.settings.textSize = 'small';
        }
        showToast('🔎 Text size decreased');
        break;
      case 'reset-text':
        body.classList.remove('a11y-large-text', 'a11y-larger-text', 'a11y-small-text');
        this.settings.textSize = 'normal';
        showToast('↺ Text size reset');
        break;
      case 'high-contrast':
        body.classList.toggle('a11y-high-contrast');
        this.settings.highContrast = body.classList.contains('a11y-high-contrast');
        break;
      case 'reduce-motion':
        body.classList.toggle('a11y-reduce-motion');
        this.settings.reduceMotion = body.classList.contains('a11y-reduce-motion');
        break;
      case 'dyslexia-font':
        body.classList.toggle('a11y-dyslexia-font');
        this.settings.dyslexiaFont = body.classList.contains('a11y-dyslexia-font');
        break;
    }
    this.saveSettings();
    this.updateUI();
  },

  updateUI() {
    $$('.a11y-option').forEach(opt => {
      const action = opt.dataset.a11y;
      const active = (
        (action === 'high-contrast' && this.settings.highContrast) ||
        (action === 'reduce-motion' && this.settings.reduceMotion) ||
        (action === 'dyslexia-font' && this.settings.dyslexiaFont)
      );
      opt.classList.toggle('active', active);
    });
  },

  saveSettings() {
    localStorage.setItem('omh-a11y', JSON.stringify(this.settings));
  },

  loadSettings() {
    try {
      const saved = JSON.parse(localStorage.getItem('omh-a11y') || '{}');
      Object.assign(this.settings, saved);

      const body = document.body;
      if (this.settings.highContrast) body.classList.add('a11y-high-contrast');
      if (this.settings.reduceMotion) body.classList.add('a11y-reduce-motion');
      if (this.settings.dyslexiaFont) body.classList.add('a11y-dyslexia-font');
      if (this.settings.textSize === 'large') body.classList.add('a11y-large-text');
      if (this.settings.textSize === 'larger') body.classList.add('a11y-larger-text');
      if (this.settings.textSize === 'small') body.classList.add('a11y-small-text');

      this.updateUI();
    } catch (e) {}
  }
};

/* ============================================================
   15. SEARCH MODAL
============================================================ */
const searchData = [
  { title: 'Adinath Temple', url: 'pages/tourism.html#adinath', icon: '🛕' },
  { title: 'Mainak Hill', url: 'pages/tourism.html#mainak', icon: '⛰️' },
  { title: 'Sonadia Island', url: 'pages/tourism.html#sonadia', icon: '🏝️' },
  { title: 'Dhalghata Union', url: 'pages/union.html#dhalghata', icon: '🌴' },
  { title: 'Matarbari Union', url: 'pages/union.html#matarbari', icon: '🌊' },
  { title: 'Kalarmarchhara Union', url: 'pages/union.html#kalarmarchhara', icon: '🌿' },
  { title: 'Shaplapur Union', url: 'pages/union.html#shaplapur', icon: '🌸' },
  { title: 'Hoanak Union', url: 'pages/union.html#hoanak', icon: '🌊' },
  { title: 'Bara Maheshkhali Union', url: 'pages/union.html#bara-maheshkhali', icon: '🏝️' },
  { title: 'Kutubjom Union', url: 'pages/union.html#kutubjom', icon: '🌊' },
  { title: 'Chhota Maheshkhali Union', url: 'pages/union.html#chhota-maheshkhali', icon: '🌿' },
  { title: 'Education Institutions', url: 'pages/education.html', icon: '🎓' },
  { title: 'Health Services', url: 'pages/health.html', icon: '🏥' },
  { title: 'Business Directory', url: 'pages/business.html', icon: '🏪' },
  { title: 'Local Products', url: 'pages/local-products.html', icon: '🛍️' },
  { title: 'Emergency Numbers', url: 'pages/emergency.html', icon: '🚨' },
  { title: 'Gallery', url: 'pages/gallery.html', icon: '📸' },
  { title: 'News', url: 'pages/news.html', icon: '📰' },
  { title: 'About Maheshkhali', url: 'pages/about.html', icon: '📖' },
  { title: 'History', url: 'pages/history.html', icon: '📜' },
  { title: 'Geography', url: 'pages/geography.html', icon: '🗺️' },
  { title: 'Administration', url: 'pages/administration.html', icon: '🏛️' },
  { title: 'Map', url: 'pages/map.html', icon: '🗺️' }
];

function openSearch() {
  const modal = $('#searchModal');
  if (!modal) return;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => { const input = $('#searchInput'); if (input) input.focus(); }, 300);
}

function closeSearch() {
  const modal = $('#searchModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const input = $('#searchInput');
  const results = $('#searchResults');
  if (input) input.value = '';
  if (results) results.innerHTML = `<p class="search-hint">${I18N.t('search_hint')}</p>`;
}

const Search = {
  init() {
    on($('#searchBtn'), 'click', openSearch);
    on($('#topbarSearchTrigger'), 'click', openSearch);
    on($('#sidebarSearch'), 'click', (e) => { e.preventDefault(); Sidebar.close(); openSearch(); });
    on($('#searchClose'), 'click', closeSearch);
    on($('#searchBackdrop'), 'click', closeSearch);

    const input = $('#searchInput');
    const results = $('#searchResults');

    if (input) {
      input.addEventListener('input', debounce(function() {
        const q = this.value.toLowerCase().trim();
        if (!q) {
          results.innerHTML = `<p class="search-hint">${I18N.t('search_hint')}</p>`;
          return;
        }
        const filtered = searchData.filter(item => item.title.toLowerCase().includes(q));
        if (filtered.length === 0) {
          results.innerHTML = '<p class="search-hint">No results found.</p>';
        } else {
          const isDark = document.body.getAttribute('data-theme') === 'dark';
          const textColor = isDark ? '#fff' : '#1a1a2e';
          results.innerHTML = filtered.map(item =>
            `<a href="${item.url}" style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;color:${textColor};transition:all 0.2s;margin-bottom:4px;" onmouseover="this.style.background='rgba(212,175,55,0.15)';this.style.paddingLeft='22px'" onmouseout="this.style.background='transparent';this.style.paddingLeft='16px'">
              <span style="font-size:1.3rem;">${item.icon}</span>
              <span style="flex:1;">${item.title}</span>
              <span style="opacity:0.5;">→</span>
            </a>`
          ).join('');
        }
      }, 200));
    }
  }
};

/* ============================================================
   16. EMERGENCY MODAL
============================================================ */
const Emergency = {
  init() {
    this.modal = $('#emergencyModal');
    on($('#emergencyBtn'), 'click', () => this.open());
    on($('#emergencyClose'), 'click', () => this.close());
    on($('#emergencyBackdrop'), 'click', () => this.close());
    on(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('active')) this.close();
    });
  },
  open() {
    this.modal?.classList.add('active');
    this.modal?.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  },
  close() {
    this.modal?.classList.remove('active');
    this.modal?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

/* ============================================================
   17. MOBILE MENU
============================================================ */
const MobileMenu = {
  init() {
    const btn = $('#mobileMenuBtn');
    const nav = $('#mainNav');

    on(btn, 'click', function() {
      nav?.classList.toggle('open');
      this.classList.toggle('active');
    });

    $$('.nav-dropdown').forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      if (toggle) {
        on(toggle, 'click', function(e) {
          if (window.innerWidth <= 1024) {
            e.preventDefault();
            dropdown.classList.toggle('open');
          }
        });
      }
    });
  }
};

/* ============================================================
   18. HEADER SCROLL EFFECT
============================================================ */
const Header = {
  init() {
    this.header = $('.main-header');
    on(window, 'scroll', throttle(() => {
      if (this.header) {
        if (window.scrollY > 50) this.header.classList.add('scrolled');
        else this.header.classList.remove('scrolled');
      }
    }, 100));
  }
};

/* ============================================================
   19. SCROLL REVEAL
============================================================ */
const Reveal = {
  init() {
    if (!('IntersectionObserver' in window)) {
      $$('.section-heading, .about-card, .card-grid > *, .footer-grid > *').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          this.observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    this.setupElements();
  },

  setupElements() {
    const selectors = [
      '.section-heading', '.about-card', '.card-grid > *',
      '.footer-grid > *', '.union-grid > *', '.gallery-grid > *',
      '.news-grid > *', '.emergency-grid > *'
    ];

    selectors.forEach(selector => {
      $$(selector).forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        this.observer.observe(el);
      });
    });
  }
};

/* ============================================================
   20. DYNAMIC CONTENT — UNION CARDS
============================================================ */
const Content = {
  init() {
    this.buildUnionCards();
  },

  buildUnionCards() {
    const grid = $('.union-grid');
    if (!grid) return;

    const unions = [
      { name: 'Dhalghata',          icon: '🌴', num: '01', slug: 'dhalghata' },
      { name: 'Matarbari',          icon: '🌊', num: '02', slug: 'matarbari' },
      { name: 'Kalarmarchhara',     icon: '🌿', num: '03', slug: 'kalarmarchhara' },
      { name: 'Shaplapur',          icon: '🌸', num: '04', slug: 'shaplapur' },
      { name: 'Hoanak',             icon: '🌊', num: '05', slug: 'hoanak' },
      { name: 'Bara Maheshkhali',   icon: '🏝️', num: '06', slug: 'bara-maheshkhali' },
      { name: 'Kutubjom',           icon: '🌊', num: '07', slug: 'kutubjom' },
      { name: 'Chhota Maheshkhali', icon: '🌿', num: '08', slug: 'chhota-maheshkhali' }
    ];

    grid.innerHTML = unions.map(u => `
      <div class="about-card union-card" data-union="${u.slug}" style="cursor:pointer;" role="button" tabindex="0" aria-label="${u.name} Union">
        <span class="about-icon">${u.icon}</span>
        <h3>${u.num}</h3>
        <strong>${u.name}</strong>
      </div>
    `).join('');

    $$('.union-card', grid).forEach(card => {
      const slug = card.dataset.union;
      const name = card.querySelector('strong')?.textContent || '';
      const handler = () => {
        showToast(`🌴 Opening ${name}...`);
        setTimeout(() => { window.location.href = `pages/union.html#${slug}`; }, 500);
      };
      on(card, 'click', handler);
      on(card, 'keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
      });
    });
  }
};

/* ============================================================
   21. MISC (Year, Smooth Scroll, Language Button)
============================================================ */
const Misc = {
  init() {
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* Language button */
    on($('#langBtn'), 'click', () => I18N.toggle());
    on($('#sidebarLang'), 'click', (e) => { e.preventDefault(); Sidebar.close(); I18N.toggle(); });

    /* Smooth scroll for anchors */
    $$('a[href^="#"]').forEach(anchor => {
      on(anchor, 'click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#!') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 120;
          const offset = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      });
    });

    /* Keyboard shortcuts */
    on(document, 'keydown', (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      /* Ctrl/Cmd + K — Search */
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      /* Ctrl/Cmd + / — Language toggle */
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        I18N.toggle();
      }
      /* Escape — close all */
      if (e.key === 'Escape') {
        closeSearch();
        Emergency.close();
        Accessibility.close();
        Sidebar.close();
        FAB.close();
        Notifications.close();
        UserMenu.close();
      }
    });

    /* Sidebar misc links */
    on($('#tocToggle'), 'click', (e) => { e.preventDefault(); showToast(I18N.t('toast_coming_soon')); });
    on($('#favBtn'), 'click', (e) => { e.preventDefault(); showToast(I18N.t('toast_favorite_added')); });
    on($('#bookmarkBtn'), 'click', (e) => { e.preventDefault(); showToast(I18N.t('toast_bookmark_added')); });
    on($('#recentBtn'), 'click', (e) => { e.preventDefault(); showToast(I18N.t('toast_coming_soon')); });
    on($('#sidebarSettings'), 'click', (e) => { e.preventDefault(); showToast(I18N.t('toast_coming_soon')); });
  }
};

/* ============================================================
   22. MAIN INITIALIZATION
============================================================ */
function initApp() {
  try {
    /* Core first */
    Theme.init();
    I18N.init();
    DateTime.init();

    /* Loader */
    Loader.init();

    /* Navigation */
    Header.init();
    MobileMenu.init();
    Sidebar.init();
    FAB.init();
    BottomNav.init();
    Notifications.init();
    UserMenu.init();

    /* Scrolling */
    ScrollProgress.init();
    ScrollControls.init();
    ActiveSection.init();

    /* Content */
    Content.init();
    Reveal.init();

    /* Modals */
    Search.init();
    Emergency.init();
    Accessibility.init();

    /* Misc */
    Misc.init();

    /* Expose for global access */
    window.I18N = I18N;
    window.Theme = Theme;

    console.log('🌴 OUR MAHESHKHALI v6.0 initialized');
    console.log('👨‍💻 Developed by Badsha Solyman');
  } catch (error) {
    console.error('❌ Initialization error:', error);
    const loader = $('#loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.style.display = 'none', 1000);
    }
    document.body.style.overflow = '';
  }
}

/* ============================================================
   23. DOM READY
============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ============================================================
   24. GLOBAL ERROR HANDLER
============================================================ */
window.addEventListener('error', (e) => {
  console.error('⚠️ Global error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('⚠️ Unhandled promise rejection:', e.reason);
});

/* ============================================================
   25. EXPOSE API (for debugging)
============================================================ */
window.OMH_App = {
  I18N, Theme, Loader, DateTime,
  ScrollProgress, ScrollControls, ActiveSection,
  Sidebar, FAB, BottomNav, Notifications, UserMenu,
  Accessibility, Search, Emergency, Reveal, Content, Misc,
  openSearch, closeSearch, showToast
};

/* ============================================================
   26. END OF MAIN.JS
============================================================ */