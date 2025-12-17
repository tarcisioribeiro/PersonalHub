from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from credit_cards.models import (
    CreditCard,
    CreditCardBill,
    CreditCardExpense
)
from credit_cards.serializers import (
    CreditCardSerializer,
    CreditCardBillsSerializer,
    CreditCardExpensesSerializer
)
from app.permissions import GlobalDefaultPermission


class CreditCardCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar cartões de crédito.

    Permite:
    - GET: Lista todos os cartões de crédito com conta associada
    - POST: Cria um novo cartão de crédito

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet dos cartões (exclui deletados) com conta associada carregada
    serializer_class : class
        Serializer usado para validação e serialização
    ordering : list
        Ordenação padrão por nome
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCard.objects.filter(is_deleted=False).select_related('associated_account')
    serializer_class = CreditCardSerializer
    ordering = ['name']


class CreditCardRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    ViewSet para operações individuais em cartões de crédito.

    Permite:
    - GET: Recupera um cartão específico
    - PUT/PATCH: Atualiza um cartão existente
    - DELETE: Remove um cartão

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet dos cartões (exclui deletados) com conta associada carregada
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCard.objects.filter(is_deleted=False).select_related('associated_account')
    serializer_class = CreditCardSerializer


class CreditCardBillCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar faturas de cartão de crédito.

    Permite:
    - GET: Lista todas as faturas ordenadas por data
    - POST: Cria uma nova fatura

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet das faturas (exclui deletadas) com cartão e conta associada carregados
    serializer_class : class
        Serializer usado para validação e serialização
    ordering : list
        Ordenação por ano, mês e data de fim da fatura (descendente)
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardBill.objects.filter(is_deleted=False).select_related(
        'credit_card',
        'credit_card__associated_account'
    )
    serializer_class = CreditCardBillsSerializer
    ordering = ['-year', '-month', '-invoice_ending_date']


class CreditCardBillRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    ViewSet para operações individuais em faturas de cartão.

    Permite:
    - GET: Recupera uma fatura específica
    - PUT/PATCH: Atualiza uma fatura existente
    - DELETE: Remove uma fatura

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet das faturas (exclui deletadas) com cartão e conta associada carregados
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardBill.objects.filter(is_deleted=False).select_related(
        'credit_card', 'credit_card__associated_account'
    )
    serializer_class = CreditCardBillsSerializer


class CreditCardExpenseCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar despesas de cartão de crédito.

    Permite:
    - GET: Lista todas as despesas do cartão ordenadas por data
    - POST: Cria uma nova despesa no cartão

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet das despesas (exclui deletadas) com cartão e conta associada carregados
    serializer_class : class
        Serializer usado para validação e serialização
    ordering : list
        Ordenação por data e ID (descendente)
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardExpense.objects.filter(is_deleted=False).select_related(
        'card', 'card__associated_account'
    )
    serializer_class = CreditCardExpensesSerializer
    ordering = ['-date', '-id']


class CreditCardExpenseRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    ViewSet para operações individuais em despesas de cartão.

    Permite:
    - GET: Recupera uma despesa específica
    - PUT/PATCH: Atualiza uma despesa existente
    - DELETE: Remove uma despesa

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    queryset : QuerySet
        QuerySet das despesas (exclui deletadas) com cartão e conta associada carregados
    serializer_class : class
        Serializer usado para validação e serialização
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardExpense.objects.filter(is_deleted=False).select_related(
        'card', 'card__associated_account'
    )
    serializer_class = CreditCardExpensesSerializer
