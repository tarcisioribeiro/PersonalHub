from rest_framework import serializers
from credit_cards.models import CreditCard, CreditCardBill, CreditCardExpense


class CreditCardSerializer(serializers.ModelSerializer):
    security_code = serializers.CharField(
        max_length=4,
        min_length=3,
        write_only=True,
        help_text="CVV do cartão (3 ou 4 dígitos)"
    )

    class Meta:
        model = CreditCard
        exclude = ['_security_code']

    def validate_security_code(self, value):
        """
        Validação customizada para o CVV.
        """
        if not value.isdigit():
            raise serializers.ValidationError("CVV deve conter apenas dígitos")
        if len(value) not in [3, 4]:
            raise serializers.ValidationError("CVV deve ter 3 ou 4 dígitos")
        return value

    def validate_validation_date(self, value):
        """
        Validação customizada para data de validade.
        """
        from datetime import date
        if value <= date.today():
            raise serializers.ValidationError(
                "Data de validade deve ser posterior à data atual"
            )
        return value

    def create(self, validated_data):
        """
        Override do create para lidar com o campo criptografado.
        """
        security_code = validated_data.pop('security_code', None)
        # Criar a instância sem salvar
        instance = CreditCard(**validated_data)
        # Definir o security_code via property (que criptografa e define _security_code)
        if security_code:
            instance.security_code = security_code
        # Agora salvar a instância com _security_code já definido
        instance.save()
        return instance

    def update(self, instance, validated_data):
        """
        Override do update para lidar com o campo criptografado.
        """
        security_code = validated_data.pop('security_code', None)
        # Atualizar os campos do validated_data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        # Definir o security_code via property se fornecido
        if security_code:
            instance.security_code = security_code
        # Salvar a instância
        instance.save()
        return instance


class CreditCardBillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCardBill
        fields = '__all__'


class CreditCardExpensesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCardExpense
        fields = '__all__'
