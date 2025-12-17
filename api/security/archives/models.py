from django.db import models
from app.models import BaseModel
from app.encryption import FieldEncryption


ARCHIVE_TYPES = (
    ('text', 'Texto'),
    ('pdf', 'PDF'),
    ('image', 'Imagem'),
    ('document', 'Documento'),
    ('other', 'Outro')
)

ARCHIVE_CATEGORIES = (
    ('personal', 'Pessoal'),
    ('financial', 'Financeiro'),
    ('legal', 'Jurídico'),
    ('medical', 'Médico'),
    ('tax', 'Impostos'),
    ('work', 'Trabalho'),
    ('other', 'Outro')
)


class Archive(BaseModel):
    """
    Modelo para armazenamento seguro de arquivos confidenciais.
    Suporta dois métodos de armazenamento:
    1. Texto criptografado em banco de dados (para arquivos .txt pequenos)
    2. Arquivo criptografado em FileField (para arquivos binários)
    """
    title = models.CharField(
        max_length=200,
        verbose_name="Título",
        help_text="Nome identificador do arquivo"
    )
    category = models.CharField(
        max_length=100,
        choices=ARCHIVE_CATEGORIES,
        default='other',
        verbose_name="Categoria"
    )
    archive_type = models.CharField(
        max_length=50,
        choices=ARCHIVE_TYPES,
        default='other',
        verbose_name="Tipo de Arquivo"
    )

    # Opção 1: Armazenamento de texto criptografado
    _encrypted_text = models.TextField(
        blank=True,
        null=True,
        verbose_name="Texto Criptografado",
        help_text="Conteúdo de texto criptografado (para arquivos .txt)"
    )

    # Opção 2: Armazenamento de arquivo criptografado
    encrypted_file = models.FileField(
        upload_to='security/archives/%Y/%m/',
        blank=True,
        null=True,
        verbose_name="Arquivo Criptografado",
        help_text="Arquivo binário criptografado"
    )

    file_size = models.BigIntegerField(
        blank=True,
        null=True,
        verbose_name="Tamanho do Arquivo (bytes)"
    )

    notes = models.TextField(
        blank=True,
        null=True,
        verbose_name="Observações"
    )

    tags = models.CharField(
        max_length=500,
        blank=True,
        null=True,
        verbose_name="Tags",
        help_text="Tags separadas por vírgula para facilitar busca"
    )

    owner = models.ForeignKey(
        'members.Member',
        on_delete=models.PROTECT,
        related_name='archives',
        verbose_name="Proprietário"
    )

    @property
    def text_content(self):
        """Descriptografa e retorna o conteúdo de texto."""
        if self._encrypted_text:
            try:
                return FieldEncryption.decrypt_data(self._encrypted_text)
            except Exception:
                return None
        return None

    @text_content.setter
    def text_content(self, value):
        """Criptografa e armazena o conteúdo de texto."""
        if value:
            self._encrypted_text = FieldEncryption.encrypt_data(str(value))
            # Atualizar tamanho
            self.file_size = len(str(value).encode('utf-8'))
        else:
            self._encrypted_text = None
            self.file_size = None

    def has_text_content(self):
        """Verifica se tem conteúdo de texto."""
        return bool(self._encrypted_text)

    def has_file_content(self):
        """Verifica se tem arquivo anexado."""
        return bool(self.encrypted_file)

    class Meta:
        verbose_name = "Arquivo Confidencial"
        verbose_name_plural = "Arquivos Confidenciais"
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'category']),
            models.Index(fields=['title']),
            models.Index(fields=['archive_type']),
        ]

    def __str__(self):
        return f"{self.title} - {self.category}"
