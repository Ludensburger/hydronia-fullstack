"""
Django management command to create test users for role-based authentication testing.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Create test users for Hydronia app'

    def handle(self, *args, **options):
        # Create a farmer user
        farmer_user, created = User.objects.get_or_create(
            username='farmer1',
            defaults={
                'email': 'farmer@hydronia.com',
                'first_name': 'John',
                'last_name': 'Farmer',
                'role': 'FARMER'
            }
        )
        if created:
            farmer_user.set_password('password123')
            farmer_user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Created farmer user: {farmer_user.username}')
            )
        else:
            self.stdout.write(f'Farmer user already exists: {farmer_user.username}')

        # Create a developer user
        dev_user, created = User.objects.get_or_create(
            username='dev1',
            defaults={
                'email': 'dev@hydronia.com',
                'first_name': 'Jane',
                'last_name': 'Developer',
                'role': 'DEV'
            }
        )
        if created:
            dev_user.set_password('password123')
            dev_user.save()
            self.stdout.write(
                self.style.SUCCESS(f'Created developer user: {dev_user.username}')
            )
        else:
            self.stdout.write(f'Developer user already exists: {dev_user.username}')

        self.stdout.write(
            self.style.SUCCESS('\nTest users created successfully!')
        )
        self.stdout.write('Farmer login: farmer1 / password123')
        self.stdout.write('Developer login: dev1 / password123')
