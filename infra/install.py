import argparse
import os
import subprocess

BACKEND_URL = '../backend'
GROCKET_URL = '../backend/Grocket'
# PYTHON = '../backend/venv/Scripts/pip'


class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def make_venv():
    print()
    print(bcolors.OKBLUE + 'Создаем виртуальное окружение...' + bcolors.ENDC)
    is_venv_folder = os.path.isdir(f'{BACKEND_URL}/venv')

    if not is_venv_folder:
        subprocess.run(
            f'python -m {BACKEND_URL}/venv venv',
            shell=True
        )

    subprocess.run(
            f'source {BACKEND_URL}/venv/Scripts/activate',
            shell=True
        )


def install_requirements():
    print()
    print(bcolors.OKBLUE + 'Устанавливаем зависимости...' + bcolors.ENDC)
    subprocess.run(
        f'python -m pip install --upgrade pip',
        shell=True
    )
    subprocess.run(
        f'pip install -r {GROCKET_URL}/requirements.txt',
        shell=True
    )


def migrate():
    print()
    print(bcolors.OKBLUE + 'Добавляем миграции в бд...' + bcolors.ENDC)
    subprocess.run(
        f'python {GROCKET_URL}/manage.py migrate',
        shell=True
    )


def makemigrations():
    print()
    print(bcolors.OKBLUE + 'Создаем миграции...' + bcolors.ENDC)
    subprocess.run(
        f'python {GROCKET_URL}/manage.py makemigrations users products comments',
        shell=True
    )


def load_data(test=False):
    print()
    print(bcolors.OKBLUE + 'Добавляем данные...' + bcolors.ENDC)
    name = 'test_data.json' if test else 'static_data.json'
    subprocess.run(
        f'python {GROCKET_URL}/manage.py '
        f'loaddatautf8 {GROCKET_URL}/data/json/{name}',
        shell=True
    )


def start_docker(test=False):
    print()
    print(bcolors.OKBLUE + 'Собираем контейнеры...' + bcolors.ENDC)
    subprocess.run(
        'docker-compose up -d --build',
        shell=True
    )
    subprocess.run(
        'docker-compose exec web python manage.py makemigrations users products comments',
        shell=True
    )
    subprocess.run(
        'docker-compose exec web python manage.py migrate',
        shell=True
    )
    name = 'test_data.json' if test else 'static_data.json'
    subprocess.run(
        f'docker-compose exec web python manage.py loaddatautf8 data/json/{name}',
        shell=True
    )
    subprocess.run(
        'docker-compose exec web python manage.py collectstatic',
        shell=True
    )


def parse_arguments(parser):
    parser.add_argument(
        '-d',
        '--docker',
        action='store_true',
        help='Создать докер контейнеры'
    )
    parser.add_argument(
        '-l',
        '--local',
        action='store_true',
        help='Подготовить проект локально'
    )
    parser.add_argument(
        '-t',
        '--test',
        action='store_true',
        help=('Добавить тестовые данные '
              '(основные данные будут добавлены в любом случае)')
    )

    args = parser.parse_args()
    return args


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='')
    args = parse_arguments(parser)

    docker = args.docker
    local = args.local
    test = args.test

    if local:
        # make_venv()
        # install_requirements()
        # makemigrations()
        # migrate()
        # load_data(test=test)
        exit('Локальная установка в разработке :(')

    if docker:
        start_docker(test=test)
