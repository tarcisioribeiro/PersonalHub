from rest_framework import serializers
from expenses.models import Expense


class ExpenseSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.account_name', read_only=True)
    current_balance = serializers.DecimalField(
        source='account.current_balance',
        max_digits=15,
        decimal_places=2,
        read_only=True
    )

    class Meta:
        model = Expense
        fields = '__all__'
