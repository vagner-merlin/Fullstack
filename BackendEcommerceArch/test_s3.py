"""
Script para probar la conexión a S3
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project_ecommerce.settings')
django.setup()

import boto3
from django.conf import settings
from botocore.exceptions import ClientError

def test_s3_connection():
    """Prueba la conexión a S3"""
    print("🔍 Probando conexión a AWS S3...")
    print(f"Bucket: {settings.AWS_STORAGE_BUCKET_NAME}")
    print(f"Región: {settings.AWS_S3_REGION_NAME}")
    
    try:
        # Crear cliente S3
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )
        
        # Intentar listar objetos del bucket
        response = s3_client.list_objects_v2(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            MaxKeys=5
        )
        
        print("✅ Conexión exitosa a S3")
        print(f"Objetos en el bucket: {response.get('KeyCount', 0)}")
        
        if 'Contents' in response:
            print("\nPrimeros archivos:")
            for obj in response['Contents'][:5]:
                print(f"  - {obj['Key']}")
        
        # Verificar permisos de escritura
        print("\n🔍 Verificando permisos de escritura...")
        test_key = 'test-upload.txt'
        s3_client.put_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=test_key,
            Body=b'Test upload from Django',
            ContentType='text/plain'
        )
        print(f"✅ Archivo de prueba subido: {test_key}")
        
        # Obtener URL
        url = f"https://{settings.AWS_S3_CUSTOM_DOMAIN}/{test_key}"
        print(f"URL: {url}")
        
        # Eliminar archivo de prueba
        s3_client.delete_object(
            Bucket=settings.AWS_STORAGE_BUCKET_NAME,
            Key=test_key
        )
        print(f"✅ Archivo de prueba eliminado")
        
        return True
        
    except ClientError as e:
        print(f"❌ Error de AWS: {e}")
        error_code = e.response['Error']['Code']
        
        if error_code == 'InvalidAccessKeyId':
            print("   Las credenciales AWS son inválidas")
        elif error_code == 'SignatureDoesNotMatch':
            print("   La firma de la solicitud no coincide")
        elif error_code == 'AccessDenied':
            print("   Acceso denegado al bucket")
        elif error_code == 'NoSuchBucket':
            print("   El bucket no existe")
        
        return False
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

if __name__ == '__main__':
    test_s3_connection()
