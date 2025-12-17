from django.db import models
from app.models import BaseModel
from app.encryption import FieldEncryption


PASSWORD_CATEGORIES = (
    ('social', 'Redes Sociais'),
    ('email', 'E-mail'),
    ('banking', 'Bancário'),
    ('work', 'Trabalho'),
    ('entertainment', 'Entretenimento'),
    ('shopping', 'Compras'),
    ('streaming', 'Streaming'),
    ('gaming', 'Games'),
    ('other', 'Outro')
)


class Password(BaseModel):
    """
    Modelo para armazenamento seguro de senhas.
    Todas as senhas são criptografadas usando Fernet.
    """
    title = models.CharField(
        max_length=200,
        verbose_name="Título",
        help_text="Nome identificador da senha (ex: Gmail, Netflix)"
    )
    site = models.URLField(
        max_length=500,
        verbose_name="Site",
        blank=True,
        null=True,
        help_text="URL do site/serviço"
    )
    username = models.CharField(
        max_length=200,
        verbose_name="Usuário/Email",
        help_text="Nome de usuário ou email usado no login"
    )
    _password = models.TextField(
        verbose_name="Senha (Criptografada)",
        help_text="Senha criptografada usando Fernet"
    )
    category = models.CharField(
        max_length=100,
        choices=PASSWORD_CATEGORIES,
        default='other',
        verbose_name="Categoria"
    )
    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Observações",
        help_text="Notas adicionais sobre esta senha"
    )
    last_password_change = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Última Alteração da Senha"
    )
    owner = models.ForeignKey(
        'members.Member',
        on_delete=models.PROTECT,
        related_name='passwords',
        verbose_name="Proprietário"
    )

    @property
    def password(self):
        """Descriptografa e retorna a senha."""
        if self._password:
            try:
                return FieldEncryption.decrypt_data(self._password)
            except Exception:
                return None
        return None

    @password.setter
    def password(self, value):
        """Criptografa e armazena a senha."""
        if value:
            self._password = FieldEncryption.encrypt_data(str(value))
        else:
            self._password = None

    class Meta:
        verbose_name = "Senha"
        verbose_name_plural = "Senhas"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'category']),
            models.Index(fields=['title']),
        ]

    def __str__(self):
        return f"{self.title} - {self.username}"
