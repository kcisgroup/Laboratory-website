document.addEventListener('DOMContentLoaded', function () {
    if (window.lightbox) {
        window.lightbox.option({ resizeDuration: 200 });
    }

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
