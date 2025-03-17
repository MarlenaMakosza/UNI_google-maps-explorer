window.addEventListener("DOMContentLoaded", () => {
    loadGoogleMapsScript();
});

window.addEventListener("DOMContentLoaded", () => {
    const burgerButton = document.getElementById("burger-button");
    const burgerMenu = document.getElementById("burger-menu");
    const closeBurgerButton = document.getElementById("close-burger-menu");

    if (burgerButton && burgerMenu) {
        burgerButton.addEventListener("click", () => {
            burgerMenu.classList.toggle("hidden");
        });
    }

    if (closeBurgerButton && burgerMenu) {
        closeBurgerButton.addEventListener("click", () => {
            burgerMenu.classList.add("hidden");
        });
    }
});