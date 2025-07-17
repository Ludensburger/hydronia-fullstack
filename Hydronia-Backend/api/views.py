from django.shortcuts import render
from .models import *
from .serializers import *
from rest_framework import generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Test endpoint for JWT authentication
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def protected_test_view(request):
    return Response({
        'message': 'Hello, authenticated user!',
        'user': request.user.username,
        'user_id': request.user.id
    })

# User profile endpoint with role information
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile_view(request):
    serializer = UserSerializer(request.user)
    return Response({
        'user': serializer.data,
        'permissions': {
            'can_access_farmer_view': True,  # All users can access farmer view
            'can_access_dev_view': request.user.is_dev,  # Only devs can access dev view
            'needs_role_selection': request.user.is_dev  # Only devs see role selection
        }
    })

# POST /sensors/
class SensorReadingCreateAPIView(generics.CreateAPIView):
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer

# GET /sensors/<int:row>/<int:cycle>/
class SensorReadingListAPIView(generics.ListAPIView):
    serializer_class = SensorReadingSerializer

    def get_queryset(self): # Currently set at recent 10 readings
        row = self.kwargs['row']
        cycle = self.kwargs['cycle']
        return SensorReading.objects.filter(row=row, cycle=cycle).order_by('-timestamp')[:10]

# POST /images/
class PlantImageUploadAPIView(generics.CreateAPIView):
    queryset = PlantImage.objects.all()
    serializer_class = PlantImageSerializer
    parser_classes = (MultiPartParser, FormParser)

# GET /images/<int:row>/<int:cycle>/
class PlantImageListAPIView(generics.ListAPIView):
    serializer_class = PlantImageSerializer

    def get_queryset(self):
        row = self.kwargs['row']
        cycle = self.kwargs['cycle']
        return PlantImage.objects.filter(row=row, cycle=cycle).order_by('-timestamp')

# POST /logs/
class ManualLogCreateAPIView(generics.CreateAPIView):
    queryset = ManualLog.objects.all()
    serializer_class = ManualLogSerializer
    parser_classes = (MultiPartParser, FormParser)

# GET /logs/<int:row>/<int:cycle/
class ManualLogListAPIView(generics.ListAPIView):
    serializer_class = ManualLogSerializer

    def get_queryset(self):
        row = self.kwargs['row']
        cycle = self.kwargs['cycle']
        return ManualLog.objects.filter(row=row, cycle=cycle).order_by('-timestamp')
    
from rest_framework.views import APIView
import requests
from environments import environment  # If you use an environments module
    
class WeatherAPIView(APIView):
    def get(self, request):
        city = request.query_params.get("city", "Cebu")
        url = "https://api.openweathermap.org/data/2.5/weather"
        params = {
            "q": city,
            "appid": environment.OPENWEATHER_API_KEY,  # or your API key directly
            "units": "metric"
        }
        try:
            response = requests.get(url, params=params)
            data = response.json()
            return Response(data)
        except Exception as e:
            return Response({"error": str(e)}, status=500)