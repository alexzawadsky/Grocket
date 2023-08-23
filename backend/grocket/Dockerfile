FROM python:3.11-slim

WORKDIR /app
COPY . .
RUN apt-get update && apt-get install -y gettext
RUN pip3 install -r requirements.txt --no-cache-dir
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "grocket.asgi:application"]