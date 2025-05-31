import os
import sys

from django.core.asgi import get_asgi_application

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, os.path.dirname(CURRENT_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'momentum.settings.prod')

application = get_asgi_application()
