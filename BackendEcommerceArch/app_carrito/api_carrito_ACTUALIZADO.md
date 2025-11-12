# 🛒 API del Carrito de Compras - ACTUALIZADO

## 🔐 Autenticación
**TODAS las APIs requieren autenticación por token**

### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Content-Type: application/json
```

---

## 📋 APIs Disponibles

### 1. **Obtener mi carrito**
- **URL**: `GET /api/carrito/carritos/mi_carrito/`
- **Método**: GET
- **Autenticación**: ✅ Requerida
- **Descripción**: Obtiene el carrito del usuario autenticado con TODA la información del producto (imágenes, precios, categoría, etc.)

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "carrito": {
        "id": 1,
        "cliente": 1,
        "fecha_creacion": "2025-11-11T10:30:00.123456Z",
        "fecha_modificacion": "2025-11-11T11:45:00.123456Z",
        "items": [
            {
                "id": 1,
                "carrito": 1,
                "producto_variante": 1,
                "cantidad": 2,
                "subtotal": 51.98,
                "variante_info": {
                    "id": 1,
                    "producto": 1,
                    "categoria": 1,
                    "color": "Azul",
                    "talla": "M",
                    "capacidad": "",
                    "precio_unitario": "25.99",
                    "stock": 50,
                    "producto_info": {
                        "id": 1,
                        "nombre": "Camiseta Básica",
                        "descripcion": "Camiseta 100% algodón",
                        "peso": "0.25"
                    },
                    "categoria_info": {
                        "id": 1,
                        "nombre": "Ropa"
                    },
                    "imagen_principal": "https://storage.example.com/imagen1.jpg",
                    "imagenes": [
                        {
                            "id": 1,
                            "url": "https://storage.example.com/imagen1.jpg",
                            "texto": "Vista frontal",
                            "es_principal": true
                        },
                        {
                            "id": 2,
                            "url": "https://storage.example.com/imagen2.jpg",
                            "texto": "Vista lateral",
                            "es_principal": false
                        }
                    ]
                }
            }
        ],
        "total_items": 2,
        "total_precio": 51.98
    }
}
```

#### Carrito vacío (200):
```json
{
    "success": true,
    "carrito": {
        "id": 1,
        "cliente": 1,
        "fecha_creacion": "2025-11-11T10:30:00Z",
        "fecha_modificacion": "2025-11-11T10:30:00Z",
        "items": [],
        "total_items": 0,
        "total_precio": 0.00
    }
}
```

---

### 2. **Agregar producto al carrito**
- **URL**: `POST /api/carrito/carritos/agregar_item/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "producto_variante_id": 1,
    "cantidad": 2
}
```

#### Respuesta - Producto nuevo (201):
```json
{
    "success": true,
    "message": "Producto agregado al carrito",
    "item": {
        "id": 2,
        "carrito": 1,
        "producto_variante": 1,
        "cantidad": 2,
        "subtotal": 51.98,
        "variante_info": {
            "id": 1,
            "producto": 1,
            "categoria": 1,
            "color": "Azul",
            "talla": "M",
            "capacidad": "",
            "precio_unitario": "25.99",
            "stock": 50,
            "producto_info": {
                "id": 1,
                "nombre": "Camiseta Básica",
                "descripcion": "Camiseta 100% algodón",
                "peso": "0.25"
            },
            "categoria_info": {
                "id": 1,
                "nombre": "Ropa"
            },
            "imagen_principal": "https://storage.example.com/imagen1.jpg",
            "imagenes": [...]
        }
    }
}
```

#### Respuesta - Cantidad actualizada (200):
```json
{
    "success": true,
    "message": "Cantidad actualizada en el carrito",
    "item": {
        "id": 1,
        "cantidad": 4,
        "subtotal": 103.96,
        "variante_info": {...}
    }
}
```

#### Error - Stock insuficiente (400):
```json
{
    "success": false,
    "message": "Stock insuficiente. Disponible: 3"
}
```

---

### 3. **Actualizar cantidad de un item**
- **URL**: `PUT /api/carrito/carritos/actualizar_item/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "item_id": 1,
    "cantidad": 3
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Cantidad actualizada",
    "item": {
        "id": 1,
        "carrito": 1,
        "producto_variante": 1,
        "cantidad": 3,
        "subtotal": 77.97,
        "variante_info": {...}
    }
}
```

#### Error - Item no encontrado (404):
```json
{
    "success": false,
    "message": "Item no encontrado en tu carrito"
}
```

---

### 4. **Eliminar item del carrito**
- **URL**: `DELETE /api/carrito/carritos/eliminar_item/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "item_id": 1
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Producto eliminado del carrito"
}
```

---

### 5. **Vaciar carrito completo**
- **URL**: `DELETE /api/carrito/carritos/vaciar_carrito/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida
- **Body**: No requiere datos

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Carrito vaciado exitosamente"
}
```

---

## 🎯 Información Completa del Producto en Carrito

El carrito devuelve TODA la información del producto sin necesidad de llamadas adicionales a `/api/productos/productos/{id}/`:

### Estructura de `variante_info`:

```typescript
{
    // ID y referencias
    id: number,                           // ID de la variante
    producto: number,                     // ID del producto
    categoria: number,                    // ID de la categoría
    
    // Atributos del producto
    color: string,                        // Color de la variante
    talla: string,                        // Talla/tamaño
    capacidad: string | null,             // Capacidad (si aplica)
    
    // Precios
    precio_unitario: string,              // Precio de una unidad
    stock: number,                        // Stock disponible
    
    // Información del producto principal
    producto_info: {
        id: number,
        nombre: string,                   // Nombre del producto
        descripcion: string,              // Descripción
        peso: string                      // Peso del producto
    },
    
    // Categoría
    categoria_info: {
        id: number,
        nombre: string                    // Nombre de la categoría
    },
    
    // Imágenes
    imagen_principal: string | null,      // URL de imagen principal
    imagenes: [                           // Todas las imágenes de la variante
        {
            id: number,
            url: string,                  // URL completa de la imagen
            texto: string,                // Descripción de la imagen
            es_principal: boolean         // Si es la imagen principal
        }
    ]
}
```

### ✅ **Ventajas del nuevo formato:**

1. **Una sola llamada API** - El carrito devuelve TODO lo que necesitas para mostrar el producto
2. **No necesitas `/api/productos/productos/{id}/`** - Ya tienes toda la información
3. **Imágenes incluidas** - Puedes mostrar fotos sin llamadas extra
4. **Información de categoría** - Ya sabes a qué categoría pertenece
5. **Precios y stock actualizados** - Siempre sincronizados

---

## 🚀 Flujo de trabajo típico (Actualizado)

### 1. **Frontend - Agregar producto**
```javascript
// JavaScript ejemplo
const response = await fetch('/api/carrito/carritos/agregar_item/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        producto_variante_id: 1,
        cantidad: 2
    })
});
const data = await response.json();
// data.item contiene TODA la información del producto
```

### 2. **Frontend - Ver carrito**
```javascript
// Obtienes TODO lo que necesitas para mostrar el carrito
const response = await fetch('/api/carrito/carritos/mi_carrito/', {
    method: 'GET',
    headers: {
        'Authorization': 'Token ' + userToken,
    }
});
const carrito = await response.json();

// Puedes renderizar cada item sin llamadas adicionales
carrito.carrito.items.forEach(item => {
    console.log(item.variante_info.producto_info.nombre);  // Nombre del producto
    console.log(item.variante_info.imagen_principal);      // Imagen del producto
    console.log(item.variante_info.categoria_info.nombre); // Categoría
    console.log(item.subtotal);                             // Subtotal del item
});
```

### 3. **Frontend - Actualizar cantidad**
```javascript
const response = await fetch('/api/carrito/carritos/actualizar_item/', {
    method: 'PUT',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        item_id: 1,
        cantidad: 5
    })
});
const resultado = await response.json();
// resultado.item tiene la información actualizada
```

---

## 📊 Cambios principales vs versión anterior

| Aspecto | Anterior | Ahora |
|--------|----------|-------|
| **Imagen** | Llamada separada | Incluida en carrito |
| **Categoría** | No venía | Incluida |
| **Variante completa** | Info básica | Toda la estructura |
| **Producto info** | ID solo | Nombre, descripción, peso |
| **Múltiples imágenes** | No | ✅ Todas incluidas |
| **Llamadas API necesarias** | 2+ (carrito + producto + imágenes) | 1 (solo carrito) |

---

## ❌ Errores comunes

### Error 401 - No autenticado:
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### Error 404 - Cliente no encontrado:
```json
{
    "success": false,
    "message": "Cliente no encontrado"
}
```

### Error 400 - Datos inválidos:
```json
{
    "success": false,
    "message": "Datos inválidos",
    "errors": {
        "cantidad": ["La cantidad debe ser mayor a 0"]
    }
}
```

---

## 📝 Notas importantes

1. **Autenticación requerida** - Todas las APIs del carrito necesitan token
2. **Un carrito por cliente** - Se crea automáticamente si no existe
3. **Información completa** - El carrito devuelve TODA la info del producto
4. **Validación de stock** - Automática en cada operación
5. **Actualización inteligente** - Agregar un producto existente suma cantidades
6. **Cálculos automáticos** - Subtotales y totales se calculan en backend
7. **Imágenes reales** - URLs completas de S3 o storage local

---

## 🎁 Beneficios de esta implementación

✅ **Eficiencia** - Una sola llamada API para todo  
✅ **Consistencia** - Datos sincronizados con el backend  
✅ **Rendimiento** - Menos peticiones HTTP  
✅ **Flexibilidad** - Toda la info del producto disponible  
✅ **Escalabilidad** - Fácil de mantener y extender  

¡El carrito está optimizado para máxima eficiencia! 🛒🚀
