from django.contrib import admin
from credit_cards.models import CreditCard, CreditCardBill, CreditCardExpense


@admin.register(CreditCard)
class CreditCardAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'flag')


@admin.register(CreditCardBill)
class CreditCardBillAdmin(admin.ModelAdmin):
    list_display = ('year', 'month')


@admin.register(CreditCardExpense)
class CreditCardExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'description',
        'value',
        'date',
        'card',
        'installment'
    )
