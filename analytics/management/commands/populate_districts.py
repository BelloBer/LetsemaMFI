from django.core.management.base import BaseCommand
from analytics.models import LesothoDistrict

class Command(BaseCommand):
    help = 'Populates Lesotho districts with their data'

    def handle(self, *args, **kwargs):
        districts = [
            ('BERA', 'Berea', 'BER', 250000, 2222),
            ('BUTHA', 'Butha-Buthe', 'BUT', 120000, 1767),
            ('LERIBE', 'Leribe', 'LER', 300000, 2828),
            ('MAFETENG', 'Mafeteng', 'MAF', 200000, 2119),
            ('MASERU', 'Maseru', 'MAS', 500000, 4279),
            ('MOHALES', 'Mohale\'s Hoek', 'MOH', 180000, 3530),
            ('MOKHOTLONG', 'Mokhotlong', 'MOK', 100000, 4075),
            ('QACHA', 'Qacha\'s Nek', 'QAC', 80000, 2349),
            ('QUTHING', 'Quthing', 'QUT', 120000, 2916),
            ('THABA', 'Thaba-Tseka', 'THA', 150000, 4270),
        ]

        for code, name, short_code, pop, area in districts:
            district, created = LesothoDistrict.objects.get_or_create(
                name=code,
                defaults={
                    'code': short_code,
                    'population': pop,
                    'area': area
                }
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Successfully created district {name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'District {name} already exists')
                ) 