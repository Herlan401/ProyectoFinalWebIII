from rest_framework import serializers
from django.contrib.auth.models import User
from usuarios.models.rol import Role
from usuarios.models.perfil import PerfilUsuario

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField(read_only=True)

    role_id = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        write_only=True
    )

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'role', 'role_id', 'password'
        ]
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def get_role(self, obj):
        if hasattr(obj, 'profile') and obj.profile.role:
            return RoleSerializer(obj.profile.role).data
        return None

    def create(self, validated_data):
        # Obtenemos el rol desde role_id directamente
        role = validated_data.pop('role_id')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()

        PerfilUsuario.objects.create(usuario=user, role=role)
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop('role_id', None)
        password = validated_data.pop('password', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()

        if role:
            perfil, _ = PerfilUsuario.objects.get_or_create(usuario=instance)
            perfil.role = role
            perfil.save()

        return instance
