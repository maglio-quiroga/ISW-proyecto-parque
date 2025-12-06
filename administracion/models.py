from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Sector(models.Model):
    """
    Tabla de sectores del parque (Zona 1..N).
    """
    code = models.CharField(max_length=20, unique=True)  # e.g. "zona_1"
    name = models.CharField(max_length=120)               # e.g. "Zona 1: Acceso / Mandíbula"
    description = models.TextField(blank=True, null=True)

    class Meta:
        verbose_name = "Sector"
        verbose_name_plural = "Sectores"

    def __str__(self):
        return f"{self.code} - {self.name}"


class Period(models.Model):
    """
    Periodo para estadísticas (ej: año + mes).
    Usar year + month para poder agrupar fácilmente por mes/año.
    """
    year = models.PositiveSmallIntegerField()
    month = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(12)])

    class Meta:
        unique_together = ('year', 'month')
        ordering = ['-year', '-month']
        verbose_name = "Periodo"
        verbose_name_plural = "Periodos"

    def __str__(self):
        return f"{self.year}-{self.month:02d}"


class VisitCount(models.Model):
    """
    Número de visitas en el parque por periodo.
    Esto permite calcular tasa de participación: responses / visits.
    """
    period = models.ForeignKey(Period, on_delete=models.CASCADE, related_name="visit_counts")
    visits = models.PositiveIntegerField(default=0, help_text="Número de visitas en el periodo (ej. total mensual)")

    class Meta:
        unique_together = ('period',)
        verbose_name = "Conteo de visitas"
        verbose_name_plural = "Conteos de visitas"

    def __str__(self):
        return f"{self.period}: {self.visits}"


class Response(models.Model):
    """
    Respuesta completa del formulario 'extenso'.
    No incluimos datos personales identificables (nombre, email, ip) para cumplir privacidad;
    si se necesita algún identificador, usar hash pseudónimo y consent boolean.
    """
    # Relaciones
    sector = models.ForeignKey(Sector, on_delete=models.SET_NULL, null=True, blank=True, related_name="responses")
    period = models.ForeignKey(Period, on_delete=models.SET_NULL, null=True, blank=True, related_name="responses")

    # Datos demográficos del formulario
    nationality = models.CharField(max_length=60, blank=True, null=True)   # 'Chile', 'Europa', ...
    age_group = models.CharField(max_length=20, blank=True, null=True)     # '-18', '18-30', '31-50', ...
    motive = models.CharField(max_length=40, blank=True, null=True)        # 'turismo', 'educacion', ...

    # Ratings (1-5)
    rate_sendero = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],
                                                   null=True, blank=True)
    rate_info = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],
                                                 null=True, blank=True)
    rate_limpieza = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],
                                                     null=True, blank=True)
    rate_personal = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)],
                                                     null=True, blank=True)

    # Comentarios y NPS
    comentario_positivo = models.TextField(blank=True, null=True)
    comentario_negativo = models.TextField(blank=True, null=True)
    nps = models.PositiveSmallIntegerField(validators=[MinValueValidator(0), MaxValueValidator(10)], null=True, blank=True)
    comentario_general = models.TextField(blank=True, null=True)

    # Metadata y privacidad
    anonymous = models.BooleanField(default=True, help_text="Si True, no se almacena información identificable")
    consent_given = models.BooleanField(default=False, help_text="Consentimiento explícito para usar datos")
    language = models.CharField(max_length=10, blank=True, null=True)  # 'es', 'en', ...
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Campos para procesamiento/etiquetado (filled later by procesos batch/LLM)
    sentiment = models.CharField(max_length=20, blank=True, null=True)  # 'positive'|'neutral'|'negative'
    topics = models.JSONField(blank=True, null=True, help_text="Array de tópicos extraídos o tokens relevantes")
    score_text = models.FloatField(null=True, blank=True, help_text="score de positividad/algún algoritmo")

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['period']),
            models.Index(fields=['sector']),
        ]
        verbose_name = "Respuesta"
        verbose_name_plural = "Respuestas"

    def __str__(self):
        return f"Resp {self.id} - {self.created_at.date()}"


class TopPositiveComment(models.Model):
    """
    Tabla que guarda los top comentarios positivos (resultado del proceso de agregación/ML).
    Normalmente se llenará por un job que analiza todas las respuestas y selecciona top N.
    """
    response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name="top_positive_entry")
    rank = models.PositiveSmallIntegerField(help_text="1 = top", default=1)
    score = models.FloatField(null=True, blank=True, help_text="Score de relevancia/positividad")
    period = models.ForeignKey(Period, on_delete=models.SET_NULL, null=True, blank=True, related_name="top_positive_comments")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('response', 'rank')
        ordering = ['rank']
        verbose_name = "Comentario positivo destacado"
        verbose_name_plural = "Comentarios positivos destacados"

    def __str__(self):
        return f"Top+ #{self.rank} - Resp {self.response_id}"


class TopIssue(models.Model):
    """
    Tabla que guarda los top problemas/temas negativos.
    """
    response = models.ForeignKey(Response, on_delete=models.CASCADE, related_name="top_issue_entry")
    rank = models.PositiveSmallIntegerField(help_text="1 = top problema", default=1)
    frequency = models.PositiveIntegerField(null=True, blank=True, help_text="veces reportado (por cálculo)")
    period = models.ForeignKey(Period, on_delete=models.SET_NULL, null=True, blank=True, related_name="top_issues")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('response', 'rank')
        ordering = ['rank']
        verbose_name = "Problema destacado"
        verbose_name_plural = "Problemas destacados"

    def __str__(self):
        return f"Top- #{self.rank} - Resp {self.response_id}"


class StatsPerPeriod(models.Model):
    """
    Estadísticas agregadas por periodo (calcular con jobs).
    Guardar aquí métricas clave para desplegar en dashboard sin recalcular todo en cada request.
    """
    period = models.OneToOneField(Period, on_delete=models.CASCADE, related_name="stats")
    total_visits = models.PositiveIntegerField(default=0)
    total_responses = models.PositiveIntegerField(default=0)
    participation_rate = models.FloatField(null=True, blank=True, help_text="responses / visits")
    positive_count = models.PositiveIntegerField(default=0)
    neutral_count = models.PositiveIntegerField(default=0)
    negative_count = models.PositiveIntegerField(default=0)
    avg_nps = models.FloatField(null=True, blank=True)
    sentiment_index = models.FloatField(null=True, blank=True, help_text="p.ej. (pos-neg)/total o %pos")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Estadísticas por periodo"
        verbose_name_plural = "Estadísticas por periodos"

    def __str__(self):
        return f"Stats {self.period}"
