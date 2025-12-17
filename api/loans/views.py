from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from loans.models import Loan
from loans.serializers import LoanSerializer
from app.permissions import GlobalDefaultPermission


class LoanCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar empréstimos.

    Permite:
    - GET: Lista todos os empréstimos (exclui deletados)
    - POST: Cria um novo empréstimo

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de empréstimos não deletados
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Loan.objects.filter(is_deleted=False)
    serializer_class = LoanSerializer


class LoanRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    ViewSet para operações individuais em empréstimos.

    Permite:
    - GET: Recupera um empréstimo específico (exclui deletados)
    - PUT/PATCH: Atualiza um empréstimo existente
    - DELETE: Remove um empréstimo (soft delete)

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de empréstimos não deletados
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Loan.objects.filter(is_deleted=False)
    serializer_class = LoanSerializer
