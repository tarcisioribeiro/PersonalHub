from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django_filters import rest_framework as filters
from expenses.models import Expense
from expenses.serializers import ExpenseSerializer
from expenses.filters import ExpenseFilter
from app.permissions import GlobalDefaultPermission


class ExpenseCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar despesas.

    Permite:
    - GET: Lista todas as despesas ordenadas por data decrescente
    - POST: Cria uma nova despesa

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de todas as despesas (exclui deletadas) com relação account pré-carregada
    serializer_class : class
        Serializer usado para validação e serialização
    filter_backends : list
        Backends de filtro (DjangoFilterBackend)
    filterset_class : class
        Classe de filtros personalizada para despesas
    ordering : list
        Ordenação padrão por data e ID decrescente
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Expense.objects.filter(is_deleted=False).select_related('account')
    serializer_class = ExpenseSerializer
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = ExpenseFilter
    ordering = ['-date', '-id']  # Consistent ordering for pagination


class ExpenseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    ViewSet para operações individuais em despesas.

    Permite:
    - GET: Recupera uma despesa específica
    - PUT/PATCH: Atualiza uma despesa existente
    - DELETE: Remove uma despesa

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de todas as despesas (exclui deletadas) com relação account pré-carregada
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Expense.objects.filter(is_deleted=False).select_related('account')
    serializer_class = ExpenseSerializer
