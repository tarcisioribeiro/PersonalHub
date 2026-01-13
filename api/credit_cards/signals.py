from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from decimal import Decimal
from .models import CreditCardExpense, CreditCardBill


@receiver(post_save, sender=CreditCardExpense)
@receiver(post_delete, sender=CreditCardExpense)
def update_bill_totals(sender, instance, **kwargs):
    """
    Signal para atualizar automaticamente o total da fatura e o pagamento mínimo
    quando uma despesa de cartão é criada, atualizada ou deletada.

    Regras:
    - total_amount = soma de todas as despesas da fatura
    - minimum_payment = 10% do total_amount
    """
    # Verifica se a despesa está associada a uma fatura
    if not instance.bill:
        return

    bill = instance.bill

    # Calcula o total de todas as despesas não deletadas associadas à fatura
    expenses = CreditCardExpense.objects.filter(
        bill=bill,
        is_deleted=False
    )

    total = sum(Decimal(str(expense.value)) for expense in expenses)

    # Atualiza o total e o pagamento mínimo (10%)
    bill.total_amount = total
    bill.minimum_payment = total * Decimal('0.10')  # 10% do total
    bill.save()


@receiver(post_save, sender=CreditCardBill)
def ensure_bill_defaults(sender, instance, created, **kwargs):
    """
    Signal para garantir que faturas recém-criadas tenham valores padrão corretos.
    Este signal serve como garantia adicional caso o serializer seja contornado.
    """
    if created:
        needs_update = False

        if instance.status != 'open':
            instance.status = 'open'
            needs_update = True

        if instance.closed:
            instance.closed = False
            needs_update = True

        # Salva novamente se necessário, mas evita loop infinito
        if needs_update:
            # Usa update para evitar disparar o signal novamente
            CreditCardBill.objects.filter(pk=instance.pk).update(
                status='open',
                closed=False
            )
