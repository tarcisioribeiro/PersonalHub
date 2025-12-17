from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from revenues.models import Revenue
from revenues.serializers import RevenueSerializer
from app.permissions import GlobalDefaultPermission


class RevenueCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar receitas.

    Permite:
    - GET: Lista todas as receitas ordenadas por data decrescente
    - POST: Cria uma nova receita

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de todas as receitas (exclui deletadas) com relação account pré-carregada
    serializer_class : class
        Serializer usado para validação e serialização
    ordering : list
        Ordenação padrão por data e ID decrescente
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Revenue.objects.filter(is_deleted=False).select_related('account')
    serializer_class = RevenueSerializer
    ordering = ['-date', '-id']  # Consistent ordering for pagination


class RevenueRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    """
    ViewSet para operações individuais em receitas.

    Permite:
    - GET: Recupera uma receita específica
    - PUT/PATCH: Atualiza uma receita existente
    - DELETE: Remove uma receita

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet de todas as receitas (exclui deletadas) com relação account pré-carregada
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = Revenue.objects.filter(is_deleted=False).select_related('account')
    serializer_class = RevenueSerializer
