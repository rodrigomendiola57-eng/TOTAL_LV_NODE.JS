"""Validación de documentos PDF para fichas técnicas de propiedades."""

from __future__ import annotations

import os

from django.core.exceptions import ValidationError

ALLOWED_PDF_EXTENSIONS = {".pdf"}
MAX_PDF_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
PDF_MAGIC = b"%PDF-"


def validate_technical_sheet_pdf(uploaded_file) -> None:
    """Valida extensión, content-type, tamaño y magic bytes %PDF-."""
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

    position = uploaded_file.tell() if hasattr(uploaded_file, "tell") else 0
    try:
        header = uploaded_file.read(8) or b""
    finally:
        if hasattr(uploaded_file, "seek"):
            uploaded_file.seek(position)

    if not header.startswith(PDF_MAGIC):
        raise ValidationError(
            "El archivo no es un PDF válido (falta cabecera %PDF-).",
        )
