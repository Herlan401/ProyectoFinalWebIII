from django.urls import path
from usuarios.views.auth_view import LoginView
from usuarios.views.user_view import UsuarioListCreateView, UsuarioRetrieveUpdateDestroyView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuarios'),
    path('usuarios/<int:pk>/', UsuarioRetrieveUpdateDestroyView.as_view(), name='usuario-detail'),
]
