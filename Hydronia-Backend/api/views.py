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

# POST /sensors/
class SensorReadingCreateAPIView(generics.CreateAPIView):
    queryset = SensorReading.objects.all()
    serializer_class = SensorReadingSerializer

# GET /sensors/<int:row>/<int:cycle>/
class SensorReadingListAPIView(generics.ListAPIView):
    serializer_class = SensorReadingSerializer

    def get_queryset(self):
        row = self.kwargs['row']
        cycle = self.kwargs['cycle']
        return SensorReading.objects.filter(row=row, cycle=cycle).order_by('-timestamp')

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
