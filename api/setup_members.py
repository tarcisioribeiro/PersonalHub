#!/usr/bin/env python
import os
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')
django.setup()

from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType

print('🔧 Configurando grupo members e permissões...')

# Criar grupo
group, created = Group.objects.get_or_create(name='members')
print(f'Grupo members: {"criado" if created else "já existia"} - ID: {group.id}')

# Limpar permissões existentes
group.permissions.clear()

# Apps alvo
apps = [
    'accounts',
    'credit_cards',
    'expenses',
    'revenues',
    'members',
    'loans',
    'transfers'
]

# Buscar e adicionar permissões
permissions_added = 0
for app_label in apps:
    try:
        content_types = ContentType.objects.filter(app_label=app_label)
        for ct in content_types:
            # Buscar permissões view_ e add_
            perms = Permission.objects.filter(
                content_type=ct,
                codename__startswith='view_'
            ).union(
                Permission.objects.filter(
                    content_type=ct,
                    codename__startswith='add_'
                )
            )

            for perm in perms:
                group.permissions.add(perm)
                permissions_added += 1
                print(f'✅ {app_label}.{perm.codename}')
    except Exception as e:
        print(f'❌ Erro em {app_label}: {e}')

print(f'\n📊 Total: {permissions_added} permissões adicionadas')
print(f'Grupo members tem {group.permissions.count()} permissões')
