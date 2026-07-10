"""Validación de documentos PDF para fichas técnicas de propiedades."""

from __future__ import annotations

import os

from django.core.exceptions import ValidationError

ALLOWED_PDF_EXTENSIONS = {".pdf"}
MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB


def validate_technical_sheet_pdf(uploaded_file) -> None:
    """Valida extensión y tamaño de un PDF de ficha técnica."""
    if uploaded_file.size > MAX_PDF_SIZE_BYTES:
        raise ValidationError(
            f"El PDF supera el tamaño máximo de {MAX_PDF_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    extension = os.path.splitext(uploaded_file.name)[1].lower()
    if extension not in ALLOWED_PDF_EXTENSIONS:
        raise ValidationError("Solo se permiten archivos PDF para la ficha técnica.")

    content_type = getattr(uploaded_file, "content_type", "") or ""
    if content_type and content_type not in {"application/pdf", "application/x-pdf"}:
        raise ValidationError("El archivo debe ser un documento PDF válido.")
