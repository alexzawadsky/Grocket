import json

import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

from products.models import Product, Promotion

from .models import StripePromotionsTransaction

stripe.api_key=settings.STRIPE_PRIVATE_KEY
endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

@csrf_exempt
def create_payment_view(request, slug):
    body = json.loads(request.body.decode('UTF-8'))

    promotions_queryset = Promotion.objects.filter(id__in=body.get('promotions')).all()

    promotions = [
        {
            "price": promotion.stripe_id, 
            "quantity": 1
        } 
        for promotion in promotions_queryset
    ]

    locales = {
        "zh-hant": "zh",
        "ru": "ru",
        "uk": "ru",
        "en": "en",
        "it": "it",
        "de": "de",
        "sv": "sv",
        "fr": "fr",
        "nl": "nl",
        "pl": "pl"
    }

    product = Product.objects.get(slug=slug)

    checkout_session = stripe.checkout.Session.create(
        line_items=promotions,
        mode='payment',
        success_url=f'{request.headers.get("Origin")}/?success=true',
        cancel_url=f'{request.headers.get("Origin")}/?canceled=true',
        payment_method_types=['card'],
        locale=locales[request.headers.get('Accept-Language')]
    )

    transaction = StripePromotionsTransaction.objects.create(
        stripe_id=checkout_session.id,
        product=product
    )
    transaction.promotions.set(promotions_queryset)
    transaction.save()

    return HttpResponse(checkout_session.url, status=200)


@csrf_exempt
def payment_callback(request):
    
    event = None
    payload = request.body
    sig_header = request.headers['STRIPE_SIGNATURE']

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError as e:
        # Invalid payload
        raise e
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        raise e


    if event.type == 'checkout.session.completed':
        session = event.data.object
        session_id = session.get('id')
        transaction = StripePromotionsTransaction.objects.get(stripe_id=session_id)
        product = transaction.product
        product.promotions.set(transaction.promotions.all())

    return HttpResponse('success')