from io import BytesIO

from django.core.files.base import ContentFile
from django.test import SimpleTestCase
from PIL import Image

from properties.image_processing import (
    build_optimized_filename,
    optimize_image_bytes,
    optimize_uploaded_file,
)


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

    def test_optimize_image_bytes_preserves_svg(self):
        svg = b"<svg xmlns='http://www.w3.org/2000/svg'></svg>"
        result = optimize_image_bytes(svg, "icon.svg")
        self.assertEqual(result.read(), svg)
