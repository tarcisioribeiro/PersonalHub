# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from rest_framework import status


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'detail': 'Logout efetuado com sucesso.'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    GET /api/v1/me/

    Retorna dados completos do usuário autenticado incluindo:
    - Informações do User (Django)
    - Informações do Member vinculado (se existir)
    - Permissões do usuário

    FEAT-01: Endpoint centralizado para dados do usuário.
    """
    from members.models import Member

    user = request.user

    # Buscar membro vinculado
    try:
        member = Member.objects.get(user=user, is_deleted=False)
        member_data = {
            'id': member.id,
            'name': member.name,
            'document': member.document,
            'phone': member.phone,
            'email': member.email,
            'sex': member.sex,
            'is_creditor': member.is_creditor,
            'is_benefited': member.is_benefited,
            'active': member.active,
        }
    except Member.DoesNotExist:
        member_data = None

    # Permissões do usuário
    perms = user.get_all_permissions()

    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser,
        'is_active': user.is_active,
        'date_joined': user.date_joined,
        'permissions': list(perms),
        'member': member_data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_permissions(request):
    user = request.user

    # Bloqueia superusuários de usar a interface Streamlit
    if user.is_superuser:
        return Response(
            {'error': 'Administradores não podem acessar esta interface'},
            status=status.HTTP_403_FORBIDDEN
        )

    perms = user.get_all_permissions()
    return Response({
        "username": user.username,
        "permissions": list(perms),
        "is_staff": user.is_staff,
        "is_superuser": user.is_superuser,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_available_users(request):
    """
    Retorna lista de usuários disponíveis para vinculação com membros.
    Exclui superusuários e usuários já vinculados a membros.
    """
    from members.models import Member

    # Pega IDs de usuários já vinculados a membros
    linked_user_ids = Member.objects.filter(
        user__isnull=False
    ).values_list('user_id', flat=True)

    # Lista usuários não superusuários e não vinculados
    available_users = User.objects.filter(
        is_superuser=False,
        is_active=True
    ).exclude(
        id__in=linked_user_ids
    ).values('id', 'username', 'first_name', 'last_name', 'email')

    return Response(list(available_users))


@api_view(['POST'])
def create_user_with_member(request):
    """
    Cria um novo usuário e o vincula a um membro.
    Endpoint público para registro de novos usuários.
    """
    from members.models import Member
    from django.db import transaction

    username = request.data.get('username')
    password = request.data.get('password')
    name = request.data.get('name')
    document = request.data.get('document')
    phone = request.data.get('phone')
    email = request.data.get('email')

    # Validações básicas
    if not all([username, password, name, document, phone]):
        return Response(
            {'error': 'Todos os campos obrigatórios devem ser preenchidos'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verifica se username já existe
    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'Nome de usuário já existe'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Verifica se documento já existe
    if Member.objects.filter(document=document).exists():
        return Response(
            {'error': 'Documento já cadastrado'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        with transaction.atomic():
            # Cria o usuário
            user = User.objects.create_user(
                username=username,
                password=password,
                email=email or '',
                first_name=name.split()[0] if name else '',
                last_name=(
                    ' '.join(name.split()[1:]) if len(
                        name.split()
                    ) > 1 else ''
                ),
                is_superuser=False,
                is_staff=False,
                is_active=True
            )

            # Adiciona usuário ao grupo members
            from django.contrib.auth.models import Group
            try:
                members_group = Group.objects.get(name='members')
                user.groups.add(members_group)
            except Group.DoesNotExist:
                pass

            # Cria o membro vinculado
            member = Member.objects.create(
                name=name,
                document=document,
                phone=phone,
                email=email,
                sex='M',  # Default, pode ser alterado depois
                user=user,
                is_creditor=True,
                is_benefited=True,
                active=True
            )

            return Response({
                'message': 'Usuário criado com sucesso',
                'user_id': user.id,
                'member_id': member.id,
                'username': username
            }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response(
            {'error': f'Erro ao criar usuário: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
