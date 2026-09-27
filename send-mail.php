<?php
/**
 * Point d'entrée unique des formulaires du site (contact + réservation).
 *
 * Défenses, dans l'ordre : méthode HTTP, origine, honeypot, limitation par IP,
 * puis validation stricte champ par champ selon le type de formulaire.
 * Aucune donnée n'est stockée hormis un compteur d'IP haché, hors racine web.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

// L'ini d'OVH peut différer de la valeur par défaut : on fixe l'encodage
// explicitement pour que mb_substr/mb_strlen traitent bien l'UTF-8.
mb_internal_encoding('UTF-8');


/** Renvoie une réponse JSON et termine. Les messages restent volontairement
 *  génériques : pas de chemin, pas de détail interne côté client. */
function reply($code, $payload) {
    http_response_code($code);
    echo json_encode($payload);
    exit;
}

/* ─────────────────────────────────────────────
   1. Méthode
───────────────────────────────────────────── */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, ['success' => false]);
}

/* ─────────────────────────────────────────────
   2. Origine — ancrage obligatoire, sinon
      « https://axeltagrou.fr.attaquant.com » passerait.
───────────────────────────────────────────── */
$origin  = $_SERVER['HTTP_ORIGIN']  ?? '';
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$allowed = '#^https://(www\.)?axeltagrou\.fr(/|$)#i';
if (!preg_match($allowed, $origin) && !preg_match($allowed, $referer)) {
    reply(403, ['success' => false]);
}

/* ─────────────────────────────────────────────
   3. Honeypot — champ invisible pour les humains
───────────────────────────────────────────── */
if (!empty($_POST['website'])) {
    reply(200, ['success' => true]);   // silence volontaire : le bot croit avoir réussi
}

/* ─────────────────────────────────────────────
   4. Limitation de débit par IP
      L'ancienne version s'appuyait sur $_SESSION, donc sur un cookie fourni
      par le client : il suffisait de ne pas le renvoyer pour repartir à zéro.
      Ici le compteur est indexé sur l'adresse IP, côté serveur.

      • REMOTE_ADDR uniquement : X-Forwarded-For est falsifiable par le client.
      • L'IP est hachée : aucune donnée personnelle en clair sur le disque.
      • Fichier dans le répertoire temporaire système, donc hors /www/ :
        il n'est pas atteignable par HTTP.
      • flock() pour rester correct si deux requêtes arrivent en parallèle.
      • En cas d'échec disque on laisse passer : le honeypot et le contrôle
        d'origine restent actifs, et un site vitrine ne doit pas tomber
        parce qu'un fichier temporaire est indisponible.
───────────────────────────────────────────── */
define('RL_MAX',    3);     // envois autorisés…
define('RL_WINDOW', 900);   // …par tranche de 15 minutes

function rate_limited($ip) {
    $key  = hash('sha256', 'axeltagrou|rate-limit|' . $ip);
    $file = sys_get_temp_dir() . '/axf-rl-' . substr($key, 0, 32);
    $now  = time();

    $fh = @fopen($file, 'c+');
    if (!$fh) {
        return false;
    }
    if (!flock($fh, LOCK_EX)) {
        fclose($fh);
        return false;
    }

    $raw  = stream_get_contents($fh);
    $prev = json_decode($raw !== '' ? $raw : '[]', true);
    if (!is_array($prev)) {
        $prev = [];
    }

    // Fenêtre glissante : on ne garde que les envois encore dans la fenêtre
    $hits = [];
    foreach ($prev as $t) {
        $t = (int) $t;
        if ($t > 0 && ($now - $t) < RL_WINDOW) {
            $hits[] = $t;
        }
    }

    $blocked = count($hits) >= RL_MAX;
    if (!$blocked) {
        $hits[] = $now;
    }

    ftruncate($fh, 0);
    rewind($fh);
    fwrite($fh, json_encode($hits));
    fflush($fh);
    flock($fh, LOCK_UN);
    fclose($fh);

    return $blocked;
}

$ip = $_SERVER['REMOTE_ADDR'] ?? '';
if ($ip !== '' && rate_limited($ip)) {
    reply(429, ['success' => false, 'message' => 'rate_limit']);
}

/* ─────────────────────────────────────────────
   5. Champs communs
───────────────────────────────────────────── */
$type = ($_POST['type'] ?? 'contact') === 'reservation' ? 'reservation' : 'contact';
$name = mb_substr(strip_tags(trim($_POST['name'] ?? '')), 0, 100);

if (mb_strlen($name) < 2) {
    reply(400, ['success' => false, 'message' => 'invalid_data']);
}

$to       = 'axelalvin20@gmail.com';
$headers  = "From: noreply@axeltagrou.fr\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

/* ─────────────────────────────────────────────
   6a. Formulaire de contact
───────────────────────────────────────────── */
if ($type === 'contact') {

    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
    $subject = mb_substr(strip_tags(trim($_POST['subject'] ?? '')), 0, 150);
    $message = mb_substr(strip_tags(trim($_POST['message'] ?? '')), 0, 1000);

    if (!$email || mb_strlen($subject) < 3 || mb_strlen($message) < 10) {
        reply(400, ['success' => false, 'message' => 'invalid_data']);
    }

    $body  = "Nouveau message depuis axeltagrou.fr\n";
    $body .= str_repeat('-', 40) . "\n";
    $body .= "Nom     : {$name}\n";
    $body .= "Email   : {$email}\n";
    $body .= "Sujet   : {$subject}\n\n";
    $body .= "Message :\n{$message}\n";
    $body .= str_repeat('-', 40) . "\n";
    $body .= "Répondre directement à : {$email}\n";

    $subj = mb_encode_mimeheader("[Portfolio] {$subject}", 'UTF-8', 'B');

    // FILTER_VALIDATE_EMAIL rejette les retours à la ligne : pas d'injection
    // d'en-tête possible via Reply-To.
    $headers .= "Reply-To: {$email}\r\n";

/* ─────────────────────────────────────────────
   6b. Réservation de table
       Chaque champ est validé contre un format strict ou une liste blanche.
───────────────────────────────────────────── */
} else {

    $phone  = trim($_POST['phone']  ?? '');
    $date   = trim($_POST['date']   ?? '');
    $time   = trim($_POST['time']   ?? '');
    $guests = trim($_POST['guests'] ?? '');

    // Téléphone : chiffres et séparateurs usuels uniquement
    if (!preg_match('/^[0-9+\s().\-]{6,20}$/', $phone)) {
        reply(400, ['success' => false, 'message' => 'invalid_data']);
    }

    // Date : format exact AAAA-MM-JJ, date réelle, et pas dans le passé
    $d = DateTime::createFromFormat('!Y-m-d', $date);
    if (!$d || $d->format('Y-m-d') !== $date) {
        reply(400, ['success' => false, 'message' => 'invalid_data']);
    }
    $today = new DateTime('today');
    if ($d < $today) {
        reply(400, ['success' => false, 'message' => 'invalid_date']);
    }
    // Garde-fou : pas de réservation à plus d'un an
    $limit = (new DateTime('today'))->modify('+1 year');
    if ($d > $limit) {
        reply(400, ['success' => false, 'message' => 'invalid_date']);
    }

    // Heure : 00:00 à 23:59
    if (!preg_match('/^([01][0-9]|2[0-3]):[0-5][0-9]$/', $time)) {
        reply(400, ['success' => false, 'message' => 'invalid_data']);
    }

    // Nombre de couverts : liste blanche identique aux options du <select>
    $allowedGuests = ['1', '2', '3', '4', '5', '6', '7', '8+'];
    if (!in_array($guests, $allowedGuests, true)) {
        reply(400, ['success' => false, 'message' => 'invalid_data']);
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

/* ─────────────────────────────────────────────
   7. Envoi
───────────────────────────────────────────── */
if (@mail($to, $subj, $body, $headers)) {
    reply(200, ['success' => true]);
}

reply(500, ['success' => false, 'message' => 'send_error']);
