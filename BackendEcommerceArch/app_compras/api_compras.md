# 🛒 API de Compras - Documentación Completa

## 🔐 Autenticación
**TODAS las APIs requieren autenticación por token**

### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Content-Type: application/json
```

---

## 📋 APIs Disponibles

## 1. **PROVEEDORES** (`/api/compras/proveedores/`)

### 1.1 **Listar todos los proveedores**
- **URL**: `GET /api/compras/proveedores/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "count": 2,
    "proveedores": [
        {
            "id": 1,
            "nombre": "Distribuidora ABC S.A.",
            "nombre_contacto": "Juan Pérez",
            "telefono": "+1234567890",
            "email": "contacto@distribuidoraabc.com",
            "direccion": "Av. Principal 123, Col. Centro, Ciudad"
        },
        {
            "id": 2,
            "nombre": "Suministros XYZ",
            "nombre_contacto": "María González",
            "telefono": "+0987654321",
            "email": "ventas@suministrosxyz.com",
            "direccion": "Calle Comercial 456, Industrial"
        }
    ]
}
```

### 1.2 **Obtener proveedor específico**
- **URL**: `GET /api/compras/proveedores/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "proveedor": {
        "id": 1,
        "nombre": "Distribuidora ABC S.A.",
        "nombre_contacto": "Juan Pérez",
        "telefono": "+1234567890",
        "email": "contacto@distribuidoraabc.com",
        "direccion": "Av. Principal 123, Col. Centro, Ciudad"
    }
}
```

### 1.3 **Crear nuevo proveedor**
- **URL**: `POST /api/compras/proveedores/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "nombre": "Proveedores del Norte S.A.",
    "nombre_contacto": "Carlos Rodríguez",
    "telefono": "+5544332211",
    "email": "info@proveedoresnorte.com",
    "direccion": "Boulevard Norte 789, Zona Industrial"
}
```

#### Respuesta exitosa (201):
```json
{
    "success": true,
    "message": "Proveedor creado exitosamente",
    "proveedor": {
        "id": 3,
        "nombre": "Proveedores del Norte S.A.",
        "nombre_contacto": "Carlos Rodríguez",
        "telefono": "+5544332211",
        "email": "info@proveedoresnorte.com",
        "direccion": "Boulevard Norte 789, Zona Industrial"
    }
}
```

#### Error - Datos inválidos (400):
```json
{
    "success": false,
    "message": "Datos inválidos",
    "errors": {
        "email": ["Enter a valid email address."],
        "nombre": ["This field is required."]
    }
}
```

### 1.4 **Actualizar proveedor**
- **URL**: `PUT /api/compras/proveedores/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "nombre": "Distribuidora ABC Actualizada S.A.",
    "nombre_contacto": "Juan Carlos Pérez",
    "telefono": "+1234567891",
    "email": "nuevoemail@distribuidoraabc.com",
    "direccion": "Nueva dirección 123, Col. Moderna"
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Proveedor actualizado exitosamente",
    "proveedor": {
        "id": 1,
        "nombre": "Distribuidora ABC Actualizada S.A.",
        "nombre_contacto": "Juan Carlos Pérez",
        "telefono": "+1234567891",
        "email": "nuevoemail@distribuidoraabc.com",
        "direccion": "Nueva dirección 123, Col. Moderna"
    }
}
```

### 1.5 **Eliminar proveedor**
- **URL**: `DELETE /api/compras/proveedores/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```json
{
    "success": true,
    "message": "Proveedor eliminado exitosamente"
}
```

---

## 2. **COMPRAS** (`/api/compras/compras/`)

### 2.1 **Listar todas las compras**
- **URL**: `GET /api/compras/compras/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "count": 3,
    "compras": [
        {
            "id": 1,
            "fecha_compra": "2025-11-11",
            "monto_total": "1500.00",
            "estado": "confirmado"
        },
        {
            "id": 2,
            "fecha_compra": "2025-11-10",
            "monto_total": "750.50",
            "estado": "confirmado"
        },
        {
            "id": 3,
            "fecha_compra": "2025-11-09",
            "monto_total": "2200.75",
            "estado": "cancelado"
        }
    ]
}
```

### 2.2 **Obtener compra específica**
- **URL**: `GET /api/compras/compras/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "compra": {
        "id": 1,
        "fecha_compra": "2025-11-11",
        "monto_total": "1500.00",
        "estado": "confirmado"
    }
}
```

### 2.3 **Crear nueva compra**
- **URL**: `POST /api/compras/compras/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "monto_total": "850.25",
    "estado": "confirmado"
}
```

**Nota**: `fecha_compra` se asigna automáticamente con la fecha actual.
**Nota**: `estado` es opcional, por defecto es "confirmado".

#### Respuesta exitosa (201):
```json
{
    "success": true,
    "message": "Compra registrada exitosamente",
    "compra": {
        "id": 4,
        "fecha_compra": "2025-11-11",
        "monto_total": "850.25",
        "estado": "confirmado"
    }
}
```

#### Error - Monto inválido (400):
```json
{
    "success": false,
    "message": "Datos inválidos",
    "errors": {
        "monto_total": ["El monto total debe ser mayor a 0"]
    }
}
```

### 2.4 **Actualizar compra**
- **URL**: `PUT /api/compras/compras/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "monto_total": "950.50",
    "estado": "cancelado"
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Compra actualizada exitosamente",
    "compra": {
        "id": 1,
        "fecha_compra": "2025-11-11",
        "monto_total": "950.50",
        "estado": "cancelado"
    }
}
```

### 2.5 **Eliminar compra**
- **URL**: `DELETE /api/compras/compras/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```json
{
    "success": true,
    "message": "Compra eliminada exitosamente"
}
```

### 2.6 **Filtrar compras por estado**
- **URL**: `GET /api/compras/compras/por_estado/?estado=confirmado`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Parámetros de consulta:
- `estado`: "confirmado" o "cancelado" (por defecto: "confirmado")

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "estado": "confirmado",
    "count": 2,
    "compras": [
        {
            "id": 1,
            "fecha_compra": "2025-11-11",
            "monto_total": "1500.00",
            "estado": "confirmado"
        },
        {
            "id": 2,
            "fecha_compra": "2025-11-10",
            "monto_total": "750.50",
            "estado": "confirmado"
        }
    ]
}
```

---

## 🔗 Resumen de URLs

### **Proveedores:**
```
GET    /api/compras/proveedores/           # Listar proveedores
POST   /api/compras/proveedores/           # Crear proveedor
GET    /api/compras/proveedores/{id}/      # Obtener proveedor específico
PUT    /api/compras/proveedores/{id}/      # Actualizar proveedor
PATCH  /api/compras/proveedores/{id}/      # Actualización parcial de proveedor
DELETE /api/compras/proveedores/{id}/      # Eliminar proveedor
```

### **Compras:**
```
GET    /api/compras/compras/                     # Listar compras
POST   /api/compras/compras/                     # Crear compra
GET    /api/compras/compras/{id}/                # Obtener compra específica
PUT    /api/compras/compras/{id}/                # Actualizar compra
PATCH  /api/compras/compras/{id}/                # Actualización parcial de compra
DELETE /api/compras/compras/{id}/                # Eliminar compra
GET    /api/compras/compras/por_estado/          # Filtrar por estado
```

---

## 🚀 Ejemplos de uso en Frontend

### JavaScript - Crear proveedor:
```javascript
const response = await fetch('/api/compras/proveedores/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        nombre: "Nuevo Proveedor S.A.",
        nombre_contacto: "Ana López",
        telefono: "+1122334455",
        email: "contacto@nuevoproveedor.com",
        direccion: "Calle Nueva 123"
    })
});
```

### JavaScript - Registrar compra:
```javascript
const response = await fetch('/api/compras/compras/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        monto_total: "1250.75",
        estado: "confirmado"
    })
});
```

### JavaScript - Filtrar compras confirmadas:
```javascript
const response = await fetch('/api/compras/compras/por_estado/?estado=confirmado', {
    method: 'GET',
    headers: {
        'Authorization': 'Token ' + userToken,
    }
});
```

### JavaScript - Actualizar estado de compra:
```javascript
const response = await fetch('/api/compras/compras/1/', {
    method: 'PATCH',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        estado: "cancelado"
    })
});
```

---

## 📊 Estados de Compra Disponibles

- **confirmado**: Compra confirmada y procesada
- **cancelado**: Compra cancelada

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
        "email": ["Enter a valid email address."]
    }
}
```

---

## 📝 Notas importantes

1. **Autenticación obligatoria**: Todas las APIs requieren token válido
2. **Fecha automática**: `fecha_compra` se asigna automáticamente
3. **Estado por defecto**: Las compras se crean con estado "confirmado" por defecto
4. **Validaciones**: Montos deben ser positivos, emails válidos
5. **Ordenamiento**: Las compras se listan de más reciente a más antigua
6. **Filtrado personalizado**: Usa `/por_estado/` para filtrar compras específicas

Todas las APIs están listas para integrar con tu frontend. 🚀