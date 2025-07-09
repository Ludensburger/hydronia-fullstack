from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = [
        ('FARMER', 'Farmer'),
        ('DEV', 'Developer'),
    ]
    
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='FARMER',
        help_text="User role: FARMER or DEV"
    )
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    @property
    def is_farmer(self):
        return self.role == 'FARMER'
    
    @property
    def is_dev(self):
        return self.role == 'DEV'

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