from rest_framework import serializers
from members.models import Member
from django.contrib.auth.models import Permission


class MemberSerializer(serializers.ModelSerializer):
    member_name = serializers.CharField(source='name')
    member_type = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            'id',
            'uuid',
            'name',
            'member_name',
            'member_type',
            'document',
            'phone',
            'email',
            'sex',
            'user',
            'is_creditor',
            'is_benefited',
            'active',
            'birth_date',
            'address',
            'profile_photo',
            'emergency_contact',
            'monthly_income',
            'occupation',
            'notes',
            'created_at',
            'updated_at',
            'created_by',
            'updated_by'
        ]
        read_only_fields = ['uuid', 'created_at', 'updated_at', 'created_by', 'updated_by']

    def get_member_type(self, obj):
        """Retorna o tipo do membro baseado nos flags"""
        if obj.is_creditor and obj.is_benefited:
            return 'both'
        elif obj.is_creditor:
            return 'creditor'
        elif obj.is_benefited:
            return 'beneficiary'
        return 'other'

    def create(self, validated_data):
        # Remove member_name do validated_data pois é um alias para name
        validated_data.pop('member_name', None)
        return super().create(validated_data)


class PermissionSerializer(serializers.ModelSerializer):
    """Serializer para permissões do Django"""

    class Meta:
        model = Permission
        fields = ['id', 'name', 'codename', 'content_type']


class MemberPermissionsSerializer(serializers.Serializer):
    """Serializer para gerenciar permissões de um membro"""
    permission_codenames = serializers.ListField(
        child=serializers.CharField(),
        required=True,
        help_text="Lista de codenames de permissões a serem atribuídas ao membro"
    )
