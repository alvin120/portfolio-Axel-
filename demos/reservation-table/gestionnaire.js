
    /* ─────────────────────────────────────────────
       Formulaire de réservation de table
    ───────────────────────────────────────────── */
    const resForm  = document.getElementById('reservationForm');
    const resAlert = document.getElementById('resAlert');

    if (resForm) resForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (resAlert) resAlert.textContent = '';

        const honeypot = document.getElementById('res-website');
        if (honeypot && honeypot.value.trim() !== '') return;

        const name   = document.getElementById('res-name').value.trim();
        const phone  = document.getElementById('res-phone').value.trim();
        const date   = document.getElementById('res-date').value;
        const time   = document.getElementById('res-time').value;
        const guests = document.getElementById('res-guests').value;

        let erreur = '';
        if (name.length < 2)                        erreur = 'Merci d\'indiquer votre nom.';
        else if (!isValidPhone(phone))              erreur = 'Merci d\'indiquer un numéro de téléphone valide.';
        else if (!date)                             erreur = 'Merci de choisir une date.';
        else if (!time)                             erreur = 'Merci de choisir une heure.';
        else if (!guests)                           erreur = 'Merci d\'indiquer le nombre de personnes.';
        else {
            // Comparaison sur des dates locales, sans fuseau, comme le serveur
            const today = new Date();
            const jour = new Date(date + 'T00:00:00');
            today.setHours(0, 0, 0, 0);
            if (jour < today) erreur = 'La date choisie est déjà passée.';
        }

        if (erreur) { showAlert(resAlert, erreur, 'error'); return; }

        const btn = document.getElementById('resSubmitBtn');
        const body = new FormData();
        body.append('type', 'reservation');
        body.append('name', name);
        body.append('phone', phone);
        body.append('date', date);
        body.append('time', time);
        body.append('guests', guests);
        body.append('website', honeypot ? honeypot.value : '');

        send('send-mail.php', body, btn, 'Réserver', resAlert,
             'Merci ! Votre demande de réservation est bien reçue. Vous serez rappelé pour confirmation.',
             () => resForm.reset());
    });
