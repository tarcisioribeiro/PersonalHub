from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from credit_cards.models import (
    CreditCard,
    CreditCardBill,
    CreditCardExpense,
    CreditCardPurchase,
    CreditCardInstallment,
)
from credit_cards.serializers import (
    CreditCardSerializer,
    CreditCardBillsSerializer,
    CreditCardExpensesSerializer,
    CreditCardPurchaseSerializer,
    CreditCardPurchaseCreateSerializer,
    CreditCardPurchaseUpdateSerializer,
    CreditCardInstallmentSerializer,
    CreditCardInstallmentUpdateSerializer,
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


# ============================================================================
# NEW VIEWS FOR PURCHASE AND INSTALLMENT
# ============================================================================

class CreditCardPurchaseCreateListView(generics.ListCreateAPIView):
    """
    ViewSet para listar e criar compras de cartão de crédito.

    Permite:
    - GET: Lista todas as compras com parcelas aninhadas
    - POST: Cria uma nova compra (parcelas são geradas automaticamente)

    Query params para filtro:
    - card: ID do cartão
    - category: Categoria da compra
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardPurchase.objects.all()
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['card', 'category']
    ordering = ['-purchase_date', '-id']

    def get_queryset(self):
        return CreditCardPurchase.objects.filter(is_deleted=False).select_related(
            'card', 'card__associated_account', 'member'
        ).prefetch_related(
            'installments', 'installments__bill'
        )

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreditCardPurchaseCreateSerializer
        return CreditCardPurchaseSerializer


class CreditCardPurchaseRetrieveUpdateDestroyView(
    generics.RetrieveUpdateDestroyAPIView
):
    """
    ViewSet para operações individuais em compras de cartão.

    Permite:
    - GET: Recupera uma compra específica com parcelas
    - PUT/PATCH: Atualiza uma compra existente (exceto valor e parcelas)
    - DELETE: Remove uma compra e suas parcelas

    Attributes
    ----------
    permission_classes : tuple
        Permissões necessárias (IsAuthenticated, GlobalDefaultPermission)
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardPurchase.objects.all()

    def get_queryset(self):
        return CreditCardPurchase.objects.filter(is_deleted=False).select_related(
            'card', 'card__associated_account', 'member'
        ).prefetch_related(
            'installments', 'installments__bill'
        )

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return CreditCardPurchaseUpdateSerializer
        return CreditCardPurchaseSerializer


class CreditCardInstallmentListView(generics.ListAPIView):
    """
    ViewSet para listar parcelas de cartão de crédito.

    Query params para filtro:
    - card: ID do cartão (via purchase__card)
    - bill: ID da fatura
    - category: Categoria (via purchase__category)
    - payed: Status de pagamento (true/false)
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardInstallment.objects.all()
    serializer_class = CreditCardInstallmentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = {
        'purchase__card': ['exact'],
        'bill': ['exact', 'isnull'],
        'purchase__category': ['exact'],
        'payed': ['exact'],
    }
    ordering = ['due_date', 'purchase__description']

    def get_queryset(self):
        return CreditCardInstallment.objects.filter(
            is_deleted=False,
            purchase__is_deleted=False
        ).select_related(
            'purchase', 'purchase__card', 'purchase__member', 'bill'
        )


class CreditCardInstallmentUpdateView(generics.UpdateAPIView):
    """
    ViewSet para atualizar uma parcela específica.

    Permite alterar apenas:
    - bill: Fatura associada
    - payed: Status de pagamento
    """
    permission_classes = (IsAuthenticated, GlobalDefaultPermission,)
    queryset = CreditCardInstallment.objects.all()
    serializer_class = CreditCardInstallmentUpdateSerializer

    def get_queryset(self):
        return CreditCardInstallment.objects.filter(
            is_deleted=False,
            purchase__is_deleted=False
        ).select_related('purchase', 'bill')
