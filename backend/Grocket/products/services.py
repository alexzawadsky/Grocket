import base64
import io

from django.core.files import File
from django.core.files.base import ContentFile
from django.db.models import Manager, Model
from PIL import Image

from products.models import Product


class ProductService:
    objects: Manager = Product.objects
    model: Model = Product
