/**
 * i18n.js - Custom Translation Dictionary for JS Alerts & Google Translate logic
 */

const alertTranslations = {
    // Auth & General
    "Эхлээд нэвтэрнэ үү! (Please login first)": { mn: "Эхлээд нэвтэрнэ үү! (Please login first)", en: "Please login first!" },
    "Амжилттай нэвтэрлээ!": { mn: "Амжилттай нэвтэрлээ!", en: "Successfully logged in!" },
    "Амжилттай гарлаа!": { mn: "Амжилттай гарлаа!", en: "Logged out successfully!" },
    "Системээс гарлаа": { mn: "Системээс гарлаа", en: "Logged out of the system" },
    "Амжилттай бүртгүүллээ. Одоо нэвтэрнэ үү.": { mn: "Амжилттай бүртгүүллээ. Одоо нэвтэрнэ үү.", en: "Registration successful. Please login now." },
    "Сүлжээний алдаа": { mn: "Сүлжээний алдаа", en: "Network error" },
    "Сүлжээний алдаа (Network Error)": { mn: "Сүлжээний алдаа (Network Error)", en: "Network Error" },

    // Purchasing
    "Үлдэгдэл хүрэлцэхгүй байна.": { mn: "Үлдэгдэл хүрэлцэхгүй байна.", en: "Insufficient balance." },
    "Үлдэгдэл хүрэлцэхгүй байна. Цэнэглэнэ үү.": { mn: "Үлдэгдэл хүрэлцэхгүй байна. Цэнэглэнэ үү.", en: "Insufficient balance. Please recharge." },
    "Дугаар сонгоно уу.": { mn: "Дугаар сонгоно уу.", en: "Please select numbers." },
    "Амжилттай худалдан авлаа!": { mn: "Амжилттай худалдан авлаа!", en: "Purchase successful!" },
    "Таны худалдан авалт амжилттай боллоо! Амжилт хүсье.": { mn: "Таны худалдан авалт амжилттай боллоо! Амжилт хүсье.", en: "Purchase successful! Good luck." },
    "Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.": { mn: "Таны худалдан авалт амжилттай боллоо! Тоглоомыг эхлүүлнэ үү.", en: "Purchase successful! Please start the game." },
    "Таны худалдан авалт амжилттай боллоо!": { mn: "Таны худалдан авалт амжилттай боллоо!", en: "Purchase successful!" },
    "Худалдаж авах тоглоом сонгоно уу.": { mn: "Худалдаж авах тоглоом сонгоно уу.", en: "Please select a game to purchase." },

    // Game Specific
    "Та 2-оос 10 хүртэлх дугаар сонгоно уу.": { mn: "Та 2-оос 10 хүртэлх дугаар сонгоно уу.", en: "Please select between 2 to 10 numbers." },
    "Та 24 дугаар сонгоно уу.": { mn: "Та 24 дугаар сонгоно уу.", en: "Please select 24 numbers." },
};

function getLanguage() {
    return localStorage.getItem('az_lang') || 'mn';
}

function setAppLanguage(lang) {
    localStorage.setItem('az_lang', lang);

    // Update our custom dropdowns
    document.querySelectorAll('.lang-switcher').forEach(select => {
        select.value = lang;
    });

    // Trigger Google Translate dropdown
    triggerGoogleTranslate(lang);
}

function triggerGoogleTranslate(lang) {
    const gtSelect = document.querySelector('.goog-te-combo');
    if (gtSelect) {
        gtSelect.value = lang;
        gtSelect.dispatchEvent(new Event('change'));
    }
}

// Global translate function for JS alerts (since GT doesn't translate JS alerts)
window.t = function (key) {
    const lang = getLanguage();

    // We sometimes have dynamic strings like `Таны худалдан авалт амжилттай боллоо! (10,000₮)`.
    // Try to match the base sentence.
    for (const dictKey in alertTranslations) {
        if (key.startsWith(dictKey) || key.includes(dictKey)) {
            let translatedBase = alertTranslations[dictKey][lang];
            return key.replace(dictKey, translatedBase); // basic replacement
        }
    }

    if (alertTranslations[key] && alertTranslations[key][lang]) {
        return alertTranslations[key][lang];
    }
    return key;
}

// Google Translate Init callback
window.googleTranslateElementInit = function () {
    new google.translate.TranslateElement({
        pageLanguage: 'mn',
        includedLanguages: 'en,mn',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');

    // After a short delay, apply the saved language
    setTimeout(() => {
        const savedLang = getLanguage();
        if (savedLang === 'en') {
            triggerGoogleTranslate('en');
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Add Google Translate script
    const script = document.createElement('script');
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    document.head.appendChild(script);

    // Setup switchers
    const currentLang = getLanguage();
    document.querySelectorAll('.lang-switcher').forEach(select => {
        select.value = currentLang;
        select.addEventListener('change', (e) => {
            setAppLanguage(e.target.value);
        });
    });
});

// Override default alert
const originalAlert = window.alert;
window.alert = function (message) {
    originalAlert(window.t(message));
};
