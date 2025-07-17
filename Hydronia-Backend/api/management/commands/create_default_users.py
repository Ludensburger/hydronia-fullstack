from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from api.models import UserProfile

User = get_user_model()

class Command(BaseCommand):
    help = 'Create default users: dev1 (DEV role), farmer1 (FARMER role), and admin (superuser)'

    def handle(self, *args, **options):
        # Create dev1 user
        if not User.objects.filter(username='dev1').exists():
            dev_user = User.objects.create_user(
                username='dev1',
                password='123456',
                email='dev1@hydronia.com',
                first_name='Dev',
                last_name='User'
            )
            UserProfile.objects.create(
                user=dev_user,
                role='DEV'
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created dev user: {dev_user.username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Dev user "dev1" already exists')
            )

        # Create farmer1 user
        if not User.objects.filter(username='farmer1').exists():
            farmer_user = User.objects.create_user(
                username='farmer1',
                password='123456',
                email='farmer1@hydronia.com',
                first_name='Farmer',
                last_name='User'
            )
            UserProfile.objects.create(
                user=farmer_user,
                role='FARMER'
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created farmer user: {farmer_user.username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Farmer user "farmer1" already exists')
            )

        # Create admin superuser
        if not User.objects.filter(username='admin').exists():
            admin_user = User.objects.create_superuser(
                username='admin',
                password='admin',
                email='admin@hydronia.com',
                first_name='Admin',
                last_name='User'
            )
            UserProfile.objects.create(
                user=admin_user,
                role='ADMIN'
            )
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created admin superuser: {admin_user.username}')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Admin superuser "admin" already exists')
            )

        self.stdout.write(
            self.style.SUCCESS('Default user creation completed!')
        )