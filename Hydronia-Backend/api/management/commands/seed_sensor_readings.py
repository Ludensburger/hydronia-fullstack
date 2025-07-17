from django.core.management.base import BaseCommand
from api.models import SensorReading
import datetime
import random

class Command(BaseCommand):
    help = 'Seed the database with hardcoded sensor readings.'

    def handle(self, *_args, **_options):
        SensorReading.objects.all().delete()
        start_date = datetime.datetime(2023, 5, 1)
        end_date = datetime.datetime.now()
        total_seconds = int((end_date - start_date).total_seconds())
        count = 0
        readings_per_row = 10
        for i in range(readings_per_row):
            for cycle in range(5):
                # Random timestamp between start_date and now
                random_seconds = random.randint(0, total_seconds)
                timestamp = start_date + datetime.timedelta(seconds=random_seconds)
                # Row 1: Optimal (random within optimal)
                SensorReading.objects.create(
                    row=1,
                    cycle=cycle,
                    timestamp=timestamp,
                    ph=round(random.uniform(6.0, 6.5), 2),
                    ec=round(random.uniform(1.2, 2.2), 2),
                    temperature=round(random.uniform(22, 24), 1),
                    humidity=round(random.uniform(65, 70), 1),
                    tph=random.randint(500, 800)
                )
                # Row 2: Slightly below optimal
                SensorReading.objects.create(
                    row=2,
                    cycle=cycle,
                    timestamp=timestamp,
                    ph=round(random.uniform(5.5, 5.9), 2),
                    ec=round(random.uniform(0.8, 1.19), 2),
                    temperature=round(random.uniform(19, 21), 1),
                    humidity=round(random.uniform(55, 60), 1),
                    tph=random.randint(300, 499)
                )
                # Row 3: Slightly above optimal
                SensorReading.objects.create(
                    row=3,
                    cycle=cycle,
                    timestamp=timestamp,
                    ph=round(random.uniform(6.6, 7.0), 2),
                    ec=round(random.uniform(2.21, 2.7), 2),
                    temperature=round(random.uniform(25, 28), 1),
                    humidity=round(random.uniform(71, 80), 1),
                    tph=random.randint(801, 1200)
                )
                # Row 4: Far from optimal (over/under)
                SensorReading.objects.create(
                    row=4,
                    cycle=cycle,
                    timestamp=timestamp,
                    ph=round(random.uniform(4.0, 5.0), 2),
                    ec=round(random.uniform(0.2, 0.7), 2),
                    temperature=round(random.uniform(30, 35), 1),
                    humidity=round(random.uniform(35, 50), 1),
                    tph=random.randint(100, 299)
                )
                count += 4
        self.stdout.write(self.style.SUCCESS(f'Seeded {count} sensor readings.'))