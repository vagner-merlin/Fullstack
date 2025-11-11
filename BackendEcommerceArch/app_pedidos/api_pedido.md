# 📦 API de Pedidos - Documentación Completa

## 🔐 Autenticación
**TODAS las APIs requieren autenticación por token**

### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Content-Type: application/json
```

---

## 📋 APIs Disponibles

## 1. **PEDIDOS** (`/api/pedidos/pedidos/`)

### 1.1 **Listar todos los pedidos**
- **URL**: `GET /api/pedidos/pedidos/`
- **Método**: GET
- **Autenticación**: ✅ Requerida
- **Filtros opcionales**: 
  - `?cliente=1` - Filtrar por ID de cliente
  - `?estado=pendiente` - Filtrar por estado

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "count": 3,
    "pedidos": [
        {
            "id": 1,
            "cliente": 1,
            "direccion_envio": 1,
            "fecha_pedido": "2025-11-11",
            "monto_total": "150.75",
            "estado": "pendiente",
            "cliente_info": {
                "id": 1,
                "telefono": "+1234567890",
                "fecha_creacion": "2025-11-10T10:30:00.123456Z",
                "fecha_nacimiento": "1990-05-15",
                "usuario": 1
            },
            "direccion_info": {
                "id": 1,
                "calle": "Av. Principal 123",
                "ciudad": "Ciudad de México",
                "estado": "CDMX",
                "codigo_postal": "01234",
                "Pais": "México",
                "Cliente": 1
            }
        },
        {
            "id": 2,
            "cliente": 1,
            "direccion_envio": 2,
            "fecha_pedido": "2025-11-10",
            "monto_total": "89.50",
            "estado": "procesando",
            "cliente_info": {
                "id": 1,
                "telefono": "+1234567890",
                "fecha_creacion": "2025-11-10T10:30:00.123456Z",
                "fecha_nacimiento": "1990-05-15",
                "usuario": 1
            },
            "direccion_info": {
                "id": 2,
                "calle": "Calle Secundaria 456",
                "ciudad": "Guadalajara",
                "estado": "Jalisco",
                "codigo_postal": "44100",
                "Pais": "México",
                "Cliente": 1
            }
        }
    ]
}
```

### 1.2 **Obtener pedido específico**
- **URL**: `GET /api/pedidos/pedidos/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "pedido": {
        "id": 1,
        "cliente": 1,
        "direccion_envio": 1,
        "fecha_pedido": "2025-11-11",
        "monto_total": "150.75",
        "estado": "pendiente",
        "cliente_info": {
            "id": 1,
            "telefono": "+1234567890",
            "fecha_creacion": "2025-11-10T10:30:00.123456Z",
            "fecha_nacimiento": "1990-05-15",
            "usuario": 1
        },
        "direccion_info": {
            "id": 1,
            "calle": "Av. Principal 123",
            "ciudad": "Ciudad de México",
            "estado": "CDMX",
            "codigo_postal": "01234",
            "Pais": "México",
            "Cliente": 1
        }
    }
}
```

### 1.3 **Crear nuevo pedido**
- **URL**: `POST /api/pedidos/pedidos/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "cliente": 1,
    "direccion_envio": 1,
    "monto_total": "250.00",
    "estado": "pendiente"
}
```

**Nota**: `fecha_pedido` se asigna automáticamente con la fecha actual.

#### Respuesta exitosa (201):
```json
{
    "success": true,
    "message": "Pedido creado exitosamente",
    "pedido": {
        "id": 3,
        "cliente": 1,
        "direccion_envio": 1,
        "fecha_pedido": "2025-11-11",
        "monto_total": "250.00",
        "estado": "pendiente",
        "cliente_info": {
            "id": 1,
            "telefono": "+1234567890",
            "fecha_creacion": "2025-11-10T10:30:00.123456Z",
            "fecha_nacimiento": "1990-05-15",
            "usuario": 1
        },
        "direccion_info": {
            "id": 1,
            "calle": "Av. Principal 123",
            "ciudad": "Ciudad de México",
            "estado": "CDMX",
            "codigo_postal": "01234",
            "Pais": "México",
            "Cliente": 1
        }
    }
}
```

#### Error - Datos inválidos (400):
```json
{
    "success": false,
    "message": "Datos inválidos",
    "errors": {
        "monto_total": ["El monto total debe ser mayor a 0"],
        "estado": ["Estado no válido. Estados permitidos: pendiente, procesando, enviado, entregado, cancelado"],
        "non_field_errors": ["La dirección de envío debe pertenecer al cliente seleccionado"]
    }
}
```

### 1.4 **Actualizar pedido completo**
- **URL**: `PUT /api/pedidos/pedidos/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "cliente": 1,
    "direccion_envio": 2,
    "monto_total": "300.50",
    "estado": "procesando"
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Pedido actualizado exitosamente",
    "pedido": {
        "id": 1,
        "cliente": 1,
        "direccion_envio": 2,
        "fecha_pedido": "2025-11-11",
        "monto_total": "300.50",
        "estado": "procesando",
        "cliente_info": {...},
        "direccion_info": {...}
    }
}
```

### 1.5 **Actualización parcial de pedido**
- **URL**: `PATCH /api/pedidos/pedidos/{id}/`
- **Método**: PATCH
- **Autenticación**: ✅ Requerida

#### JSON de entrada (solo campos a actualizar):
```json
{
    "estado": "enviado",
    "monto_total": "275.25"
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Pedido actualizado exitosamente",
    "pedido": {
        "id": 1,
        "cliente": 1,
        "direccion_envio": 1,
        "fecha_pedido": "2025-11-11",
        "monto_total": "275.25",
        "estado": "enviado",
        "cliente_info": {...},
        "direccion_info": {...}
    }
}
```

### 1.6 **Eliminar pedido**
- **URL**: `DELETE /api/pedidos/pedidos/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```json
{
    "success": true,
    "message": "Pedido eliminado exitosamente"
}
```

---

## 2. **APIs PERSONALIZADAS**

### 2.1 **Filtrar pedidos por estado**
- **URL**: `GET /api/pedidos/pedidos/por_estado/?estado=pendiente`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Parámetros de consulta:
- `estado`: pendiente, procesando, enviado, entregado, cancelado (por defecto: "pendiente")

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "estado": "pendiente",
    "count": 2,
    "pedidos": [
        {
            "id": 1,
            "cliente": 1,
            "direccion_envio": 1,
            "fecha_pedido": "2025-11-11",
            "monto_total": "150.75",
            "estado": "pendiente",
            "cliente_info": {...},
            "direccion_info": {...}
        },
        {
            "id": 3,
            "cliente": 2,
            "direccion_envio": 3,
            "fecha_pedido": "2025-11-09",
            "monto_total": "99.99",
            "estado": "pendiente",
            "cliente_info": {...},
            "direccion_info": {...}
        }
    ]
}
```

### 2.2 **Obtener pedidos por cliente**
- **URL**: `GET /api/pedidos/pedidos/por_cliente/?cliente_id=1`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Parámetros de consulta:
- `cliente_id`: ID del cliente (obligatorio)

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "cliente": {
        "id": 1,
        "telefono": "+1234567890",
        "fecha_creacion": "2025-11-10T10:30:00.123456Z"
    },
    "count": 2,
    "pedidos": [
        {
            "id": 1,
            "cliente": 1,
            "direccion_envio": 1,
            "fecha_pedido": "2025-11-11",
            "monto_total": "150.75",
            "estado": "pendiente",
            "cliente_info": {...},
            "direccion_info": {...}
        },
        {
            "id": 2,
            "cliente": 1,
            "direccion_envio": 2,
            "fecha_pedido": "2025-11-10",
            "monto_total": "89.50",
            "estado": "procesando",
            "cliente_info": {...},
            "direccion_info": {...}
        }
    ]
}
```

#### Error - Cliente no encontrado (404):
```json
{
    "success": false,
    "message": "Cliente no encontrado"
}
```

### 2.3 **Cambiar solo el estado de un pedido**
- **URL**: `PATCH /api/pedidos/pedidos/{id}/cambiar_estado/`
- **Método**: PATCH
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "estado": "entregado"
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Estado cambiado a \"entregado\"",
    "pedido": {
        "id": 1,
        "cliente": 1,
        "direccion_envio": 1,
        "fecha_pedido": "2025-11-11",
        "monto_total": "150.75",
        "estado": "entregado",
        "cliente_info": {...},
        "direccion_info": {...}
    }
}
```

---

## 🔗 Resumen de URLs

### **URLs Estándar (CRUD):**
```
GET    /api/pedidos/pedidos/                    # Listar pedidos
POST   /api/pedidos/pedidos/                    # Crear pedido
GET    /api/pedidos/pedidos/{id}/               # Obtener pedido específico
PUT    /api/pedidos/pedidos/{id}/               # Actualizar pedido completo
PATCH  /api/pedidos/pedidos/{id}/               # Actualizar pedido parcial
DELETE /api/pedidos/pedidos/{id}/               # Eliminar pedido
```

### **URLs Personalizadas:**
```
GET    /api/pedidos/pedidos/por_estado/         # Filtrar por estado
GET    /api/pedidos/pedidos/por_cliente/        # Filtrar por cliente
PATCH  /api/pedidos/pedidos/{id}/cambiar_estado/ # Cambiar solo estado
```

---

## 🚀 Ejemplos de uso en Frontend

### JavaScript - Crear pedido:
```javascript
const response = await fetch('/api/pedidos/pedidos/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        cliente: 1,
        direccion_envio: 1,
        monto_total: "150.75",
        estado: "pendiente"
    })
});
```

### JavaScript - Filtrar pedidos pendientes:
```javascript
const response = await fetch('/api/pedidos/pedidos/por_estado/?estado=pendiente', {
    method: 'GET',
    headers: {
        'Authorization': 'Token ' + userToken,
    }
});
```

### JavaScript - Obtener pedidos de un cliente:
```javascript
const response = await fetch('/api/pedidos/pedidos/por_cliente/?cliente_id=1', {
    method: 'GET',
    headers: {
        'Authorization': 'Token ' + userToken,
    }
});
```

### JavaScript - Cambiar estado del pedido:
```javascript
const response = await fetch('/api/pedidos/pedidos/1/cambiar_estado/', {
    method: 'PATCH',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        estado: "enviado"
    })
});
```

### JavaScript - Actualización parcial:
```javascript
const response = await fetch('/api/pedidos/pedidos/1/', {
    method: 'PATCH',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        monto_total: "200.00"
    })
});
```

---

## 📊 Estados de Pedido Disponibles

- **pendiente**: Pedido recién creado, esperando procesamiento
- **procesando**: Pedido en proceso de preparación
- **enviado**: Pedido enviado al cliente
- **entregado**: Pedido entregado exitosamente
- **cancelado**: Pedido cancelado

---

## ❌ Errores comunes

### Error 401 - No autenticado:
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### Error 404 - No encontrado:
```json
{
    "detail": "Not found."
}
```

### Error 400 - Validación:
```json
{
    "success": false,
    "message": "Datos inválidos",
    "errors": {
        "monto_total": ["El monto total debe ser mayor a 0"],
        "estado": ["Estado no válido. Estados permitidos: pendiente, procesando, enviado, entregado, cancelado"],
        "non_field_errors": ["La dirección de envío debe pertenecer al cliente seleccionado"]
    }
}
```

---

## 📝 Notas importantes

1. **Autenticación obligatoria**: Todas las APIs requieren token válido
2. **Fecha automática**: `fecha_pedido` se asigna automáticamente al crear
3. **Validación de relaciones**: La dirección debe pertenecer al cliente seleccionado
4. **Estados válidos**: Solo se permiten los 5 estados definidos
5. **Montos positivos**: El monto_total debe ser mayor a 0
6. **Ordenamiento**: Los pedidos se listan de más reciente a más antiguo
7. **Reutilización de serializers**: Usa los serializers existentes de `app_Cliente`
8. **Información completa**: Las respuestas incluyen datos del cliente y dirección

Todas las APIs están listas para integrar con tu frontend. 🚀
