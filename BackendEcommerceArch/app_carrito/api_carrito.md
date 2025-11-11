# 🛒 API del Carrito de Compras

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
- **Descripción**: Obtiene el carrito del usuario autenticado (lo crea si no existe)

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
                "Producto": 1,
                "cantidad": 2,
                "producto_info": {
                    "id": 1,
                    "producto": {
                        "id": 1,
                        "nombre": "Camiseta Básica",
                        "descripcion": "Camiseta 100% algodón",
                        "peso": "0.25"
                    },
                    "color": "Azul",
                    "talla": "M",
                    "capacidad": "",
                    "precio_unitario": "25.99",
                    "stock": 50
                },
                "subtotal": "51.98"
            }
        ],
        "total_items": 1,
        "total_precio": "51.98"
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
        "total_precio": "0.00"
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
        "Producto": 1,
        "cantidad": 2,
        "producto_info": {
            "id": 1,
            "producto": {
                "id": 1,
                "nombre": "Camiseta Básica",
                "descripcion": "Camiseta 100% algodón",
                "peso": "0.25"
            },
            "color": "Azul",
            "talla": "M",
            "capacidad": "",
            "precio_unitario": "25.99",
            "stock": 50
        },
        "subtotal": "51.98"
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
        "subtotal": "103.96"
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
        "Producto": 1,
        "cantidad": 3,
        "producto_info": {
            "id": 1,
            "producto": {
                "id": 1,
                "nombre": "Camiseta Básica"
            },
            "color": "Azul",
            "talla": "M",
            "precio_unitario": "25.99",
            "stock": 50
        },
        "subtotal": "77.97"
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

## 🔗 Cómo se generan las URLs

### URLs automáticas del ViewSet:
El router genera estas URLs estándar (que NO necesitas usar):
```
GET    /api/carrito/carritos/          # Listar carritos
POST   /api/carrito/carritos/          # Crear carrito
GET    /api/carrito/carritos/{id}/     # Obtener carrito específico
PUT    /api/carrito/carritos/{id}/     # Actualizar carrito
DELETE /api/carrito/carritos/{id}/     # Eliminar carrito
```

### URLs personalizadas (las que SÍ usas):
```
GET    /api/carrito/carritos/mi_carrito/      # @action(detail=False, methods=['get'])
POST   /api/carrito/carritos/agregar_item/    # @action(detail=False, methods=['post'])
PUT    /api/carrito/carritos/actualizar_item/ # @action(detail=False, methods=['put'])
DELETE /api/carrito/carritos/eliminar_item/   # @action(detail=False, methods=['delete'])
DELETE /api/carrito/carritos/vaciar_carrito/  # @action(detail=False, methods=['delete'])
```

---

## 🚀 Flujo de trabajo típico

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
```

### 2. **Frontend - Ver carrito**
```javascript
const response = await fetch('/api/carrito/carritos/mi_carrito/', {
    method: 'GET',
    headers: {
        'Authorization': 'Token ' + userToken,
    }
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
```

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

1. **Un carrito por cliente**: Cada usuario autenticado tiene un solo carrito activo
2. **Creación automática**: Si el usuario no tiene carrito, se crea automáticamente
3. **Validación de stock**: Siempre valida que haya stock suficiente
4. **Actualización inteligente**: Si agregas un producto que ya está en el carrito, suma las cantidades
5. **Cálculo automático**: Los subtotales y totales se calculan automáticamente


todas las api requieren token 