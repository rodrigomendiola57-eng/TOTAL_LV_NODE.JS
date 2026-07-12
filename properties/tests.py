from io import BytesIO
from pathlib import Path
from tempfile import TemporaryDirectory

from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.http import Http404
from django.test import RequestFactory, SimpleTestCase, override_settings
from PIL import Image

from properties.document_validators import validate_technical_sheet_pdf
from properties.image_processing import (
    build_optimized_filename,
    optimize_image_bytes,
    optimize_uploaded_file,
)
from properties.photo_service import parse_photo_reorder_items
from totalliving_backend.image_uploads import validate_cms_image
from totalliving_backend.media_views import serve_media


def _make_jpeg_bytes(width: int, height: int) -> bytes:
    buffer = BytesIO()
    Image.new("RGB", (width, height), color=(120, 80, 40)).save(
        buffer,
        format="JPEG",
        quality=95,
    )
    return buffer.getvalue()


class ImageProcessingTests(SimpleTestCase):
    def test_build_optimized_filename(self):
        self.assertEqual(
            build_optimized_filename("properties/2026/07/EB-photo.PNG"),
            "EB-photo.jpg",
        )

    def test_optimize_image_bytes_downscales_large_image(self):
        original = _make_jpeg_bytes(3200, 2400)
        optimized = optimize_image_bytes(original, "large.jpg")
        data = optimized.read()

        self.assertLess(len(data), len(original))
        with Image.open(BytesIO(data)) as image:
            self.assertLessEqual(max(image.size), 1920)

    def test_optimize_uploaded_file_keeps_original_on_invalid_data(self):
        uploaded = ContentFile(b"not-an-image", name="broken.jpg")
        result = optimize_uploaded_file(uploaded)

        self.assertEqual(result.read(), b"not-an-image")


class CmsImageValidationTests(SimpleTestCase):
    def test_accepts_jpeg(self):
        data = _make_jpeg_bytes(64, 64)
        uploaded = ContentFile(data, name="ok.jpg")
        uploaded.content_type = "image/jpeg"
        validate_cms_image(uploaded)

    def test_rejects_svg_extension(self):
        svg = b"<svg xmlns='http://www.w3.org/2000/svg'><script></script></svg>"
        uploaded = ContentFile(svg, name="evil.svg")
        uploaded.content_type = "image/svg+xml"
        with self.assertRaises(ValidationError) as ctx:
            validate_cms_image(uploaded)
        self.assertIn("SVG", str(ctx.exception))

    def test_rejects_svg_content_type_with_png_name(self):
        svg = b"<svg xmlns='http://www.w3.org/2000/svg'></svg>"
        uploaded = ContentFile(svg, name="fake.png")
        uploaded.content_type = "image/svg+xml"
        with self.assertRaises(ValidationError):
            validate_cms_image(uploaded)


class TechnicalSheetPdfValidationTests(SimpleTestCase):
    def test_accepts_real_pdf_header(self):
        uploaded = ContentFile(b"%PDF-1.4\n%rest", name="ficha.pdf")
        uploaded.content_type = "application/pdf"
        validate_technical_sheet_pdf(uploaded)

    def test_rejects_non_pdf_bytes_with_pdf_extension(self):
        uploaded = ContentFile(b"MZ\x90\x00not-a-pdf", name="fake.pdf")
        uploaded.content_type = "application/pdf"
        with self.assertRaises(ValidationError) as ctx:
            validate_technical_sheet_pdf(uploaded)
        self.assertIn("%PDF-", str(ctx.exception))

    def test_rejects_wrong_extension(self):
        uploaded = ContentFile(b"%PDF-1.4", name="ficha.exe")
        uploaded.content_type = "application/pdf"
        with self.assertRaises(ValidationError):
            validate_technical_sheet_pdf(uploaded)


class PhotoReorderValidationTests(SimpleTestCase):
    def test_parses_valid_payload(self):
        items, cover = parse_photo_reorder_items(
            [{"id": 1, "order": 0}, {"id": "2", "order": "1"}],
            cover_id=1,
        )
        self.assertEqual(items, [(1, 0), (2, 1)])
        self.assertEqual(cover, 1)

    def test_rejects_non_numeric_order(self):
        with self.assertRaises(ValueError) as ctx:
            parse_photo_reorder_items([{"id": 1, "order": "abc"}], None)
        self.assertIn("enteros", str(ctx.exception))

    def test_rejects_empty_list(self):
        with self.assertRaises(ValueError):
            parse_photo_reorder_items([], None)


class ServeMediaSecurityTests(SimpleTestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def test_rejects_path_traversal(self):
        with TemporaryDirectory() as tmp:
            with override_settings(
                MEDIA_ROOT=tmp,
                DEBUG=True,
                MEDIA_SERVE_FROM_DJANGO=True,
            ):
                request = self.factory.get("/media/../secret.txt")
                with self.assertRaises(Http404):
                    serve_media(request, "../secret.txt")

    def test_rejects_svg(self):
        with TemporaryDirectory() as tmp:
            media = Path(tmp)
            svg_path = media / "icon.svg"
            svg_path.write_text("<svg xmlns='http://www.w3.org/2000/svg'></svg>")
            with override_settings(
                MEDIA_ROOT=tmp,
                DEBUG=True,
                MEDIA_SERVE_FROM_DJANGO=True,
            ):
                request = self.factory.get("/media/icon.svg")
                response = serve_media(request, "icon.svg")
                self.assertEqual(response.status_code, 403)

    def test_serves_regular_file(self):
        with TemporaryDirectory() as tmp:
            media = Path(tmp)
            file_path = media / "ok.txt"
            file_path.write_text("hola")
            with override_settings(
                MEDIA_ROOT=tmp,
                DEBUG=True,
                MEDIA_SERVE_FROM_DJANGO=True,
            ):
                request = self.factory.get("/media/ok.txt")
                response = serve_media(request, "ok.txt")
                self.assertEqual(response.status_code, 200)
                # FileResponse deja el handle abierto; cerrar antes del rmtree (Windows).
                response.close()
