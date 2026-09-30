/* ─────────────────────────────────────────────
   6b. Réservation de table
       Chaque champ est validé contre un format strict ou une liste blanche.
───────────────────────────────────────────── */
} else {

    $phone  = trim(post_field('phone'));
    $date   = trim(post_field('date'));
    $time   = trim(post_field('time'));
    $guests = trim(post_field('guests'));

    // Téléphone : chiffres et séparateurs usuels uniquement
    if (!preg_match('/^[0-9+\s().\-]{6,20}$/', $phone)) {
        reply(400, array('success' => false, 'message' => 'invalid_data'));
    }

    // Date : format exact AAAA-MM-JJ, date réelle, et pas dans le passé
    $d = DateTime::createFromFormat('!Y-m-d', $date);
    if (!$d || $d->format('Y-m-d') !== $date) {
        reply(400, array('success' => false, 'message' => 'invalid_data'));
    }
    $today = new DateTime('today');
    if ($d < $today) {
        reply(400, array('success' => false, 'message' => 'invalid_date'));
    }
    // Garde-fou : pas de réservation à plus d'un an
    $limit = new DateTime('today');
    $limit->modify('+1 year');
    if ($d > $limit) {
        reply(400, array('success' => false, 'message' => 'invalid_date'));
    }

    // Heure : 00:00 à 23:59
    if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $time)) {
        reply(400, array('success' => false, 'message' => 'invalid_data'));
    }

    // Nombre de couverts : liste blanche identique aux options du <select>
    $allowedGuests = array('1', '2', '3', '4', '5', '6', '7', '8+');
    if (!in_array($guests, $allowedGuests, true)) {
        reply(400, array('success' => false, 'message' => 'invalid_data'));
    }

    $body  = "Nouvelle demande de réservation depuis axeltagrou.fr\n";
    $body .= str_repeat('-', 40) . "\n";
    $body .= "Nom       : {$name}\n";
    $body .= "Téléphone : {$phone}\n";
    $body .= "Date      : " . $d->format('d/m/Y') . "\n";
    $body .= "Heure     : {$time}\n";
    $body .= "Couverts  : {$guests}\n";
    $body .= str_repeat('-', 40) . "\n";
    $body .= "Rappeler le client au {$phone}\n";

    $subj = mb_encode_mimeheader(
        "[Réservation] {$name} — " . $d->format('d/m/Y') . " à {$time}",
        'UTF-8',
        'B'
    );
    // Pas de Reply-To : le formulaire de réservation ne collecte pas d'email.
}