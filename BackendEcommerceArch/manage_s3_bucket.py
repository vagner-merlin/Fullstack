"""
Script para listar y crear bucket S3
"""
import boto3
from botocore.exceptions import ClientError
from decouple import config

# Cargar credenciales
AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY')
AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
AWS_S3_REGION_NAME = config('AWS_S3_REGION_NAME', default='us-east-1')

def list_buckets():
    """Lista todos los buckets disponibles"""
    print("🔍 Listando todos los buckets disponibles...")
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_S3_REGION_NAME
        )
        
        response = s3_client.list_buckets()
        
        if 'Buckets' in response and len(response['Buckets']) > 0:
            print(f"\n✅ Encontrados {len(response['Buckets'])} buckets:")
            for bucket in response['Buckets']:
                print(f"  📦 {bucket['Name']}")
            return response['Buckets']
        else:
            print("❌ No se encontraron buckets")
            return []
            
    except ClientError as e:
        print(f"❌ Error: {e}")
        return []

def create_bucket():
    """Crea el bucket si no existe"""
    print(f"\n🔨 Intentando crear bucket: {AWS_STORAGE_BUCKET_NAME}")
    
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_S3_REGION_NAME
        )
        
        # Crear bucket
        if AWS_S3_REGION_NAME == 'us-east-1':
            # us-east-1 no requiere LocationConstraint
            s3_client.create_bucket(Bucket=AWS_STORAGE_BUCKET_NAME)
        else:
            s3_client.create_bucket(
                Bucket=AWS_STORAGE_BUCKET_NAME,
                CreateBucketConfiguration={'LocationConstraint': AWS_S3_REGION_NAME}
            )
        
        print(f"✅ Bucket '{AWS_STORAGE_BUCKET_NAME}' creado exitosamente")
        
        # Configurar política de acceso público (opcional)
        print("\n🔧 Configurando política de acceso público...")
        
        # Desbloquear acceso público
        s3_client.delete_public_access_block(Bucket=AWS_STORAGE_BUCKET_NAME)
        
        # Política para permitir lectura pública de objetos
        bucket_policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "PublicReadGetObject",
                    "Effect": "Allow",
                    "Principal": "*",
                    "Action": "s3:GetObject",
                    "Resource": f"arn:aws:s3:::{AWS_STORAGE_BUCKET_NAME}/*"
                }
            ]
        }
        
        import json
        s3_client.put_bucket_policy(
            Bucket=AWS_STORAGE_BUCKET_NAME,
            Policy=json.dumps(bucket_policy)
        )
        
        print("✅ Política de acceso público configurada")
        
        # Configurar CORS
        print("\n🔧 Configurando CORS...")
        cors_configuration = {
            'CORSRules': [{
                'AllowedHeaders': ['*'],
                'AllowedMethods': ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                'AllowedOrigins': ['*'],
                'ExposeHeaders': ['ETag'],
                'MaxAgeSeconds': 3000
            }]
        }
        
        s3_client.put_bucket_cors(
            Bucket=AWS_STORAGE_BUCKET_NAME,
            CORSConfiguration=cors_configuration
        )
        
        print("✅ CORS configurado")
        
        return True
        
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code == 'BucketAlreadyOwnedByYou':
            print(f"⚠️  El bucket '{AWS_STORAGE_BUCKET_NAME}' ya existe y es tuyo")
            return True
        elif error_code == 'BucketAlreadyExists':
            print(f"❌ El bucket '{AWS_STORAGE_BUCKET_NAME}' ya existe (propiedad de otro usuario)")
            return False
        else:
            print(f"❌ Error al crear bucket: {e}")
            return False
    
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return False

def check_bucket_exists():
    """Verifica si el bucket existe"""
    try:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
            region_name=AWS_S3_REGION_NAME
        )
        
        s3_client.head_bucket(Bucket=AWS_STORAGE_BUCKET_NAME)
        return True
    except ClientError:
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🪣 GESTIÓN DE BUCKET S3")
    print("=" * 60)
    print(f"\nBucket configurado: {AWS_STORAGE_BUCKET_NAME}")
    print(f"Región: {AWS_S3_REGION_NAME}")
    
    # Listar buckets existentes
    buckets = list_buckets()
    
    # Verificar si el bucket configurado existe
    print(f"\n🔍 Verificando bucket '{AWS_STORAGE_BUCKET_NAME}'...")
    if check_bucket_exists():
        print(f"✅ El bucket '{AWS_STORAGE_BUCKET_NAME}' existe y es accesible")
    else:
        print(f"❌ El bucket '{AWS_STORAGE_BUCKET_NAME}' no existe")
        
        # Preguntar si crear
        respuesta = input("\n¿Deseas crear el bucket? (s/n): ")
        if respuesta.lower() == 's':
            if create_bucket():
                print("\n✅ ¡Bucket creado y configurado exitosamente!")
            else:
                print("\n❌ No se pudo crear el bucket")
                print("\n💡 Sugerencias:")
                print("   1. Verifica que el nombre del bucket sea único globalmente")
                print("   2. Intenta con otro nombre en el archivo .env")
                print("   3. Verifica que tus credenciales AWS tengan permisos para crear buckets")
        else:
            print("\n⚠️  No se creó el bucket. Actualiza AWS_STORAGE_BUCKET_NAME en .env con un bucket existente")
