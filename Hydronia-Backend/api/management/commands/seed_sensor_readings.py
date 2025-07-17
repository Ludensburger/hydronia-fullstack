from django.core.management.base import BaseCommand
from api.models import SensorReading
from django.utils import timezone
import random

class Command(BaseCommand):
    help = 'Seed the database with realistic random sensor readings.'

    def handle(self, *args, **options):
        SensorReading.objects.all().delete()
        now = timezone.now()
        rows = [1, 2, 3, 4]
        cycles = [0, 1, 2, 3, 4]
        days_back = 10  # Only 10 readings per row/cycle
        count = 0
        for row in rows:
            for cycle in cycles:
                for day in range(days_back):
                    timestamp = now - timezone.timedelta(days=days_back - day)
                    ph = round(random.uniform(6.0, 6.5), 2)  # pH optimal range
                    ec = round(random.uniform(1.2, 2.2), 2)  # EC typical for lettuce
                    temperature = round(random.uniform(20, 25), 1)  # °C
                    humidity = round(random.uniform(60, 70), 1)  # %
                    tph = round(random.uniform(500, 800), 1)  # TPH optimal range
                    SensorReading.objects.create(
                        row=row,
                        cycle=cycle,
                        timestamp=timestamp,
                        ph=ph,
                        ec=ec,
                        temperature=temperature,
                        humidity=humidity,
                        tph=tph
                    )
                    count += 1
        self.stdout.write(self.style.SUCCESS(f'Seeded {count} sensor readings.'))
