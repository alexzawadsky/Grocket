from django.shortcuts import get_object_or_404

from ..models import Product


class BaseProductService:
    def __init__(self, product_id: int) -> None:
        self.product_id: int = product_id
        self.product: Product = self._get_product_or_404(product_id=product_id)

    def _get_product_or_404(self, product_id: int) -> Product:
        return get_object_or_404(Product, id=product_id)
