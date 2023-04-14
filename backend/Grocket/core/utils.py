import logging

from django.http.response import Http404


def http_404_logger(func):
    def wrapper(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
        except Http404 as error:
            logging.debug(error)
            raise
        return result

    return wrapper
