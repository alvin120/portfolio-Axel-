(function () {

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
            keywords: ['prix', 'tarif', 'coût', 'combien', 'devis', 'budget', 'gratuit', 'pas cher'],
            answer: '💰 Les tarifs varient selon le projet :\n• Site vitrine : à partir de quelques centaines d\'€\n• Application mobile : selon complexité\n• Devis 100% gratuit et sans engagement\n\nContactez Axel pour une estimation 👉 <a href="contact.html">page contact</a>'
        },
        {
            keywords: ['délai', 'temps', 'durée', 'rapide', 'quand', 'livraison', 'semaine', 'mois'],
            answer: '⏱️ Délais indicatifs :\n• Site vitrine : 1-2 semaines\n• Site complet : 2-4 semaines\n• Application mobile : 1-3 mois\n\nContactez Axel pour une estimation précise selon votre projet.'
        },
        {
            keywords: ['contact', 'joindre', 'email', 'téléphone', 'appeler', 'message', 'écrire'],
            answer: '📬 Contactez Axel :\n• Email : axelavin20@gmail.com\n• Tél : +33 6 65 33 49 65\n\nOu directement via la <a href="contact.html">page contact</a> — réponse sous 24h !'
        },
        {
            keywords: ['technologie', 'stack', 'html', 'css', 'javascript', 'react', 'php', 'symfony', 'mysql', 'git'],
            answer: '💻 Stack technique d\'Axel :\n• Front : HTML/CSS, JavaScript, React\n• Back : PHP, Symfony, MySQL\n• Mobile : React Native\n• Design : Figma\n• IA : ChatGPT, Claude, Gemini\n\nVoir les <a href="compétence.html">compétences complètes</a>.'
        },
        {
            keywords: ['expérience', 'depuis', 'ans', 'année', 'sénior', 'junior', 'niveau'],
            answer: '📅 Axel développe depuis 2020, soit 5+ ans d\'expérience. Il a créé 6+ sites web, des applications mobiles et des projets intégrant l\'IA.'
        },
        {
            keywords: ['voyage', 'pays', 'monde', 'continent'],
            answer: '✈️ En dehors du code, Axel est un grand voyageur — 18 pays visités sur 3 continents ! Cette ouverture culturelle nourrit sa créativité. Voir ses <a href="voyages.html">voyages</a>.'
        },
        {
            keywords: ['restaurant', 'menu', 'table', 'réservation'],
            answer: '🍽️ Axel a créé un site de restaurant avec carte et réservation en ligne. Découvrez-le dans la section <a href="accueil.html">Restaurant</a>.'
        },
        {
            keywords: ['pourquoi', 'besoin', 'utilité', 'avantage', 'important'],
            answer: '📈 En 2025, avoir un site internet c\'est indispensable :\n• 97% des clients cherchent en ligne\n• Visibilité 24h/24 sur Google\n• Image professionnelle et crédibilité\n• Clients au-delà de votre zone géographique\n\nNe laissez pas vos clients à la concurrence !'
        },
        {
            keywords: ['merci', 'super', 'parfait', 'ok', 'génial', 'bien', 'top', 'excellent', 'nickel'],
            answer: '😊 Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. Pour démarrer un projet, contactez Axel 👉 <a href="contact.html">page contact</a>'
        },
        {
            keywords: ['au revoir', 'bye', 'à bientôt', 'adieu', 'ciao'],
            answer: 'À bientôt ! 👋 N\'hésitez pas à revenir si vous avez des questions. Axel sera ravi de travailler avec vous !'
        },
    ];

    const QUICK_REPLIES = [
        { label: '🌐 Créer un site web',  text: 'Je veux créer un site internet' },
        { label: '📱 Application mobile', text: 'Application mobile, comment ça marche ?' },
        { label: '💰 Tarifs et devis',    text: 'Quels sont vos tarifs ?' },
        { label: '📬 Contacter Axel',     text: 'Je veux contacter Axel' },
    ];

    // ── Inject HTML ──
    document.body.insertAdjacentHTML('beforeend', `
        <button class="chatbox-btn" id="chatboxBtn" aria-label="Ouvrir le chat">
            <i class="fas fa-comments icon-open"></i>
            <i class="fas fa-times icon-close"></i>
            <span class="chatbox-notif" id="chatNotif">1</span>
        </button>

        <div class="chatbox-panel" id="chatboxPanel" role="dialog" aria-label="Chat avec l'assistant d'Axel">
            <div class="chat-header">
                <div class="chat-avatar"><i class="fas fa-user-tie"></i></div>
                <div class="chat-header-info">
                    <h4>Assistant d'Axel</h4>
                    <span><span class="online-dot"></span> En ligne &bull; Répond rapidement</span>
                </div>
                <button class="chat-close" id="chatboxClose" aria-label="Fermer le chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-quick"   id="chatQuick"></div>

            <div class="chat-input-row">
                <input type="text" class="chat-input" id="chatInput"
                       placeholder="Écrivez votre message..." maxlength="300" autocomplete="off">
                <button class="chat-send" id="chatSend" aria-label="Envoyer">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `);

    // ── Elements ──
    const btn      = document.getElementById('chatboxBtn');
    const panel    = document.getElementById('chatboxPanel');
    const closeBtn = document.getElementById('chatboxClose');
    const messages = document.getElementById('chatMessages');
    const input    = document.getElementById('chatInput');
    const sendBtn  = document.getElementById('chatSend');
    const quick    = document.getElementById('chatQuick');
    const notif    = document.getElementById('chatNotif');

    let opened = false;

    // ── Welcome message ──
    setTimeout(() => {
        addBotMsg('👋 Bonjour ! Je suis l\'assistant d\'Axel. Comment puis-je vous aider aujourd\'hui ?');
        buildQuickReplies();
    }, 800);

    // ── Toggle panel ──
    btn.addEventListener('click', () => {
        opened = !opened;
        panel.classList.toggle('open', opened);
        btn.classList.toggle('active', opened);
        if (opened) {
            notif.style.display = 'none';
            setTimeout(() => input.focus(), 300);
        }
    });

    closeBtn.addEventListener('click', () => {
        opened = false;
        panel.classList.remove('open');
        btn.classList.remove('active');
    });

    // ── Send ──
    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') sendMessage(); });

    function sendMessage() {
        const text = input.value.trim();
        if (!text) return;
        input.value = '';
        quick.innerHTML = '';
        addUserMsg(text);
        setTimeout(() => respond(text), 500);
    }

    function respond(text) {
        showTyping();
        setTimeout(() => {
            removeTyping();
            const lower = text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
            const match = RESPONSES.find(r =>
                r.keywords.some(k => lower.includes(k.normalize('NFD').replace(/[̀-ͯ]/g, '')))
            );
            addBotMsg(match
                ? match.answer
                : '🤔 Je ne suis pas sûr de comprendre. Pour toute question précise, contactez Axel directement 👉 <a href="contact.html">page contact</a>'
            );
        }, 1100);
    }

    // ── Helpers ──
    function addBotMsg(html) {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.innerHTML = `<div class="chat-bubble">${html}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function addUserMsg(text) {
        const div = document.createElement('div');
        div.className = 'chat-msg user';
        div.innerHTML = `<div class="chat-bubble">${esc(text)}</div>`;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const div = document.createElement('div');
        div.className = 'chat-msg bot';
        div.id = 'chatTyping';
        div.innerHTML = '<div class="chat-bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>';
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
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
            b.addEventListener('click', () => {
                quick.innerHTML = '';
                addUserMsg(qr.label.replace(/^[^\w]+/, '').trim());
                setTimeout(() => respond(qr.text), 500);
            });
            quick.appendChild(b);
        });
    }

    function esc(str) {
        return str
            .replace(/&/g,  '&amp;')
            .replace(/</g,  '&lt;')
            .replace(/>/g,  '&gt;')
            .replace(/"/g,  '&quot;')
            .replace(/'/g,  '&#39;');
    }

})();
