from .models import *
from rest_framework import serializers

class SensorReadingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorReading
        fields = "__all__"

class PlantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantImage
        fields = "__all__"