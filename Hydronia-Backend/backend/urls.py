"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from api.views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import WeatherAPIView



urlpatterns = [

    # JWT authentication URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User profile endpoint
    path('api/user/profile/', user_profile_view, name='user-profile'),

    # Test protected endpoint
    path('api/test/', protected_test_view, name='protected-test'),

    # Admin URL
    path('admin/', admin.site.urls),

    # Views
    path('api/sensors/', SensorReadingCreateAPIView.as_view(), name='sensor-create'),
    path('api/sensors/<int:row>/<int:cycle>/', SensorReadingListAPIView.as_view(), name='sensor-list'),
    path('api/images/', PlantImageUploadAPIView.as_view(), name='image-upload'),
    path('api/images/<int:row>/<int:cycle>/', PlantImageListAPIView.as_view(), name='image-list'),
    path('api/logs/', ManualLogCreateAPIView.as_view(), name='manual-log-create'),
    path('api/logs/<int:row>/<int:cycle>/', ManualLogListAPIView.as_view(), name='manual-log-list'),


    path('api/weather/', WeatherAPIView.as_view(), name='weather'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)