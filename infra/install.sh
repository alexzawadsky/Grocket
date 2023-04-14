#!/bin/bash

red="\e[0;91m"
blue="\e[0;94m"
expand_bg="\e[K"
blue_bg="\e[0;104m${expand_bg}"
red_bg="\e[0;101m${expand_bg}"
green_bg="\e[0;102m${expand_bg}"
green="\e[0;92m"
white="\e[0;97m"
bold="\e[1m"
uline="\e[4m"
reset="\e[0m"


echo -e "${green}${uline}${bold}STARTING DOCKER...${reset}"
docker-compose up -d --build
echo -e "\n"

echo -e "${green}${uline}${bold}Deleting old database...${reset}"
docker-compose exec web rm db.sqlite3
echo -e "\n"

echo -e "${green}${uline}${bold}Making migrations...${reset}"
docker-compose exec web python manage.py makemigrations users products comments
echo -e "\n"

echo -e "${green}${uline}${bold}Migrating...${reset}"
docker-compose exec web python manage.py migrate
echo -e "\n"

echo -e "${green}${uline}${bold}Collecting ctatic files...${reset}"
docker-compose exec web python manage.py collectstatic
echo -e "\n"

echo -e "${green}${uline}${bold}Adding data to database...${reset}"
echo -e "${blue}--Categories${reset}"
docker-compose exec web python manage.py loaddatautf8 data/json/categories.json
echo -e "${blue}--Promotions${reset}"
docker-compose exec web python manage.py loaddatautf8 data/json/promotions.json
echo -e "${blue}--Statuses${reset}"
docker-compose exec web python manage.py loaddatautf8 data/json/statuses.json
echo -e "${blue}--Users${reset}"
docker-compose exec web python manage.py loaddatautf8 data/json/users.json
echo -e "\n"

echo -e "${green_bg}${bold}FINISH${reset}"
