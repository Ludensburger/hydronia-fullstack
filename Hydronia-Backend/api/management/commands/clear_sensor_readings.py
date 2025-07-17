from django.core.management.base import BaseCommand
from api.models import SensorReading

class Command(BaseCommand):
    help = 'Clear all sensor readings from the database.'

    def handle(self, *args, **options):
        deleted, _ = SensorReading.objects.all().delete()
        self.stdout.write(self.style.SUCCESS(f'Deleted {deleted} sensor readings.'))
