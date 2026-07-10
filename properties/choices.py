"""Opciones compartidas del catálogo de propiedades — Total Living."""

from __future__ import annotations

from django.db import models


class PropertyType(models.TextChoices):
    """Tipología física del inmueble."""

    CASA = "Casa", "Casa"
    DEPARTAMENTO = "Departamento", "Departamento"
    TERRENO = "Terreno", "Terreno"
    CONDOMINIO = "Condominio", "Condominio"
    CASA_EN_CONDOMINIO = "Casa en condominio", "Casa en condominio"
    PENTHOUSE = "Penthouse", "Penthouse"
    LOCAL_COMERCIAL = "Local Comercial", "Local Comercial"
    OFICINA = "Oficina", "Oficina"
    CONSULTORIO = "Consultorio", "Consultorio"
    BODEGA = "Bodega", "Bodega"
    NAVE_INDUSTRIAL = "Nave industrial", "Nave industrial"
    RANCHO = "Rancho", "Rancho"
    OTRO = "Otro", "Otro"


class OperationType(models.TextChoices):
    """Modalidad comercial de la operación."""

    VENTA = "Venta", "Venta"
    RENTA = "Renta", "Renta"
    VENTA_O_RENTA = "Venta o Renta", "Venta o Renta"


class QueretaroZone(models.TextChoices):
    """Zonas operativas del mercado inmobiliario en Querétaro."""

    CAMPANARIO_ALTOZANO = (
        "Zona Campanario / Altozano",
        "Zona Campanario / Altozano",
    )
    CENTRO_TRADICIONAL = (
        "Zona Centro / Querétaro Tradicional",
        "Zona Centro / Querétaro Tradicional",
    )
    CENTRO_SUR = (
        "Zona Centro Sur / Sur de Querétaro",
        "Zona Centro Sur / Sur de Querétaro",
    )
    CIUDAD_DEL_SOL = (
        "Zona Ciudad del Sol / Poniente",
        "Zona Ciudad del Sol / Poniente",
    )
    CORREGIDORA = "Zona Corregidora", "Zona Corregidora"
    EL_REFUGIO = (
        "Zona El Refugio / Norte de El Marqués",
        "Zona El Refugio / Norte de El Marqués",
    )
    JURIQUILLA_JURICA = (
        "Zona Juriquilla / Jurica",
        "Zona Juriquilla / Jurica",
    )
    ZIBATA_ZAKIA = "Zona Zibatá / Zakia", "Zona Zibatá / Zakia"
    OTRA = "Otra / Sin clasificar", "Otra / Sin clasificar"


class AmenityCategory(models.TextChoices):
    """Agrupaciones para el catálogo de amenidades."""

    SEGURIDAD = "Seguridad", "Seguridad"
    DESARROLLO = "Amenidades del desarrollo", "Amenidades del desarrollo"
    INTERIOR = "Interiores", "Interiores"
    EXTERIOR = "Exteriores y áreas verdes", "Exteriores y áreas verdes"
    SERVICIOS = "Servicios", "Servicios"
    UBICACION = "Ubicación y vistas", "Ubicación y vistas"


class MexicanState(models.TextChoices):
    """Estados de la República Mexicana."""

    AGUASCALIENTES = "Aguascalientes", "Aguascalientes"
    BAJA_CALIFORNIA = "Baja California", "Baja California"
    BAJA_CALIFORNIA_SUR = "Baja California Sur", "Baja California Sur"
    CAMPECHE = "Campeche", "Campeche"
    CHIAPAS = "Chiapas", "Chiapas"
    CHIHUAHUA = "Chihuahua", "Chihuahua"
    CIUDAD_DE_MEXICO = "Ciudad de México", "Ciudad de México"
    COAHUILA = "Coahuila", "Coahuila"
    COLIMA = "Colima", "Colima"
    DURANGO = "Durango", "Durango"
    ESTADO_DE_MEXICO = "Estado de México", "Estado de México"
    GUANAJUATO = "Guanajuato", "Guanajuato"
    GUERRERO = "Guerrero", "Guerrero"
    HIDALGO = "Hidalgo", "Hidalgo"
    JALISCO = "Jalisco", "Jalisco"
    MICHOACAN = "Michoacán", "Michoacán"
    MORELOS = "Morelos", "Morelos"
    NAYARIT = "Nayarit", "Nayarit"
    NUEVO_LEON = "Nuevo León", "Nuevo León"
    OAXACA = "Oaxaca", "Oaxaca"
    PUEBLA = "Puebla", "Puebla"
    QUERETARO = "Querétaro", "Querétaro"
    QUINTANA_ROO = "Quintana Roo", "Quintana Roo"
    SAN_LUIS_POTOSI = "San Luis Potosí", "San Luis Potosí"
    SINALOA = "Sinaloa", "Sinaloa"
    SONORA = "Sonora", "Sonora"
    TABASCO = "Tabasco", "Tabasco"
    TAMAULIPAS = "Tamaulipas", "Tamaulipas"
    TLAXCALA = "Tlaxcala", "Tlaxcala"
    VERACRUZ = "Veracruz", "Veracruz"
    YUCATAN = "Yucatán", "Yucatán"
    ZACATECAS = "Zacatecas", "Zacatecas"
