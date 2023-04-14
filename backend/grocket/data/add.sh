#!/bin/bash

python3 manage.py migrate

echo ""

python3 manage.py loaddatautf8 data/json/categories.json
python3 manage.py loaddatautf8 data/json/promotions.json
python3 manage.py loaddatautf8 data/json/statuses.json
python3 manage.py loaddatautf8 data/json/users.json
