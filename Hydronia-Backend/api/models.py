from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# User Profile to extend the built-in User model
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('FARMER', 'Farmer'),
        ('DEV', 'Developer'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='FARMER',
        help_text="User role: FARMER or DEV"
    )
    
    def __str__(self):
        return f"{self.user.username} ({self.get_role_display()})"
    
    @property
    def is_farmer(self):
        return self.role == 'FARMER'
    
    @property
    def is_dev(self):
        return self.role == 'DEV'

# Add convenience methods to User model
def user_is_farmer(self):
    try:
        return self.profile.is_farmer
    except UserProfile.DoesNotExist:
        return True  # Default to farmer if no profile

def user_is_dev(self):
    try:
        return self.profile.is_dev
    except UserProfile.DoesNotExist:
        return False

User.add_to_class('is_farmer', property(user_is_farmer))
User.add_to_class('is_dev', property(user_is_dev))

CYCLE_CHOICES = [
    (0, 'Germination'),
    (1, 'Seedling'),
    (2, 'Vegetative'),
    (3, 'Maturing'),
    (4, 'Harvest-ready'),
]

class SensorReading(models.Model):
    row = models.IntegerField()
    cycle = models.IntegerField(choices=CYCLE_CHOICES)
    timestamp = models.DateTimeField()
    ph = models.FloatField()
    ec = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    tph = models.FloatField()

def upload_to(instance, filename):
    return f"plant_images/row{instance.row}_cycle{instance.cycle}/{datetime.now().date()}/{filename}"

class PlantImage(models.Model):
    row = models.IntegerField()
    cycle = models.IntegerField(choices=CYCLE_CHOICES)
    timestamp = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to=upload_to)

class ManualLog(models.Model):
    row = models.IntegerField()
    cycle = models.IntegerField()
    timestamp = models.DateTimeField(auto_now_add=True)
    note = models.TextField()
    image = models.ImageField(upload_to="manual_logs/", blank=True, null=True)
    tag = models.CharField(max_length=50, blank=True)  # Optional classifier (e.g., "fungus", "observation")

    def __str__(self):
        return f"Log for Row {self.row}, Cycle {self.cycle} @ {self.timestamp}"