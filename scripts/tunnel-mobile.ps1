# Ver Total Living en el celular - diagnostico rapido
# Uso: .\scripts\tunnel-mobile.ps1

$ErrorActionPreference = "SilentlyContinue"

function Get-PageTitle([string]$Url) {
    try {
        $r = Invoke-WebRequest -Uri $Url -TimeoutSec 10 -UseBasicParsing -Headers @{ "ngrok-skip-browser-warning" = "69420" }
        if ($r.Content -match '<title>([^<]+)</title>') { return $Matches[1].Trim() }
        return "(sin title)"
    } catch {
        return "ERROR: $($_.Exception.Message)"
    }
}

$localIp = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {
    $_.IPAddress -notlike "127.*" -and $_.PrefixOrigin -ne "WellKnown"
} | Select-Object -First 1).IPAddress

if (-not $localIp) { $localIp = "TU_IP_LOCAL" }

Write-Host ""
Write-Host "=== Total Living - vista movil ===" -ForegroundColor Cyan
Write-Host ""

$title3000 = Get-PageTitle "http://localhost:3000"
Write-Host "localhost:3000 -> $title3000"

if ($title3000 -notmatch "Total Living") {
    Write-Host "AVISO: el puerto 3000 no sirve Total Living. Ejecuta: npm run dev" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "--- Opcion A: WiFi (recomendada si ngrok muestra Mendifly) ---" -ForegroundColor Green
Write-Host "1. Celular y PC en la misma red WiFi"
Write-Host "2. Terminal Django:  .\venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000"
Write-Host "3. Terminal Next:    npm run dev:tunnel"
Write-Host "4. En .env agrega tu IP a ALLOWED_HOSTS, ej.:"
Write-Host "   ALLOWED_HOSTS=localhost,127.0.0.1,192.168.10.124"
Write-Host "5. En .env.local:"
Write-Host "   NEXT_PUBLIC_API_URL=http://${localIp}:8000/api"
Write-Host "6. Abre en el celular: http://${localIp}:3000"
Write-Host ""

Write-Host "--- Opcion B: ngrok ---" -ForegroundColor Green
$ngrokTitle = Get-PageTitle "https://confabulatory-cecil-grummer.ngrok-free.dev"
Write-Host "URL guardada -> $ngrokTitle"

if ($ngrokTitle -match "Mendifly") {
    Write-Host ""
    Write-Host "PROBLEMA: esa URL es de Mendifly, no de Total Living." -ForegroundColor Red
    Write-Host "Tu dominio ngrok gratuito esta ocupado por otro proyecto."
    Write-Host ""
    Write-Host "Solucion:"
    Write-Host "  1. Cierra ngrok en el proyecto Mendifly (otra PC o terminal)"
    Write-Host "  2. O entra a dashboard.ngrok.com/endpoints y deten el endpoint activo"
    Write-Host "  3. Luego en este proyecto: ngrok http 3000"
    Write-Host "  4. Verifica que el titulo diga Total Living, no Mendifly"
} elseif ($ngrokTitle -match "Total Living") {
    Write-Host "OK: ngrok apunta a Total Living." -ForegroundColor Green
    Write-Host "Abre la URL ngrok en el celular y pulsa Visit Site"
}

Write-Host ""
