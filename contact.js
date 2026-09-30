document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────────
       Menu burger
    ───────────────────────────────────────────── */
    const burger = document.querySelector('.menuBurguer');
    const nav = document.querySelector('nav');
    if (burger && nav) {
        burger.addEventListener('click', () => nav.classList.toggle('navOpen'));
    }

    /* ─────────────────────────────────────────────
       Helpers partagés

       Note sécurité : ces contrôles servent uniquement le confort de
       l'utilisateur (retour immédiat, moins d'allers-retours réseau).
       La validation qui compte est celle de send-mail.php, côté serveur,
       car tout ce qui est fait ici est contournable depuis la console.
    ───────────────────────────────────────────── */
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }
    function setFieldError(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    /* Construit l'alerte via textContent plutôt qu'innerHTML :
       aucune chaîne ne peut être interprétée comme du HTML. */
    function showAlert(container, text, type) {
        if (!container) return;
        container.textContent = '';
        const box = document.createElement('div');
        box.className = `form-alert form-alert--${type}`;
        box.textContent = text;
        container.appendChild(box);
    }

    /* Traduit la réponse du serveur en message lisible */
    function serverMessage(data) {
        if (data && data.message === 'rate_limit') {
            return 'Vous avez envoyé plusieurs messages coup sur coup. Merci de patienter quelques minutes.';
        }
        return 'Une erreur est survenue. Réessayez ou écrivez-moi directement à axelalvin20@gmail.com.';
    }

    /* ─────────────────────────────────────────────
       Formulaire de contact
    ───────────────────────────────────────────── */
    const form = document.getElementById('contactForm');
    const msg = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    const formAlert = document.getElementById('formAlert');

    if (msg && charCount) {
        msg.addEventListener('input', () => {
            charCount.textContent = `(${msg.value.length}/1000)`;
        });
    }

    if (form) form.addEventListener('submit', (e) => {
        e.preventDefault();
        ['nameError', 'emailError', 'subjectError', 'messageError'].forEach(id => setFieldError(id, ''));
        if (formAlert) formAlert.textContent = '';

        // Honeypot : rempli = robot, on ne fait rien
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value.trim() !== '') return;

        /* Les valeurs partent telles que saisies. L'ancienne version les
           échappait en HTML ici, ce qui faisait arriver « j&#39;ai » dans
           les emails reçus. L'échappement n'a pas sa place à l'envoi :
           send-mail.php applique strip_tags côté serveur. */
        const name    = document.getElementById('name').value.trim();
        const email   = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = msg.value.trim();

        let valid = true;
        if (name.length < 2)       { setFieldError('nameError',    'Le nom doit contenir au moins 2 caractères.'); valid = false; }
        if (!isValidEmail(email))  { setFieldError('emailError',   'Adresse email invalide.'); valid = false; }
        if (subject.length < 3)    { setFieldError('subjectError', 'Le sujet doit contenir au moins 3 caractères.'); valid = false; }
        if (message.length < 10)   { setFieldError('messageError', 'Le message doit contenir au moins 10 caractères.'); valid = false; }
        if (!valid) return;

        const btn = document.getElementById('submitBtn');
        const body = new FormData();
        body.append('type', 'contact');
        body.append('name', name);
        body.append('email', email);
        body.append('subject', subject);
        body.append('message', message);
        body.append('website', honeypot ? honeypot.value : '');

        send('send-mail.php', body, btn, 'Envoyer', formAlert,
             'Merci ! Votre message a bien été envoyé. Je vous répondrai sous 24h.',
             () => {
                 form.reset();
                 if (charCount) charCount.textContent = '(0/1000)';
             });
    });

    /* ─────────────────────────────────────────────
       Envoi du formulaire
    ───────────────────────────────────────────── */
    function send(url, body, btn, labelInitial, alertBox, messageSucces, onSuccess) {
        const rendreBouton = () => {
            if (btn) { btn.disabled = false; btn.textContent = labelInitial; }
        };

        if (btn) { btn.disabled = true; btn.textContent = 'Envoi…'; }

        fetch(url, { method: 'POST', body })
            .then(r => r.json().catch(() => ({ success: false })))
            .then(data => {
                if (data.success) {
                    showAlert(alertBox, messageSucces, 'success');
                    if (onSuccess) onSuccess();
                    if (btn) btn.textContent = 'Envoyé ✓';
                    setTimeout(rendreBouton, 5000);
                } else {
                    const type = data.message === 'rate_limit' ? 'warning' : 'error';
                    showAlert(alertBox, serverMessage(data), type);
                    rendreBouton();
                }
            })
            .catch(() => {
                showAlert(alertBox, 'Impossible de contacter le serveur. Écrivez-moi à axelalvin20@gmail.com.', 'error');
                rendreBouton();
            });
    }
});
