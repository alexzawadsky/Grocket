FROM python:3.11-slim

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y gettext
RUN pip3 install -r requirements.txt --no-cache-dir
CMD ["gunicorn", "grocket.wsgi:application", "--bind", "0:8000" ]
