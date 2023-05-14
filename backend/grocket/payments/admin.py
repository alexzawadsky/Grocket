from django.contrib import admin
from .models import StripePromotionsTransaction

@admin.register(StripePromotionsTransaction)
class StripePromotionsTransactionAdmin(admin.ModelAdmin):
    list_display = (
        "pk",
        "pub_date",
        "product"
    )
    search_fields = ("text",)
    list_filter = (
        "product",
        "promotions",
        "pub_date"
    )
    empty_value_display = "-empty-"

    @admin.display(description="text")
    def short_text(self, obj):
        text = obj.text
        max_letters = 15
        return text[:max_letters] + ("..." if len(text) > max_letters else "")
