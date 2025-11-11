# 🛍️ API de Productos - Documentación Completa

## 🔓 Acceso Público vs Autenticado

### 📖 **APIs PÚBLICAS** (Sin login - Para catálogo):
- ✅ Ver productos y catálogo
- ✅ Ver categorías
- ✅ Ver variantes de productos
- ✅ Ver reseñas de productos
- ✅ Ver imágenes de productos

### 🔐 **APIs AUTENTICADAS** (Con token - Para compras/administración):
- ✅ Crear/editar productos
- ✅ Crear/editar categorías
- ✅ Crear/editar variantes
- ✅ Crear reseñas
- ✅ Gestionar items de pedidos y compras

---

## 📋 APIs Disponibles

## 1. **PRODUCTOS** (`/api/productos/productos/`)

### 1.1 **Listar productos del catálogo** 🔓 PÚBLICO
- **URL**: `GET /api/productos/productos/`
- **Método**: GET
- **Autenticación**: ❌ No requerida
- **Filtros**: `?nombre=camiseta&categoria=1`

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "count": 3,
    "productos": [
        {
            "id": 1,
            "nombre": "Camiseta Básica",
            "descripcion": "Camiseta 100% algodón",
            "activo": true,
            "fecha_creacion": "2025-11-11T10:30:00.123456Z",
            "peso": "0.25"
        },
        {
            "id": 2,
            "nombre": "Pantalón Deportivo",
            "descripcion": "Pantalón cómodo para ejercicio",
            "activo": true,
            "fecha_creacion": "2025-11-10T15:20:00.123456Z",
            "peso": "0.40"
        }
    ]
}
```

### 1.2 **Obtener producto completo con variantes** 🔓 PÚBLICO
- **URL**: `GET /api/productos/productos/{id}/`
- **Método**: GET
- **Autenticación**: ❌ No requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "producto": {
        "id": 1,
        "nombre": "Camiseta Básica",
        "descripcion": "Camiseta 100% algodón",
        "activo": true,
        "fecha_creacion": "2025-11-11T10:30:00.123456Z",
        "peso": "0.25",
        "variantes": [
            {
                "id": 1,
                "producto": 1,
                "categoria": 1,
                "color": "Azul",
                "talla": "M",
                "capacidad": "",
                "precio_variante": "5.00",
                "precio_unitario": "25.99",
                "stock": 50,
                "fecha_creacion": "2025-11-11T10:30:00.123456Z",
                "producto_info": {
                    "id": 1,
                    "nombre": "Camiseta Básica",
                    "descripcion": "Camiseta 100% algodón",
                    "activo": true,
                    "fecha_creacion": "2025-11-11T10:30:00.123456Z",
                    "peso": "0.25"
                },
                "categoria_info": {
                    "id": 1,
                    "nombre": "Ropa",
                    "descripcion": "Categoría de ropa",
                    "activo": true
                },
                "imagenes": [
                    {
                        "id": 1,
                        "Producto_url": "https://ejemplo.com/imagen1.jpg",
                        "texto": "Camiseta azul frontal",
                        "es_principal": true,
                        "Producto_categoria": 1
                    }
                ],
                "imagen_principal": {
                    "id": 1,
                    "Producto_url": "https://ejemplo.com/imagen1.jpg",
                    "texto": "Camiseta azul frontal",
                    "es_principal": true,
                    "Producto_categoria": 1
                }
            }
        ],
        "categorias": [
            {
                "id": 1,
                "nombre": "Ropa",
                "descripcion": "Categoría de ropa",
                "activo": true
            }
        ]
    }
}
```

### 1.3 **Productos destacados** 🔓 PÚBLICO
- **URL**: `GET /api/productos/productos/destacados/`
- **Método**: GET
- **Autenticación**: ❌ No requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "count": 6,
    "productos_destacados": [
        {
            "id": 1,
            "nombre": "Camiseta Básica",
            "descripcion": "Camiseta 100% algodón",
            "activo": true,
            "fecha_creacion": "2025-11-11T10:30:00.123456Z",
            "peso": "0.25"
        }
    ]
}
```

### 1.4 **Variantes de un producto** 🔓 PÚBLICO
- **URL**: `GET /api/productos/productos/{id}/variantes/`
- **Método**: GET
- **Autenticación**: ❌ No requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "producto": "Camiseta Básica",
    "count": 3,
    "variantes": [
        {
            "id": 1,
            "color": "Azul",
            "talla": "M",
            "precio_unitario": "25.99",
            "stock": 50,
            "imagenes": [...],
            "imagen_principal": {...}
        }
    ]
}
```

### 1.5 **Crear producto** 🔐 AUTENTICADO
- **URL**: `POST /api/productos/productos/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "nombre": "Nueva Camiseta",
    "descripcion": "Descripción del producto",
    "peso": "0.30"
}
```

---

## 2. **CATEGORÍAS** (`/api/productos/categorias/`)

### 2.1 **Listar categorías principales** 🔓 PÚBLICO
- **URL**: `GET /api/productos/categorias/`
- **Método**: GET
- **Autenticación**: ❌ No requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "count": 2,
    "categorias": [
        {
            "id": 1,
            "nombre": "Ropa",
            "descripcion": "Categoría principal de ropa",
            "activo": true,
            "id_padre": null,
            "fecha_creacion": "2025-11-10T10:00:00.123456Z",
            "subcategorias": [
                {
                    "id": 3,
                    "nombre": "Camisetas",
                    "descripcion": "Subcategoría de camisetas",
                    "activo": true
                },
                {
                    "id": 4,
                    "nombre": "Pantalones",
                    "descripcion": "Subcategoría de pantalones",
                    "activo": true
                }
            ]
        }
    ]
}
```

### 2.2 **Productos de una categoría** 🔓 PÚBLICO
- **URL**: `GET /api/productos/categorias/{id}/productos/`
- **Método**: GET
- **Autenticación**: ❌ No requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "categoria": "Ropa",
    "count": 5,
    "productos": [
        {
            "id": 1,
            "nombre": "Camiseta Básica",
            "descripcion": "Camiseta 100% algodón",
            "activo": true,
            "fecha_creacion": "2025-11-11T10:30:00.123456Z",
            "peso": "0.25"
        }
    ]
}
```

---

## 3. **VARIANTES DE PRODUCTOS** (`/api/productos/variantes/`)

### 3.1 **Listar todas las variantes** 🔓 PÚBLICO
- **URL**: `GET /api/productos/variantes/`
- **Método**: GET
- **Autenticación**: ❌ No requerida
- **Filtros**: `?producto=1&categoria=1&disponible=true`

#### Respuesta exitosa (200):
```json
{
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "producto": 1,
            "categoria": 1,
            "color": "Azul",
            "talla": "M",
            "capacidad": "",
            "precio_variante": "5.00",
            "precio_unitario": "25.99",
            "stock": 50,
            "fecha_creacion": "2025-11-11T10:30:00.123456Z",
            "producto_info": {...},
            "categoria_info": {...},
            "imagenes": [...],
            "imagen_principal": {...}
        }
    ]
}
```

### 3.2 **Variantes disponibles (con stock)** 🔓 PÚBLICO
- **URL**: `GET /api/productos/variantes/disponibles/`
- **Método**: GET
- **Autenticación**: ❌ No requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "count": 8,
    "variantes": [
        {
            "id": 1,
            "color": "Azul",
            "talla": "M",
            "precio_unitario": "25.99",
            "stock": 50,
            "producto_info": {...}
        }
    ]
}
```

### 3.3 **Crear variante** 🔐 AUTENTICADO
- **URL**: `POST /api/productos/variantes/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "producto": 1,
    "categoria": 1,
    "color": "Rojo",
    "talla": "L",
    "capacidad": "",
    "precio_variante": "3.00",
    "precio_unitario": "28.99",
    "stock": 30
}
```

---

## 4. **RESEÑAS** (`/api/productos/reseñas/`)

### 4.1 **Ver reseñas** 🔓 PÚBLICO
- **URL**: `GET /api/productos/reseñas/`
- **Método**: GET
- **Autenticación**: ❌ No requerida
- **Filtros**: `?producto_variante=1`

#### Respuesta exitosa (200):
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "calificacion": 5,
            "comentario": "Excelente producto, muy cómodo",
            "fecha_reseña": "2025-11-11T14:30:00.123456Z",
            "Producto_categoria": 1,
            "Cliente": 1,
            "cliente_info": {
                "id": 1,
                "telefono": "+1234567890",
                "fecha_creacion": "2025-11-10T10:30:00.123456Z",
                "fecha_nacimiento": "1990-05-15",
                "usuario": 1
            }
        }
    ]
}
```

### 4.2 **Reseñas por producto con estadísticas** 🔓 PÚBLICO
- **URL**: `GET /api/productos/reseñas/por_producto/?producto_variante_id=1`
- **Método**: GET
- **Autenticación**: ❌ No requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "producto_variante_id": "1",
    "total_reseñas": 8,
    "calificacion_promedio": 4.25,
    "reseñas": [
        {
            "id": 1,
            "calificacion": 5,
            "comentario": "Excelente producto",
            "fecha_reseña": "2025-11-11T14:30:00.123456Z",
            "cliente_info": {...}
        }
    ]
}
```

### 4.3 **Crear reseña** 🔐 AUTENTICADO
- **URL**: `POST /api/productos/reseñas/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "calificacion": 5,
    "comentario": "Producto excelente, lo recomiendo",
    "Producto_categoria": 1,
    "Cliente": 1
}
```

---

## 5. **IMÁGENES DE PRODUCTOS** (`/api/productos/imagenes/`)

### 5.1 **Ver imágenes** 🔓 PÚBLICO
- **URL**: `GET /api/productos/imagenes/`
- **Método**: GET
- **Autenticación**: ❌ No requerida
- **Filtros**: `?producto_categoria=1`

#### Respuesta exitosa (200):
```json
{
    "count": 3,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "Producto_url": "https://ejemplo.com/imagen1.jpg",
            "texto": "Vista frontal de la camiseta",
            "es_principal": true,
            "Producto_categoria": 1
        },
        {
            "id": 2,
            "Producto_url": "https://ejemplo.com/imagen2.jpg",
            "texto": "Vista posterior de la camiseta",
            "es_principal": false,
            "Producto_categoria": 1
        }
    ]
}
```

---

## 🔗 Resumen de URLs

### **URLs PÚBLICAS** (Sin autenticación):
```bash
# PRODUCTOS
GET    /api/productos/productos/                    # Catálogo de productos
GET    /api/productos/productos/{id}/               # Producto completo
GET    /api/productos/productos/destacados/         # Productos destacados
GET    /api/productos/productos/{id}/variantes/     # Variantes del producto

# CATEGORÍAS
GET    /api/productos/categorias/                   # Categorías principales
GET    /api/productos/categorias/{id}/              # Categoría específica
GET    /api/productos/categorias/{id}/productos/    # Productos de categoría

# VARIANTES
GET    /api/productos/variantes/                    # Todas las variantes
GET    /api/productos/variantes/{id}/               # Variante específica
GET    /api/productos/variantes/disponibles/        # Solo con stock

# RESEÑAS
GET    /api/productos/reseñas/                      # Todas las reseñas
GET    /api/productos/reseñas/por_producto/         # Reseñas por producto

# IMÁGENES
GET    /api/productos/imagenes/                     # Todas las imágenes
```

### **URLs AUTENTICADAS** (Con token):
```bash
# CRUD COMPLETO para todas las entidades
POST   /api/productos/productos/                    # Crear producto
PUT    /api/productos/productos/{id}/               # Actualizar producto
DELETE /api/productos/productos/{id}/               # Eliminar producto

POST   /api/productos/categorias/                   # Crear categoría
POST   /api/productos/variantes/                    # Crear variante
POST   /api/productos/reseñas/                      # Crear reseña
POST   /api/productos/imagenes/                     # Subir imagen

# Items de pedidos y compras
GET/POST/PUT/DELETE /api/productos/items-pedido/    # Gestionar items pedido
GET/POST/PUT/DELETE /api/productos/items-compras/   # Gestionar items compras
```

---

## 🚀 Ejemplos de uso en Frontend

### JavaScript - Obtener catálogo (SIN LOGIN):
```javascript
// No necesita token
const response = await fetch('/api/productos/productos/', {
    method: 'GET'
});
const data = await response.json();
```

### JavaScript - Obtener producto completo (SIN LOGIN):
```javascript
const response = await fetch('/api/productos/productos/1/', {
    method: 'GET'
});
const producto = await response.json();
```

### JavaScript - Ver reseñas con estadísticas (SIN LOGIN):
```javascript
const response = await fetch('/api/productos/reseñas/por_producto/?producto_variante_id=1', {
    method: 'GET'
});
const reseñas = await response.json();
```

### JavaScript - Crear reseña (CON LOGIN):
```javascript
const response = await fetch('/api/productos/reseñas/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        calificacion: 5,
        comentario: "Excelente producto",
        Producto_categoria: 1,
        Cliente: 1
    })
});
```

### JavaScript - Filtrar productos por categoría (SIN LOGIN):
```javascript
const response = await fetch('/api/productos/productos/?categoria=1', {
    method: 'GET'
});
const productos = await response.json();
```

### JavaScript - Buscar productos (SIN LOGIN):
```javascript
const response = await fetch('/api/productos/productos/?nombre=camiseta', {
    method: 'GET'
});
const resultados = await response.json();
```

---

## 📊 Características Especiales

### 🔓 **Sin autenticación** (Para navegación del catálogo):
- ✅ Ver todos los productos y sus detalles
- ✅ Navegar por categorías
- ✅ Ver imágenes y variantes
- ✅ Leer reseñas de otros usuarios
- ✅ Ver estadísticas de calificaciones

### 🔐 **Con autenticación** (Para compras y gestión):
- ✅ Crear reseñas propias
- ✅ Gestionar productos (admin)
- ✅ Crear/editar categorías
- ✅ Gestionar items de pedidos y compras

### 🎯 **Funcionalidades avanzadas**:
- ✅ Productos destacados
- ✅ Filtros múltiples
- ✅ Búsqueda por nombre
- ✅ Stock disponible
- ✅ Relaciones muchos a muchos bien manejadas
- ✅ Estadísticas de reseñas
- ✅ Imágenes principales y secundarias

---

## ❌ Errores comunes

### Error 401 - Solo para APIs autenticadas:
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### Error 400 - Validación:
```json
{
    "precio_unitario": ["El precio unitario debe ser mayor a 0"],
    "stock": ["El stock no puede ser negativo"],
    "calificacion": ["La calificación debe estar entre 1 y 5"]
}
```

---

## 📝 Notas importantes

1. **APIs Públicas**: El catálogo es completamente público para mejorar SEO y experiencia de usuario
2. **Autenticación selectiva**: Solo se requiere login para crear contenido o comprar
3. **Relaciones complejas**: Maneja correctamente las relaciones muchos a muchos
4. **Reutilización**: Usa serializers existentes de otras apps cuando es posible
5. **Imágenes**: Soporte completo para múltiples imágenes por variante
6. **Estadísticas**: Calcula automáticamente promedios de calificaciones
7. **Filtros**: Múltiples opciones de filtrado y búsqueda
8. **Stock**: Control de disponibilidad en tiempo real

¡Todas las APIs están listas para tu ecommerce! 🛍️🚀
