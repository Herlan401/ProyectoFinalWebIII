from django.urls import include, path
from rest_framework import routers

from votacion.apis import ElectorViewSet, PapeletaViewSet, VotoViewSet, CandidatoViewSet, EleccionViewSet, JuradoViewSet

router = routers.DefaultRouter()
router.register('electores', ElectorViewSet,basename='electores')
router.register('papeletas', PapeletaViewSet)
router.register('votos', VotoViewSet)
router.register('candidatos', CandidatoViewSet)
router.register('elecciones', EleccionViewSet)
router.register('jurados', JuradoViewSet)

urlpatterns = [
    path('',include(router.urls)),

]