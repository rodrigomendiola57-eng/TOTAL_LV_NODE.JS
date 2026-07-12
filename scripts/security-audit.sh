#!/usr/bin/env bash
# Audita npm + pip (Fase 3). Ejecutar desde la raíz del repo.
set -euo pipefail
echo "== npm audit =="
npm audit --omit=dev
echo ""
echo "== pip-audit =="
if [[ -x "./venv/bin/python" ]]; then
  ./venv/bin/python -m pip install -q pip-audit
  ./venv/bin/python -m pip_audit -r requirements.txt
else
  echo "No hay venv/. Crea el entorno e instala requirements.txt"
  exit 1
fi
