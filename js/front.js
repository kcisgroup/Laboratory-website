document.addEventListener('DOMContentLoaded', function () {
    if (window.lightbox) {
        window.lightbox.option({ resizeDuration: 200 });
    }

    const affiliationLogos = {
        '无锡力捷丰科技有限公司': 'opteeq.com.png',
        '上海烟草': 'china-tobacco.png',
        '博世': 'bosch.com.cn.ico',
        '绿联科技股份有限公司': 'ugreen.com.png',
        '中国工商银行': 'icbc.com.cn.png',
        '哔哩哔哩': 'bilibili.com.ico',
        '苏州农商行': 'szrcb.com.ico',
        '摩尔线程': 'mthreads.com.ico',
        '中国联通': 'chinaunicom.com.cn.png',
        '无锡超通智能制造': 'chiaot.com.png',
        '朗新科技': 'longshine.com.png',
        '梦创双杨': 'dreamdt.cn.png',
        '中国移动': '10086.cn.png',
        '河南中烟': 'china-tobacco.png',
        '智慧芽': 'patsnap.com.ico',
        '科锐国际': 'careerintlinc.com.ico',
        '极智嘉': 'geekplus.com.ico',
        '苏州城市学院': 'szcu.edu.cn.png',
        '华润上华': 'crmicro.com.png',
        '米哈游': 'mihoyo.com.ico',
        'Monash University': 'monash.edu.ico',
        '追觅科技': 'dreame.tech.png',
        '江苏银行': 'jsbchina.cn.ico',
        '度小满': 'duxiaoman.com.png',
        '信通院': 'caict.ac.cn.png',
        '南瑞集团': 'narigroup.com.png',
        '汉口银行': 'hkbchina.com.png',
        '远景': 'envision-group.com.png',
        '临沂市中心医院': 'lyszxyy.com.cn.png',
        '扬州卫健委': 'government.png',
        '华为云计算': 'huaweicloud.com.ico',
        '中国重汽': 'sinotruk.com.png',
        '无锡先研院': 'wiat.png',
        '安徽经济信息中心': 'government.png',
        '沃太新能源': 'alphaess.com.ico',
        '中国电信': 'chinatelecom.com.cn.png',
        '英特尔亚太研发中心': 'intel.cn.ico'
    };
    const affiliationNames = Object.keys(affiliationLogos).sort(function (first, second) {
        return second.length - first.length;
    });
    document.querySelectorAll('#team small').forEach(function (detail) {
        const match = affiliationNames.find(function (name) { return detail.textContent.includes(name); });
        if (!match) return;

        const text = detail.textContent;
        const before = text.slice(0, text.indexOf(match));
        const after = text.slice(text.indexOf(match) + match.length);
        const affiliation = document.createElement('span');
        const logo = document.createElement('img');
        affiliation.className = 'affiliation';
        logo.className = 'affiliation-logo';
        logo.src = 'img/affiliations/' + affiliationLogos[match];
        logo.alt = '';
        logo.height = 18;
        logo.loading = 'lazy';
        logo.addEventListener('error', function () { logo.hidden = true; });
        affiliation.append(logo, match);
        detail.replaceChildren(before, affiliation, after);
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const video = document.querySelector('.hero-bg-video');
    if (video) {
        const applyMotionPreference = function () {
            if (reducedMotion.matches) {
                video.pause();
            } else {
                video.play().catch(function () {
                    // Keep the black backdrop if autoplay is unavailable.
                });
            }
        };
        reducedMotion.addEventListener('change', applyMotionPreference);
        applyMotionPreference();
    }

    const header = document.querySelector('.site-header');
    const content = document.getElementById('philosophy');
    const enterLink = document.querySelector('.scroll-btn');
    if (!header || !content || !enterLink) return;

    const measureHeader = function () {
        document.documentElement.style.setProperty('--site-header-height', header.offsetHeight + 'px');
    };
    measureHeader();
    if (window.ResizeObserver) {
        new ResizeObserver(measureHeader).observe(header);
    } else {
        window.addEventListener('resize', measureHeader);
    }

    let entering = false;
    let wheelDistance = 0;
    let lastWheelTime = 0;
    let touchStart = null;
    const atOpening = function () { return window.scrollY <= 2; };
    const contentTop = function () {
        const position = window.getComputedStyle(header).position;
        const offset = position === 'sticky' || position === 'fixed' ? header.offsetHeight : 0;
        return content.getBoundingClientRect().top + window.scrollY - offset;
    };

    // Only the opening-to-content transition is controlled; the document stays native.
    const enterContent = function (moveFocus) {
        if (entering) return;
        entering = true;
        wheelDistance = 0;
        const startY = window.scrollY;
        const startTime = performance.now();
        const duration = reducedMotion.matches ? 0 : 650;
        const step = function (now) {
            const progress = duration ? Math.min((now - startTime) / duration, 1) : 1;
            const eased = 1 - Math.pow(1 - progress, 3);
            window.scrollTo({ top: startY + (contentTop() - startY) * eased, behavior: 'instant' });
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                entering = false;
                if (moveFocus) content.focus({ preventScroll: true });
            }
        };
        window.requestAnimationFrame(step);
    };

    enterLink.addEventListener('click', function (event) {
        // Modified clicks retain the anchor's normal browser behavior.
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        enterContent(true);
    });

    window.addEventListener('wheel', function (event) {
        if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
        if (entering) {
            event.preventDefault();
            return;
        }
        if (!atOpening() || event.deltaY <= 0) {
            wheelDistance = 0;
            return;
        }
        event.preventDefault();
        const now = performance.now();
        if (now - lastWheelTime > 180) wheelDistance = 0;
        lastWheelTime = now;
        const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
        wheelDistance += event.deltaY * unit;
        if (wheelDistance >= 24) enterContent(false);
    }, { passive: false });

    window.addEventListener('touchstart', function (event) {
        touchStart = atOpening() && event.touches.length === 1
            ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
            : null;
    }, { passive: true });
    window.addEventListener('touchmove', function (event) {
        if (event.touches.length !== 1) {
            touchStart = null;
            return;
        }
        if (entering) {
            event.preventDefault();
            return;
        }
        if (!touchStart || !atOpening()) return;
        const dx = touchStart.x - event.touches[0].clientX;
        const dy = touchStart.y - event.touches[0].clientY;
        if (dy <= 0 || Math.abs(dx) > Math.abs(dy)) return;
        event.preventDefault();
        if (dy >= 40) {
            touchStart = null;
            enterContent(false);
        }
    }, { passive: false });
    const resetTouch = function () { touchStart = null; };
    window.addEventListener('touchend', resetTouch, { passive: true });
    window.addEventListener('touchcancel', resetTouch, { passive: true });

    window.addEventListener('keydown', function (event) {
        if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
        if (event.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
        if (!['ArrowDown', 'PageDown', ' '].includes(event.key)) return;
        if (entering || atOpening()) {
            event.preventDefault();
            enterContent(true);
        }
    });
});
