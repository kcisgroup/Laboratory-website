document.addEventListener('DOMContentLoaded', function() {
    const popups = document.querySelectorAll('.popup');
    const screenHeight = window.innerHeight;
    const minSpacing = 150; // Minimum spacing between popups
    const minYPosition = 100; // Minimum distance from the top of the page

    let usedPositions = [];

    popups.forEach((popup, index) => {
        let randomY;
        do {
            randomY = minYPosition + Math.random() * (screenHeight - popup.offsetHeight - minYPosition);
        } while (usedPositions.some(pos => Math.abs(pos - randomY) < minSpacing));

        usedPositions.push(randomY);
        popup.style.top = `${randomY}px`; // Randomize Y position with spacing
        popup.style.left = '-100%'; // Start off-screen to the left
        popup.style.animation = `slideIn 30s linear ${index * 2}s infinite`; // Adjust duration and add delay
    });

    const closeButtons = document.querySelectorAll('.closePopup');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            button.parentElement.style.display = 'none';
        });
    });
});