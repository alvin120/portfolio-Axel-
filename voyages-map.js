document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        scrollWheelZoom: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const visitedCountryNames = new Set([
        'France', 'Spain', 'United Kingdom', 'Italy', 'Switzerland', 'Belgium',
        'Vatican', 'Monaco', 'Norway', 'Germany', 'Austria', 'Slovakia',
        'Gabon', 'Côte d\'Ivoire', 'Cameroon', 'Suriname', 'Argentina', 'Brazil',
        'Holy See', 'Ivory Coast', 'Northern Ireland'
    ]);

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
        .then(r => r.json())
        .then(data => {
            const countries = topojson.feature(data, data.objects.countries);

            L.geoJSON(countries.features, {
                style: feature => {
                    const name = feature.properties.name;
                    const isVisited = visitedCountryNames.has(name);
                    return {
                        fillColor: isVisited ? '#1a73e8' : '#e8e8e8',
                        weight: 0.5,
                        opacity: 1,
                        color: '#999',
                        fillOpacity: isVisited ? 0.9 : 0.7
                    };
                },
                onEachFeature: (feature, layer) => {
                    const name = feature.properties.name;
                    const isVisited = visitedCountryNames.has(name);
                    layer.bindPopup(`<strong>${name}</strong><br>${isVisited ? '✓ Visité' : 'Non visité'}`);
                }
            }).addTo(map);
        })
        .catch(e => console.error('Erreur carte:', e));
});
