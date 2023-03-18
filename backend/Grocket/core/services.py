from django.db.models import QuerySet, Manager, Model
from django.shortcuts import get_object_or_404


class CommonService:
    objects: Manager = ...
    model: Model = ...

    def _get_filtered_objects(self, **kwargs) -> QuerySet:
        return self.objects.filter(**kwargs)

    def _get_object_or_404(self, **kwargs):
        return get_object_or_404(self.model_class, **kwargs)
