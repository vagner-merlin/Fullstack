"""
Script para REINICIAR el servidor Django y verificar S3
"""
import subprocess
import sys
import os

print("=" * 60)
print("🔄 REINICIO DEL SERVIDOR DJANGO")
print("=" * 60)

print("\n📋 Instrucciones:")
print("1. Detén el servidor Django actual (Ctrl+C en la terminal donde corre)")
print("2. Ejecuta este comando en la terminal del backend:")
print("   python manage.py runserver")
print("\n3. Una vez reiniciado, ejecuta este script de prueba:")
print("   python test_complete_s3.py")
print("\n" + "=" * 60)
print("⚠️  IMPORTANTE: El servidor DEBE reiniciarse para cargar .env")
print("=" * 60)
