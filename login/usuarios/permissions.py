from rest_framework import permissions

class HasRole(permissions.BasePermission):
    required_roles = []

    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated or not hasattr(user, 'profile'):
            return False
        return user.profile.role.name in self.required_roles

class IsSuperAdmin(HasRole):
    required_roles = ['super_admin']