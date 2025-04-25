# #use
# from rest_framework.permissions import BasePermission

# class CanRegisterUsers(BasePermission):
#     def has_permission(self, request, view):
#         if not request.user.is_authenticated:
#             return False
            
#         if request.user.role == 'SYSTEM_ADMIN':
#             return True
            
#         if request.user.role == 'MFI_ADMIN':
#             # MFI Admins can create borrowers and loan officers
#             requested_role = request.data.get('role', 'BORROWER')
#             return requested_role in ['BORROWER', 'LOAN_OFFICER']
            
#         if request.user.role == 'LOAN_OFFICER':
#             # Loan Officers can only create borrowers
#             return request.data.get('role', 'BORROWER') == 'BORROWER'
            
#         return False


from rest_framework.permissions import BasePermission, IsAuthenticated

class AllowAny(BasePermission):
    """
    Allow unrestricted access to all endpoints
    """
    def has_permission(self, request, view):
        return True

class IsAuthenticatedOrReadOnly(IsAuthenticated):
    """
    Allow read-only access to unauthenticated users,
    but require authentication for write operations
    """
    def has_permission(self, request, view):
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        return super().has_permission(request, view)

class BasicAuthPermission(IsAuthenticated):
    """
    Simple authenticated-only access (no role checks)
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated