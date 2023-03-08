import csv
import random

from django.conf import settings
from django.core.management.base import BaseCommand

from products.models import Category, Product, Promotion
from users.models import User

url = settings.CSV_URL


class Command(BaseCommand):
    """Загрузка объектов из CSV в БД."""

    local_data = {
        'categories': {'added': []},
        'promotions': {'added': [], 'missed': []},
        'users': {'added': [], 'missed': []},
        'products': {'added': []}
    }

    def parsing_caregories(self, string):
        title, parent, category_id = string

        if parent.isdigit():
            parent = int(parent)
        elif parent == 'null':
            parent = None
        else:
            raise TypeError(
                'parent_id может быть только числом и null')

        if category_id.isdigit():
            category_id = int(category_id)
        else:
            raise TypeError(
                'category_id может быть только числом')

        title = str(title)

        return title, parent, category_id

    def load_categories(self):
        with open(
            f'{url}/categories.csv', newline='', encoding="utf-8"
        ) as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
            next(spamreader)

            categories = {}
            for string in spamreader:
                title, parent, category_id = self.parsing_caregories(string)

                if category_id not in categories.keys():
                    if parent is None:
                        if not Category.objects.filter(title=title).exists():
                            category = Category.objects.create(title=title)
                        else:
                            return f'Категория с title={title} уже есть в бд.'
                    elif parent in categories.keys():
                        parent_category = categories[parent]
                        if not Category.objects.filter(title=title).exists():
                            category = Category.objects.create(
                                title=title,
                                parent=parent_category
                            )
                        else:
                            return f'Категория с title={title} уже есть в бд.'
                    else:
                        return (f'Нет категории с id={parent}'
                                f' или она идет дальше в списке.')
                    categories[category_id] = category
                    self.local_data['categories']['added'].append(category)
                else:
                    return f'Категория с id={category_id} уже соществует'

    def parsing_promotions(self, string):
        name, title, price, price_currency, description = string

        fields = {
            'name': name,
            'title': title,
            'price': price,
            'price_currency': price_currency,
            'description': description
        }

        return fields

    def load_promotions(self):
        with open(
            f'{url}/promotions.csv', newline='', encoding="utf-8"
        ) as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
            next(spamreader)

            for string in spamreader:
                fields = self.parsing_promotions(string)

                if not Promotion.objects.filter(name=fields['name']).exists():
                    promotion = Promotion.objects.create(
                        name=fields['name'],
                        title=fields['title'],
                        price=fields['price'],
                        price_currency=fields['price_currency'],
                        description=fields['description'],
                    )
                    self.local_data['promotions']['added'].append(promotion)
                else:
                    self.local_data['promotions']['missed'].append(
                        fields['name']
                    )

    def parsing_users(self, string):
        (first_name, last_name, email, phone,
         country, username, password, is_staff) = string

        if is_staff == '1':
            is_staff = True
        elif is_staff == '0':
            is_staff = False
        else:
            raise ValueError(
                f'Значение is_staff может быть 1 и 0. Принято: {is_staff}')

        fields = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'phone': phone,
            'country': country,
            'username': username,
            'password': password,
            'is_staff': is_staff,
        }

        return fields

    def load_users(self):
        with open(
            f'{url}/users.csv', newline='', encoding="utf-8"
        ) as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
            next(spamreader)

            for string in spamreader:
                fields = self.parsing_users(string)

                if not User.objects.filter(
                    username=fields['username']
                ).exists():
                    user = User.objects.create_superuser(
                        first_name=fields['first_name'],
                        last_name=fields['last_name'],
                        email=fields['email'],
                        phone=fields['phone'],
                        country=fields['country'],
                        username=fields['username'],
                        password=fields['password'],
                        is_staff=fields['is_staff'],
                    )
                    self.local_data['users']['added'].append(user)
                else:
                    self.local_data['users']['missed'].append(
                        fields['username']
                    )

    def parsing_products(self, string):
        (name, description, price, price_currency,
         address, is_archived, is_sold) = string

        if is_archived == '1':
            is_archived = True
        elif is_archived == '0':
            is_archived = False
        else:
            raise ValueError(
                'Значение is_archived может быть 1 и 0. '
                f'Принято: {is_archived}'
            )

        if is_sold == '1':
            is_sold = True
        elif is_sold == '0':
            is_sold = False
        else:
            raise ValueError(
                'Значение is_sold может быть 1 и 0. '
                f'Принято: {is_sold}'
            )

        fields = {
            'name': name,
            'description': description,
            'price': price,
            'price_currency': price_currency,
            'address': address,
            'is_archived': is_archived,
            'is_sold': is_sold
        }

        return fields

    def load_products(self):
        with open(
            f'{url}/products.csv', newline='', encoding="utf-8"
        ) as csvfile:
            spamreader = csv.reader(csvfile, delimiter=',', quotechar='|')
            next(spamreader)

            users = self.local_data['users']['added']
            if not users:
                users = User.objects.all()
                if not users.exists():
                    raise ValueError(
                        'Необходимо добавить хотябы одного '
                        f'пользователя в {url}/users.csv или БД.'
                    )
            promotions = self.local_data['promotions']['added']
            if not promotions:
                promotions = Promotion.objects.all()
                if not promotions.exists():
                    promotions = None
            categories = self.local_data['categories']['added']
            if not categories:
                categories = Category.objects.all()
                if not categories.exists():
                    raise ValueError(
                        'Необходимо добавить хотябы одну категорию '
                        f'в {url}/categories.csv или БД.'
                    )

            for string in spamreader:
                fields = self.parsing_products(string)

                category = random.choice(categories)
                while not category.is_leaf_node():
                    category = random.choice(categories)
                user = random.choice(users)
                if promotions is not None:
                    promotion = random.choice(promotions)
                else:
                    promotion = None

                product = Product.objects.create(
                    name=fields['name'],
                    description=fields['description'],
                    price=fields['price'],
                    price_currency=fields['price_currency'],
                    address=fields['address'],
                    is_archived=fields['is_archived'],
                    is_sold=fields['is_sold'],
                    category=category,
                    user=user,
                    promotion=promotion
                )

                self.local_data['products']['added'].append(product)

    def print_categories(self):
        added = ', '.join(list(map(
            lambda category: category.title,
            self.local_data["categories"]["added"])
        ))

        print('Categories:')
        print(f'  Added: {added}')

    def print_promotions(self):
        added = ', '.join(list(map(
            lambda promotion: promotion.name,
            self.local_data["promotions"]["added"])
        ))
        missed = ", ".join(self.local_data["promotions"]["missed"])

        print('Promotions:')
        print(f'  Added: {added}')
        print(f'  Missed: {missed}')

    def print_users(self):
        added = ', '.join(list(map(
            lambda user: user.username,
            self.local_data["users"]["added"])
        ))
        missed = ", ".join(self.local_data["users"]["missed"])

        print('Users:')
        print(f'  Added: {added}')
        print(f'  Missed: {missed}')

    def print_products(self):
        added = ', '.join(list(map(
            lambda product: product.name,
            self.local_data["products"]["added"])
        ))

        print('Products:')
        print(f'  Added: {added}')

    def handle(self, *args, **options):
        categories = options['categories']
        promotions = options['promotions']
        users = options['users']

        if categories:
            message = self.load_categories()
            if message is not None:
                print(f'Error: {message}')
            self.print_categories()
        if promotions:
            self.load_promotions()
            self.print_promotions()
        if users:
            self.load_users()
            self.print_users()

        if not any([categories, promotions, users]):
            message = self.load_categories()
            if message is not None:
                print(f'Error: {message}')
            self.print_categories()
            self.load_promotions()
            self.print_promotions()
            self.load_users()
            self.print_users()
            self.load_products()
            self.print_products()

    def add_arguments(self, parser):
        parser.add_argument(
            '-c',
            '--categories',
            action='store_true',
            help='Добавить в БД категории.'
        )
        parser.add_argument(
            '-p',
            '--promotions',
            action='store_true',
            help='Добавить в БД типы продвижения.'
        )
        parser.add_argument(
            '-u',
            '--users',
            action='store_true',
            help='Добавить в БД тестовых юзеров.'
        )
