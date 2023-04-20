import random
import time
from typing import Dict, Optional

from django.conf import settings
from django.http.response import Http404
from redis import Redis

EXCHANGE = settings.EXCHANGE


class ExchangeRateService:
    """Работает с конвертацией валют с помощью Redis и api курсов валют."""

    def __init__(self, key: str) -> None:
        self.key = self._check_currencies(key=key.lower())

    def _check_currencies(self, key: str) -> str:
        """Проверяет, что данная валюта поддерживается."""
        if not key in EXCHANGE["CURRENCIES"]:
            raise Http404()
        return key

    def _get_redis_currency(self) -> Optional[Dict[float, int]]:
        """
        Достанет из redis значения по ключу:
        {
            "exchange_rate": float,
            "add_time": int
        }
        """
        with Redis(**EXCHANGE["REDIS"]) as r:
            exchange_rate = r.hget(self.key, "rate")
            add_time = r.hget(self.key, "time")

            if exchange_rate is not None and add_time is not None:
                return {
                    "exchange_rate": float(exchange_rate),
                    "add_time": int(add_time),
                }

    def _add_redis_currency(self, rate: float, now: int) -> None:
        """
        Добавит в redis на ключ `key` значения:
        `rate`: данный курс в float,
        `time`: данное время в UNIX в int
        """
        with Redis(**EXCHANGE["REDIS"]) as r:
            r.hset(self.key, "rate", rate)
            r.hset(self.key, "time", now)

    def _get_api_currency(self) -> float:
        """
        Должен брать курс с апи, но пока что выбирает рандомное float число от 0 до 1.
        Потом будет отдавать отношения данной валюты к $.
        """
        return random.uniform(0, 1)

    def get_exchange_rate(self) -> float:
        """
        Решает брать ли курс с redis или с api.
        Если с redis ничего не пришло, то берет из api и записывает в redis.
        Если в redis есть курс этой валюты и время ее действия не истекло, то вернет из redis.
        Если время действия валюты истекло, то берет из api и записывает в redis.
        Время берется в системе UNIX.
        """
        redis_currency = self._get_redis_currency()
        now = int(time.time())

        if redis_currency is not None:
            if (redis_currency["add_time"] + EXCHANGE["EXPIRE_TIME"]) >= now:
                return redis_currency["exchange_rate"]

        api_rate = self._get_api_currency()
        self._add_redis_currency(rate=api_rate, now=now)
        return api_rate
