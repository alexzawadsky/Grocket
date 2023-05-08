import stripe
from django.conf import settings
from django.http import HttpResponse

stripe.api_key=settings.STRIPE_PRIVATE_KEY

def create_payment_view(request):
    promotions = request.body
    checkout_session = stripe.checkout.Session.create(
        line_items=[
            #TODO: promotions from DB
            {
                'price': 'price_1N4kDLE5e9FltXO2qv22DSj0',
                'quantity': 1,
            },
        ],
        mode='payment',
        success_url='http://localhost/?success=true',
        cancel_url='http://localhost/?canceled=true',
    )
    print('here 111 111')


    return HttpResponse(checkout_session.url, status=303)