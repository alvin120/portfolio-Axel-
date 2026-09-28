/**
 * Estampille les feuilles de style et scripts locaux avec une empreinte
 * calculée sur leur contenu : style.css?v=a1b2c3d4
 *
 * POURQUOI
 * .htaccess met le CSS et le JS en cache pendant une semaine. Un numéro de
 * version écrit à la main (?v=1) doit être incrémenté à chaque modification,
 * et il suffit de l'oublier une fois pour que les visiteurs — et soi-même —
 * continuent de recevoir l'ancien fichier pendant sept jours. C'est arrivé :
 * theme-cozy.css a été redéployé quatre fois sous ?v=1.
 *
 * Avec une empreinte du contenu, l'URL change automatiquement dès que le
 * fichier change, et ne change pas quand il ne change pas.
 *
 * USAGE : node stamp-assets.js   (à lancer avant chaque déploiement)
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const racine = __dirname;

const PAGES = fs.readdirSync(racine).filter(f => f.endsWith('.html'));

// Fichiers dont on estampille les références
const ESTAMPILLABLES = /\.(css|js)$/i;

function empreinte(fichier) {
  const contenu = fs.readFileSync(fichier);
  return crypto.createHash('sha1').update(contenu).digest('hex').slice(0, 8);
}

const cache = new Map();
function versionDe(nom) {
  if (!cache.has(nom)) {
    const p = path.join(racine, nom);
    cache.set(nom, fs.existsSync(p) ? empreinte(p) : null);
  }
  return cache.get(nom);
}

let totalPages = 0;
let totalRefs = 0;

for (const page of PAGES) {
  const chemin = path.join(racine, page);
  let html = fs.readFileSync(chemin, 'utf8');
  const avant = html;
  let n = 0;

  // href="fichier.css" ou src="fichier.js", avec ou sans ?v=... déjà présent.
  // On ignore tout ce qui est absolu (http, //, /) : seuls les fichiers locaux.
  html = html.replace(
    /(href|src)="(?!https?:|\/\/|\/)([^"?#]+)(\?[^"#]*)?"/g,
    (tout, attr, fichier, requete) => {
      if (!ESTAMPILLABLES.test(fichier)) return tout;
      const v = versionDe(fichier);
      if (!v) return tout;                       // fichier absent : on ne touche pas
      n++;
      return `${attr}="${fichier}?v=${v}"`;
    }
  );

  if (html !== avant) {
    fs.writeFileSync(chemin, html);
    totalPages++;
  }
  totalRefs += n;
  console.log(`  ${page.padEnd(32)} ${n} référence(s)`);
}

console.log(`\n  ${totalRefs} références estampillées, ${totalPages} page(s) modifiée(s)`);
console.log('  empreintes :');
for (const [nom, v] of [...cache].filter(([, v]) => v).sort()) {
  console.log(`    ${nom.padEnd(20)} ${v}`);
}
