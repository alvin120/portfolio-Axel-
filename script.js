document.addEventListener('DOMContentLoaded', () => {
    const menuBurguer = document.querySelector('.menuBurguer');
    const nav = document.querySelector('nav');

    if (menuBurguer && nav) {
        menuBurguer.addEventListener('click', () => {
            menuBurguer.classList.toggle('active');
            nav.classList.toggle('navOpen');
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBurguer.classList.remove('active');
                nav.classList.remove('navOpen');
            });
        });

        // Fermer le menu en scrollant
        window.addEventListener('scroll', () => {
            menuBurguer.classList.remove('active');
            nav.classList.remove('navOpen');
        });
    }
});