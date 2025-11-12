# API de Imágenes S3 - Documentación

## Descripción General
Este documento describe las APIs creadas específicamente para manejar imágenes de productos almacenadas en Amazon S3.

## APIs Disponibles

### 1. ImageUploadAPIView - Subir Imágenes
**URL:** `/api/productos/upload-imagen/`
**Métodos:** `POST`, `GET`

#### POST - Subir imagen a S3
Sube una imagen directamente a S3 y crea el registro en la base de datos.

**Parámetros:**
- `imagen`: Archivo de imagen (requerido)
- `Producto_categoria`: ID de la variante del producto (requerido)
- `texto`: Descripción de la imagen (opcional)
- `es_principal`: Si es la imagen principal (opcional, default: false)

**Ejemplo de uso:**
```javascript
const formData = new FormData();
formData.append('imagen', file);
formData.append('Producto_categoria', '1');
formData.append('texto', 'Imagen frontal del producto');
formData.append('es_principal', 'true');

fetch('/api/productos/upload-imagen/', {
    method: 'POST',
    body: formData,
    headers: {
        'Authorization': 'Token tu_token_aqui'
    }
})
```

#### GET - Información de configuración S3
Devuelve información sobre la configuración actual de S3.

### 2. ImageDisplayAPIView - Mostrar Imágenes
**URL:** `/api/productos/mostrar-imagenes/`
**Método:** `GET`

#### Obtener imágenes con filtros
Esta es la API principal para mostrar imágenes en tu frontend.

**Parámetros de consulta opcionales:**
- `producto_categoria`: ID de la variante del producto
- `producto`: ID del producto
- `categoria`: ID de la categoría
- `principal`: 'true' para solo imágenes principales
- `imagen_id`: ID específico de una imagen

**Ejemplos de uso:**

1. **Obtener todas las imágenes:**
```
GET /api/productos/mostrar-imagenes/
```

2. **Obtener imágenes de un producto específico:**
```
GET /api/productos/mostrar-imagenes/?producto=1
```

3. **Obtener solo imágenes principales:**
```
GET /api/productos/mostrar-imagenes/?principal=true
```

4. **Obtener imágenes de una variante específica:**
```
GET /api/productos/mostrar-imagenes/?producto_categoria=5
```

5. **Obtener una imagen específica:**
```
GET /api/productos/mostrar-imagenes/?imagen_id=3
```

**Respuesta JSON:**
```json
{
    "success": true,
    "count": 2,
    "imagenes": [
        {
            "id": 1,
            "imagen_url": "https://tu-bucket.s3.amazonaws.com/productos/imagen1.jpg",
            "imagen_name": "productos/imagen1.jpg",
            "texto": "Imagen frontal del producto",
            "es_principal": true,
            "producto_categoria_id": 1,
            "producto_info": {
                "id": 1,
                "nombre": "Camiseta Deportiva",
                "descripcion": "Camiseta para deportes",
                "activo": true,
                "peso": 0.25
            },
            "categoria_info": {
                "id": 1,
                "nombre": "Ropa Deportiva",
                "descripcion": "Ropa para hacer ejercicio"
            },
            "variante_info": {
                "color": "Azul",
                "talla": "M",
                "capacidad": null,
                "precio_variante": 25.99,
                "precio_unitario": 25.99,
                "stock": 10,
                "fecha_creacion": "2024-01-15T10:30:00Z"
            },
            "s3_info": {
                "storage_backend": "S3Boto3Storage",
                "file_size": 245760,
                "content_type": "image/jpeg"
            }
        }
    ]
}
```

### 3. ImageStatsAPIView - Estadísticas de Imágenes
**URL:** `/api/productos/estadisticas-imagenes/`
**Método:** `GET`

#### Obtener estadísticas generales
Devuelve estadísticas sobre las imágenes almacenadas.

**Respuesta JSON:**
```json
{
    "success": true,
    "estadisticas": {
        "total_imagenes": 25,
        "imagenes_principales": 8,
        "imagenes_secundarias": 17,
        "productos_con_imagenes": 8,
        "categorias_con_imagenes": 3,
        "storage_backend": "S3Boto3Storage"
    }
}
```

## Casos de Uso en Frontend

### 1. Mostrar catálogo de productos con imágenes principales
```javascript
// Obtener solo imágenes principales para el catálogo
const response = await fetch('/api/productos/mostrar-imagenes/?principal=true');
const data = await response.json();

data.imagenes.forEach(imagen => {
    console.log(`Producto: ${imagen.producto_info.nombre}`);
    console.log(`Imagen: ${imagen.imagen_url}`);
    console.log(`Precio: $${imagen.variante_info.precio_variante}`);
});
```

### 2. Galería de imágenes de un producto específico
```javascript
// Obtener todas las imágenes de un producto
const productId = 1;
const response = await fetch(`/api/productos/mostrar-imagenes/?producto=${productId}`);
const data = await response.json();

// Crear galería de imágenes
const gallery = data.imagenes.map(imagen => ({
    src: imagen.imagen_url,
    alt: imagen.texto,
    isPrincipal: imagen.es_principal,
    variante: `${imagen.variante_info.color} - ${imagen.variante_info.talla}`
}));
```

### 3. Imagen de producto en carrito
```javascript
// Obtener imagen de una variante específica para el carrito
const varianteId = 5;
const response = await fetch(`/api/productos/mostrar-imagenes/?producto_categoria=${varianteId}&principal=true`);
const data = await response.json();

if (data.imagenes.length > 0) {
    const imagen = data.imagenes[0];
    const cartItem = {
        name: imagen.producto_info.nombre,
        image: imagen.imagen_url,
        price: imagen.variante_info.precio_variante,
        variant: `${imagen.variante_info.color} - ${imagen.variante_info.talla}`,
        stock: imagen.variante_info.stock
    };
}
```

## Ventajas de esta API

1. **Específica para S3:** Diseñada específicamente para trabajar con imágenes almacenadas en S3
2. **Información completa:** Devuelve no solo la URL de la imagen, sino también información del producto, categoría y variante
3. **Filtros flexibles:** Permite filtrar por producto, categoría, variante o tipo de imagen
4. **Pública:** No requiere autenticación para ver imágenes (ideal para catálogo público)
5. **Optimizada:** Incluye select_related para evitar consultas N+1
6. **Manejo de errores:** Respuestas consistentes con manejo de errores
7. **Debug friendly:** Incluye información de S3 para debugging

## Notas Importantes

- Todas las URLs de imágenes son directas a S3, no pasan por el servidor Django
- Las imágenes principales tienen prioridad en el ordenamiento
- La API es pública para permitir que los clientes vean el catálogo sin autenticación
- Los campos de texto descriptivo están disponibles para SEO y accesibilidad
- La información de stock está incluida para validaciones en tiempo real