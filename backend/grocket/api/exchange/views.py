from django.http.response import JsonResponse
from exchange.services import ExchangeRateService


def exchange(request, code):
    service = ExchangeRateService(key=code)
    rate = service.get_exchange_rate()
    return JsonResponse({"rate": rate})
