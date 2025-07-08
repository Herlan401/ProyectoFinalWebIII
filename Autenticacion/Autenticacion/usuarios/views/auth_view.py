from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework import serializers

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        profile = getattr(user, 'profile', None)
        if profile and profile.role:
            data['usuario'] = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "rol": profile.role.name
            }
        else:
            raise serializers.ValidationError("Este usuario no tiene un rol asignado.")
        return data

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
