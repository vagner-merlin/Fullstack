from django.urls import path , include
from .api  import UserViewSet , GroupViewSet , PermissionViewSet, login_view, logout_view, register_view, add_user_to_group, remove_user_from_group
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserViewSet, basename='user')
router.register('groups', GroupViewSet, basename='group')
router.register('permissions', PermissionViewSet, basename='permission')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
    path('add-user-to-group/', add_user_to_group, name='add_user_to_group'),
    path('remove-user-from-group/', remove_user_from_group, name='remove_user_from_group'),
]