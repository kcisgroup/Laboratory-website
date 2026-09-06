document.addEventListener('DOMContentLoaded', function () {
    const popup = document.getElementById('welcomePopup');
    if (!popup) return;

    const storageKey = 'kcis-welcome-dismissed';
    try {
        if (sessionStorage.getItem(storageKey) === 'true') return;
    } catch (error) {
        // The dismiss control also works when browser storage is unavailable.
    }
    popup.hidden = false;
    popup.querySelector('.closePopup').addEventListener('click', function () {
        popup.hidden = true;
        try {
            sessionStorage.setItem(storageKey, 'true');
        } catch (error) {
            // Dismissal is still effective for the current page.
        }
    });
});
