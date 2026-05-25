document.addEventListener('DOMContentLoaded', () => {

    // ── Menu burger ──
    const burger = document.querySelector('.menuBurguer');
    const nav = document.querySelector('nav');
    if (burger && nav) {
        burger.addEventListener('click', () => nav.classList.toggle('navOpen'));
    }

    const form = document.getElementById('contactForm');
    if (!form) return;

    const msg = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    // Compteur de caractères
    if (msg && charCount) {
        msg.addEventListener('input', () => {
            charCount.textContent = `(${msg.value.length}/1000)`;
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        // ── 1. Honeypot : si rempli → bot détecté ──
        const honeypot = document.getElementById('website');
        if (honeypot && honeypot.value.trim() !== '') return;

        // ── 2. Rate limiting : 1 envoi toutes les 5 minutes ──
        const lastSent = localStorage.getItem('lastFormSent');
        if (lastSent && Date.now() - parseInt(lastSent) < 5 * 60 * 1000) {
            showAlert('Merci de patienter quelques minutes avant d\'envoyer un autre message.', 'warning');
            return;
        }

        // ── 3. Validation des champs ──
        const name    = sanitize(document.getElementById('name').value.trim());
        const email   = document.getElementById('email').value.trim();
        const subject = sanitize(document.getElementById('subject').value.trim());
        const message = sanitize(msg.value.trim());

        let valid = true;

        if (name.length < 2) {
            showFieldError('nameError', 'Le nom doit contenir au moins 2 caractères.');
            valid = false;
        }

        if (!isValidEmail(email)) {
            showFieldError('emailError', 'Adresse email invalide.');
            valid = false;
        }

        if (subject.length < 3) {
            showFieldError('subjectError', 'Le sujet doit contenir au moins 3 caractères.');
            valid = false;
        }

        if (message.length < 10) {
            showFieldError('messageError', 'Le message doit contenir au moins 10 caractères.');
            valid = false;
        }

        if (!valid) return;

        // ── 4. Envoi réussi ──
        localStorage.setItem('lastFormSent', Date.now().toString());
        const btn = document.getElementById('submitBtn');
        btn.disabled = true;
        btn.textContent = 'Envoyé ✓';
        showAlert('Merci ! Votre message a bien été envoyé. Je vous répondrai sous 24h.', 'success');
        form.reset();
        if (charCount) charCount.textContent = '(0/1000)';
        setTimeout(() => { btn.disabled = false; btn.textContent = 'Envoyer'; }, 5000);
    });

    // ── Helpers ──
    function sanitize(str) {
        return str.replace(/[<>&"']/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    }

    function showFieldError(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function clearErrors() {
        ['nameError','emailError','subjectError','messageError'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });
        const alert = document.getElementById('formAlert');
        if (alert) alert.innerHTML = '';
    }

    function showAlert(text, type) {
        const alert = document.getElementById('formAlert');
        if (!alert) return;
        alert.innerHTML = `<div class="form-alert form-alert--${type}">${text}</div>`;
    }
});
