from django.urls import path
from usuarios.views.auth_view import LoginView, MeView
from usuarios.views.user_view import UsuarioListCreateView, UsuarioRetrieveUpdateDestroyView
from rest_framework_simplejwt.views import TokenRefreshView
from usuarios.views.role_view import RoleListView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('usuarios/', UsuarioListCreateView.as_view(), name='usuarios'),
    path('usuarios/<int:pk>/', UsuarioRetrieveUpdateDestroyView.as_view(), name='usuario-detail'),
    path('roles/', RoleListView.as_view(), name='roles-list'),

]
