#!/bin/bash

python manage.py migrate

echo ""

python manage.py loaddatautf8 data/json/categories.json
python manage.py loaddatautf8 data/json/promotions.json
python manage.py loaddatautf8 data/json/statuses.json
python manage.py loaddatautf8 data/json/users.json
