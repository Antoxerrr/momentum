#!/bin/sh

python momentum/manage.py collectstatic --no-input
python momentum/manage.py migrate

exec "$@"