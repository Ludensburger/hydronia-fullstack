from .models import *
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    is_farmer = serializers.SerializerMethodField()
    is_dev = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'is_farmer', 'is_dev']
        read_only_fields = ['id', 'is_farmer', 'is_dev', 'role']
    
    def get_role(self, obj):
        try:
            return obj.profile.role
        except UserProfile.DoesNotExist:
            return 'FARMER'
    
    def get_is_farmer(self, obj):
        return obj.is_farmer
    
    def get_is_dev(self, obj):
        return obj.is_dev

class SensorReadingSerializer(serializers.ModelSerializer):
    in_range = serializers.SerializerMethodField()
    warning = serializers.SerializerMethodField()

    class Meta:
        model = SensorReading
        fields = "__all__"
        extra_fields = ['in_range', 'warning']

    def get_in_range(self, obj): # Subject to change as per Sir Popoy's recommendations
        return (
            5.5 <= obj.ph <= 6.5 and
            1.5 <= obj.ec <= 2.5 and
            20 <= obj.temperature <= 28 and
            40 <= obj.humidity <= 70 and
            0 <= obj.tph <= 0.03
        )

    def get_warning(self, obj):
        warnings = []
        if not (5.5 <= obj.ph <= 6.5):
            warnings.append("pH out of range (5.5-6.5)")
        if not (1.5 <= obj.ec <= 2.5):
            warnings.append("EC out of range (1.5-2.5)")
        if not (20 <= obj.temperature <= 28):
            warnings.append("Temp out of range (20-28°C)")
        if not (40 <= obj.humidity <= 70):
            warnings.append("Humidity out of range (40-70%)")
        if not (0 <= obj.tph <= 0.03):
            warnings.append("TPH out of range (≤ 0.03)")
        return "; ".join(warnings) if warnings else "OK"

class PlantImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlantImage
        fields = "__all__"

class ManualLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ManualLog
        fields = '__all__'