<?php
/**
 * Traitement du formulaire de contact du site.
 *
 * Défenses, dans l'ordre : méthode HTTP, origine, honeypot, limitation par IP,
 * puis validation stricte champ par champ.
 * Aucune donnée n'est stockée hormis un compteur d'IP haché, hors racine web.
 *
 * COMPATIBILITÉ — ce fichier reste volontairement compatible PHP 5.4, parce que
 * c'est la version réellement servie par l'hébergement aujourd'hui (vérifié :
 * 5.4.45). D'où l'absence de l'opérateur ?? et des fonctions fléchées, qui
 * provoquaient une erreur de parsing et donc un HTTP 500 muet sur chaque envoi.
 * Le code fonctionne à l'identique sur PHP 8.x : la montée de version, qui
 * reste vivement recommandée, ne cassera rien ici.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');

// L'ini de l'hébergeur peut différer de la valeur par défaut : on fixe
// l'encodage pour que mb_substr/mb_strlen traitent bien l'UTF-8.
mb_internal_encoding('UTF-8');

/** Renvoie une réponse JSON et termine. Les messages restent volontairement
 *  génériques : pas de chemin, pas de détail interne côté client. */
function reply($code, $payload) {
    http_response_code($code);
    echo json_encode($payload);
    exit;
}

/** Lecture d'un champ POST, sans ?? pour rester compatible PHP 5.4 */
function post_field($key, $default = '') {
    return isset($_POST[$key]) && is_string($_POST[$key]) ? $_POST[$key] : $default;
}

/** Lecture d'un en-tête / variable serveur */
function server_field($key, $default = '') {
    return isset($_SERVER[$key]) && is_string($_SERVER[$key]) ? $_SERVER[$key] : $default;
}

/* ─────────────────────────────────────────────
   1. Méthode
───────────────────────────────────────────── */
if (server_field('REQUEST_METHOD') !== 'POST') {
    header('Allow: POST');
    reply(405, array('success' => false));
}

/* ─────────────────────────────────────────────
   2. Origine — l'ancrage est indispensable, sinon
      « https://axeltagrou.fr.attaquant.com » passerait.
───────────────────────────────────────────── */
$origin  = server_field('HTTP_ORIGIN');
$referer = server_field('HTTP_REFERER');
$allowed = '#^https://(www\.)?axeltagrou\.fr(/|$)#i';
if (!preg_match($allowed, $origin) && !preg_match($allowed, $referer)) {
    reply(403, array('success' => false));
}

/* ─────────────────────────────────────────────
   3. Honeypot — champ invisible pour les humains
───────────────────────────────────────────── */
if (post_field('website') !== '') {
    reply(200, array('success' => true));   // silence volontaire : le bot croit avoir réussi
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
        $prev = array();
    }

    // Fenêtre glissante : on ne garde que les envois encore dans la fenêtre
    $hits = array();
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

$ip = server_field('REMOTE_ADDR');
if ($ip !== '' && rate_limited($ip)) {
    reply(429, array('success' => false, 'message' => 'rate_limit'));
}

/* ─────────────────────────────────────────────
   5. Expéditeur et en-têtes
───────────────────────────────────────────── */
$name = mb_substr(strip_tags(trim(post_field('name'))), 0, 100);

if (mb_strlen($name) < 2) {
    reply(400, array('success' => false, 'message' => 'invalid_data'));
}

$to       = 'axelalvin20@gmail.com';
$headers  = "From: noreply@axeltagrou.fr\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

/* ─────────────────────────────────────────────
   6. Validation des champs et corps du message
───────────────────────────────────────────── */

$email   = filter_var(trim(post_field('email')), FILTER_VALIDATE_EMAIL);
$subject = mb_substr(strip_tags(trim(post_field('subject'))), 0, 150);
$message = mb_substr(strip_tags(trim(post_field('message'))), 0, 1000);

if (!$email || mb_strlen($subject) < 3 || mb_strlen($message) < 10) {
    reply(400, array('success' => false, 'message' => 'invalid_data'));
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
   7. Envoi
───────────────────────────────────────────── */
if (@mail($to, $subj, $body, $headers)) {
    reply(200, array('success' => true));
}

reply(500, array('success' => false, 'message' => 'send_error'));
