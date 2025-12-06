from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import (
    Sector, Period, Response, StatsPerPeriod,
    TopIssue, TopPositiveComment, VisitCount
)

admin.site.register(Sector)
admin.site.register(Period)
admin.site.register(Response)
admin.site.register(StatsPerPeriod)
admin.site.register(TopIssue)
admin.site.register(TopPositiveComment)
admin.site.register(VisitCount)
