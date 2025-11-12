# 🛒 API del Carrito de Compras - ACTUALIZADO ✨

## 🔐 Autenticación
**TODAS las APIs requieren autenticación por token**

### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Content-Type: application/json
```

---

## 📋 APIs Disponibles

### 1. **Obtener mi carrito** ⭐ RECOMENDADO
- **URL**: `GET /api/carrito/carritos/mi_carrito/`
- **Método**: GET
- **Autenticación**: ✅ Requerida
- **Descripción**: Obtiene el carrito del usuario autenticado con **TODA la información del producto** (imágenes, precios, categoría, etc.)
- **Ventaja**: ✨ **UNA sola llamada API** - devuelve todo lo que necesitas

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
                    "color": "Azul",
                    "talla": "M",
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
        "cantidad": 3,
        "subtotal": 77.97,
        "variante_info": {...}
    }
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

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Carrito vaciado exitosamente"
}
```

---

## ✨ Información Completa en Carrito

### **NO NECESITAS `/api/productos/productos/{id}/`**

El carrito devuelve TODA la información del producto:

```json
{
    "variante_info": {
        "id": 1,
        "producto": 1,
        "categoria": 1,
        "color": "Azul",
        "talla": "M",
        "capacidad": "",
        "precio_unitario": "25.99",
        "stock": 50,
        
        // Información del producto
        "producto_info": {
            "id": 1,
            "nombre": "Camiseta Básica",
            "descripcion": "Camiseta 100% algodón",
            "peso": "0.25"
        },
        
        // Categoría
        "categoria_info": {
            "id": 1,
            "nombre": "Ropa"
        },
        
        // IMÁGENES PRINCIPALES Y SECUNDARIAS
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
```

---

## 🚀 Uso en Frontend

### JavaScript - Ver carrito completo:
```javascript
const response = await fetch('/api/carrito/carritos/mi_carrito/', {
    method: 'GET',
    headers: {
        'Authorization': 'Token ' + userToken,
    }
});
const carrito = await response.json();

// TODO está aquí - sin llamadas adicionales
carrito.carrito.items.forEach(item => {
    console.log(item.variante_info.producto_info.nombre);       // Nombre
    console.log(item.variante_info.categoria_info.nombre);      // Categoría
    console.log(item.variante_info.imagen_principal);           // Imagen principal
    console.log(item.variante_info.imagenes);                   // Todas las imágenes
    console.log(item.variante_info.color, item.variante_info.talla); // Variante
    console.log(item.subtotal);                                 // Subtotal
});
```

---

## 📝 Notas importantes

1. ✅ **Autenticación requerida** - Todas las APIs necesitan token
2. ✅ **Un carrito por cliente** - Se crea automáticamente
3. ✅ **Información completa** - Todo el producto incluido
4. ✅ **Validación de stock** - Automática
5. ✅ **Múltiples imágenes** - Todas incluidas
6. ✅ **Cálculos automáticos** - Subtotales y totales

todas las api requieren token
 