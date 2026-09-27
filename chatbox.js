(function () {

    /* ═══════════════════════════════════════════
       SÉCURITÉ — constantes
    ═══════════════════════════════════════════ */
    const MAX_MSG_LENGTH   = 300;   // caractères max par message
    const RATE_LIMIT_MAX   = 6;     // messages max par fenêtre
    const RATE_LIMIT_MS    = 60000; // fenêtre = 1 minute
    const MIN_SEND_INTERVAL= 800;   // ms entre deux envois (anti-spam rapide)
    const MAX_SAME_MSG     = 2;     // fois qu'un même message peut être répété

    const _ts        = [];          // timestamps des envois
    let   _lastSend  = 0;           // timestamp du dernier envoi
    let   _lastText  = '';          // dernier texte envoyé
    let   _sameCount = 0;           // compteur de répétitions

    /* ═══════════════════════════════════════════
       RÉPONSES DU BOT
    ═══════════════════════════════════════════ */
    /* ═══════════════════════════════════════════
       BASE DE CONNAISSANCES — Axel Tagrou
       Sources : pages du portfolio (accueil, expériences,
       compétences, sites, voyages, contact), profil
       LinkedIn public et dépôts GitHub publics.
    ═══════════════════════════════════════════ */
    const RESPONSES = [

        /* ── Politesse & navigation ───────────── */
        {
            id: 'salutation',
            keywords: ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou', 'hi', 'hey', 'bonne journee'],
            answer: '👋 Bonjour ! Je suis l\'assistant d\'Axel Tagrou, développeur web full stack &amp; IA.\n\nJe connais son parcours, ses compétences, ses réalisations, ses tarifs et même ses voyages. Que souhaitez-vous savoir ?'
        },
        {
            id: 'aide',
            keywords: ['aide', 'help', 'options', 'sujets', 'menu', 'que peux tu faire', 'de quoi peux tu parler', 'tu sais quoi'],
            answer: '🧭 Je peux vous parler de :\n• 👤 Qui est Axel (parcours, formation, expériences)\n• 🌐 Sites web, 📱 apps mobiles, 🤖 intégration IA\n• 🎨 Maquettes UI/UX (Figma)\n• 🔍 SEO et 🔒 sécurité web\n• 💻 Technologies &amp; stack technique\n• 📂 Ses 8 réalisations (avec les liens)\n• 💰 Tarifs, ⏱️ délais, 🧩 déroulement d\'un projet\n• 🌍 Langues parlées &amp; disponibilité\n• ✈️ Ses 18 pays visités\n• 🍽️ Le restaurant de démonstration\n\nPosez-moi votre question !'
        },

        /* ── Identité & parcours ──────────────── */
        {
            id: 'qui-est-axel',
            keywords: ['qui est axel', 'qui es tu', 'presentation', 'presente', 'a propos', 'parle moi de axel', 'parle moi d axel', 'bio', 'profil', 'axel tagrou', 'tagrou'],
            answer: '👤 <strong>Axel Tagrou</strong> — Développeur Web Full Stack &amp; IA.\n\nIl conçoit des sites modernes, des applications mobiles, des maquettes design et des expériences sur mesure depuis 2020. Il maîtrise le front-end (HTML, CSS, JavaScript, React) comme le back-end (PHP, Symfony, MySQL), et intègre les outils d\'IA dans ses projets.\n\nEn dehors du code, c\'est un grand voyageur : 18 pays sur 3 continents, ce qui nourrit sa créativité.\n\n👉 <a href="index.html">En savoir plus</a>'
        },
        {
            id: 'chiffres-cles',
            keywords: ['chiffres', 'statistiques', 'stats', 'en resume', 'resume', 'combien de sites', 'nombre de projets'],
            answer: '📊 Axel en quelques chiffres :\n• 5+ années d\'expérience (depuis 2020)\n• 8 sites livrés et en ligne\n• 18 pays visités\n• 3 continents explorés\n• 18 dépôts publics sur GitHub\n• Un portfolio traduit en 8 langues'
        },
        {
            id: 'experience-annees',
            keywords: ['experience', 'depuis quand', 'depuis', 'ans', 'annees', 'anciennete', 'senior', 'junior', 'niveau'],
            answer: '📅 Axel développe depuis 2020, soit 5+ ans d\'expérience.\n\nSon parcours : formation intensive à l\'IFCASS (2021-2022), stage de fin d\'études en développement full stack chez Nes Proworking (2022), puis des projets clients en web, mobile et IA.\n\n👉 <a href="experience.html">Voir tout le parcours</a>'
        },
        {
            id: 'formation',
            keywords: ['formation', 'etudes', 'diplome', 'ecole', 'ifcass', 'esecad', 'appris', 'autodidacte', 'cursus'],
            answer: '🎓 Formation d\'Axel :\n• <strong>IFCASS</strong> (Dieppe) — formation intensive en développement web, du 6 septembre 2021 au 22 juin 2022 : pages statiques et dynamiques, portfolio HTML/CSS, bases de données MySQL, programmation PHP, réservation en ligne pour un restaurant.\n• <strong>ESECAD</strong> — formation complémentaire à distance.\n\nEt depuis, de la veille technologique en continu.\n\n👉 <a href="experience.html">Détail du parcours</a>'
        },
        {
            id: 'stage-nes-proworking',
            keywords: ['stage', 'nes proworking', 'proworking', 'alternance', 'entreprise', 'dieppe'],
            answer: '💼 <strong>Développeur Web Full Stack — Nes Proworking</strong> (Dieppe)\nStage de fin d\'études de 11 semaines, du 28 mars au 8 juin 2022.\n\nFront-end :\n• Élaboration du cahier des charges\n• Création d\'un site e-commerce\n• Création et gestion des pages\n\nBack-end :\n• Sécurité et paiement des achats\n• Enregistrement des données personnelles\n• Création de la base de données utilisateur\n\nStack : HTML, CSS, JavaScript, PHP.'
        },
        {
            id: 'experiences-hors-dev',
            keywords: ['restauration', 'serveur', 'tourisme', 'agent de voyage', 'office de tourisme', 'polyvalent', 'petits boulots', 'reconversion', 'iracoubo', 'jal voyage', 'ailleurs et autrement'],
            answer: '🧳 Avant et à côté du développement, Axel a construit un vrai sens du service client :\n• <strong>Employé polyvalent</strong> — restaurant "3 Canards" (Saint-Georges-de-Reneins), Hôpital Léon Bérard, restaurant "Les Cocottes Mijotées" : service, accueil, nettoyage.\n• <strong>Agent de voyage</strong> — Jal Voyage (Guyane) : réservation de sites touristiques, tableaux synoptiques pour groupes, gestion du calendrier de disponibilités.\n• <strong>Organisateur de voyage</strong> — association Ailleurs et Autrement : accueil de voyageurs internationaux, administration, logistique.\n• <strong>Chargé d\'accueil</strong> — Office de Tourisme d\'Iracoubo : accueil des visiteurs, visites guidées, création de supports marketing.\n\n👉 <a href="experience.html">Voir les expériences</a>'
        },

        /* ── Services ─────────────────────────── */
        {
            id: 'sites-web',
            keywords: ['site', 'site internet', 'site web', 'internet', 'web', 'creer un site', 'creation', 'vitrine', 'ecommerce', 'e commerce', 'boutique', 'landing page', 'blog', 'refonte'],
            answer: '🌐 Axel crée des sites web sur mesure :\n• Sites vitrines\n• E-commerces (avec paiement sécurisé)\n• Portfolios &amp; blogs\n• Plateformes web et sites institutionnels\n\nModernes, rapides, responsive, optimisés SEO et sécurisés. Envie d\'un devis gratuit ?\n👉 <a href="contact.html">Demander un devis</a>'
        },
        {
            id: 'application-mobile',
            keywords: ['application', 'application mobile', 'mobile', 'app', 'appli', 'android', 'ios', 'smartphone', 'store'],
            answer: '📱 Axel développe des applications mobiles en <strong>React Native</strong> (iOS + Android avec une seule base de code) :\n• Notifications push ciblées pour fidéliser\n• Expérience fluide et intuitive\n• Accès hors-ligne\n• Paiement intégré, réservation en un clic\n\n💡 60% du trafic web vient du mobile — autant y être.'
        },
        {
            id: 'ia',
            keywords: ['ia', 'intelligence artificielle', 'intelligence', 'artificielle', 'chatgpt', 'ai', 'chatbot', 'bot', 'robot', 'automatisation', 'gemini', 'claude', 'llm', 'agent'],
            answer: '🤖 Axel intègre l\'IA dans vos projets :\n• Chatbot disponible 24h/24 (comme celui-ci !)\n• Automatisation des tâches répétitives\n• Recommandations personnalisées par visiteur\n• Analyse de données pour mieux décider\n\nOutils utilisés : <strong>Claude AI, ChatGPT, Gemini</strong>. Exemple concret : <strong>ChatGPT Mairie</strong>, un assistant IA qui répond aux questions administratives des citoyens.\n👉 <a href="sites.html">Voir la réalisation</a>'
        },
        {
            id: 'design-maquette',
            keywords: ['maquette', 'design', 'figma', 'ui', 'ux', 'graphique', 'wireframe', 'prototype', 'visuel', 'charte', 'logo', 'photoshop', 'capcut', 'video'],
            answer: '🎨 Axel conçoit les maquettes UI/UX sur <strong>Figma</strong> avant d\'écrire la moindre ligne de code : vous validez le rendu final avant le développement, zéro surprise.\n\nIl travaille aussi sur <strong>Photoshop</strong> pour la retouche et la création graphique, et sur <strong>CapCut</strong> pour le contenu vidéo court format.'
        },
        {
            id: 'seo',
            keywords: ['seo', 'referencement', 'google', 'visibilite', 'premiere page', 'ranking', 'moteur de recherche', 'trafic', 'meta', 'sitemap'],
            answer: '🔍 Le référencement est inclus dès la conception :\n• Balises meta optimisées\n• Open Graph (aperçus propres sur les réseaux sociaux)\n• Données structurées JSON-LD\n• Sitemap.xml &amp; robots.txt\n• URL canonique configurée\n• Vitesse de chargement optimisée\n\nObjectif : que vos clients vous trouvent sur Google sans payer de publicité en permanence.\n👉 <a href="compétence.html">Voir la méthode</a>'
        },
        {
            id: 'securite',
            keywords: ['securite', 'securise', 'protection', 'xss', 'ssl', 'https', 'hsts', 'csp', 'piratage', 'hack', 'spam', 'injection'],
            answer: '🔒 La sécurité est prise au sérieux — ce site en est la démonstration :\n• HTTPS / HSTS forcé\n• CSP stricte (Content-Security-Policy)\n• En-têtes HTTP sécurisés, anti-clickjacking (X-Frame-Options)\n• Protection anti-XSS et anti-injection\n• Formulaires avec honeypot anti-bot\n• Rate limiting anti-spam (y compris sur ce chat)\n• Hashs SRI sur les ressources externes\n\nTous les sites livrés suivent les mêmes bonnes pratiques.'
        },
        {
            id: 'performance',
            keywords: ['performance', 'lent', 'trop lent', 'lenteur', 'rame', 'vitesse', 'rapide', 'rapidite', 'chargement', 'optimisation', 'cache', 'core web vitals', 'lighthouse'],
            answer: '⚡ Performance :\n• Chargement en moins de 2 secondes\n• Cache navigateur activé, compression gzip\n• Scripts chargés en defer\n• CSS &amp; JS minifiables\n• Images optimisées\n• Hébergement professionnel OVH\n\nUn site lent fait fuir les visiteurs — et Google le sanctionne.'
        },
        {
            id: 'responsive',
            keywords: ['responsive', 'adaptatif', 'ecran', 'tablette', 'telephone portable', 'mobile friendly', 'burger'],
            answer: '📐 Tous les sites d\'Axel sont responsive :\n• Design adaptatif sur tous les écrans\n• Menu burger sur mobile\n• Zones tactiles confortables (touch-friendly)\n• Images optimisées selon l\'appareil\n• Viewport correctement configuré'
        },
        {
            id: 'wordpress',
            keywords: ['wordpress', 'cms', 'wix', 'shopify', 'squarespace', 'back office', 'administration'],
            answer: '🧩 Axel maîtrise <strong>WordPress</strong> si vous souhaitez gérer vous-même votre contenu, et le développement sur mesure (HTML/CSS/JS, PHP, Symfony, React) quand il faut sortir des limites d\'un CMS.\n\nIl vous conseille la solution adaptée à votre budget et à l\'autonomie que vous souhaitez.'
        },
        {
            id: 'hebergement',
            keywords: ['hebergement', 'heberger', 'nom de domaine', 'domaine', 'ovh', 'vercel', 'serveur', 'ftp', 'mise en ligne', 'deploiement'],
            answer: '☁️ Hébergement &amp; mise en ligne :\n• Ce portfolio est hébergé chez <strong>OVH</strong> (hébergeur professionnel français)\n• Les réalisations clients sont déployées sur <strong>Vercel</strong> (rapide, HTTPS automatique)\n• Axel gère le nom de domaine, le certificat SSL et la mise en ligne de bout en bout\n\nVous n\'avez rien de technique à gérer.'
        },
        {
            id: 'maintenance',
            keywords: ['maintenance', 'suivi', 'mise a jour', 'evolution', 'support', 'garantie', 'bug'],
            answer: '🛠️ Après la livraison, Axel assure les ajustements et le suivi de votre projet — c\'est la dernière étape de sa méthode de travail.\n\nBesoin d\'une évolution, d\'une nouvelle page ou d\'une correction plus tard ? Il reste joignable.\n👉 <a href="contact.html">Le contacter</a>'
        },

        /* ── Commercial ───────────────────────── */
        {
            id: 'tarifs',
            keywords: ['prix', 'tarif', 'tarifs', 'cout', 'combien', 'combien ca coute', 'devis', 'budget', 'gratuit', 'pas cher', 'facture', 'paiement', 'euros'],
            answer: '💰 Les tarifs dépendent du projet :\n• Site vitrine : à partir de quelques centaines d\'€\n• Site complet / e-commerce : selon les fonctionnalités\n• Application mobile : selon la complexité\n• Devis <strong>100% gratuit et sans engagement</strong>\n\nDites-lui ce dont vous avez besoin, il vous fait une estimation précise.\n👉 <a href="contact.html">Demander un devis gratuit</a>'
        },
        {
            id: 'delais',
            keywords: ['delai', 'delais', 'temps', 'duree', 'quand', 'livraison', 'semaine', 'semaines', 'mois', 'urgent', 'vite'],
            answer: '⏱️ Délais indicatifs :\n• Site vitrine : 1 à 2 semaines\n• Site complet : 2 à 4 semaines\n• Application mobile : 1 à 3 mois\n\nCes délais dépendent de la validation de la maquette et de la fourniture de vos contenus (textes, photos).\n👉 <a href="contact.html">Obtenir une estimation</a>'
        },
        {
            id: 'process',
            keywords: ['etape', 'etapes', 'process', 'methode', 'deroule', 'deroulement', 'fonctionne', 'comment ca marche', 'cahier des charges', 'demarche', 'workflow'],
            answer: '🧩 Le déroulement d\'un projet avec Axel :\n1️⃣ Échange sur vos besoins → devis gratuit\n2️⃣ Maquette Figma à valider\n3️⃣ Développement du site / de l\'app\n4️⃣ Tests, optimisation SEO &amp; sécurité, livraison\n5️⃣ Ajustements &amp; suivi\n\nÀ chaque étape, vous validez avant de passer à la suite.\n👉 <a href="contact.html">Démarrer un projet</a>'
        },
        {
            id: 'pourquoi-site',
            keywords: ['pourquoi', 'besoin', 'utilite', 'avantage', 'important', 'interet', 'ca sert a quoi', 'digital', 'numerique'],
            answer: '📈 Pourquoi passer au digital maintenant :\n• <strong>97% des clients</strong> recherchent en ligne avant d\'acheter\n• Visibilité 24h/24 sur Google, sans budget publicitaire permanent\n• Crédibilité et image de marque renforcées\n• Des clients au-delà de votre zone géographique\n• Vos concurrents en ont déjà un\n\nNe laissez pas vos clients à la concurrence !'
        },
        {
            id: 'disponibilite',
            keywords: ['disponible', 'dispo', 'libre', 'commencer', 'demarrer', 'nouveau projet', 'freelance', 'mission', 'recrutement', 'embaucher', 'cdi', 'cv'],
            answer: '✅ Axel est <strong>disponible pour de nouveaux projets</strong> dès maintenant — missions freelance, collaborations ou opportunités en entreprise.\n\nParlons de votre besoin 👉 <a href="contact.html">page contact</a>'
        },
        {
            id: 'contact',
            keywords: ['contact', 'contacter', 'joindre', 'email', 'mail', 'adresse', 'telephone', 'numero', 'appeler', 'message', 'ecrire', 'whatsapp', 'rendez vous'],
            answer: '📬 Contacter Axel :\n• ✉️ Email : <a href="mailto:axelalvin20@gmail.com">axelalvin20@gmail.com</a>\n• 📞 Téléphone : <a href="tel:+33665334965">+33 6 65 33 49 65</a>\n• 🌐 Site : <a href="https://www.axeltagrou.fr" target="_blank" rel="noopener">axeltagrou.fr</a>\n\nOu via le formulaire de la <a href="contact.html">page contact</a> — réponse sous 24h !'
        },
        {
            id: 'localisation',
            keywords: ['ou es tu', 'ou habite', 'localisation', 'base', 'situe', 'ville', 'a distance', 'remote', 'teletravail', 'lyon', 'france', 'guyane', 'cayenne', 'deplacement'],
            answer: '📍 Axel est basé en <strong>France</strong> (région de Lyon, Auvergne-Rhône-Alpes) et travaille à distance avec des clients partout.\n\nIl a de fortes attaches avec la <strong>Guyane</strong>, où il a travaillé dans le tourisme et pour laquelle il a réalisé plusieurs projets (Guyane Code, Lycée de Guyane, Wapa Lodge).\n\nLa distance n\'est pas un problème : échanges par visio, email ou téléphone.'
        },

        /* ── Technique ────────────────────────── */
        {
            id: 'stack',
            keywords: ['technologie', 'technologies', 'stack', 'langage', 'langages', 'competence', 'competences', 'outils', 'framework', 'code', 'html', 'css', 'javascript', 'js', 'ajax', 'git'],
            answer: '💻 Stack technique d\'Axel :\n• <strong>Front</strong> : HTML5, CSS3, JavaScript, React.js, AJAX\n• <strong>Back</strong> : PHP, Symfony, MySQL\n• <strong>Mobile</strong> : React Native\n• <strong>CMS</strong> : WordPress\n• <strong>Design</strong> : Figma, Photoshop\n• <strong>Scripting</strong> : Python\n• <strong>Versioning</strong> : Git &amp; GitHub\n• <strong>IA</strong> : Claude AI, ChatGPT, Gemini\n• <strong>Autres</strong> : SEO, sécurité web, CapCut\n\n👉 <a href="compétence.html">Voir toutes les compétences</a>'
        },
        {
            id: 'react',
            keywords: ['react', 'reactjs', 'react native', 'spa', 'composant', 'typescript', 'nextjs', 'next'],
            answer: '⚛️ <strong>React.js</strong> pour les interfaces web modernes et <strong>React Native</strong> pour les applications mobiles iOS/Android.\n\nPlusieurs projets d\'Axel reposent sur cet écosystème, dont LinguaBoost et Guyane Code.'
        },
        {
            id: 'backend',
            keywords: ['php', 'symfony', 'mysql', 'backend', 'back end', 'base de donnees', 'bdd', 'sql', 'phpmyadmin', 'api'],
            answer: '🗄️ Côté back-end, Axel travaille avec :\n• <strong>PHP</strong> — pages dynamiques et traitements serveur\n• <strong>Symfony</strong> — framework PHP professionnel\n• <strong>MySQL / phpMyAdmin</strong> — bases de données relationnelles\n\nIl a notamment conçu la base de données utilisateur, la gestion du paiement et l\'enregistrement des données personnelles d\'un site e-commerce lors de son stage chez Nes Proworking.'
        },
        {
            id: 'python',
            keywords: ['python', 'script', 'scripting', 'data', 'automatiser'],
            answer: '🐍 Axel pratique <strong>Python</strong> pour le scripting et l\'automatisation (il partage régulièrement ses exercices sur LinkedIn).\n\nDans ce portfolio, des scripts Python servent par exemple à analyser et optimiser automatiquement les images du site.'
        },
        {
            id: 'ce-site',
            keywords: ['ce site', 'ton site', 'portfolio', 'comment est fait', 'fait avec quoi'],
            answer: '🛠️ Ce portfolio est fait main en HTML, CSS et JavaScript pur (sans framework), avec :\n• Un système de traduction en <strong>8 langues</strong>\n• Une carte interactive des voyages\n• Ce chatbot, en JavaScript vanilla avec rate limiting\n• SEO complet (JSON-LD, sitemap, Open Graph)\n• Sécurité renforcée (CSP, HSTS, SRI)\n• Hébergement OVH\n\nUne démonstration concrète de son savoir-faire.'
        },
        {
            id: 'github',
            keywords: ['github', 'git hub', 'code source', 'open source', 'depot', 'repo', 'repository'],
            answer: '💻 Axel partage son code sur GitHub — 18 dépôts publics :\n👉 <a href="https://github.com/alvin120" target="_blank" rel="noopener">github.com/alvin120</a>\n\nOn y trouve wapa-lodge, linguaboost, guyanecode, chatgptmairie, auberge-des-iles, pizza-mille-pate, restaurantlebistrot, ses premières maquettes de 2021 (blog, pizzeria, startup, architecture) et vinishop (PHP).'
        },
        {
            id: 'reseaux-sociaux',
            keywords: ['linkedin', 'reseaux sociaux', 'reseau', 'social', 'suivre', 'twitter', 'instagram', 'facebook'],
            answer: '🔗 Où retrouver Axel :\n• <strong>LinkedIn</strong> 👉 <a href="https://www.linkedin.com/in/axel-tagrou-208334155/" target="_blank" rel="noopener">axel-tagrou</a> — parcours, publications et veille technique\n• <strong>GitHub</strong> 👉 <a href="https://github.com/alvin120" target="_blank" rel="noopener">github.com/alvin120</a> — ses projets et son code\n• <strong>Site</strong> 👉 <a href="https://www.axeltagrou.fr" target="_blank" rel="noopener">axeltagrou.fr</a>\n\nLe plus direct reste l\'email : <a href="mailto:axelalvin20@gmail.com">axelalvin20@gmail.com</a>'
        },

        /* ── Langues ──────────────────────────── */
        {
            id: 'langues-parlees',
            keywords: ['langue', 'langues', 'anglais', 'espagnol', 'bilingue', 'parle', 'international', 'english', 'spanish', 'espanol'],
            answer: '🌍 Axel parle <strong>français</strong> (langue maternelle), <strong>anglais</strong> et <strong>espagnol</strong>.\n\nPratique pour des projets et des clients à l\'international — ses 18 pays visités aident aussi beaucoup.'
        },
        {
            id: 'site-multilingue',
            keywords: ['multilingue', 'traduction', 'traduire', 'plusieurs langues', 'i18n', 'version anglaise', 'chinois', 'portugais', 'japonais', 'allemand', 'italien'],
            answer: '🗣️ Ce portfolio est disponible en <strong>8 langues</strong> : 🇫🇷 Français, 🇬🇧 English, 🇪🇸 Español, 🇧🇷 Português, 🇨🇳 中文, 🇩🇪 Deutsch, 🇮🇹 Italiano, 🇯🇵 日本語.\n\nUtilisez le sélecteur de langue en haut de page. Axel peut faire la même chose pour votre site — un vrai atout à l\'international.'
        },

        /* ── Réalisations ─────────────────────── */
        {
            id: 'projets',
            keywords: ['projet', 'projets', 'realisation', 'realisations', 'exemple', 'exemples', 'reference', 'references', 'travaux', 'demo', 'montre', 'client', 'clients', 'book'],
            answer: '📂 Les 8 réalisations d\'Axel :\n• 🌿 <strong>Wapa Lodge</strong> — lodge écotouristique\n• 🏫 <strong>Lycée de Guyane</strong> — site institutionnel\n• 🤖 <strong>ChatGPT Mairie</strong> — assistant IA pour une mairie\n• 👨‍💻 <strong>Guyane Code</strong> — plateforme de formation au dev web\n• 🏝️ <strong>Auberge des Îles</strong> — réservation en ligne\n• 🍕 <strong>Pizza Mille Pâtes</strong> — pizzeria artisanale\n• 🍽️ <strong>Restaurant Bistrol</strong> — site vitrine + menu\n• 🗣️ <strong>LinguaBoost</strong> — apprentissage des langues\n\n👉 <a href="sites.html">Voir tous les sites en ligne</a>'
        },
        {
            id: 'wapa-lodge',
            boost: 1,
            keywords: ['wapa', 'wapa lodge', 'lodge', 'ecotourisme', 'ecotouristique', 'nature'],
            answer: '🌿 <strong>Wapa Lodge</strong> — site vitrine d\'un lodge en pleine nature, mettant en valeur les hébergements et les activités écotouristiques.\n👉 <a href="https://wapa-lodge.vercel.app" target="_blank" rel="noopener">wapa-lodge.vercel.app</a>'
        },
        {
            id: 'lycee-guyane',
            boost: 1,
            keywords: ['lycee', 'lycee de guyane', 'lycee guyane', 'institutionnel', 'etablissement', 'filieres', 'college'],
            answer: '🏫 <strong>Lycée de Guyane</strong> — site institutionnel d\'un lycée : présentation des filières, actualités et informations pratiques.\n👉 <a href="https://lyc-e-guyane.vercel.app" target="_blank" rel="noopener">lyc-e-guyane.vercel.app</a>'
        },
        {
            id: 'chatgpt-mairie',
            boost: 1,
            keywords: ['mairie', 'commune', 'collectivite', 'administration publique', 'service public', 'citoyen'],
            answer: '🤖 <strong>ChatGPT Mairie</strong> — un assistant IA intégré pour une mairie : les citoyens obtiennent des réponses instantanées à leurs questions administratives, 24h/24.\n👉 <a href="https://chatgptmairie.vercel.app" target="_blank" rel="noopener">chatgptmairie.vercel.app</a>'
        },
        {
            id: 'guyane-code',
            boost: 1,
            keywords: ['guyane code', 'guyanecode', 'formation dev', 'apprendre a coder', 'plateforme formation', 'e learning'],
            answer: '👨‍💻 <strong>Guyane Code</strong> — plateforme de formation au développement web en Guyane, pour apprendre à coder et se former aux métiers du numérique.\n👉 <a href="https://guyanecode.vercel.app" target="_blank" rel="noopener">guyanecode.vercel.app</a>'
        },
        {
            id: 'auberge-iles',
            boost: 1,
            keywords: ['auberge', 'auberge des iles', 'hotel', 'hotellerie', 'chambre', 'chambres', 'gite'],
            answer: '🏝️ <strong>Auberge des Îles</strong> — site de réservation d\'une auberge insulaire : présentation des chambres, des services et du cadre.\n👉 <a href="https://auberge-des-iles.vercel.app" target="_blank" rel="noopener">auberge-des-iles.vercel.app</a>\n\nAxel connaît bien le secteur hôtellerie-restauration-tourisme, pour y avoir travaillé.'
        },
        {
            id: 'pizzeria-bistrol',
            boost: 1,
            keywords: ['pizza', 'pizzeria', 'mille pates', 'bistrol', 'bistrot'],
            answer: '🍕 Deux réalisations dans la restauration :\n• <strong>Pizza Mille Pâtes</strong> — pizzeria artisanale, carte en ligne et spécialités 👉 <a href="https://pizza-mille-pate.vercel.app" target="_blank" rel="noopener">pizza-mille-pate.vercel.app</a>\n• <strong>Restaurant Bistrol</strong> — site vitrine avec menu et informations de réservation 👉 <a href="https://restaurant-axel120.vercel.app" target="_blank" rel="noopener">restaurant-axel120.vercel.app</a>'
        },
        {
            id: 'linguaboost',
            boost: 1,
            keywords: ['linguaboost', 'lingua', 'apprentissage des langues', 'cours en ligne', 'exercices'],
            answer: '🗣️ <strong>LinguaBoost</strong> — plateforme d\'apprentissage des langues en ligne, avec des cours interactifs et des exercices pour progresser rapidement.\n👉 <a href="https://linguaboost-gold-psi.vercel.app" target="_blank" rel="noopener">linguaboost-gold-psi.vercel.app</a>'
        },

        /* ── Voyages ──────────────────────────── */
        {
            id: 'voyages',
            keywords: ['voyage', 'voyages', 'voyager', 'pays', 'monde', 'continent', 'continents', 'carte', 'destination', 'destinations'],
            answer: '✈️ En dehors du code, Axel est un grand voyageur : <strong>18 pays sur 3 continents</strong> (Europe, Afrique, Amérique du Sud).\n\nCette ouverture culturelle nourrit directement sa créativité et sa façon de concevoir des interfaces.\n\n👉 <a href="voyages.html">Voir la carte de ses voyages</a>'
        },
        {
            id: 'liste-pays',
            keywords: ['quels pays', 'liste des pays', 'ou es tu alle', 'quel pays', 'pays visites'],
            answer: '🌍 Les 18 pays visités par Axel :\n🇫🇷 France • 🇪🇸 Espagne • 🇬🇧 Royaume-Uni • 🇮🇹 Italie • 🇨🇭 Suisse • 🇧🇪 Belgique • 🇻🇦 Vatican • 🇲🇨 Monaco • 🇳🇴 Norvège • 🇩🇪 Allemagne • 🇦🇹 Autriche • 🇸🇰 Slovaquie • 🇬🇦 Gabon • 🇨🇮 Côte d\'Ivoire • 🇨🇲 Cameroun • 🇸🇷 Suriname • 🇦🇷 Argentine • 🇧🇷 Brésil\n\n👉 <a href="voyages.html">Voir la carte interactive</a>'
        },
        {
            id: 'destinations-preferees',
            keywords: ['destination preferee', 'prefere', 'preferee', 'plus beau', 'coup de coeur', 'ibiza', 'vienne', 'rome', 'bratislava', 'oslo', 'buenos aires', 'schonbrunn'],
            answer: '⭐ Les coups de cœur d\'Axel :\n• 🇪🇸 <strong>Ibiza</strong> — le port et le centre historique\n• 🇦🇹 <strong>Vienne</strong> — le Parlement et le château de Schönbrunn\n• 🇮🇹 <strong>Rome</strong> — la Ville Éternelle\n• 🇸🇰 <strong>Bratislava</strong> — l\'Église Bleue, joyau Art Nouveau de 1913\n• 🇳🇴 <strong>Oslo</strong> — l\'Opéra sur le fjord (2008), au toit accessible\n• 🇦🇷 <strong>Buenos Aires</strong> — l\'Ambassade de France, style Beaux-Arts\n\n👉 <a href="voyages.html">Voir les photos</a>'
        },

        /* ── Restaurant de démonstration ──────── */
        {
            id: 'restaurant-demo',
            boost: 1,
            keywords: ['restaurant', 'menu', 'carte du restaurant', 'galette', 'galettes', 'crepe', 'crepes', 'manger', 'plat', 'specialite', 'creperie'],
            answer: '🍽️ La section <strong>Restaurant</strong> du site est une démonstration de site de restauration, avec menu et réservation en ligne.\n\nAu menu :\n• Galette Fromage — 10 €\n• Galette Œufs (complet, salade verte) — 11 €\n• Crêpe Caramel maison — 8 €\n• Crêpe Banane-chocolat — 9 €\n\n👉 <a href="accueil.html">Voir le menu</a>'
        },
        {
            id: 'reservation-table',
            keywords: ['reserver', 'reservation', 'table', 'reserver une table', 'booking'],
            answer: '📅 Le site inclut un <strong>formulaire de réservation de table</strong> (nom, téléphone, date, heure, nombre de personnes jusqu\'à 8+) — un exemple de ce qu\'Axel peut intégrer sur le site d\'un restaurant.\n\n👉 <a href="contact.html">Essayer le formulaire</a>'
        },

        {
            id: 'donnees-personnelles',
            keywords: ['rgpd', 'gdpr', 'donnees personnelles', 'donnee personnelle', 'vie privee', 'confidentialite', 'cookie', 'cookies', 'mentions legales', 'traceur', 'consentement', 'cnil'],
            answer: '🔐 Ce site ne dépose <strong>aucun cookie</strong> et n\'utilise aucun outil de mesure d\'audience ni traceur publicitaire.\n\nSeules les informations que vous saisissez dans un formulaire sont collectées, uniquement pour vous répondre. Votre adresse IP est hachée — jamais stockée en clair — pendant 15 minutes, le temps de bloquer les robots de spam.\n\n• <a href="politique-confidentialite.html">Politique de confidentialité</a>\n• <a href="mentions-legales.html">Mentions légales</a>'
        },

        /* ── Méta ─────────────────────────────── */
        {
            id: 'meta-bot',
            keywords: ['tu es un robot', 'tu es une ia', 'es tu humain', 'qui t a cree', 'comment tu marches'],
            answer: '🤖 Je suis un assistant intégré au site, écrit en JavaScript par Axel lui-même — sans dépendance externe et avec protection anti-spam.\n\nC\'est justement un exemple de ce qu\'il peut ajouter à votre site. Pour parler au vrai Axel 👉 <a href="contact.html">page contact</a>'
        },
        {
            id: 'remerciement',
            keywords: ['merci', 'super', 'parfait', 'ok', 'genial', 'top', 'excellent', 'nickel', 'bravo', 'cool'],
            answer: '😊 Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions.\n\nPour démarrer un projet 👉 <a href="contact.html">page contact</a>'
        },
        {
            id: 'au-revoir',
            keywords: ['au revoir', 'bye', 'a bientot', 'adieu', 'ciao', 'bonne soiree', 'a plus'],
            answer: 'À bientôt ! 👋 Revenez quand vous voulez. Axel sera ravi de travailler avec vous !'
        },
    ];

    const QUICK_REPLIES = [
        { label: '👤 Qui est Axel ?',     text: 'Qui est Axel Tagrou, presentation' },
        { label: '🌐 Créer un site web',  text: 'Je veux creer un site internet' },
        { label: '📂 Voir ses projets',   text: 'Montre-moi tes projets et realisations' },
        { label: '💻 Ses compétences',    text: 'Quelles technologies et competences ?' },
        { label: '💰 Tarifs et devis',    text: 'Quels sont vos tarifs ?' },
        { label: '🧩 Déroulement projet', text: 'Comment se deroule un projet, les etapes ?' },
        { label: '✈️ Ses voyages',        text: 'Parle-moi de tes voyages et pays visites' },
        { label: '📬 Contacter Axel',     text: 'Je veux contacter Axel par email' },
    ];

    /* ═══════════════════════════════════════════
       INJECT HTML
    ═══════════════════════════════════════════ */
    document.body.insertAdjacentHTML('beforeend', `
        <button class="chatbox-btn" id="chatboxBtn" aria-label="Ouvrir le chat" aria-expanded="false">
            <i class="fas fa-comments icon-open" aria-hidden="true"></i>
            <i class="fas fa-times icon-close"   aria-hidden="true"></i>
            <span class="chatbox-notif" id="chatNotif" aria-label="1 nouveau message">1</span>
        </button>

        <div class="chatbox-panel" id="chatboxPanel"
             role="dialog" aria-modal="true" aria-label="Chat avec l'assistant d'Axel"
             aria-hidden="true">
            <div class="chat-header">
                <div class="chat-avatar" aria-hidden="true"><i class="fas fa-user-tie"></i></div>
                <div class="chat-header-info">
                    <h4>Assistant d'Axel</h4>
                    <span><span class="online-dot" aria-hidden="true"></span> En ligne &bull; Répond rapidement</span>
                </div>
                <button class="chat-close" id="chatboxClose" aria-label="Fermer le chat">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>

            <div class="chat-messages" id="chatMessages" role="log" aria-live="polite" aria-label="Messages"></div>
            <div class="chat-quick"   id="chatQuick"></div>

            <div class="chat-input-row">
                <input type="text" class="chat-input" id="chatInput"
                       placeholder="Écrivez votre message..."
                       maxlength="${MAX_MSG_LENGTH}"
                       autocomplete="off"
                       aria-label="Message à envoyer">
                <button class="chat-send" id="chatSend" aria-label="Envoyer le message">
                    <i class="fas fa-paper-plane" aria-hidden="true"></i>
                </button>
            </div>

            <div class="chat-rate-warning" id="chatRateWarn" role="alert" aria-live="assertive"></div>
        </div>
    `);

    /* ═══════════════════════════════════════════
       ÉLÉMENTS DOM
    ═══════════════════════════════════════════ */
    const btn      = document.getElementById('chatboxBtn');
    const panel    = document.getElementById('chatboxPanel');
    const closeBtn = document.getElementById('chatboxClose');
    const messages = document.getElementById('chatMessages');
    const input    = document.getElementById('chatInput');
    const sendBtn  = document.getElementById('chatSend');
    const quick    = document.getElementById('chatQuick');
    const notif    = document.getElementById('chatNotif');
    const rateWarn = document.getElementById('chatRateWarn');

    let opened = false;
    let botBusy = false;

    /* ── Message de bienvenue ── */
    setTimeout(() => {
        addBotMsg('👋 Bonjour ! Je suis l\'assistant d\'<strong>Axel Tagrou</strong>, développeur web full stack &amp; IA.<br><br>Je connais son parcours, ses compétences, ses 8 réalisations, ses tarifs et ses délais. Par quoi souhaitez-vous commencer ?');
        buildQuickReplies();
    }, 900);

    /* ═══════════════════════════════════════════
       TOGGLE PANEL
    ═══════════════════════════════════════════ */
    btn.addEventListener('click', togglePanel);
    closeBtn.addEventListener('click', () => closePanel());

    /* Fermer en cliquant à l'extérieur */
    document.addEventListener('click', (e) => {
        if (opened && !panel.contains(e.target) && !btn.contains(e.target)) {
            closePanel();
        }
    });

    /* Fermer avec Échap */
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && opened) closePanel();
    });

    function togglePanel() {
        opened ? closePanel() : openPanel();
    }

    function openPanel() {
        opened = true;
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
        btn.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        notif.style.display = 'none';
        setTimeout(() => input.focus(), 300);
    }

    function closePanel() {
        opened = false;
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
    }

    /* ═══════════════════════════════════════════
       ENVOI DE MESSAGE
    ═══════════════════════════════════════════ */
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

    function sendMessage() {
        if (botBusy) return;

        const raw   = input.value;
        const clean = sanitize(raw);

        if (!clean) return;

        /* ── Sécurité : vérifications ── */
        const block = checkSecurity(clean);
        if (block) { showRateWarn(block); return; }

        /* Tout OK : on envoie */
        hideRateWarn();
        input.value = '';
        quick.innerHTML = '';

        _lastSend  = Date.now();
        _ts.push(_lastSend);

        if (clean === _lastText) { _sameCount++; } else { _sameCount = 0; }
        _lastText = clean;

        addUserMsg(clean);
        setTimeout(() => respond(clean), 500);
    }

    /* ═══════════════════════════════════════════
       SÉCURITÉ — vérifications
    ═══════════════════════════════════════════ */
    function checkSecurity(text) {
        const now = Date.now();

        /* 1. Envoi trop rapide (bot) */
        if (now - _lastSend < MIN_SEND_INTERVAL) {
            return 'Doucement ! Attendez un instant avant d\'envoyer un autre message. 🙂';
        }

        /* 2. Rate limiting (> RATE_LIMIT_MAX messages / minute) */
        const recent = _ts.filter(t => now - t < RATE_LIMIT_MS);
        if (recent.length >= RATE_LIMIT_MAX) {
            const wait = Math.ceil((RATE_LIMIT_MS - (now - Math.min(...recent))) / 1000);
            return `Trop de messages envoyés. Veuillez patienter environ ${wait}s. ⏳`;
        }

        /* 3. Message répété trop de fois (spam) */
        if (_sameCount >= MAX_SAME_MSG) {
            return 'Vous avez déjà envoyé ce message plusieurs fois. Essayez une autre question ! 😊';
        }

        return null;
    }

    /* ═══════════════════════════════════════════
       RÉPONSE DU BOT
    ═══════════════════════════════════════════ */
    function respond(text) {
        botBusy = true;
        input.disabled = true;
        sendBtn.disabled = true;
        showTyping();

        setTimeout(() => {
            removeTyping();
            const match = findBestMatch(text);
            addBotMsg(match
                ? match.answer
                : '🤔 Je n\'ai pas bien saisi votre question. Essayez par exemple : <em>qui est Axel</em>, <em>ses projets</em>, <em>ses compétences</em>, <em>ses tarifs</em>, <em>les délais</em>, <em>la sécurité</em>, <em>ses voyages</em>... ou tapez <em>aide</em> pour voir tous les sujets.<br>Sinon, contactez Axel directement 👉 <a href="contact.html">page contact</a>'
            );
            botBusy = false;
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }, 1100);
    }

    /* ═══════════════════════════════════════════
       HELPERS — AFFICHAGE
    ═══════════════════════════════════════════ */
    function addBotMsg(html) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.setAttribute('role', 'article');
        div.innerHTML = `<div class="chat-bubble">${html}</div>`;
        messages.appendChild(div);
        scrollDown();
    }

    function addUserMsg(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.setAttribute('role', 'article');
        div.innerHTML = `<div class="chat-bubble">${esc(text)}</div>`;
        messages.appendChild(div);
        scrollDown();
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.id = 'chatTyping';
        div.setAttribute('aria-label', 'Assistant en train de répondre');
        div.innerHTML = '<div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
        messages.appendChild(div);
        scrollDown();
    }

    function removeTyping() {
        const t = document.getElementById('chatTyping');
        if (t) t.remove();
    }

    function buildQuickReplies() {
        quick.innerHTML = '';
        QUICK_REPLIES.forEach(qr => {
            const b = document.createElement('button');
            b.className = 'quick-btn';
            b.textContent = qr.label;
            b.setAttribute('type', 'button');
            b.addEventListener('click', () => {
                if (botBusy) return;
                quick.innerHTML = '';
                addUserMsg(qr.label.replace(/^[^\w]+/, '').trim());
                _lastSend = Date.now();
                _ts.push(_lastSend);
                setTimeout(() => respond(qr.text), 500);
            });
            quick.appendChild(b);
        });
    }

    function showRateWarn(msg) {
        rateWarn.textContent = msg;
        rateWarn.style.display = 'block';
    }

    function hideRateWarn() {
        rateWarn.textContent = '';
        rateWarn.style.display = 'none';
    }

    function scrollDown() {
        messages.scrollTop = messages.scrollHeight;
    }

    /* ═══════════════════════════════════════════
       HELPERS — SÉCURITÉ / TEXTE
    ═══════════════════════════════════════════ */

    /* Normalise l'entrée : espaces superflus et longueur maximale.
       L'échappement HTML n'est PAS fait ici : il a lieu une seule fois,
       au moment de l'affichage (esc()). Échapper deux fois transformait
       « j'ai un projet » en « j&#39;ai un projet » à l'écran. */
    function sanitize(str) {
        return str
            .trim()
            .slice(0, MAX_MSG_LENGTH);
    }

    /* Échappement pour affichage dans une bulle utilisateur */
    function esc(str) {
        return str
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;')
            .replace(/'/g,  '&#39;')
            .replace(/`/g,  '&#96;');
    }

    /* ═══════════════════════════════════════════
       MOTEUR DE RECHERCHE — mots-clés pondérés
       • une expression de plusieurs mots pèse plus lourd
         qu'un mot isolé ;
       • un mot long est plus discriminant qu'un mot court ;
       • la correspondance se fait sur des mots entiers,
         donc « ia » ne se déclenche plus dans « social » ;
       • les pluriels sont tolérés mais comptés une seule fois
         (« projet » + « projets » ne valent pas double) ;
       • « boost » départage en faveur des fiches précises
         (une réalisation nommée passe devant la liste générale).
    ═══════════════════════════════════════════ */
    const MIN_SCORE = 1;   // score minimal pour accepter une réponse

    function findBestMatch(text) {
        const norm   = ' ' + normalize(text) + ' ';
        const tokens = norm.trim().split(' ').filter(Boolean);

        let best = null;
        let bestScore = 0;

        for (const r of RESPONSES) {
            let score  = 0;
            const seen = new Set();   // radicaux déjà comptés pour cette fiche

            for (const k of r.keywords) {
                const key = normalize(k);
                if (!key) continue;

                /* Expression de plusieurs mots : match exact, bien pondéré */
                if (key.indexOf(' ') !== -1) {
                    if (norm.includes(' ' + key + ' ')) score += 2 + key.split(' ').length;
                    continue;
                }

                /* Un seul point par radical, pour ne pas compter
                   deux fois le singulier et le pluriel */
                const stem = key.endsWith('s') ? key.slice(0, -1) : key;
                if (seen.has(stem)) continue;

                const hit = tokens.includes(key) ||
                            tokens.includes(key + 's') ||
                            (key.endsWith('s') && tokens.includes(stem)) ||
                            (key.length >= 5 && tokens.some(t => t.startsWith(key)));

                if (hit) {
                    seen.add(stem);
                    score += key.length >= 9 ? 3 : (key.length >= 6 ? 2 : 1);
                }
            }

            /* Bonus de précision (fiches projets, sujets pointus) */
            if (score > 0 && r.boost) score += r.boost;

            if (score > bestScore) {
                bestScore = score;
                best = r;
            }
        }

        return bestScore >= MIN_SCORE ? best : null;
    }

    /* Normalisation pour la correspondance de mots-clés :
       décode d'abord les entités HTML laissées par sanitize()
       (sinon « qu'est-ce » devient « qu 39 est ce »), puis
       retire accents, casse et ponctuation. */
    function normalize(str) {
        return str
            .replace(/&#?\w{1,8};/g, ' ')        // &#39; &quot; &amp; ...
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')     // retire les accents
            .replace(/[^a-z0-9\s]/g, ' ')        // garde lettres, chiffres, espaces
            .replace(/\s+/g, ' ')
            .trim();
    }

})();
