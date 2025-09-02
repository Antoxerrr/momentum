import os
import sys

from django.core.wsgi import get_wsgi_application
from dotenv import load_dotenv

CURRENT_DIR = os.path.abspath(os.path.dirname(__file__))
sys.path.insert(0, os.path.dirname(CURRENT_DIR))

load_dotenv()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'momentum.settings.prod')

application = get_wsgi_application()
