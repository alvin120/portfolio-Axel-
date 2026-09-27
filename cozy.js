/* Apparition progressive des blocs au défilement.
   En fichier externe et non en <script> inline, car la CSP du site
   déclare script-src 'self' sans 'unsafe-inline'. */
(function () {
    var cibles = document.querySelectorAll('.reveal');
    if (!cibles.length) return;

    // Si l'utilisateur préfère moins d'animations, on affiche tout d'emblée.
    var sobre = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sobre || !('IntersectionObserver' in window)) {
        for (var i = 0; i < cibles.length; i++) cibles[i].classList.add('is-in');
        return;
    }

    var obs = new IntersectionObserver(function (entrees) {
        entrees.forEach(function (e) {
            if (e.isIntersecting) {
                e.target.classList.add('is-in');
                obs.unobserve(e.target);       // une seule fois par bloc
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    cibles.forEach(function (c) { obs.observe(c); });
})();
