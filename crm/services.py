"""Servicios del CRM web."""

from __future__ import annotations

from .models import DeliveryStatus, Lead, LeadMessage, MessageDirection


def create_agent_note(lead: Lead, content: str) -> LeadMessage:
    message = LeadMessage.objects.create(
        lead=lead,
        direction=MessageDirection.OUTBOUND,
        content=content,
        channel=lead.channel,
        delivery_status=DeliveryStatus.SENT,
        metadata={"note": "internal_agent_note"},
    )
    lead.touch_from_message(content, inbound=False)
    return message
