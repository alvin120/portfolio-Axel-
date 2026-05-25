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
    const RESPONSES = [
        {
            keywords: ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou', 'hi', 'bonne journée'],
            answer: '👋 Bonjour ! Je suis l\'assistant d\'Axel. Je peux vous renseigner sur ses services, ses compétences ou comment le contacter. Que souhaitez-vous savoir ?'
        },
        {
            keywords: ['site', 'internet', 'web', 'créer', 'création', 'vitrine', 'ecommerce', 'boutique', 'page'],
            answer: '🌐 Axel crée des sites web sur mesure :\n• Sites vitrines\n• E-commerces\n• Portfolios & blogs\n• Plateformes web\n\nModernes, rapides et adaptés à tous les écrans. Envie d\'un devis gratuit ?'
        },
        {
            keywords: ['application', 'mobile', 'app', 'android', 'ios', 'appli', 'smartphone'],
            answer: '📱 Axel développe des applications mobiles :\n• Notifications push ciblées\n• Expérience fluide et intuitive\n• Accès hors-ligne\n• Paiement intégré\n\nUn must pour fidéliser vos clients !'
        },
        {
            keywords: ['ia', 'intelligence', 'artificielle', 'chatgpt', 'ai', 'robot', 'automatisation', 'gemini', 'claude'],
            answer: '🤖 Axel intègre l\'IA dans vos projets :\n• Chatbot disponible 24h/24\n• Automatisation des tâches répétitives\n• Recommandations personnalisées\n• Analyse de données\n\nUn avantage concurrentiel décisif en 2025 !'
        },
        {
            keywords: ['maquette', 'design', 'figma', 'ui', 'ux', 'graphique', 'wireframe', 'prototype', 'visuel'],
            answer: '🎨 Axel crée des maquettes UI/UX avec Figma avant de coder. Vous voyez le résultat final avant même de commencer — zéro surprise !'
        },
        {
            keywords: ['prix', 'tarif', 'cout', 'combien', 'devis', 'budget', 'gratuit', 'pas cher'],
            answer: '💰 Les tarifs varient selon le projet :\n• Site vitrine : à partir de quelques centaines d\'€\n• Application mobile : selon complexité\n• Devis 100% gratuit et sans engagement\n\nContactez Axel pour une estimation 👉 <a href="contact.html">page contact</a>'
        },
        {
            keywords: ['delai', 'temps', 'duree', 'rapide', 'quand', 'livraison', 'semaine', 'mois'],
            answer: '⏱️ Délais indicatifs :\n• Site vitrine : 1-2 semaines\n• Site complet : 2-4 semaines\n• Application mobile : 1-3 mois\n\nContactez Axel pour une estimation précise selon votre projet.'
        },
        {
            keywords: ['contact', 'joindre', 'email', 'telephone', 'appeler', 'message', 'ecrire'],
            answer: '📬 Contactez Axel :\n• Email : axelavin20@gmail.com\n• Tél : +33 6 65 33 49 65\n\nOu directement via la <a href="contact.html">page contact</a> — réponse sous 24h !'
        },
        {
            keywords: ['technologie', 'stack', 'html', 'css', 'javascript', 'react', 'php', 'symfony', 'mysql', 'git'],
            answer: '💻 Stack technique d\'Axel :\n• Front : HTML/CSS, JavaScript, React\n• Back : PHP, Symfony, MySQL\n• Mobile : React Native\n• Design : Figma\n• IA : ChatGPT, Claude, Gemini\n\nVoir les <a href="compétence.html">compétences complètes</a>.'
        },
        {
            keywords: ['experience', 'depuis', 'ans', 'annee', 'senior', 'junior', 'niveau'],
            answer: '📅 Axel développe depuis 2020, soit 5+ ans d\'expérience. Il a créé 6+ sites web, des applications mobiles et des projets intégrant l\'IA.'
        },
        {
            keywords: ['voyage', 'pays', 'monde', 'continent'],
            answer: '✈️ En dehors du code, Axel est un grand voyageur — 18 pays visités sur 3 continents ! Cette ouverture culturelle nourrit sa créativité. Voir ses <a href="voyages.html">voyages</a>.'
        },
        {
            keywords: ['restaurant', 'menu', 'table', 'reservation'],
            answer: '🍽️ Axel a créé un site de restaurant avec carte et réservation en ligne. Découvrez-le dans la section <a href="accueil.html">Restaurant</a>.'
        },
        {
            keywords: ['pourquoi', 'besoin', 'utilite', 'avantage', 'important'],
            answer: '📈 En 2025, avoir un site internet c\'est indispensable :\n• 97% des clients cherchent en ligne\n• Visibilité 24h/24 sur Google\n• Image professionnelle et crédibilité\n• Clients au-delà de votre zone géographique\n\nNe laissez pas vos clients à la concurrence !'
        },
        {
            keywords: ['merci', 'super', 'parfait', 'ok', 'genial', 'bien', 'top', 'excellent', 'nickel'],
            answer: '😊 Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. Pour démarrer un projet, contactez Axel 👉 <a href="contact.html">page contact</a>'
        },
        {
            keywords: ['au revoir', 'bye', 'a bientot', 'adieu', 'ciao'],
            answer: 'À bientôt ! 👋 N\'hésitez pas à revenir si vous avez des questions. Axel sera ravi de travailler avec vous !'
        },
    ];

    const QUICK_REPLIES = [
        { label: '🌐 Créer un site web',  text: 'Je veux créer un site internet' },
        { label: '📱 Application mobile', text: 'Application mobile, comment ça marche ?' },
        { label: '💰 Tarifs et devis',    text: 'Quels sont vos tarifs ?' },
        { label: '📬 Contacter Axel',     text: 'Je veux contacter Axel' },
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
        addBotMsg('👋 Bonjour ! Je suis l\'assistant d\'Axel. Comment puis-je vous aider aujourd\'hui ?');
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
            const norm  = normalize(text);
            const match = RESPONSES.find(r =>
                r.keywords.some(k => norm.includes(normalize(k)))
            );
            addBotMsg(match
                ? match.answer
                : '🤔 Je ne suis pas sûr de comprendre. Pour toute question précise, contactez Axel directement 👉 <a href="contact.html">page contact</a>'
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

    /* Sanitisation : supprime tout HTML potentiel + limite la longueur */
    function sanitize(str) {
        return str
            .trim()
            .slice(0, MAX_MSG_LENGTH)
            .replace(/[<>&"'`]/g, c => ({
                '<':'&lt;', '>':'&gt;', '&':'&amp;',
                '"':'&quot;', "'": '&#39;', '`':'&#96;'
            }[c]));
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

    /* Normalisation pour la correspondance de mots-clés
       (accents, casse, caractères spéciaux) */
    function normalize(str) {
        return str
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '') // retire les accents
            .replace(/[^a-z0-9\s]/g, ' ')    // garde lettres, chiffres, espaces
            .replace(/\s+/g, ' ')
            .trim();
    }

})();
