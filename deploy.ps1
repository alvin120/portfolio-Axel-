# Deploy to OVH via FTP
# Usage: .\deploy.ps1

# Load credentials from .env
Get-Content .env | ForEach-Object {
    if ($_ -match "^([^#][^=]+)=(.+)$") {
        Set-Item "Env:$($Matches[1].Trim())" $Matches[2].Trim()
    }
}

$server  = $env:FTP_SERVER
$user    = $env:FTP_USER
$pass    = $env:FTP_PASS
$remote  = $env:FTP_REMOTE

# Files and folders to deploy
$extensions = @("*.html", "*.css", "*.js", "*.xml", "*.txt", "*.json", "*.jpg", "*.png", "*.gif", "*.svg", "*.ico", "*.webp", "*.htaccess")
$exclude    = @(".git", ".github", ".vercel", ".env", "deploy.ps1", "node_modules", "*.py", "*.bat", "README.md")

Write-Host "Deploying to $server$remote ..." -ForegroundColor Cyan

$errors = 0
$count  = 0

function Upload-File($localPath, $remotePath) {
    $url = "ftp://$server$remotePath"
    $result = curl.exe --silent --show-error `
        -u "${user}:${pass}" `
        --ftp-create-dirs `
        -T $localPath `
        $url 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  FAIL: $localPath -> $result" -ForegroundColor Red
        return $false
    }
    return $true
}

Get-ChildItem -Recurse -File | Where-Object {
    $rel = $_.FullName.Replace((Get-Location).Path + "\", "")
    $skip = $false
    foreach ($ex in $exclude) {
        if ($rel -like "$ex*" -or $rel -like "*\$ex*") { $skip = $true; break }
    }
    !$skip
} | ForEach-Object {
    $rel        = $_.FullName.Replace((Get-Location).Path + "\", "").Replace("\", "/")
    $remoteFull = $remote + $rel
    Write-Host "  $rel" -ForegroundColor Gray
    if (Upload-File $_.FullName $remoteFull) { $count++ } else { $errors++ }
}

Write-Host ""
if ($errors -eq 0) {
    Write-Host "Done! $count files uploaded successfully." -ForegroundColor Green
} else {
    Write-Host "$count files uploaded, $errors errors." -ForegroundColor Yellow
}
