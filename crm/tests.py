"""Tests de seguridad / robustez del CRM (PR 3)."""

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from crm.models import Lead

User = get_user_model()


class LeadHoneypotTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_honeypot_website_returns_201_without_persisting(self):
        before = Lead.objects.count()
        response = self.client.post(
            "/api/leads/",
            {
                "name": "Bot Spam",
                "email": "bot@example.com",
                "phone": "5551234567",
                "website": "https://spam.example",
                "initial_message": "buy now",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data.get("id"), 0)
        self.assertEqual(Lead.objects.count(), before)


class LeadPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.lead = Lead.objects.create(
            name="Prospecto",
            email="lead@example.com",
            phone="5550001111",
        )

    def test_anon_cannot_list_leads(self):
        response = self.client.get("/api/leads/")
        # Anónimo → 401 (sin credenciales); no staff autenticado → 403.
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )

    def test_staff_can_list_leads(self):
        user = User.objects.create_user(
            username="staff1",
            password="test-pass-123",
            is_staff=True,
        )
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/leads/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_staff_can_get_lead_stats(self):
        Lead.objects.create(
            name="Cerrado",
            email="c@example.com",
            phone="5550002222",
            status="Cerrado",
        )
        user = User.objects.create_user(
            username="staff-stats",
            password="test-pass-123",
            is_staff=True,
        )
        self.client.force_authenticate(user=user)
        response = self.client.get("/api/leads/stats/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["total"], 2)
        self.assertEqual(response.data["active"], 1)

    def test_anon_cannot_get_lead_stats(self):
        response = self.client.get("/api/leads/stats/")
        self.assertIn(
            response.status_code,
            (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN),
        )


class LeadUnreadCountTests(TestCase):
    def test_touch_from_message_increments_with_f_expression(self):
        lead = Lead.objects.create(
            name="Unread",
            email="u@example.com",
            phone="5559998888",
            unread_count=2,
        )
        lead.touch_from_message("hola", inbound=True)
        lead.refresh_from_db()
        self.assertEqual(lead.unread_count, 3)
        self.assertEqual(lead.last_message_preview, "hola")
