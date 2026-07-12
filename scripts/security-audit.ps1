# Audita npm + pip (Fase 3). Ejecutar desde la raíz del repo.
$ErrorActionPreference = "Continue"
Write-Host "== npm audit ==" -ForegroundColor Cyan
npm.cmd audit --omit=dev
Write-Host ""
Write-Host "== pip-audit ==" -ForegroundColor Cyan
if (Test-Path ".\venv\Scripts\python.exe") {
  & ".\venv\Scripts\python.exe" -m pip install -q pip-audit
  & ".\venv\Scripts\python.exe" -m pip_audit -r requirements.txt
} else {
  Write-Host "No hay venv\. Ejecuta: python -m venv venv && .\venv\Scripts\pip install -r requirements.txt"
  exit 1
}
