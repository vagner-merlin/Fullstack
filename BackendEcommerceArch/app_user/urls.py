from django.urls import path , include
from .api  import (
    UserViewSet, GroupViewSet, PermissionViewSet, 
    login_view, logout_view, register_view, 
    add_user_to_group, remove_user_from_group,
    create_employee, list_employees, delete_employee, toggle_employee_active
)
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
    # Nuevas rutas para empleados
    path('employees/', list_employees, name='list_employees'),
    path('employees/create/', create_employee, name='create_employee'),
    path('employees/<int:user_id>/delete/', delete_employee, name='delete_employee'),
    path('employees/<int:user_id>/toggle-active/', toggle_employee_active, name='toggle_employee_active'),
]