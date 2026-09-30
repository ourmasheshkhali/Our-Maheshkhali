/* ==========================================
   OUR MAHESHKHALI — MAIN JAVASCRIPT
   Developed by Badsha Solyman
   Merchant Mariner • Founder • Web Developer
   ========================================== */


/* ==========================================
   1. LANGUAGE SYSTEM (বাংলা ↔ English)
   ========================================== */

let currentLang = localStorage.getItem('language') || 'bn';

function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);

    // সব [data-bn][data-en] এলিমেন্ট আপডেট
    const elements = document.querySelectorAll('[data-bn][data-en]');
    elements.forEach(el => {
        el.textContent = lang === 'bn' 
            ? el.getAttribute('data-bn') 
            : el.getAttribute('data-en');
    });

    // Placeholder আপডেট
    const placeholders = document.querySelectorAll('[data-bn-placeholder][data-en-placeholder]');
    placeholders.forEach(el => {
        el.placeholder = lang === 'bn'
            ? el.getAttribute('data-bn-placeholder')
            : el.getAttribute('data-en-placeholder');
    });

    // Language buttons আপডেট
    const langBtn = document.getElementById('lang-btn');
    if (langBtn) langBtn.textContent = lang === 'bn' ? 'বাংলা | EN' : 'EN | বাংলা';

    const introLangBtn = document.getElementById('intro-lang-btn');
    if (introLangBtn) introLangBtn.textContent = lang === 'bn' ? 'বাংলা | EN' : 'EN | বাংলা';

    document.documentElement.lang = lang;
    updateDateTime();
}

// TopBar Language Button
const langBtn = document.getElementById('lang-btn');
if (langBtn) {
    langBtn.addEventListener('click', () => {
        applyLanguage(currentLang === 'bn' ? 'en' : 'bn');
    });
}

// Intro Language Button
const introLangBtn = document.getElementById('intro-lang-btn');
if (introLangBtn) {
    introLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyLanguage(currentLang === 'bn' ? 'en' : 'bn');
    });
}


/* ==========================================
   2. LOADING SCREEN — 9 STEPS (Click-Based)
   ========================================== */

const stages = document.querySelectorAll('#loading-screen .stage');
const dots = document.querySelectorAll('.progress-dots .dot');
let currentStageIndex = 0;
let countdownStarted = false;

function showStage(index) {
    stages.forEach((stage, i) => {
        stage.classList.remove('active');
        if (i === index) stage.classList.add('active');
    });

    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        dot.classList.remove('completed');
        if (i === index) dot.classList.add('active');
        if (i < index) dot.classList.add('completed');
    });

    currentStageIndex = index;

    if (index === stages.length - 1 && !countdownStarted) {
        countdownStarted = true;
        startCountdown();
    }
}

function nextStage() {
    if (currentStageIndex < stages.length - 1) {
        showStage(currentStageIndex + 1);
    }
}

function endIntro() {
    const loading = document.getElementById('loading-screen');
    const main = document.getElementById('main-website');

    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
            if (main) main.classList.remove('hidden');
            document.body.style.overflow = 'auto';
        }, 800);
    }
}

stages.forEach(stage => {
    stage.addEventListener('click', () => {
        if (currentStageIndex !== stages.length - 1) {
            nextStage();
        }
    });
});

const skipBtn = document.getElementById('skip-intro');
if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        endIntro();
    });
}

window.addEventListener('load', () => {
    showStage(0);
    applyLanguage(currentLang);
    document.body.style.overflow = 'hidden';
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const loading = document.getElementById('loading-screen');
        if (loading && loading.style.display !== 'none') {
            endIntro();
        }
    }
});


/* ==========================================
   3. COUNTDOWN TIMER (Stage 9)
   ========================================== */

let countdownInterval = null;

function startCountdown() {
    const numberEl = document.getElementById('countdown-number');
    const progressEl = document.querySelector('.countdown-progress');
    
    if (!numberEl) return;

    let count = 3;
    numberEl.textContent = count;

    const circumference = 282.74;
    if (progressEl) {
        progressEl.style.strokeDasharray = circumference;
        progressEl.style.strokeDashoffset = 0;
    }

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        count--;

        if (count > 0) {
            numberEl.textContent = count;
            if (progressEl) {
                const offset = circumference * (1 - count / 3);
                progressEl.style.strokeDashoffset = offset;
            }
        } else {
            numberEl.textContent = '✓';
            if (progressEl) progressEl.style.strokeDashoffset = circumference;

            setTimeout(() => {
                clearInterval(countdownInterval);
                endIntro();
            }, 700);
        }
    }, 1000);
}


/* ==========================================
   4. LIVE DATE, TIME & GREETING
   ========================================== */

function updateDateTime() {
    const now = new Date();

    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    const locale = currentLang === 'bn' ? 'bn-BD' : 'en-US';

    // Main topbar date
    const dateEl = document.getElementById('live-date');
    if (dateEl) dateEl.textContent = '📅 ' + now.toLocaleDateString(locale, dateOptions);

    // Live status bar date
    const dateEl2 = document.getElementById('live-date-2');
    if (dateEl2) dateEl2.textContent = '📅 ' + now.toLocaleDateString(locale, { day: 'numeric', month: 'short' });

    // Main topbar time
    const timeEl = document.getElementById('live-time');
    if (timeEl) timeEl.textContent = '🕐 ' + now.toLocaleTimeString(locale);

    // Live status bar time
    const timeEl2 = document.getElementById('live-time-2');
    if (timeEl2) timeEl2.textContent = '⏰ ' + now.toLocaleTimeString(locale);

    // Greeting
    const hour = now.getHours();
    let greeting = '';
    if (currentLang === 'bn') {
        if (hour >= 5 && hour < 12) greeting = '🌅 সুপ্রভাত';
        else if (hour >= 12 && hour < 17) greeting = '☀️ শুভ অপরাহ্ণ';
        else if (hour >= 17 && hour < 20) greeting = '🌆 শুভ সন্ধ্যা';
        else greeting = '🌙 শুভ রাত্রি';
    } else {
        if (hour >= 5 && hour < 12) greeting = '🌅 Good Morning';
        else if (hour >= 12 && hour < 17) greeting = '☀️ Good Afternoon';
        else if (hour >= 17 && hour < 20) greeting = '🌆 Good Evening';
        else greeting = '🌙 Good Night';
    }

    const greetEl = document.getElementById('greeting');
    if (greetEl) greetEl.textContent = greeting;
}

setInterval(updateDateTime, 1000);


/* ==========================================
   5. BACK TO TOP
   ========================================== */

const backToTopBtn = document.getElementById('back-to-top');
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}


/* ==========================================
   6. GO TO FOOTER
   ========================================== */

const footerBtn = document.getElementById('footer-btn');
if (footerBtn) {
    footerBtn.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}


/* ==========================================
   7. THEME TOGGLE
   ========================================== */

const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        themeBtn.textContent = '☀️';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeBtn.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            themeBtn.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
}


/* ==========================================
   8. NOTIFICATIONS
   ========================================== */

const notifBtn = document.getElementById('notif-btn');
if (notifBtn) {
    notifBtn.addEventListener('click', () => {
        if (currentLang === 'bn') {
            alert('🔔 নোটিফিকেশন:\n\n১. Our Maheshkhali-তে স্বাগতম!\n২. নতুন আপডেট শীঘ্রই আসছে।\n৩. রেজিস্ট্রেশন শীঘ্রই খুলবে।');
        } else {
            alert('🔔 Notifications:\n\n1. Welcome to Our Maheshkhali!\n2. New update coming soon.\n3. Registration will open shortly.');
        }
    });
}


/* ==========================================
   9. EMERGENCY SYSTEM
   ========================================== */

function showEmergency() {
    if (currentLang === 'bn') {
        alert('🚨 জরুরি নম্বর\n\n🚑 অ্যাম্বুলেন্স: ৯৯৯\n🚓 পুলিশ: ৯৯৯\n🚒 ফায়ার সার্ভিস: ৯৯৯\n🏥 হাসপাতাল: ৯৯৯\n\n📞 জাতীয় হেল্পলাইন: ৩৩৩');
    } else {
        alert('🚨 EMERGENCY NUMBERS\n\n🚑 Ambulance: 999\n🚓 Police: 999\n🚒 Fire Service: 999\n🏥 Hospital: 999\n\n📞 National Helpline: 333');
    }
}

const emergencyBtn = document.getElementById('emergency-btn');
if (emergencyBtn) {
    emergencyBtn.addEventListener('click', showEmergency);
}

const liveEmergency = document.getElementById('live-emergency');
if (liveEmergency) {
    liveEmergency.addEventListener('click', showEmergency);
}


/* ==========================================
   10. PROFILE BUTTON
   ========================================== */

const profileBtn = document.getElementById('profile-btn');
if (profileBtn) {
    profileBtn.addEventListener('click', () => {
        if (currentLang === 'bn') {
            alert('👤 প্রোফাইল\n\nলগইন / রেজিস্ট্রেশন শীঘ্রই আসছে!');
        } else {
            alert('👤 Profile\n\nLogin / Registration coming soon!');
        }
    });
}


/* ==========================================
   11. SEARCH SYSTEM
   ========================================== */

const searchBtn = document.getElementById('search-btn');
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const msg = currentLang === 'bn' 
            ? '🔎 Our Maheshkhali-তে খুঁজুন...\n\nআপনি কী খুঁজতে চান?' 
            : '🔎 Search Our Maheshkhali...\n\nWhat do you want to find?';
        const query = prompt(msg);
        if (query) {
            if (currentLang === 'bn') {
                alert('খোঁজা হচ্ছে: ' + query + '\n\n(সম্পূর্ণ সার্চ সিস্টেম শীঘ্রই আসছে)');
            } else {
                alert('Searching for: ' + query + '\n\n(Full search system coming soon)');
            }
        }
    });
}


/* ==========================================
   12. HERO BUTTONS
   ========================================== */

const heroButtons = document.querySelectorAll('.hero-buttons button');
heroButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const btnText = btn.textContent.trim();
        if (currentLang === 'bn') {
            alert('🔗 ' + btnText + '\n\nএই পেজটি শীঘ্রই আসছে!');
        } else {
            alert('🔗 ' + btnText + '\n\nThis page is coming soon!');
        }
    });
});


/* ==========================================
   13. LOGIN & REGISTRATION (Intro Screen)
   ========================================== */

const introLogin = document.getElementById('intro-login');
if (introLogin) {
    introLogin.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentLang === 'bn') {
            alert('🔐 লগইন\n\nসম্পূর্ণ লগইন সিস্টেম শীঘ্রই আসছে!\n\n- Email / Username\n- Password\n- Remember Me\n- Forgot Password');
        } else {
            alert('🔐 Login\n\nFull login system coming soon!\n\n- Email / Username\n- Password\n- Remember Me\n- Forgot Password');
        }
    });
}

const introRegister = document.getElementById('intro-register');
if (introRegister) {
    introRegister.addEventListener('click', (e) => {
        e.stopPropagation();
        if (currentLang === 'bn') {
            alert('📝 রেজিস্ট্রেশন\n\nসম্পূর্ণ রেজিস্ট্রেশন সিস্টেম শীঘ্রই আসছে!\n\n- Full Name\n- Email\n- Mobile\n- Password\n- Union & Village\n- Profession');
        } else {
            alert('📝 Registration\n\nFull registration system coming soon!\n\n- Full Name\n- Email\n- Mobile\n- Password\n- Union & Village\n- Profession');
        }
    });
}


/* ==========================================
   14. SMART SIDEBAR
   ========================================== */

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarClose = document.getElementById('sidebar-close');
const menuBtn = document.getElementById('menu-btn');

function openSidebar() {
    if (sidebar) {
        sidebar.classList.add('open');
        document.body.classList.add('sidebar-open');
    }
}

function closeSidebar() {
    if (sidebar) {
        sidebar.classList.remove('open');
        document.body.classList.remove('sidebar-open');
    }
}

if (menuBtn) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openSidebar();
    });
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
        closeSidebar();
    }
});

// Sidebar Links
const sidebarLinks = document.querySelectorAll('.sidebar-link[data-page]');
sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // যদি # দিয়ে anchor থাকে, smooth scroll করব
        const href = link.getAttribute('href');
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                closeSidebar();
                return;
            }
        }
        
        e.preventDefault();
        const pageName = link.querySelector('span:not(.sidebar-icon):not(.sidebar-badge)').textContent.trim();
        if (currentLang === 'bn') {
            alert('📄 ' + pageName + '\n\nএই পেজটি শীঘ্রই আসছে!');
        } else {
            alert('📄 ' + pageName + '\n\nThis page is coming soon!');
        }
        closeSidebar();
    });
});

// Sidebar Language
const sidebarLang = document.getElementById('sidebar-lang');
if (sidebarLang) {
    sidebarLang.addEventListener('click', (e) => {
        e.preventDefault();
        applyLanguage(currentLang === 'bn' ? 'en' : 'bn');
    });
}

// Sidebar Theme
const sidebarTheme = document.getElementById('sidebar-theme');
if (sidebarTheme) {
    sidebarTheme.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.classList.toggle('light-mode');
        const themeBtn2 = document.getElementById('theme-btn');
        if (document.body.classList.contains('light-mode')) {
            if (themeBtn2) themeBtn2.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        } else {
            if (themeBtn2) themeBtn2.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Sidebar Logout
const sidebarLogout = document.getElementById('sidebar-logout');
if (sidebarLogout) {
    sidebarLogout.addEventListener('click', (e) => {
        e.preventDefault();
        const msg = currentLang === 'bn' ? 'আপনি কি লগআউট করতে চান?' : 'Are you sure you want to logout?';
        if (confirm(msg)) {
            const done = currentLang === 'bn' ? '✅ আপনি সফলভাবে লগআউট হয়েছেন!' : '✅ You have been logged out successfully!';
            alert(done);
            closeSidebar();
        }
    });
}

// Sidebar Back to Top
const sidebarBackTop = document.getElementById('sidebar-back-top');
if (sidebarBackTop) {
    sidebarBackTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeSidebar();
    });
}


/* ==========================================
   15. NAVIGATION LINKS (TopBar)
   ========================================== */

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});


/* ==========================================
   16. FLOATING ACTION BUTTONS (FAB)
   ========================================== */

// SPIN Button
const fabSpin = document.getElementById('fab-spin');
if (fabSpin) {
    fabSpin.addEventListener('click', () => {
        const spinMsg = currentLang === 'bn' 
            ? '↻ SPIN\n\nKnowledge House শীঘ্রই আসছে!' 
            : '↻ SPIN\n\nKnowledge House coming soon!';
        alert(spinMsg);
    });
}

// PREV Button
const fabPrev = document.getElementById('fab-prev');
if (fabPrev) {
    fabPrev.addEventListener('click', () => {
        const sections = document.querySelectorAll('section, footer');
        let currentY = window.scrollY;
        let prevSection = null;
        
        sections.forEach(sec => {
            const top = sec.offsetTop;
            if (top < currentY - 50) {
                prevSection = sec;
            }
        });

        if (prevSection) {
            prevSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// NEXT Button
const fabNext = document.getElementById('fab-next');
if (fabNext) {
    fabNext.addEventListener('click', () => {
        const sections = document.querySelectorAll('section, footer');
        let currentY = window.scrollY;
        
        for (let sec of sections) {
            if (sec.offsetTop > currentY + 50) {
                sec.scrollIntoView({ behavior: 'smooth' });
                return;
            }
        }
        // শেষ হলে footer এ যাবে
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}

// TOP Button
const fabTop = document.getElementById('fab-top');
if (fabTop) {
    fabTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// FOOTER Button
const fabFooter = document.getElementById('fab-footer');
if (fabFooter) {
    fabFooter.addEventListener('click', () => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
}


/* ==========================================
   17. EMERGENCY ITEMS (Click to Call)
   ========================================== */

const emergencyItems = document.querySelectorAll('.emergency-item');
emergencyItems.forEach(item => {
    item.addEventListener('click', () => {
        const tel = item.getAttribute('data-tel');
        if (tel) {
            window.location.href = 'tel:' + tel;
        }
    });
});


/* ==========================================
   18. MAP FILTERS
   ========================================== */

const filterChips = document.querySelectorAll('.filter-chip');
filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
    });
});


/* ==========================================
   19. LIVE STATUS BAR AUTO-SCROLL
   ========================================== */

const liveStatusBar = document.querySelector('.live-status-bar');
if (liveStatusBar) {
    let scrollAmount = 0;
    let direction = 1;

    setInterval(() => {
        if (liveStatusBar.scrollWidth > liveStatusBar.clientWidth) {
            scrollAmount += direction * 0.5;
            if (scrollAmount >= liveStatusBar.scrollWidth - liveStatusBar.clientWidth) {
                direction = -1;
            } else if (scrollAmount <= 0) {
                direction = 1;
            }
            liveStatusBar.scrollLeft = scrollAmount;
        }
    }, 50);
}


/* ==========================================
   20. CONSOLE WELCOME MESSAGE
   ========================================== */

console.log('%c🏝️ OUR MAHESHKHALI', 'color: #d4af37; font-size: 24px; font-weight: bold;');
console.log('%cDeveloped by Badsha Solyman', 'color: #d4af37; font-size: 14px;');
console.log('%cMerchant Mariner • Founder • Web Developer', 'color: #aaaaaa; font-size: 12px;');
console.log('%cBuilding a Digital Future for Maheshkhali', 'color: #d4af37; font-style: italic; font-size: 12px;');
console.log('%c🌐 One Island. One Community. One Platform.', 'color: #00d4ff; font-size: 12px;');/* ==========================================
   SPIN UNIVERSAL LEARNING HUB MODAL
   ========================================== */

const spinModal = document.getElementById('spin-modal');
const spinOverlay = document.getElementById('spin-overlay');
const spinClose = document.getElementById('spin-close');
const fabSpinBtn = document.getElementById('fab-spin');

function openSpinModal() {
    if (spinModal) {
        spinModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeSpinModal() {
    if (spinModal) {
        spinModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// FAB SPIN Button
if (fabSpinBtn) {
    fabSpinBtn.addEventListener('click', openSpinModal);
}

// Close Button
if (spinClose) {
    spinClose.addEventListener('click', closeSpinModal);
}

// Overlay
if (spinOverlay) {
    spinOverlay.addEventListener('click', closeSpinModal);
}

// ESC Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && spinModal && spinModal.classList.contains('open')) {
        closeSpinModal();
    }
});

// Category Cards Click
const spinCatCards = document.querySelectorAll('.spin-cat-card');
spinCatCards.forEach(card => {
    card.addEventListener('click', () => {
        const catName = card.querySelector('.spin-cat-name').textContent.trim();
        if (currentLang === 'bn') {
            alert('🌍 SPIN • ' + catName + '\n\nএই সেকশনটি শীঘ্রই আসছে!');
        } else {
            alert('🌍 SPIN • ' + catName + '\n\nThis section is coming soon!');
        }
    });
});/* ==========================================
   UNION DETAILS MODAL
   ========================================== */

// ইউনিয়নের ডেটা
const unionData = {
    'matarbari': {
        icon: '🏝️',
        title: 'মাতারবাড়ী ইউনিয়ন',
        subtitle: 'Matarbari Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'ইউনিয়ন নম্বর', value: '১ নম্বর' },
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'বিভাগ', value: 'চট্টগ্রাম' },
            { label: 'আয়তন', value: 'প্রায় ১২ বর্গকিমি' },
            { label: 'জনসংখ্যা', value: '~৮০,০০০' },
            { label: 'মোট পরিবার', value: '~১১,৫০০' },
            { label: 'গ্রাম', value: '২৫টি' },
            { label: 'মৌজা', value: '১টি' },
            { label: 'হাট/বাজার', value: '৩টি' },
            { label: 'মোট ভোটার', value: '৪০,৯১৯' },
            { label: 'শিক্ষার হার', value: '৫২%' }
        ],
        sections: [
            {
                title: '📜 ইতিহাস ও ঐতিহ্য',
                text: 'মাতারবাড়ী একটি দীর্ঘদিনের ঐতিহ্যবাহী উপকূলীয় জনপদ। স্থানীয় মানুষের জীবন ও অর্থনীতি ঐতিহাসিকভাবে লবণ উৎপাদন, কৃষিকাজ, মৎস্য আহরণ, নৌযাননির্ভর যোগাযোগ এবং স্থানীয় ব্যবসা-বাণিজ্যের সঙ্গে যুক্ত। সমুদ্র, জোয়ার-ভাটা, উপকূলীয় পরিবেশ এবং জলজ সম্পদ এখানকার মানুষের জীবনযাত্রায় গুরুত্বপূর্ণ ভূমিকা পালন করে আসছে।'
            },
            {
                title: '🏗️ আধুনিক উন্নয়ন',
                text: 'একসময় লবণ, মাছ, কৃষি ও উপকূলীয় জীবনযাত্রার জন্য পরিচিত মাতারবাড়ী বর্তমানে বৃহৎ জাতীয় অবকাঠামো উন্নয়ন কার্যক্রমের সঙ্গে যুক্ত। গভীর সমুদ্রবন্দর, বিদ্যুৎ উৎপাদন, জেটি, সড়ক যোগাযোগ, শিল্পায়ন সম্ভাবনা এবং কর্মসংস্থানের সুযোগ এই অঞ্চলের অর্থনৈতিক গুরুত্ব নতুন মাত্রা দিয়েছে।'
            },
            {
                title: '👤 চেয়ারম্যানদের ইতিহাস',
                list: [
                    '১৯৭৩–১৯৭৮ — আলহাজ্ব আবুল হোছাইন চৌধুরী',
                    '১৯৭৮–১৯৮৩ — আলহাজ্ব ছিদ্দিক আহমদ চৌধুরী',
                    '১৯৮৩–১৯৮৮ — মোস্তাক আহমদ চৌধুরী',
                    '১৯৮৮–১৯৯২ — আলহাজ্ব ছিদ্দিক আহমদ চৌধুরী',
                    '১৯৯২–১৯৯৮ — ডা. কবির আহমদ',
                    '১৯৯৮–২০০৩ — এম. আলতাফ উদ্দিন',
                    '২০০৩–২০১১ — নুরুল ইসলাম, এম.কম.',
                    '২০১১–২০১৬ — এনামুল হক চৌধুরী',
                    '২০১৬–২০২১ — মাস্টার মোহাম্মদ উল্লাহ',
                    '২০২১–বর্তমান — এস. এম. আবু হায়দার'
                ]
            },
            {
                title: '🌾 কৃষি ও লবণ',
                text: 'মাতারবাড়ীর ঐতিহ্যবাহী অর্থনীতির অন্যতম ভিত্তি হলো কৃষি ও লবণ উৎপাদন। উপকূলীয় পরিবেশের সঙ্গে সামঞ্জস্য রেখে লবণক্ষেত, কৃষিকাজ এবং জলজ সম্পদ দীর্ঘদিন ধরে স্থানীয় মানুষের জীবিকা ও অর্থনীতির সঙ্গে যুক্ত।'
            },
            {
                title: '🐟 মৎস্যসম্পদ',
                text: 'সামুদ্রিক মৎস্য আহরণ মাতারবাড়ীর ঐতিহ্যবাহী অর্থনৈতিক কর্মকাণ্ডের একটি গুরুত্বপূর্ণ অংশ। বঙ্গোপসাগরের উপকূলীয় অবস্থানের কারণে সামুদ্রিক সম্পদ স্থানীয় মানুষের জীবন ও জীবিকার সঙ্গে ঘনিষ্ঠভাবে সম্পর্কিত।'
            },
            {
                title: '📚 শিক্ষা',
                cards: [
                    { icon: '🏫', title: 'সরকারি প্রাথমিক', value: '৯টি' },
                    { icon: '🏫', title: 'বেসরকারি রেজি.', value: '২টি' },
                    { icon: '🏫', title: 'উচ্চ বিদ্যালয়', value: '৩টি' },
                    { icon: '📖', title: 'সরকারি মাদ্রাসা', value: '২টি' },
                    { icon: '📖', title: 'বেসরকারি মাদ্রাসা', value: '৭টি' },
                    { icon: '📚', title: 'শিক্ষার হার', value: '৫২%' }
                ]
            }
        ],
        tags: ['🧂 লবণ উৎপাদন', '🐟 সামুদ্রিক মৎস্য', '🌾 কৃষি', '⚓ গভীর সমুদ্রবন্দর', '⚡ বিদ্যুৎ', '🏖️ সমুদ্র সৈকত', '💼 প্রবাসী আয়']
    },

    'dhalghata': {
        icon: '🌊',
        title: 'ধলঘাটা ইউনিয়ন',
        subtitle: 'Dhalghata Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'বিভাগ', value: 'চট্টগ্রাম' },
            { label: 'আয়তন', value: '২১.৬৭ বর্গকিমি' },
            { label: 'জনসংখ্যা', value: '~২০,০০০' },
            { label: 'পুরুষ', value: '১১,৫৬৪' },
            { label: 'নারী', value: '৯,৪৩৬' },
            { label: 'মোট ভোটার', value: '৮,৯৭০' },
            { label: 'মোট পরিবার', value: '২,২৪৮' },
            { label: 'গ্রাম', value: '১৪টি' },
            { label: 'মৌজা', value: '১-২টি' },
            { label: 'হাট-বাজার', value: '৩টি' },
            { label: 'মসজিদ', value: '৪৬টি' },
            { label: 'সাক্ষরতার হার', value: '~৬৩%' }
        ],
        sections: [
            {
                title: '📜 ইতিহাস ও নামকরণ',
                text: 'ধলঘাটা একটি পুরোনো উপকূলীয় জনপদ। স্থানীয় ঐতিহ্য অনুযায়ী প্রায় ১৬৫৯ সালের দিকে এই দ্বীপাঞ্চলে বসতি গড়ে ওঠার কথা বলা হয়। নামকরণ সম্পর্কিত একটি প্রচলিত কাহিনিতে স্থানীয় বীর "ধলাবলী"-র নামের সঙ্গে ধলঘাটার নামের সম্পর্কের কথা বলা হয়।'
            },
            {
                title: '👥 মানুষ ও জনজীবন',
                text: 'উপকূলীয় পরিবেশের কারণে এখানকার মানুষের জীবনযাত্রায় কৃষি, লবণ উৎপাদন, মৎস্য আহরণ, ক্ষুদ্র ব্যবসা ও স্থানীয় শ্রমবাজারের ভূমিকা রয়েছে।'
            },
            {
                title: '🌾 কৃষি ও লবণ উৎপাদন',
                text: 'ধলঘাটা ইউনিয়নের স্থানীয় অর্থনীতিতে কৃষি ও লবণ উৎপাদনের গুরুত্বপূর্ণ ভূমিকা রয়েছে। মোট কৃষিজমি প্রায় ২,৪২০ একর, নিট আবাদি জমি প্রায় ২,০০০ একর। গভীর নলকূপ ১৮টি, অগভীর নলকূপ ২০৭টি।'
            },
            {
                title: '🐟 মৎস্যসম্পদ',
                text: 'উপকূলীয় অবস্থানের কারণে মৎস্যসম্পদ স্থানীয় অর্থনীতির একটি গুরুত্বপূর্ণ অংশ। পুকুর ৫৮টি, বার্ষিক মাছের চাহিদা প্রায় ৬,১৮০ মেট্রিক টন, বার্ষিক উৎপাদন প্রায় ৫,৫১৩ মেট্রিক টন।'
            },
            {
                title: '🏛️ ইউনিয়ন পরিষদ',
                list: [
                    'নির্বাচিত সদস্য — ১৩ জন',
                    'ইউপি সচিব — ১ জন',
                    'ডিজিটাল সেন্টার উদ্যোক্তা — ২ জন',
                    'গ্রাম আদালত — ১টি',
                    'গ্রাম পুলিশ — ৯ জন'
                ]
            },
            {
                title: '📚 শিক্ষা',
                cards: [
                    { icon: '🏫', title: 'সরকারি প্রাথমিক', value: '৪টি' },
                    { icon: '🏫', title: 'বেসরকারি প্রাথমিক', value: '১টি' },
                    { icon: '📖', title: 'উচ্চ বিদ্যালয়', value: '১টি' },
                    { icon: '📖', title: 'দাখিল মাদ্রাসা', value: '১টি' },
                    { icon: '📖', title: 'আলিম মাদ্রাসা', value: '১টি' },
                    { icon: '📚', title: 'সাক্ষরতার হার', value: '~৬৩%' }
                ]
            }
        ],
        tags: ['🌊 বঙ্গোপসাগর', '🏞️ কুহেলিয়া নদী', '🧂 লবণ মাঠ', '🌾 কৃষি', '🐟 মৎস্য', '🏪 ৩টি বাজার']
    },

    'kalarmarchhara': {
        icon: '🌿',
        title: 'কালারমারছড়া ইউনিয়ন',
        subtitle: 'Kalarmarchhara Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'ইউনিয়ন নম্বর', value: '৩ নং' },
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'আয়তন', value: '২৮.৯৮ বর্গকিমি' },
            { label: 'প্রতিষ্ঠা', value: '১৯৩৭*' },
            { label: 'জনসংখ্যা', value: '৬২,৪৮৩' },
            { label: 'পুরুষ', value: '৩২,০৮৩' },
            { label: 'মহিলা', value: '৩০,৪০০' },
            { label: 'মোট পরিবার', value: '৭,৯৬৬' },
            { label: 'গ্রাম', value: '২১টি' },
            { label: 'মৌজা', value: '৫টি' },
            { label: 'মোট ভোটার', value: '৩১,৯৫৭' },
            { label: 'মসজিদ', value: '৫২টি' },
            { label: 'মন্দির', value: '৭টি' },
            { label: 'এতিমখানা', value: '৯টি' }
        ],
        sections: [
            {
                title: '🌿 এক নজরে',
                text: '৩ নং কালারমারছড়া ইউনিয়ন মহেশখালী উপজেলার একটি গুরুত্বপূর্ণ ও প্রাকৃতিক সৌন্দর্যমণ্ডিত উপকূলীয় ইউনিয়ন। পাহাড়, সমুদ্র, নদী, সবুজ প্রকৃতি, কৃষি, লবণ, চিংড়ি ও মৎস্যসম্পদের সমন্বয়ে গড়ে উঠেছে এই জনপদের স্বতন্ত্র জীবনধারা।'
            },
            {
                title: '📜 ইতিহাস',
                text: 'প্রদত্ত ঐতিহাসিক তথ্য অনুযায়ী, ১৯৩৭ সাল থেকে কালারমারছড়া ইউনিয়নের প্রশাসনিক যাত্রার উল্লেখ পাওয়া যায়। তৎকালীন ইউনিয়ন কাউন্সিলের প্রথম প্রেসিডেন্ট হিসেবে মৌলভী বদি উদ্দিন-এর নাম উল্লেখ করা হয়েছে।'
            },
            {
                title: '👤 চেয়ারম্যানদের ইতিহাস',
                list: [
                    'মৌলভী বদি উদ্দিন — প্রথম প্রেসিডেন্ট',
                    'মীর কাসিম চৌধুরী — চেয়ারম্যান',
                    'মোহাম্মদ ওসমান গনি — সাবেক',
                    'রুহুল কাদের বাবুল — সাবেক',
                    'জাবের আহমদ চৌধুরী — সাবেক',
                    'গোলাম কুদ্দুস চৌধুরী — সাবেক',
                    'তারেক বিন ওসমান শরীফ — ২০২২',
                    'আবু আহমদ — ভারপ্রাপ্ত'
                ]
            },
            {
                title: '🌾 কৃষি ও লবণ',
                text: 'মোট জমি ১৩,৫৬০ একর, নিট ফসলি জমি ১,২৬৮ হেক্টর, মোট ফসলি জমি ১,৬০০ হেক্টর। গভীর নলকূপ ১০০টি, অগভীর নলকূপ ২০০টি। চিংড়ি চাষ ৬,৬০০ একর এবং লবণ মাঠ ৬,০০০ একর।'
            },
            {
                title: '📚 শিক্ষা',
                cards: [
                    { icon: '🏫', title: 'সরকারি প্রাথমিক', value: '১১টি' },
                    { icon: '🏫', title: 'উচ্চ বিদ্যালয়', value: '২টি' },
                    { icon: '📖', title: 'দাখিল মাদ্রাসা', value: '৩টি' },
                    { icon: '📖', title: 'আলিম মাদ্রাসা', value: '১টি' },
                    { icon: '📚', title: 'শিক্ষার হার', value: '৩৭%' }
                ]
            },
            {
                title: '🏥 স্বাস্থ্যসেবা',
                cards: [
                    { icon: '🏥', title: 'ইউনিয়ন স্বাস্থ্য কেন্দ্র', value: '১টি' },
                    { icon: '🛏️', title: 'বেড', value: '৫টি' },
                    { icon: '👨‍⚕️', title: 'ডাক্তার পদ', value: '১টি' },
                    { icon: '👩‍⚕️', title: 'সিনিয়র নার্স', value: '১ জন' },
                    { icon: '🏥', title: 'কমিউনিটি ক্লিনিক', value: '৪টি' },
                    { icon: '💊', title: 'সহকারী নার্স', value: '২ জন' }
                ]
            },
            {
                title: '🏗️ গুরুত্বপূর্ণ অবকাঠামো',
                list: [
                    '🧊 আইস ফ্যাক্টরি — ৩টি',
                    '🏭 খাদ্য গুদাম — ১টি',
                    '🏦 ব্যাংক — ২টি',
                    '👮 পুলিশ ফাঁড়ি — ১টি',
                    '🌍 ভূমি অফিস — ১টি',
                    '🏠 আশ্রয় কেন্দ্র — ১৩টি',
                    '📮 পোস্ট অফিস — ১টি'
                ]
            }
        ],
        tags: ['⛰️ পাহাড়', '🌊 বঙ্গোপসাগর', '🏞️ কোহেলিয়া নদী', '🧂 লবণ মাঠ', '🦐 চিংড়ি চাষ', '🐟 মৎস্য', '🏪 ১২টি বাজার']
    },

    'shaplapur': {
        icon: '🌸',
        title: 'শাপলাপুর ইউনিয়ন',
        subtitle: 'Shaplapur Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'ইউনিয়ন নম্বর', value: '৪ নং' },
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'বিভাগ', value: 'চট্টগ্রাম' },
            { label: 'গ্রাম', value: '১৯টি' },
            { label: 'মৌজা', value: '৫টি' },
            { label: 'মোট পরিবার', value: '৪,৯৮৮' },
            { label: 'মসজিদ', value: '৪৪টি' },
            { label: 'মন্দির', value: '৬টি' },
            { label: 'এতিমখানা', value: '৩টি' },
            { label: 'হাট-বাজার', value: '৩টি' },
            { label: 'পোস্ট অফিস', value: '১টি' }
        ],
        sections: [
            {
                title: '🌸 নামের ইতিহাস',
                text: 'শাপলাপুর নামের সঙ্গে স্থানীয় প্রকৃতি ও লোকঐতিহ্যের একটি সুন্দর গল্প জড়িয়ে রয়েছে। স্থানীয় জনশ্রুতি অনুযায়ী, শাপলাপুর বাজার সংলগ্ন সদ্দার পুকুরে একসময় প্রচুর শাপলা ফুল ফুটত। পুকুরজুড়ে শাপলার সমারোহ ছিল এলাকার একটি পরিচিত প্রাকৃতিক বৈশিষ্ট্য।'
            },
            {
                title: '🌿 ভৌগোলিক অবস্থান',
                text: 'শাপলাপুর ইউনিয়নের অন্যতম বৈশিষ্ট্য হলো একই এলাকার মধ্যে পাহাড় ও প্রণালীর সহাবস্থান। পূর্বদিকে মহেশখালী প্রণালী এবং পশ্চিমদিকে পাহাড়ি এলাকা—এই বৈচিত্র্যময় ভূপ্রকৃতির মাঝে গড়ে উঠেছে শাপলাপুরের জনপদ।'
            },
            {
                title: '👤 চেয়ারম্যানদের ইতিহাস',
                list: [
                    '১৯৭৪–১৯৭৫ — জনাব নুরুল হোছাইন',
                    '১৯৭৫–১৯৭৭ — আলহাজ্ব ছিদ্দিক আহমদ',
                    '১৯৭৭–১৯৭৯ — নুরুল আমিন হিলালী',
                    '১৯৭৯–১৯৮৪ — আলহাজ্ব ছিদ্দিক আহমদ',
                    '১৯৮৪–১৯৮৮ — মৌলভী আবদুল কাদের',
                    '১৯৮৮–১৯৯২ — এস. এম. আবদুল খালেক চৌধুরী',
                    '১৯৯২–১৯৯৮ — এস. এম. আবদুল খালেক চৌধুরী',
                    '১৯৯৮–২০০৩ — নাজেম উদ্দিন, বি.এ.',
                    '২০০৩–পরবর্তী — এস. এম. আবদুল খালেক চৌধুরী',
                    '২০২৫ — নুরুল হক'
                ]
            },
            {
                title: '🏝️ দর্শনীয় স্থান',
                list: [
                    '🌸 সদ্দার পুকুর ও শাপলাপুর বাজার',
                    '⛰️ শাপলাপুর পাহাড় ও মহেশখালী প্রণালী',
                    '🌊 উপকূলীয় প্রাকৃতিক দৃশ্য'
                ]
            },
            {
                title: '🕌 ধর্মীয় প্রতিষ্ঠান',
                cards: [
                    { icon: '🕌', title: 'মসজিদ', value: '৪৪টি' },
                    { icon: '🛕', title: 'মন্দির', value: '৬টি' },
                    { icon: '🏠', title: 'এতিমখানা', value: '৩টি' },
                    { icon: '🏪', title: 'হাট-বাজার', value: '৩টি' },
                    { icon: '📮', title: 'পোস্ট অফিস', value: '১টি' },
                    { icon: '👥', title: 'পরিষদ সদস্য', value: '১৩ জন' }
                ]
            }
        ],
        tags: ['🌸 শাপলা ঐতিহ্য', '⛰️ পাহাড়', '🌊 প্রণালী', '🌾 কৃষি', '🐟 মৎস্য', '🏪 ৩টি বাজার']
    },

    'hoanak': {
        icon: '🌿',
        title: 'নম্বর হোয়ানক ইউনিয়ন',
        subtitle: 'Hoanak Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'ইউনিয়ন নম্বর', value: '২ নম্বর' },
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'আয়তন', value: '~৩৮ বর্গ কিমি' },
            { label: 'গ্রাম', value: '২৭টি' },
            { label: 'মৌজা', value: '৪টি' },
            { label: 'পরিবার', value: '~৯,৩৭৩' },
            { label: 'জনসংখ্যা', value: '৫১,৫৮৭ (২০১১)' },
            { label: 'পুরুষ', value: '২৬,৫১৫' },
            { label: 'মহিলা', value: '২৫,০৭২' },
            { label: 'ভোটার', value: '৩০,০৩৮ (২০২৩)' },
            { label: 'হাট-বাজার', value: '১১টি' },
            { label: 'মসজিদ', value: '~৫১টি' },
            { label: 'মন্দির', value: '১৪টি' }
        ],
        sections: [
            {
                title: '🌿 এক নজরে',
                text: 'হোয়ানক ইউনিয়ন মহেশখালী উপজেলার একটি ঐতিহ্যবাহী ও গুরুত্বপূর্ণ উপকূলীয় ইউনিয়ন। পাহাড়, কৃষি, মৎস্যসম্পদ, গ্রামীণ জনপদ, স্থানীয় বাজার, ধর্মীয় ও সামাজিক প্রতিষ্ঠান এবং বিভিন্ন ক্ষুদ্র ব্যবসা ও শিল্পকে কেন্দ্র করে এই ইউনিয়নের মানুষের জীবনযাত্রা গড়ে উঠেছে।'
            },
            {
                title: '📜 ইতিহাস',
                text: 'স্থানীয় ইতিহাসে হোয়ানকের সঙ্গে রাখাইন জনগোষ্ঠীর প্রাচীন বসতির সম্পর্কের কথা উল্লেখ করা হয়। "হোয়া মগ" নামে একজন রাখাইন ব্যক্তির বসতি স্থাপন ও তাঁর নামের সঙ্গে এলাকার নামের সম্পর্কের একটি স্থানীয় ঐতিহাসিক বর্ণনা প্রচলিত রয়েছে। প্রায় ১৮০০ সালের দিকে এই বসতির কথা বলা হয়।'
            },
            {
                title: '👤 চেয়ারম্যানদের ইতিহাস',
                list: [
                    '২০১২–২০১৬ — জনাব এনামুল করিম চৌধুরী',
                    '২০২১ — আলহাজ্ব মীর কাশেম (৬,০৩৩ ভোট)',
                    'বর্তমান — আলহাজ্ব মীর কাশেম (বি.এ.)'
                ]
            },
            {
                title: '📚 শিক্ষা',
                cards: [
                    { icon: '🏫', title: 'সরকারি প্রাথমিক', value: '১০টি' },
                    { icon: '🏫', title: 'নিম্ন মাধ্যমিক', value: '৩টি' },
                    { icon: '🏫', title: 'মাধ্যমিক', value: '৩টি' },
                    { icon: '📖', title: 'দাখিল মাদ্রাসা', value: '৩টি' },
                    { icon: '🎓', title: 'কলেজ', value: '১টি' },
                    { icon: '📚', title: 'শিক্ষার হার', value: '৩১.১%' }
                ]
            },
            {
                title: '🏥 স্বাস্থ্যসেবা',
                cards: [
                    { icon: '🏥', title: 'ইউনিয়ন স্বাস্থ্য কেন্দ্র', value: '১টি' },
                    { icon: '🏥', title: 'কমিউনিটি ক্লিনিক', value: '৫টি' },
                    { icon: '👨‍⚕️', title: 'মেডিকেল অফিসার', value: '১ জন' },
                    { icon: '👩‍⚕️', title: 'পরিবার পরিদর্শিকা', value: '১ জন' },
                    { icon: '💊', title: 'স্বাস্থ্য সহকারী', value: '৬ জন' },
                    { icon: '🏥', title: 'হেলথ প্রোভাইডার', value: '৫ জন' }
                ]
            },
            {
                title: '🏪 হাট-বাজার',
                text: 'হোয়ানক ইউনিয়নে ১১টি হাট-বাজার রয়েছে। এছাড়াও ১৫টি ক্ষুদ্র ও কুটির শিল্প এবং ২টি বৃহৎ শিল্প রয়েছে।'
            }
        ],
        tags: ['⛰️ পাহাড়', '🌾 কৃষি', '🐟 মৎস্য', '🏪 ১১টি বাজার', '🏭 কুটির শিল্প', '🌊 উপকূলীয়']
    },

    'bara-maheshkhali': {
        icon: '🏝️',
        title: 'বড় মহেশখালী ইউনিয়ন',
        subtitle: 'Bara Maheshkhali Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'ইউনিয়ন নম্বর', value: '৬ নং' },
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'আয়তন', value: '১৫.৬৭ কিমি²' },
            { label: 'জনসংখ্যা', value: '~৭০,৫৬৪' },
            { label: 'পুরুষ', value: '~৩৫,৫৬৪' },
            { label: 'মহিলা', value: '~৩৫,০০০' },
            { label: 'মোট পরিবার', value: '~১৪,০০০' },
            { label: 'গ্রাম', value: '২৭টি' },
            { label: 'মৌজা', value: '৩টি' },
            { label: 'মসজিদ', value: '৭৬টি' },
            { label: 'মন্দির', value: '৭টি' },
            { label: 'হাট-বাজার', value: '৪টি' },
            { label: 'এতিমখানা', value: '৫টি' }
        ],
        sections: [
            {
                title: '🌿 এক নজরে',
                text: 'বড় মহেশখালী বাংলাদেশের কক্সবাজার জেলার মহেশখালী উপজেলার একটি প্রাচীন, গুরুত্বপূর্ণ ও সম্ভাবনাময় উপকূলীয় ইউনিয়ন। বঙ্গোপসাগরের উপকূল, নদী, পাহাড়ের পাদদেশ, কৃষিজমি, লবণ মাঠ ও সবুজ পানের বরজকে ঘিরে গড়ে উঠেছে এই জনপদের স্বতন্ত্র ভূপ্রকৃতি ও জীবনধারা।'
            },
            {
                title: '🌊 প্রকৃতি ও অর্থনীতি',
                text: 'বড় মহেশখালীর জীবন ও অর্থনীতি মূলত উপকূলীয় প্রকৃতি ও স্থানীয় সম্পদের সঙ্গে গভীরভাবে যুক্ত। বিস্তীর্ণ লবণ মাঠ, কৃষিজমি ও সবুজ পানের বরজ বড় মহেশখালীর গ্রামীণ অর্থনীতির পাশাপাশি এর প্রাকৃতিক সৌন্দর্যেও আলাদা বৈশিষ্ট্য যোগ করেছে।'
            },
            {
                title: '👤 চেয়ারম্যানদের ইতিহাস',
                list: [
                    '১৯৭০-এর দশক — আলহাজ্ব আনোয়ার পাশা চৌধুরী',
                    '১৯৭৭–১৯৯২ — আলহাজ্ব সিরাজুল হক',
                    '২০১২–২০১৫ — মোহাম্মদ শরীফ বাদশাহ',
                    '২০২২–বর্তমান — শা. আ. ম. এনায়েত উল্লাহ বাবুল (২৪ জুলাই ২০২২ থেকে)'
                ]
            },
            {
                title: '🕌 ধর্মীয় প্রতিষ্ঠান',
                cards: [
                    { icon: '🕌', title: 'মসজিদ', value: '৭৬টি' },
                    { icon: '🛕', title: 'মন্দির', value: '৭টি' },
                    { icon: '🏠', title: 'এতিমখানা', value: '৫টি' },
                    { icon: '🏪', title: 'হাট-বাজার', value: '৪টি' },
                    { icon: '📮', title: 'পোস্ট অফিস', value: '১টি' },
                    { icon: '🏭', title: 'বৃহৎ শিল্প', value: '৫টি' }
                ]
            },
            {
                title: '🚀 ভবিষ্যৎ সম্ভাবনা',
                list: [
                    '🌾 আধুনিক কৃষি',
                    '🧂 উন্নত লবণ উৎপাদন',
                    '🐟 মৎস্য ও জলজ সম্পদ',
                    '🌿 পান চাষের উন্নয়ন',
                    '💼 স্থানীয় ব্যবসা ও SME',
                    '👩‍💼 নারী উদ্যোক্তা উন্নয়ন',
                    '👨‍💻 যুব দক্ষতা উন্নয়ন',
                    '🌐 ডিজিটাল সেবা'
                ]
            }
        ],
        tags: ['🧂 লবণ মাঠ', '🌿 পান চাষ', '🌾 কৃষি', '🐟 মৎস্য', '🏪 ৪টি বাজার', '⛰️ পাহাড়ের পাদদেশ']
    },

    'kutubjom': {
        icon: '🏝️',
        title: 'কুতুবজোম ইউনিয়ন',
        subtitle: 'Kutubjom Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'আয়তন', value: '২৪.৯৬ কিমি²' },
            { label: 'ওয়ার্ড', value: '৯টি' },
            { label: 'মৌজা', value: '৩টি' },
            { label: 'গ্রাম', value: '১০টি' },
            { label: 'মোট ভোটার', value: '২৫,৮৬৩' },
            { label: 'ইউনিয়ন স্বাস্থ্য কেন্দ্র', value: '১টি' },
            { label: 'কমিউনিটি ক্লিনিক', value: '৩টি' },
            { label: 'হাট-বাজার', value: '৩টি' }
        ],
        sections: [
            {
                title: '🌿 এক নজরে',
                text: 'কুতুবজোম মহেশখালী উপজেলার একটি ঐতিহাসিক ও উপকূলীয় ইউনিয়ন। প্রাচীন বাণিজ্যপথ, নদী ও সমুদ্রঘেরা ভৌগোলিক পরিবেশ, মৎস্যসম্পদ, লবণ চাষ এবং স্থানীয় ব্যবসা-বাণিজ্যের কারণে ইউনিয়নটির রয়েছে স্বতন্ত্র অর্থনৈতিক ও সাংস্কৃতিক বৈশিষ্ট্য।'
            },
            {
                title: '🏝️ সোনাদিয়া দ্বীপ',
                text: 'কুতুবজোম ইউনিয়নের অন্যতম গুরুত্বপূর্ণ প্রাকৃতিক ও পরিবেশগত সম্পদ হলো সোনাদিয়া দ্বীপ। সোনাদিয়ার উপকূলীয় অঞ্চল, ম্যানগ্রোভ বনাঞ্চল ও সমুদ্রসৈকত এই এলাকার প্রাকৃতিক বৈচিত্র্যকে বিশেষভাবে তুলে ধরে।'
            },
            {
                title: '🏘️ গ্রাম তালিকা',
                list: [
                    'কুতুবজোম',
                    'ঘটিভাঙ্গা',
                    'সোনাদিয়া',
                    'তাজিয়াকাটা',
                    'মেহেরিয়াপাড়া',
                    'খোন্দকারপাড়া',
                    'লাল মো. সিকদারপাড়া',
                    'দাইল্যারপাড়া',
                    'পশ্চিমপাড়া',
                    'নয়াপাড়া'
                ]
            },
            {
                title: '📚 শিক্ষা প্রতিষ্ঠান',
                list: [
                    'সোনাদিয়া সরকারি প্রাথমিক বিদ্যালয়',
                    'কুতুবজোম সরকারি প্রাথমিক বিদ্যালয়',
                    'কুতুবজোম আদর্শ উচ্চ বিদ্যালয়',
                    'কুতুবজোম অফশোর উচ্চ বিদ্যালয়',
                    'কুতুবজোম জামেয়া সুন্নিয়া দাখিল মাদ্রাসা',
                    'তাজিয়াকাটা সোমাইয়া মহিলা দাখিল মাদ্রাসা'
                ]
            },
            {
                title: '🛒 হাট-বাজার',
                list: [
                    '🛒 কুতুবজোম বাজার',
                    '🛒 ঘটিভাঙ্গা বাজার',
                    '🛒 সোনাদিয়া বাজার'
                ]
            },
            {
                title: '🚀 ভবিষ্যৎ সম্ভাবনা',
                list: [
                    '🌊 পরিবেশবান্ধব উপকূলীয় পর্যটন',
                    '🌿 ম্যানগ্রোভ সংরক্ষণ',
                    '🐟 মৎস্যভিত্তিক অর্থনীতি',
                    '🧂 আধুনিক লবণ শিল্প',
                    '🌾 কৃষি আধুনিকীকরণ',
                    '💻 ডিজিটাল ব্যবসা',
                    '👨‍💻 যুব দক্ষতা উন্নয়ন'
                ]
            }
        ],
        tags: ['🏝️ সোনাদিয়া দ্বীপ', '🌿 ম্যানগ্রোভ বন', '🏖️ সমুদ্রসৈকত', '🐟 মৎস্য', '🧂 লবণ চাষ', '🏛️ ঐতিহাসিক']
    },

    'chhota-maheshkhali': {
        icon: '🏝️',
        title: 'ছোট মহেশখালী ইউনিয়ন',
        subtitle: 'Chhota Maheshkhali Union • Maheshkhali • Cox\'s Bazar',
        info: [
            { label: 'উপজেলা', value: 'মহেশখালী' },
            { label: 'জেলা', value: 'কক্সবাজার' },
            { label: 'বিভাগ', value: 'চট্টগ্রাম' },
            { label: 'অবস্থা', value: 'তথ্য সংগ্রহ চলছে' }
        ],
        sections: [
            {
                title: '📌 তথ্য সংগ্রহ চলছে',
                text: 'ছোট মহেশখালী ইউনিয়নের বিস্তারিত তথ্য সংগ্রহ ও যাচাই করার পর এই অংশে পূর্ণাঙ্গ তথ্য যুক্ত করা হবে। মহেশখালী উপজেলার একটি গুরুত্বপূর্ণ ইউনিয়ন হিসেবে এর প্রশাসনিক, ভৌগোলিক, ঐতিহাসিক, শিক্ষা, স্বাস্থ্য, অর্থনীতি ও স্থানীয় তথ্য এখানে সংরক্ষিত হবে।'
            }
        ],
        tags: ['📌 তথ্য সংগ্রহ চলছে', '📝 যাচাই প্রক্রিয়াধীন']
    }
};

// Modal খোলার ফাংশন
function openUnionModal(unionKey) {
    const modal = document.getElementById('union-modal');
    const body = document.getElementById('union-modal-body');
    const title = document.getElementById('um-title');
    const subtitle = document.getElementById('um-subtitle');
    const icon = document.getElementById('um-icon');

    if (!modal || !unionData[unionKey]) return;

    const data = unionData[unionKey];

    icon.textContent = data.icon;
    title.textContent = data.title;
    subtitle.textContent = data.subtitle;

    // Build body content
    let html = '';

    // Info section
    if (data.info && data.info.length > 0) {
        html += '<div class="um-section">';
        html += '<h3 class="um-section-title">📊 সাধারণ তথ্য</h3>';
        html += '<div class="um-info-grid">';
        data.info.forEach(item => {
            html += `
                <div class="um-info-item">
                    <span class="um-info-label">${item.label}</span>
                    <span class="um-info-value">${item.value}</span>
                </div>
            `;
        });
        html += '</div></div>';
    }

    // Sections
    if (data.sections) {
        data.sections.forEach(section => {
            html += '<div class="um-section">';
            html += `<h3 class="um-section-title">${section.title}</h3>`;

            if (section.text) {
                html += `<p class="um-text">${section.text}</p>`;
            }

            if (section.list) {
                html += '<ul class="um-chairman-list">';
                section.list.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += '</ul>';
            }

            if (section.cards) {
                html += '<div class="um-cards-grid">';
                section.cards.forEach(card => {
                    html += `
                        <div class="um-card">
                            <span class="um-card-icon">${card.icon}</span>
                            <div class="um-card-title">${card.title}</div>
                            <div class="um-card-value">${card.value}</div>
                        </div>
                    `;
                });
                html += '</div>';
            }

            html += '</div>';
        });
    }

    // Tags
    if (data.tags && data.tags.length > 0) {
        html += '<div class="um-section">';
        html += '<h3 class="um-section-title">🏷️ বৈশিষ্ট্য</h3>';
        html += '<div class="um-tags">';
        data.tags.forEach(tag => {
            html += `<span class="um-tag">${tag}</span>`;
        });
        html += '</div></div>';
    }

    // Google Maps button
    html += '<div class="um-section" style="text-align: center;">';
    html += '<h3 class="um-section-title" style="justify-content: center;">📍 Google Maps</h3>';
    html += `<a href="https://www.google.com/maps/search/${encodeURIComponent(data.title)}" target="_blank" class="um-maps-btn">🗺️ Google Maps-এ দেখুন →</a>`;
    html += '</div>';

    body.innerHTML = html;

    // Open modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

// Modal বন্ধ করার ফাংশন
function closeUnionModal() {
    const modal = document.getElementById('union-modal');
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const udcBtns = document.querySelectorAll('.udc-btn[data-union]');
    udcBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const unionKey = btn.getAttribute('data-union');
            openUnionModal(unionKey);
        });
    });

    const modalClose = document.getElementById('union-modal-close');
    const modalOverlay = document.getElementById('union-modal-overlay');

    if (modalClose) modalClose.addEventListener('click', closeUnionModal);
    if (modalOverlay) modalOverlay.addEventListener('click', closeUnionModal);

    // ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('union-modal');
            if (modal && modal.classList.contains('open')) {
                closeUnionModal();
            }
        }
    });
});/* ==========================================
   UNIVERSAL SEARCH SYSTEM
   ========================================== */

// Search Database
const searchDatabase = [
    // Developer
    {
        title: 'Badsha Solyman',
        desc: 'Merchant Mariner • Founder • Web Developer • Founder of Our Maheshkhali',
        icon: '👤',
        tag: 'Developer',
        keywords: ['badsha', 'solyman', 'developer', 'founder', 'merchant', 'mariner', 'web developer', 'badsha solyman', 'সোলেমান', 'বাদশা', 'ডেভেলপার'],
        action: 'developer'
    },
    // Unions
    { title: 'মাতারবাড়ী ইউনিয়ন', desc: 'Matarbari Union — গভীর সমুদ্রবন্দর, লবণ, মৎস্য', icon: '🏝️', tag: 'Union', keywords: ['matarbari', 'মাতারবাড়ী', 'matarbari union'], action: 'matarbari' },
    { title: 'ধলঘাটা ইউনিয়ন', desc: 'Dhalghata Union — উপকূলীয় ইউনিয়ন, লবণ, মৎস্য', icon: '🌊', tag: 'Union', keywords: ['dhalghata', 'ধলঘাটা', 'dhalghata union'], action: 'dhalghata' },
    { title: 'কালারমারছড়া ইউনিয়ন', desc: 'Kalarmarchhara Union — পাহাড়, চিংড়ি, লবণ', icon: '🌿', tag: 'Union', keywords: ['kalarmarchhara', 'কালারমারছড়া', 'kalarmarchhara union'], action: 'kalarmarchhara' },
    { title: 'শাপলাপুর ইউনিয়ন', desc: 'Shaplapur Union — পাহাড়, প্রণালী, শাপলা ঐতিহ্য', icon: '🌸', tag: 'Union', keywords: ['shaplapur', 'শাপলাপুর', 'shaplapur union'], action: 'shaplapur' },
    { title: 'হোয়ানক ইউনিয়ন', desc: 'Hoanak Union — রাখাইন ঐতিহ্য, পাহাড়, কৃষি', icon: '🌿', tag: 'Union', keywords: ['hoanak', 'হোয়ানক', 'hoanak union'], action: 'hoanak' },
    { title: 'বড় মহেশখালী ইউনিয়ন', desc: 'Bara Maheshkhali Union — লবণ, পান চাষ', icon: '🏝️', tag: 'Union', keywords: ['bara maheshkhali', 'বড় মহেশখালী'], action: 'bara-maheshkhali' },
    { title: 'কুতুবজোম ইউনিয়ন', desc: 'Kutubjom Union — সোনাদিয়া দ্বীপ, ম্যানগ্রোভ', icon: '🏝️', tag: 'Union', keywords: ['kutubjom', 'কুতুবজোম', 'সোনাদিয়া', 'sonadia'], action: 'kutubjom' },
    { title: 'ছোট মহেশখালী ইউনিয়ন', desc: 'Chhota Maheshkhali Union', icon: '🏝️', tag: 'Union', keywords: ['chhota maheshkhali', 'ছোট মহেশখালী'], action: 'chhota-maheshkhali' },
    
    // Sections
    { title: 'About Maheshkhali', desc: 'মহেশখালী সম্পর্কে জানুন — ইতিহাস, ঐতিহ্য, প্রকৃতি', icon: '📖', tag: 'Section', keywords: ['about', 'পরিচিতি', 'সম্পর্কে', 'ইতিহাস'], action: 'section-about' },
    { title: 'মহেশখালীর বিস্তারিত তথ্য', desc: 'Profile Data — প্রশাসন, জনসংখ্যা, শিক্ষা', icon: '📊', tag: 'Section', keywords: ['profile', 'data', 'তথ্য', 'জনসংখ্যা'], action: 'section-profile' },
    { title: 'History & Heritage', desc: 'মহেশখালীর ইতিহাস, ঐতিহ্য ও নামকরণ', icon: '🏛️', tag: 'Section', keywords: ['history', 'ইতিহাস', 'heritage', 'ঐতিহ্য'], action: 'section-history' },
    { title: 'Education Directory', desc: 'শিক্ষা প্রতিষ্ঠান ও কলেজ, মাদ্রাসা', icon: '🎓', tag: 'Section', keywords: ['education', 'শিক্ষা', 'স্কুল', 'কলেজ', 'মাদ্রাসা'], action: 'section-education' },
    { title: 'Health Services', desc: 'হাসপাতাল, ক্লিনিক, কমিউনিটি স্বাস্থ্যসেবা', icon: '🏥', tag: 'Section', keywords: ['health', 'স্বাস্থ্য', 'হাসপাতাল', 'ক্লিনিক'], action: 'section-health' },
    { title: 'Explore Maheshkhali', desc: 'পর্যটন — আদিনাথ মন্দির, মৈনাক পাহাড়, সোনাদিয়া', icon: '🧭', tag: 'Section', keywords: ['explore', 'tourism', 'পর্যটন', 'আদিনাথ', 'মৈনাক', 'সোনাদিয়া'], action: 'section-explore' },
    { title: 'Food & Culture', desc: 'স্থানীয় খাবার, শুটকি, সংস্কৃতি', icon: '🍽️', tag: 'Section', keywords: ['food', 'খাবার', 'শুটকি', 'culture', 'সংস্কৃতি'], action: 'section-food' },
    { title: 'Local Products', desc: 'লবণ, মাছ, চিংড়ি, শুটকি, পান', icon: '🛍️', tag: 'Section', keywords: ['products', 'পণ্য', 'লবণ', 'salt', 'চিংড়ি'], action: 'section-products' },
    { title: 'Business Directory', desc: 'ব্যবসা, উদ্যোক্তা, দোকান', icon: '🏪', tag: 'Section', keywords: ['business', 'ব্যবসা', 'উদ্যোক্তা'], action: 'section-business' },
    { title: 'Community', desc: 'কমিউনিটি, সদস্য, সংগঠন', icon: '👥', tag: 'Section', keywords: ['community', 'কমিউনিটি', 'সদস্য'], action: 'section-community' },
    { title: 'Interactive Map', desc: 'ডিজিটাল ম্যাপ, ইউনিয়ন, গ্রাম', icon: '🗺️', tag: 'Section', keywords: ['map', 'ম্যাপ', 'location', 'লোকেশন'], action: 'section-map' },
    { title: 'Emergency Numbers', desc: 'অ্যাম্বুলেন্স, পুলিশ, ফায়ার সার্ভিস, হাসপাতাল', icon: '🚨', tag: 'Section', keywords: ['emergency', 'ইমার্জেন্সি', 'অ্যাম্বুলেন্স', 'পুলিশ'], action: 'section-emergency' },
    { title: 'SPIN Learning Hub', desc: 'Universal Learning — Typing, AI, Business, Research', icon: '🌍', tag: 'Tool', keywords: ['spin', 'learning', 'শেখা', 'টুল', 'hub'], action: 'spin' },
    
    // Tools
    { title: 'BS~9Q-5F Mindmap Method', desc: 'স্ট্রাকচার্ড থিংকিং ও প্রবলেম সলভিং ফ্রেমওয়ার্ক', icon: '🧠', tag: 'Tool', keywords: ['mindmap', 'bs9q5f', 'bs~9q-5f', 'thinking'], action: 'spin' },
    { title: 'Typing Test', desc: 'টাইপিং টেস্ট ও প্র্যাকটিস', icon: '⌨️', tag: 'Tool', keywords: ['typing', 'টাইপিং'], action: 'spin' },
    { title: 'AI World', desc: 'Artificial Intelligence শেখা ও রিসোর্স', icon: '🤖', tag: 'Tool', keywords: ['ai', 'artificial intelligence', 'এআই'], action: 'spin' },
    { title: 'Islamic Resources', desc: 'কুরআন, হাদিস, ইসলামিক শিক্ষা', icon: '🕌', tag: 'Tool', keywords: ['islamic', 'ইসলামিক', 'কুরআন', 'quran'], action: 'spin' }
];

// Search Modal
const searchModal = document.getElementById('search-modal');
const searchOverlay = document.getElementById('search-overlay');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const searchClear = document.getElementById('search-clear');
const searchResults = document.getElementById('search-results');

function openSearchModal() {
    if (searchModal) {
        searchModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 300);
    }
}

function closeSearchModal() {
    if (searchModal) {
        searchModal.classList.remove('open');
        document.body.style.overflow = '';
        if (searchInput) searchInput.value = '';
        if (searchClear) searchClear.classList.remove('visible');
        renderEmptySearch();
    }
}

function renderEmptySearch() {
    if (!searchResults) return;
    searchResults.innerHTML = `
        <div class="search-empty">
            <span class="search-empty-icon">🔍</span>
            <p>কিছু লিখুন এবং ফলাফল দেখুন</p>
            <small>Search Everything. Discover Everything.</small>
        </div>
    `;
}

function performSearch(query) {
    if (!searchResults) return;
    const q = query.toLowerCase().trim();

    if (!q) {
        renderEmptySearch();
        return;
    }

    const results = searchDatabase.filter(item => {
        if (item.title.toLowerCase().includes(q)) return true;
        if (item.desc.toLowerCase().includes(q)) return true;
        if (item.tag.toLowerCase().includes(q)) return true;
        if (item.keywords && item.keywords.some(k => k.toLowerCase().includes(q))) return true;
        return false;
    });

    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-empty">
                <span class="search-empty-icon">😔</span>
                <p>"${query}" এর জন্য কিছু পাওয়া যায়নি</p>
                <small>অন্য কিছু চেষ্টা করুন</small>
            </div>
        `;
        return;
    }

    let html = `<p style="color: #888; font-size: 0.75rem; margin-bottom: 12px; letter-spacing: 1px;">${results.length}টি ফলাফল পাওয়া গেছে</p>`;
    
    results.forEach((item, index) => {
        html += `
            <div class="search-result-item" data-action="${item.action}" data-index="${index}">
                <div class="search-result-icon">${item.icon}</div>
                <div class="search-result-info">
                    <div class="search-result-title">${item.title}</div>
                    <div class="search-result-desc">${item.desc}</div>
                </div>
                <div class="search-result-tag">${item.tag}</div>
            </div>
        `;
    });

    searchResults.innerHTML = html;

    // Click events
    searchResults.querySelectorAll('.search-result-item').forEach(el => {
        el.addEventListener('click', () => {
            const action = el.getAttribute('data-action');
            handleSearchAction(action);
        });
    });
}

function handleSearchAction(action) {
    closeSearchModal();

    // Developer
    if (action === 'developer') {
        setTimeout(() => openDeveloperModal(), 300);
        return;
    }

    // Union
    if (unionData && unionData[action]) {
        setTimeout(() => openUnionModal(action), 300);
        return;
    }

    // Section scrolling
    if (action.startsWith('section-')) {
        const sectionId = action.replace('section-', '');
        const target = document.getElementById(sectionId);
        if (target) {
            setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 300);
        }
        return;
    }

    // SPIN
    if (action === 'spin') {
        setTimeout(() => {
            const spinBtn = document.getElementById('fab-spin');
            if (spinBtn) spinBtn.click();
        }, 300);
        return;
    }
}

// Search Events
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (searchClear) {
            if (val.length > 0) searchClear.classList.add('visible');
            else searchClear.classList.remove('visible');
        }
        performSearch(val);
    });
}

if (searchClear) {
    searchClear.addEventListener('click', () => {
        searchInput.value = '';
        searchClear.classList.remove('visible');
        renderEmptySearch();
        searchInput.focus();
    });
}

if (searchClose) searchClose.addEventListener('click', closeSearchModal);
if (searchOverlay) searchOverlay.addEventListener('click', closeSearchModal);

// Suggest chips
const suggestChips = document.querySelectorAll('.suggest-chip');
suggestChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const text = chip.getAttribute('data-search');
        if (searchInput) {
            searchInput.value = text;
            searchClear.classList.add('visible');
            performSearch(text);
            searchInput.focus();
        }
    });
});

// ESC key for search
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (searchModal && searchModal.classList.contains('open')) closeSearchModal();
    }
    // Ctrl+K or / opens search
    if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && !e.target.matches('input, textarea'))) {
        e.preventDefault();
        openSearchModal();
    }
});

// TopBar Search button
const searchBtnTop = document.getElementById('search-btn');
if (searchBtnTop) {
    searchBtnTop.addEventListener('click', openSearchModal);
}

// Sidebar Search link
const sidebarSearchLink = document.querySelector('.sidebar-link[data-page="search"]');
if (sidebarSearchLink) {
    sidebarSearchLink.addEventListener('click', (e) => {
        e.preventDefault();
        closeSidebar();
        setTimeout(() => openSearchModal(), 300);
    });
}


/* ==========================================
   DEVELOPER PROFILE MODAL
   ========================================== */

const developerModal = document.getElementById('developer-modal');
const developerOverlay = document.getElementById('developer-overlay');
const developerClose = document.getElementById('developer-close');

function openDeveloperModal() {
    if (developerModal) {
        developerModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeDeveloperModal() {
    if (developerModal) {
        developerModal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

if (developerClose) developerClose.addEventListener('click', closeDeveloperModal);
if (developerOverlay) developerOverlay.addEventListener('click', closeDeveloperModal);

// ESC for developer modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (developerModal && developerModal.classList.contains('open')) closeDeveloperModal();
    }
});

// Profile button opens developer modal (if not logged in)
const profileBtnTop = document.getElementById('profile-btn');
if (profileBtnTop) {
    // Replace old alert with modal
    profileBtnTop.replaceWith(profileBtnTop.cloneNode(true));
    const newProfileBtn = document.getElementById('profile-btn');
    newProfileBtn.addEventListener('click', () => {
        openDeveloperModal();
    });
}

// Footer developer name click
document.addEventListener('click', (e) => {
    if (e.target.matches('.dev-name, .footer-name, .dev-brand')) {
        openDeveloperModal();
    }
});