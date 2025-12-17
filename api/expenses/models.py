from django.db import models
from accounts.models import Account
from app.models import (
    BaseModel,
    PAYMENT_METHOD_CHOICES,
    PAYMENT_FREQUENCY_CHOICES
)


EXPENSES_CATEGORIES = (
    ('food and drink', 'Comida e bebida'),
    ('bills and services', 'Contas e serviços'),
    ('electronics', 'Eletrônicos'),
    ('family and friends', 'Amizades e Família'),
    ('pets', 'Animais de estimação'),
    ('digital signs', 'Assinaturas digitais'),
    ('house', 'Casa'),
    ('purchases', 'Compras'),
    ('donate', 'Doações'),
    ('education', 'Educação'),
    ('loans', 'Empréstimos'),
    ('entertainment', 'Entretenimento'),
    ('taxes', 'Impostos'),
    ('investments', 'Investimentos'),
    ('others', 'Outros'),
    ('vestuary', 'Roupas'),
    ('health and care', 'Saúde e cuidados pessoais'),
    ('professional services', 'Serviços profissionais'),
    ('supermarket', 'Supermercado'),
    ('rates', 'Taxas'),
    ('transport', 'Transporte'),
    ('travels', 'Viagens'),
)


class Expense(BaseModel):
    description = models.CharField(
        max_length=100,
        null=False,
        blank=False,
        verbose_name="Descrição"
    )
    value = models.DecimalField(
        null=False,
        blank=False,
        verbose_name="Valor",
        max_digits=10,
        decimal_places=2
    )
    date = models.DateField(verbose_name="Data", null=False, blank=False)
    horary = models.TimeField(verbose_name="Horário", null=False, blank=False)
    category = models.CharField(
        verbose_name="Categoria",
        max_length=200,
        choices=EXPENSES_CATEGORIES,
        null=False,
        blank=False
    )
    account = models.ForeignKey(
        Account,
        max_length=200,
        on_delete=models.PROTECT,
        null=False,
        blank=False,
        verbose_name="Conta"
    )
    payed = models.BooleanField(verbose_name="Pago", default=False)
    merchant = models.CharField(
        max_length=200,
        verbose_name="Estabelecimento",
        null=True,
        blank=True
    )
    location = models.CharField(
        max_length=200,
        verbose_name="Local da Compra",
        null=True,
        blank=True
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        verbose_name="Método de Pagamento",
        null=True,
        blank=True
    )
    receipt = models.FileField(
        upload_to='expenses/receipts/',
        verbose_name="Comprovante",
        null=True,
        blank=True
    )
    member = models.ForeignKey(
        'members.Member',
        on_delete=models.PROTECT,
        verbose_name="Membro Responsável",
        null=True,
        blank=True
    )
    notes = models.TextField(
        verbose_name="Observações",
        null=True,
        blank=True
    )
    recurring = models.BooleanField(
        verbose_name="Despesa Recorrente",
        default=False
    )
    frequency = models.CharField(
        max_length=20,
        choices=PAYMENT_FREQUENCY_CHOICES,
        verbose_name="Frequência",
        null=True,
        blank=True,
        help_text="Apenas se for recorrente"
    )

    class Meta:
        ordering = ['-date']
        verbose_name = "Despesa"
        verbose_name_plural = "Despesas"
        indexes = [
            models.Index(fields=['-date']),
            models.Index(fields=['category', 'date']),
            models.Index(fields=['account', 'date']),
            models.Index(fields=['payed', 'date']),
            models.Index(fields=['account', 'category']),
        ]

    def __str__(self):
        return f"{self.description} - {self.date}, {self.horary}"
