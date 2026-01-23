from rest_framework import serializers
from django.db import models
from decimal import Decimal
from .models import Vault, VaultTransaction, FinancialGoal


class VaultTransactionSerializer(serializers.ModelSerializer):
    """Serializer para transações do cofre."""
    transaction_type_display = serializers.CharField(
        source='get_transaction_type_display',
        read_only=True
    )
    vault_description = serializers.CharField(
        source='vault.description',
        read_only=True
    )

    class Meta:
        model = VaultTransaction
        fields = [
            'id',
            'uuid',
            'vault',
            'vault_description',
            'transaction_type',
            'transaction_type_display',
            'amount',
            'balance_after',
            'description',
            'transaction_date',
            'created_at',
            'created_by',
        ]
        read_only_fields = [
            'uuid',
            'balance_after',
            'created_at',
            'created_by',
        ]


class VaultSerializer(serializers.ModelSerializer):
    """Serializer para cofres."""
    account_name = serializers.CharField(
        source='account.account_name',
        read_only=True
    )
    account_balance = serializers.DecimalField(
        source='account.current_balance',
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    institution_name = serializers.CharField(
        source='account.institution_name',
        read_only=True
    )
    pending_yield = serializers.SerializerMethodField()
    total_deposits = serializers.SerializerMethodField()
    total_withdrawals = serializers.SerializerMethodField()
    recent_transactions = serializers.SerializerMethodField()

    class Meta:
        model = Vault
        fields = [
            'id',
            'uuid',
            'description',
            'account',
            'account_name',
            'account_balance',
            'institution_name',
            'current_balance',
            'accumulated_yield',
            'yield_rate',
            'yield_rate_percentage',
            'last_yield_date',
            'pending_yield',
            'is_active',
            'notes',
            'total_deposits',
            'total_withdrawals',
            'recent_transactions',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'uuid',
            'current_balance',
            'accumulated_yield',
            'last_yield_date',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    yield_rate_percentage = serializers.SerializerMethodField()

    def get_yield_rate_percentage(self, obj):
        """Retorna a taxa de rendimento em formato de porcentagem."""
        return float(obj.yield_rate * 100)

    def get_pending_yield(self, obj):
        """Calcula o rendimento pendente (não aplicado)."""
        return float(obj.calculate_yield())

    def get_total_deposits(self, obj):
        """Soma total de depósitos."""
        total = obj.transactions.filter(
            transaction_type='deposit',
            is_deleted=False
        ).aggregate(
            total=models.Sum('amount')
        )['total']
        return float(total or 0)

    def get_total_withdrawals(self, obj):
        """Soma total de saques."""
        total = obj.transactions.filter(
            transaction_type='withdrawal',
            is_deleted=False
        ).aggregate(
            total=models.Sum('amount')
        )['total']
        return float(total or 0)

    def get_recent_transactions(self, obj):
        """Retorna as últimas 5 transações."""
        transactions = obj.transactions.filter(
            is_deleted=False
        ).order_by('-created_at')[:5]
        return VaultTransactionSerializer(transactions, many=True).data


class VaultDepositSerializer(serializers.Serializer):
    """Serializer para realizar depósitos."""
    amount = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        min_value=Decimal('0.01')
    )
    description = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True
    )


class VaultWithdrawSerializer(serializers.Serializer):
    """Serializer para realizar saques."""
    amount = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        min_value=Decimal('0.01')
    )
    description = serializers.CharField(
        max_length=200,
        required=False,
        allow_blank=True
    )


class VaultYieldUpdateSerializer(serializers.Serializer):
    """Serializer para atualizar taxa de rendimento e recalcular."""
    yield_rate = serializers.DecimalField(
        max_digits=10,
        decimal_places=6,
        min_value=Decimal('0'),
        required=False
    )
    accumulated_yield = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        min_value=Decimal('0'),
        required=False
    )
    recalculate = serializers.BooleanField(
        default=False,
        help_text="Se verdadeiro, recalcula os rendimentos com a nova taxa"
    )
    from_date = serializers.DateField(
        required=False,
        allow_null=True,
        help_text="Data a partir da qual recalcular os rendimentos"
    )


class VaultSummarySerializer(serializers.Serializer):
    """Serializer para resumo de cofres (usado em metas)."""
    id = serializers.IntegerField()
    uuid = serializers.UUIDField()
    description = serializers.CharField()
    current_balance = serializers.DecimalField(max_digits=15, decimal_places=2)
    accumulated_yield = serializers.DecimalField(max_digits=15, decimal_places=2)
    account_name = serializers.CharField()


class FinancialGoalSerializer(serializers.ModelSerializer):
    """Serializer para metas financeiras."""
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )
    current_value = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    progress_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True
    )
    remaining_value = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    days_remaining = serializers.IntegerField(read_only=True)
    monthly_required = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True,
        allow_null=True
    )
    vaults_summary = serializers.SerializerMethodField()
    vaults_count = serializers.SerializerMethodField()

    class Meta:
        model = FinancialGoal
        fields = [
            'id',
            'uuid',
            'description',
            'category',
            'category_display',
            'target_value',
            'current_value',
            'progress_percentage',
            'remaining_value',
            'vaults',
            'vaults_count',
            'vaults_summary',
            'target_date',
            'days_remaining',
            'monthly_required',
            'is_active',
            'is_completed',
            'completed_at',
            'notes',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]
        read_only_fields = [
            'uuid',
            'is_completed',
            'completed_at',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by',
        ]

    def get_vaults_summary(self, obj):
        """Retorna o resumo dos cofres associados."""
        return obj.get_vaults_summary()

    def get_vaults_count(self, obj):
        """Retorna o número de cofres associados."""
        return obj.vaults.filter(is_deleted=False, is_active=True).count()


class FinancialGoalListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de metas."""
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )
    current_value = serializers.DecimalField(
        max_digits=15,
        decimal_places=2,
        read_only=True
    )
    progress_percentage = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        read_only=True
    )
    vaults_count = serializers.SerializerMethodField()

    class Meta:
        model = FinancialGoal
        fields = [
            'id',
            'uuid',
            'description',
            'category',
            'category_display',
            'target_value',
            'current_value',
            'progress_percentage',
            'vaults_count',
            'target_date',
            'is_active',
            'is_completed',
            'created_at',
        ]

    def get_vaults_count(self, obj):
        """Retorna o número de cofres associados."""
        return obj.vaults.filter(is_deleted=False, is_active=True).count()
