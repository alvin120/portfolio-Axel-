<?php
header('Content-Type: application/json; charset=UTF-8');

// Accepter uniquement les POST depuis le propre domaine
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false]);
    exit;
}

$origin   = $_SERVER['HTTP_ORIGIN']   ?? '';
$referer  = $_SERVER['HTTP_REFERER']  ?? '';
$allowed  = '#^https://(www\.)?axeltagrou\.fr#i';
if (!preg_match($allowed, $origin) && !preg_match($allowed, $referer)) {
    http_response_code(403);
    echo json_encode(['success' => false]);
    exit;
}

// Honeypot : si rempli → bot
if (!empty($_POST['website'])) {
    echo json_encode(['success' => true]); // silence volontaire
    exit;
}

// Rate limiting : 1 envoi par IP toutes les 5 minutes (stocké en session)
session_start();
$now = time();
if (isset($_SESSION['last_sent']) && ($now - $_SESSION['last_sent']) < 300) {
    http_response_code(429);
    echo json_encode(['success' => false, 'message' => 'rate_limit']);
    exit;
}

// Lecture et nettoyage des champs
$name    = strip_tags(trim($_POST['name']    ?? ''));
$email   = filter_var(trim($_POST['email']   ?? ''), FILTER_VALIDATE_EMAIL);
$subject = strip_tags(trim($_POST['subject'] ?? ''));
$message = strip_tags(trim($_POST['message'] ?? ''));

// Validation
if (mb_strlen($name) < 2 || !$email || mb_strlen($subject) < 3 || mb_strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'invalid_data']);
    exit;
}

// Troncature anti-abus
$name    = mb_substr($name,    0, 100);
$subject = mb_substr($subject, 0, 150);
$message = mb_substr($message, 0, 1000);

// Corps de l'e-mail
$body  = "Nouveau message depuis axeltagrou.fr\n";
$body .= str_repeat('-', 40) . "\n";
$body .= "Nom     : {$name}\n";
$body .= "Email   : {$email}\n";
$body .= "Sujet   : {$subject}\n\n";
$body .= "Message :\n{$message}\n";
$body .= str_repeat('-', 40) . "\n";
$body .= "Répondre directement à : {$email}\n";

$to      = 'axelalvin20@gmail.com';
$subj    = mb_encode_mimeheader("[Portfolio] {$subject}", 'UTF-8', 'B');
$headers  = "From: noreply@axeltagrou.fr\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "Content-Transfer-Encoding: 8bit\r\n";

$sent = mail($to, $subj, $body, $headers);

if ($sent) {
    $_SESSION['last_sent'] = $now;
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'send_error']);
}
