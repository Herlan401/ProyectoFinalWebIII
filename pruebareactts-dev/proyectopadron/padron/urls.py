from django.urls import include, path
from rest_framework import routers
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from padron.apis.elector_viewset import ElectorViewSet
from padron.apis.recinto_viewset import RecintoViewSet
from padron.apis.verificacion_viewset import verificar_padron

router = routers.DefaultRouter()
router.register('electores', ElectorViewSet, basename='electores')
router.register('recintos', RecintoViewSet, basename='recintos')

urlpatterns = [
    path('', include(router.urls)),
    path('verificar/<str:ci>/', verificar_padron),

    # 🔐 Endpoints JWT
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
