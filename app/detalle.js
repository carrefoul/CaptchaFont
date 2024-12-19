// Navegación entre páginas
window.onload = () => {
    const navItems = document.querySelectorAll('.navHeader .navItem');

    // Agregar eventos de clic a los elementos del menú
    navItems.forEach((navItem, index) => {
        navItem.addEventListener('click', () => {
            window.location.href = '../index.html';
        });
    });
};
