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
        start_month = 5
        start_year = now.year
        start_date = timezone.datetime(start_year, start_month, 1, tzinfo=timezone.get_current_timezone())
        days_range = (now - start_date).days + 1  # Include today
        count = 0

        for day in range(days_range):
            current_date = start_date + timezone.timedelta(days=day)

            # Randomly decide how many entries to create for this day (up to 3)
            num_entries = random.randint(1, 3)

            for _ in range(num_entries):
                row = random.choice(rows)
                cycle = random.choice(cycles)

                # Randomize the time of day
                random_hour = random.randint(0, 23)
                random_minute = random.randint(0, 59)
                random_second = random.randint(0, 59)

                # Create a new timestamp for each entry
                timestamp = timezone.make_aware(
                    timezone.datetime(
                        current_date.year,
                        current_date.month,
                        current_date.day,
                        random_hour,
                        random_minute,
                        random_second
                    ),
                    timezone.get_current_timezone()
                )

                ph = round(random.uniform(6.0, 6.5), 2)
                ec = round(random.uniform(1.2, 2.2), 2)
                temperature = round(random.uniform(20, 25), 1)
                humidity = round(random.uniform(60, 70), 1)
                tph = round(random.uniform(500, 800), 1)

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
