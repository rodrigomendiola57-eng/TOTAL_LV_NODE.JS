from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from developments.models import Development


class DevelopmentStatsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        Development.objects.create(
            slug="torre-a",
            name="Torre A",
            is_published=True,
        )
        Development.objects.create(
            slug="torre-b",
            name="Torre B",
            is_published=False,
        )

    def test_stats_returns_total_count(self):
        response = self.client.get("/api/developments/stats/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 2)
