from django.db import models

class SensorReading(models.Model):
    row = models.IntegerField()
    cycle = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    ph = models.FloatField()
    ec = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    tph = models.FloatField()

class PlantImage(models.Model):
    row = models.IntegerField()
    cycle = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to="pictures/")