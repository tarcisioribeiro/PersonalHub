"""
Django management command to setup default permissions for the members group.
This ensures all users in the members group have the necessary permissions.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType


class Command(BaseCommand):
    help = 'Setup default permissions for the members group'

    def handle(self, *args, **options):
        # Get or create the members group
        members_group, created = Group.objects.get_or_create(name='members')

        if created:
            self.stdout.write(
                self.style.SUCCESS('Created "members" group')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Group "members" already exists')
            )

        # Define all the models that members should have full access to
        app_models = {
            'accounts': ['account'],
            'expenses': ['expense'],
            'revenues': ['revenue'],
            'credit_cards': ['creditcard', 'creditcardbill', 'creditcardexpense'],
            'transfers': ['transfer'],
            'loans': ['loan'],
            'members': ['member'],
        }

        # Define the permissions: view, add, change, delete
        permission_types = ['view', 'add', 'change', 'delete']

        total_permissions = 0

        for app_label, models in app_models.items():
            for model_name in models:
                try:
                    content_type = ContentType.objects.get(
                        app_label=app_label,
                        model=model_name
                    )

                    for perm_type in permission_types:
                        codename = f'{perm_type}_{model_name}'

                        try:
                            permission = Permission.objects.get(
                                codename=codename,
                                content_type=content_type
                            )

                            # Add permission to group if not already there
                            if not members_group.permissions.filter(
                                id=permission.id
                            ).exists():
                                members_group.permissions.add(permission)
                                total_permissions += 1
                                self.stdout.write(
                                    self.style.SUCCESS(
                                        f'✓ Added: {app_label}.{codename}'
                                    )
                                )

                        except Permission.DoesNotExist:
                            self.stdout.write(
                                self.style.WARNING(
                                    f'✗ Permission not found: '
                                    f'{app_label}.{codename}'
                                )
                            )

                except ContentType.DoesNotExist:
                    self.stdout.write(
                        self.style.ERROR(
                            f'✗ ContentType not found: '
                            f'{app_label}.{model_name}'
                        )
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Setup complete! Added {total_permissions} permissions '
                f'to the "members" group'
            )
        )

        # Show current permissions count
        current_perms = members_group.permissions.count()
        self.stdout.write(
            self.style.SUCCESS(
                f'✓ Group "members" now has {current_perms} total permissions'
            )
        )
