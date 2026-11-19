document.addEventListener('DOMContentLoaded', function () {

    /* Échappe le HTML : les noms de pays proviennent d'un CDN tiers
       (world-atlas via jsDelivr), donc d'une source non fiable. */
    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    const css = getComputedStyle(document.body);
    const color = name => css.getPropertyValue(name).trim();

    /* Couleurs par continent : lues dans voyages.css pour rester alignées
       avec la légende et la liste des pays. */
    const CONTINENTS = {
        europe:   color('--cont-europe')   || '#22E3D2',
        africa:   color('--cont-africa')   || '#FF9A3C',
        samerica: color('--cont-samerica') || '#FF4FA0'
    };

    /* Libellé traduit de la légende (i18n.js met le DOM à jour) */
    function label(key) {
        const el = document.querySelector('[data-legend="' + key + '"]');
        return el ? el.textContent.trim() : '';
    }

    // Noms tels qu'ils figurent dans world-atlas (plus quelques variantes)
    const VISITED = {
        'France': 'europe', 'Spain': 'europe', 'United Kingdom': 'europe',
        'Italy': 'europe', 'Switzerland': 'europe', 'Belgium': 'europe',
        'Vatican': 'europe', 'Holy See': 'europe', 'Monaco': 'europe',
        'Norway': 'europe', 'Germany': 'europe', 'Austria': 'europe',
        'Slovakia': 'europe',
        'Gabon': 'africa', 'Côte d\'Ivoire': 'africa', 'Ivory Coast': 'africa',
        'Cameroon': 'africa',
        'Suriname': 'samerica', 'Argentina': 'samerica', 'Brazil': 'samerica'
    };

    /* Balises de ville : coordonnées + géographie (même teinte que la carte
       de destination correspondante dans la page). */
    const WAYPOINTS = {
        ibiza:       { ll: [38.909, 1.437],    zoom: 10, c: '#12B5C2' },
        roma:        { ll: [41.890, 12.492],   zoom: 10, c: '#C4572B' },
        wien:        { ll: [48.208, 16.359],   zoom: 10, c: '#C9A227' },
        bratislava:  { ll: [48.144, 17.117],   zoom: 10, c: '#6FB3E0' },
        oslo:        { ll: [59.908, 10.753],   zoom: 9,  c: '#4BE3A8' },
        buenosaires: { ll: [-34.592, -58.378], zoom: 9,  c: '#74ACDF' },
        cayenne:     { ll: [4.937, -52.326],   zoom: 8,  c: CONTINENTS.samerica }
    };
    // Micro-États invisibles au 1:110m : on les signale par un point
    const MICRO = [
        { name: 'Vatican', ll: [41.903, 12.453] },
        { name: 'Monaco',  ll: [43.738, 7.424] }
    ];

    const narrow = window.matchMedia('(max-width: 640px)').matches;
    const WORLD = { center: [22, -5], zoom: narrow ? 1 : 2 };

    const map = L.map('map', {
        center: WORLD.center,
        zoom: WORLD.zoom,
        minZoom: 1,
        worldCopyJump: true,
        scrollWheelZoom: false,     // ne capture pas le défilement de la page
        zoomSnap: 0.5
    });
    // La molette ne zoome qu'après un clic sur la carte
    map.on('click', () => map.scrollWheelZoom.enable());
    map.on('mouseout', () => map.scrollWheelZoom.disable());

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(r => r.json())
        .then(data => {
            const countries = topojson.feature(data, data.objects.countries);

            countryLayer = L.geoJSON(countries.features, {
                style: feature => {
                    const cont = VISITED[feature.properties.name];
                    return cont ? {
                        className: 'vy-country vy-country--visited',
                        fillColor: CONTINENTS[cont],
                        fillOpacity: 0.55,
                        color: CONTINENTS[cont],
                        weight: 1.2,
                        opacity: 1
                    } : {
                        className: 'vy-country',
                        fillColor: '#0B0F1E',
                        fillOpacity: 0.35,
                        color: '#3A4670',
                        weight: 0.5,
                        opacity: 0.6
                    };
                },
                onEachFeature: (feature, layer) => {
                    const name = feature.properties.name;
                    const cont = VISITED[name];
                    layer.bindPopup(() =>
                        '<div class="vy-pop-name">' + escapeHtml(name) + '</div>' +
                        '<div class="vy-pop-tag" style="--c:' + (cont ? CONTINENTS[cont] : '#26304D') + '">' +
                        escapeHtml(label(cont || 'off')) + '</div>'
                    );
                    if (cont) {
                        layer.on('mouseover', () => layer.setStyle({ fillOpacity: Math.min(visitedFill() + 0.25, 0.8) }));
                        layer.on('mouseout',  () => layer.setStyle({ fillOpacity: visitedFill() }));
                    }
                }
            }).addTo(map);
            restyle();

            // Les balises passent au-dessus des pays
            markers.forEach(m => m.bringToFront && m.bringToFront());
        })
        .catch(e => console.error('Erreur carte:', e));

    const markers = [];
    let countryLayer = null;

    /* Les frontières 1:110m sont grossières : en vue rapprochée, on
       allège le remplissage pour laisser lire le fond de carte. */
    function visitedFill() {
        const z = map.getZoom();
        return z <= 3 ? 0.55 : z <= 5 ? 0.3 : 0.08;
    }
    function restyle() {
        if (!countryLayer) return;
        const f = visitedFill();
        countryLayer.eachLayer(l => {
            if (VISITED[l.feature.properties.name]) l.setStyle({ fillOpacity: f, weight: f < 0.1 ? 2 : 1.2 });
            else l.setStyle({ fillOpacity: f < 0.1 ? 0 : 0.35 });
        });
    }
    map.on('zoomend', restyle);

    MICRO.forEach(m => {
        markers.push(
            L.circleMarker(m.ll, {
                radius: 4, color: CONTINENTS.europe, weight: 2,
                fillColor: '#fff', fillOpacity: 1
            }).bindTooltip(m.name, { className: 'vy-tip', direction: 'top' }).addTo(map)
        );
    });

    const buttons = document.querySelectorAll('.vy-waypoints [data-waypoint]');

    Object.keys(WAYPOINTS).forEach(key => {
        const wp = WAYPOINTS[key];
        const btn = document.querySelector('[data-waypoint="' + key + '"]');
        const name = btn ? btn.textContent.trim() : key;
        if (btn) btn.style.setProperty('--c', wp.c);

        const icon = L.divIcon({ className: '', html: '<div class="vy-waypoint" style="--c:' + wp.c + '"></div>', iconSize: [14, 14] });
        const marker = L.marker(wp.ll, { icon: icon, keyboard: false, title: name })
            .bindTooltip(name, { className: 'vy-tip', direction: 'top', offset: [0, -10] })
            .addTo(map);
        marker.on('click', () => go(key));
        wp.marker = marker;
    });

    function go(key) {
        const wp = WAYPOINTS[key];
        const already = btnFor(key) && btnFor(key).getAttribute('aria-pressed') === 'true';
        buttons.forEach(b => b.setAttribute('aria-pressed', 'false'));
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (already) {               // second clic : retour à la vue monde
            reduce ? map.setView(WORLD.center, WORLD.zoom) : map.flyTo(WORLD.center, WORLD.zoom, { duration: 1.2 });
            wp.marker.closeTooltip();
            return;
        }
        btnFor(key).setAttribute('aria-pressed', 'true');
        reduce ? map.setView(wp.ll, wp.zoom) : map.flyTo(wp.ll, wp.zoom, { duration: 1.6 });
        map.once('moveend', () => wp.marker.openTooltip());
    }

    function btnFor(key) { return document.querySelector('[data-waypoint="' + key + '"]'); }

    buttons.forEach(b => b.addEventListener('click', () => go(b.dataset.waypoint)));
});
