import os
from cryptography.fernet import Fernet
from django.core.exceptions import ValidationError


class FieldEncryption:
    """
    Classe para criptografar/descriptografar campos sensíveis do banco.
    """
    @staticmethod
    def get_encryption_key():
        """
        Obtém a chave de criptografia das variáveis de ambiente.
        """
        encryption_key = os.getenv('ENCRYPTION_KEY')
        if not encryption_key:
            raise ValidationError(
                "ENCRYPTION_KEY não encontrada nas variáveis de ambiente"
            )
        return encryption_key.encode()

    @staticmethod
    def encrypt_data(data):
        """
        Criptografa dados sensíveis.
            Args:
            data (str): Dados a serem criptografados
                Returns:
            str: Dados criptografados em string base64
        """
        if not data:
            return data
        try:
            key = FieldEncryption.get_encryption_key()
            fernet = Fernet(key)
            encrypted_data = fernet.encrypt(str(data).encode())
            return encrypted_data.decode()
        except Exception as e:
            raise ValidationError(f"Erro ao criptografar dados: {str(e)}")

    @staticmethod
    def decrypt_data(encrypted_data):
        """
        Descriptografa dados sensíveis.
            Args:
            encrypted_data (str): Dados criptografados em string base64
                Returns:
            str: Dados descriptografados
        """
        if not encrypted_data:
            return encrypted_data
        try:
            key = FieldEncryption.get_encryption_key()
            fernet = Fernet(key)
            decrypted_data = fernet.decrypt(encrypted_data.encode())
            return decrypted_data.decode()
        except Exception as e:
            raise ValidationError(f"Erro ao descriptografar dados: {str(e)}")

    @staticmethod
    def generate_key():
        """
        Gera uma nova chave de criptografia.
        Use esta função apenas para gerar a chave inicial.
            Returns:
            str: Chave de criptografia em base64
        """
        return Fernet.generate_key().decode()
