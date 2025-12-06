#!/bin/bash

# Salir si ocurre un error
set -e

echo "Ejecutando migraciones..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

echo "Colectando archivos estáticos..."
python manage.py collectstatic --noinput

# Crear superusuario SOLO SI no existe
echo "Verificando existencia de superusuario..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superusuario creado.')
else:
    print('Superusuario ya existe, no se crea.')
EOF

echo "Iniciando servidor Django..."
exec "$@"
