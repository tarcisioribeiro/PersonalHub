from django.db import models
from django.core.exceptions import ValidationError
from app.models import BaseModel
from app.encryption import FieldEncryption


FLAGS = (
    ('MSC', 'Mastercard'),
    ('VSA', 'Visa'),
    ('ELO', 'Elo'),
    ('EXP', 'American Express'),
    ('HCD', 'Hipercard'),
    ('DIN', 'Diners Club'),
    ('OTHER', 'Outro')
)


class StoredCreditCard(BaseModel):
    """
    Modelo para armazenamento seguro de credenciais de cartões de crédito.
    Separado do módulo financeiro - foco em armazenamento seguro de credenciais.
    """
    name = models.CharField(
        max_length=200,
        verbose_name="Nome do Cartão",
        help_text="Nome identificador (ex: Nubank Pessoal)"
    )
    _card_number = models.TextField(
        verbose_name="Número do Cartão (Criptografado)",
        help_text="Número do cartão criptografado"
    )
    _security_code = models.TextField(
        verbose_name="CVV (Criptografado)",
        help_text="Código de segurança criptografado"
    )
    expiration_month = models.IntegerField(
        verbose_name="Mês de Validade",
        help_text="Mês de validade (1-12)"
    )
    expiration_year = models.IntegerField(
        verbose_name="Ano de Validade",
        help_text="Ano de validade (YYYY)"
    )
    cardholder_name = models.CharField(
        max_length=200,
        verbose_name="Nome do Titular",
        help_text="Nome impresso no cartão"
    )
    flag = models.CharField(
        max_length=50,
        choices=FLAGS,
        verbose_name="Bandeira"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Observações"
    )
    owner = models.ForeignKey(
        'members.Member',
        on_delete=models.PROTECT,
        related_name='stored_credit_cards',
        verbose_name="Proprietário"
    )

    # Link opcional para módulo de finanças
    finance_card = models.ForeignKey(
        'credit_cards.CreditCard',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stored_credentials',
        verbose_name="Cartão Financeiro Vinculado",
        help_text="Link opcional para o cartão no módulo de finanças"
    )

    @property
    def card_number(self):
        """Descriptografa e retorna o número do cartão."""
        if self._card_number:
            try:
                return FieldEncryption.decrypt_data(self._card_number)
            except Exception:
                return None
        return None

    @card_number.setter
    def card_number(self, value):
        """Criptografa e armazena o número do cartão."""
        if value:
            # Remove espaços e traços
            clean_value = str(value).replace(' ', '').replace('-', '')
            # Validação básica: deve ter 13-19 dígitos
            if not clean_value.isdigit() or len(clean_value) < 13 or len(clean_value) > 19:
                raise ValidationError("Número do cartão inválido. Deve conter 13-19 dígitos.")
            self._card_number = FieldEncryption.encrypt_data(clean_value)
        else:
            self._card_number = None

    @property
    def card_number_masked(self):
        """Retorna o número do cartão mascarado (****1234)."""
        if self._card_number:
            try:
                full_number = FieldEncryption.decrypt_data(self._card_number)
                if full_number and len(full_number) >= 4:
                    return '*' * (len(full_number) - 4) + full_number[-4:]
                return full_number
            except Exception:
                return None
        return None

    @property
    def security_code(self):
        """Descriptografa e retorna o CVV."""
        if self._security_code:
            try:
                return FieldEncryption.decrypt_data(self._security_code)
            except Exception:
                return None
        return None

    @security_code.setter
    def security_code(self, value):
        """Criptografa e armazena o CVV."""
        if value:
            clean_value = str(value).strip()
            # Validação: 3 ou 4 dígitos
            if not clean_value.isdigit() or len(clean_value) not in [3, 4]:
                raise ValidationError("CVV inválido. Deve conter 3 ou 4 dígitos.")
            self._security_code = FieldEncryption.encrypt_data(clean_value)
        else:
            self._security_code = None

    class Meta:
        verbose_name = "Cartão Armazenado"
        verbose_name_plural = "Cartões Armazenados"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'flag']),
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return f"{self.name} - {self.flag} ({self.card_number_masked})"
