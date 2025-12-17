from django.db import models
from app.models import BaseModel
from app.encryption import FieldEncryption


ACCOUNT_TYPES = (
    ('CC', 'Conta Corrente'),
    ('CS', 'Conta Salário'),
    ('CP', 'Conta Poupança'),
    ('CI', 'Conta Investimento'),
    ('OTHER', 'Outro')
)


class StoredBankAccount(BaseModel):
    """
    Modelo para armazenamento seguro de credenciais de contas bancárias.
    Separado do módulo financeiro - foco em armazenamento seguro de credenciais.
    """
    name = models.CharField(
        max_length=200,
        verbose_name="Nome da Conta",
        help_text="Nome identificador (ex: Nubank Conta Corrente)"
    )
    institution_name = models.CharField(
        max_length=200,
        verbose_name="Instituição Financeira"
    )
    account_type = models.CharField(
        max_length=50,
        choices=ACCOUNT_TYPES,
        verbose_name="Tipo de Conta"
    )
    _account_number = models.TextField(
        verbose_name="Número da Conta (Criptografado)",
        help_text="Número da conta criptografado"
    )
    agency = models.CharField(
        max_length=10,
        verbose_name="Agência",
        blank=True,
        null=True
    )
    _password = models.TextField(
        verbose_name="Senha Bancária (Criptografada)",
        blank=True,
        null=True,
        help_text="Senha da conta bancária criptografada"
    )
    _digital_password = models.TextField(
        verbose_name="Senha Digital (Criptografada)",
        blank=True,
        null=True,
        help_text="Senha do app/internet banking criptografada"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Observações"
    )
    owner = models.ForeignKey(
        'members.Member',
        on_delete=models.PROTECT,
        related_name='stored_bank_accounts',
        verbose_name="Proprietário"
    )

    # Link opcional para módulo de finanças
    finance_account = models.ForeignKey(
        'accounts.Account',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='stored_credentials',
        verbose_name="Conta Financeira Vinculada",
        help_text="Link opcional para a conta no módulo de finanças"
    )

    @property
    def account_number(self):
        """Descriptografa e retorna o número da conta."""
        if self._account_number:
            try:
                return FieldEncryption.decrypt_data(self._account_number)
            except Exception:
                return None
        return None

    @account_number.setter
    def account_number(self, value):
        """Criptografa e armazena o número da conta."""
        if value:
            self._account_number = FieldEncryption.encrypt_data(str(value))
        else:
            self._account_number = None

    @property
    def account_number_masked(self):
        """Retorna o número da conta mascarado (****1234)."""
        if self._account_number:
            try:
                full_number = FieldEncryption.decrypt_data(self._account_number)
                if full_number and len(full_number) >= 4:
                    return '*' * (len(full_number) - 4) + full_number[-4:]
                return full_number
            except Exception:
                return None
        return None

    @property
    def password(self):
        """Descriptografa e retorna a senha bancária."""
        if self._password:
            try:
                return FieldEncryption.decrypt_data(self._password)
            except Exception:
                return None
        return None

    @password.setter
    def password(self, value):
        """Criptografa e armazena a senha bancária."""
        if value:
            self._password = FieldEncryption.encrypt_data(str(value))
        else:
            self._password = None

    @property
    def digital_password(self):
        """Descriptografa e retorna a senha digital."""
        if self._digital_password:
            try:
                return FieldEncryption.decrypt_data(self._digital_password)
            except Exception:
                return None
        return None

    @digital_password.setter
    def digital_password(self, value):
        """Criptografa e armazena a senha digital."""
        if value:
            self._digital_password = FieldEncryption.encrypt_data(str(value))
        else:
            self._digital_password = None

    class Meta:
        verbose_name = "Conta Bancária Armazenada"
        verbose_name_plural = "Contas Bancárias Armazenadas"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'institution_name']),
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return f"{self.name} - {self.institution_name} ({self.account_number_masked})"
