# � API de Clientes

## 🔐 Autenticación
**TODAS las APIs requieren autenticación por token**

### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
Content-Type: application/json
```

---

## 📋 Módulos de la API

Esta API gestiona tres recursos principales:
1. **Clientes** - Información del cliente (perfil)
2. **Métodos de Pago** - Formas de pago del cliente
3. **Direcciones de Envío** - Direcciones registradas del cliente

---

## 🧑 API de Clientes

### 1. **Listar todos los clientes**
- **URL**: `GET /api/cliente/clientes/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
[
    {
        "id": 1,
        "telefono": "77123456",
        "fecha_creacion": "2025-11-11T10:30:00.123456Z",
        "fecha_nacimiento": "1990-05-15",
        "usuario": 1
    },
    {
        "id": 2,
        "telefono": "71987654",
        "fecha_creacion": "2025-11-10T14:20:00.123456Z",
        "fecha_nacimiento": "1985-08-22",
        "usuario": 2
    }
]
```

---

### 2. **Obtener cliente específico**
- **URL**: `GET /api/cliente/clientes/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "telefono": "77123456",
    "fecha_creacion": "2025-11-11T10:30:00.123456Z",
    "fecha_nacimiento": "1990-05-15",
    "usuario": 1
}
```

---

### 3. **Crear nuevo cliente**
- **URL**: `POST /api/cliente/clientes/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "telefono": "77123456",
    "fecha_nacimiento": "1990-05-15",
    "usuario": 1
}
```

#### Respuesta exitosa (201):
```json
{
    "id": 3,
    "telefono": "77123456",
    "fecha_creacion": "2025-11-11T15:45:00.123456Z",
    "fecha_nacimiento": "1990-05-15",
    "usuario": 1
}
```

---

### 4. **Actualizar cliente**
- **URL**: `PUT /api/cliente/clientes/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "telefono": "77999888",
    "fecha_nacimiento": "1990-05-15",
    "usuario": 1
}
```

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "telefono": "77999888",
    "fecha_creacion": "2025-11-11T10:30:00.123456Z",
    "fecha_nacimiento": "1990-05-15",
    "usuario": 1
}
```

---

### 5. **Actualización parcial de cliente**
- **URL**: `PATCH /api/cliente/clientes/{id}/`
- **Método**: PATCH
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "telefono": "77888999"
}
```

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "telefono": "77888999",
    "fecha_creacion": "2025-11-11T10:30:00.123456Z",
    "fecha_nacimiento": "1990-05-15",
    "usuario": 1
}
```

---

### 6. **Eliminar cliente**
- **URL**: `DELETE /api/cliente/clientes/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```
No Content
```

---

## 💳 API de Métodos de Pago

### 1. **Listar métodos de pago**
- **URL**: `GET /api/cliente/metodos_pago/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
[
    {
        "id": 1,
        "forma_pago": "tarjeta_credito",
        "detalles_pago": "Visa terminada en 1234",
        "Cliente": 1
    },
    {
        "id": 2,
        "forma_pago": "qr",
        "detalles_pago": "Cuenta QR Simple",
        "Cliente": 1
    }
]
```

---

### 2. **Obtener método de pago específico**
- **URL**: `GET /api/cliente/metodos_pago/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "forma_pago": "tarjeta_credito",
    "detalles_pago": "Visa terminada en 1234",
    "Cliente": 1
}
```

---

### 3. **Crear método de pago**
- **URL**: `POST /api/cliente/metodos_pago/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "forma_pago": "tarjeta_credito",
    "detalles_pago": "Mastercard terminada en 5678",
    "Cliente": 1
}
```

**Opciones de `forma_pago`:**
- `tarjeta_credito`
- `qr`
- `efectivo` (valor por defecto)

#### Respuesta exitosa (201):
```json
{
    "id": 3,
    "forma_pago": "tarjeta_credito",
    "detalles_pago": "Mastercard terminada en 5678",
    "Cliente": 1
}
```

---

### 4. **Actualizar método de pago**
- **URL**: `PUT /api/cliente/metodos_pago/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "forma_pago": "qr",
    "detalles_pago": "Banco Mercantil QR",
    "Cliente": 1
}
```

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "forma_pago": "qr",
    "detalles_pago": "Banco Mercantil QR",
    "Cliente": 1
}
```

---

### 5. **Eliminar método de pago**
- **URL**: `DELETE /api/cliente/metodos_pago/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```
No Content
```

---

## 📍 API de Direcciones de Envío

### 1. **Listar direcciones de envío**
- **URL**: `GET /api/cliente/direcciones_envio/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
[
    {
        "id": 1,
        "calle": "Av. Busch #123",
        "ciudad": "Santa Cruz",
        "estado": "Santa Cruz",
        "codigo_postal": "0000",
        "Pais": "Bolivia",
        "Cliente": 1
    },
    {
        "id": 2,
        "calle": "Calle Sucre #456",
        "ciudad": "La Paz",
        "estado": "La Paz",
        "codigo_postal": "0000",
        "Pais": "Bolivia",
        "Cliente": 1
    }
]
```

---

### 2. **Obtener dirección específica**
- **URL**: `GET /api/cliente/direcciones_envio/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "calle": "Av. Busch #123",
    "ciudad": "Santa Cruz",
    "estado": "Santa Cruz",
    "codigo_postal": "0000",
    "Pais": "Bolivia",
    "Cliente": 1
}
```

---

### 3. **Crear dirección de envío**
- **URL**: `POST /api/cliente/direcciones_envio/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "calle": "Av. Banzer #789",
    "ciudad": "Santa Cruz",
    "estado": "Santa Cruz",
    "codigo_postal": "0000",
    "Pais": "Bolivia",
    "Cliente": 1
}
```

#### Respuesta exitosa (201):
```json
{
    "id": 3,
    "calle": "Av. Banzer #789",
    "ciudad": "Santa Cruz",
    "estado": "Santa Cruz",
    "codigo_postal": "0000",
    "Pais": "Bolivia",
    "Cliente": 1
}
```

---

### 4. **Actualizar dirección de envío**
- **URL**: `PUT /api/cliente/direcciones_envio/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "calle": "Av. Busch #123 - Edificio Torres",
    "ciudad": "Santa Cruz",
    "estado": "Santa Cruz",
    "codigo_postal": "0000",
    "Pais": "Bolivia",
    "Cliente": 1
}
```

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "calle": "Av. Busch #123 - Edificio Torres",
    "ciudad": "Santa Cruz",
    "estado": "Santa Cruz",
    "codigo_postal": "0000",
    "Pais": "Bolivia",
    "Cliente": 1
}
```

---

### 5. **Actualización parcial de dirección**
- **URL**: `PATCH /api/cliente/direcciones_envio/{id}/`
- **Método**: PATCH
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "calle": "Av. Busch #123 Apto 5B"
}
```

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "calle": "Av. Busch #123 Apto 5B",
    "ciudad": "Santa Cruz",
    "estado": "Santa Cruz",
    "codigo_postal": "0000",
    "Pais": "Bolivia",
    "Cliente": 1
}
```

---

### 6. **Eliminar dirección de envío**
- **URL**: `DELETE /api/cliente/direcciones_envio/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```
No Content
```

---

## 🚀 Ejemplos de uso en Frontend

### 1. **Crear perfil de cliente**
```javascript
const response = await fetch('/api/cliente/clientes/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        telefono: "77123456",
        fecha_nacimiento: "1990-05-15",
        usuario: userId
    })
});
```

### 2. **Agregar método de pago**
```javascript
const response = await fetch('/api/cliente/metodos_pago/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        forma_pago: "tarjeta_credito",
        detalles_pago: "Visa terminada en 1234",
        Cliente: clienteId
    })
});
```

### 3. **Registrar dirección de envío**
```javascript
const response = await fetch('/api/cliente/direcciones_envio/', {
    method: 'POST',
    headers: {
        'Authorization': 'Token ' + userToken,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        calle: "Av. Busch #123",
        ciudad: "Santa Cruz",
        estado: "Santa Cruz",
        codigo_postal: "0000",
        Pais: "Bolivia",
        Cliente: clienteId
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

### Error 404 - Recurso no encontrado:
```json
{
    "detail": "Not found."
}
```

### Error 400 - Datos inválidos:
```json
{
    "telefono": ["Este campo es requerido."],
    "fecha_nacimiento": ["Formato de fecha inválido. Use YYYY-MM-DD."]
}
```

---

## 📝 Notas importantes

1. **Relación Usuario-Cliente**: Cada usuario (`User` de Django) debe tener un perfil de `Cliente` asociado (relación OneToOne)
2. **Múltiples métodos de pago**: Un cliente puede tener varios métodos de pago registrados
3. **Múltiples direcciones**: Un cliente puede tener múltiples direcciones de envío
4. **Fecha de creación automática**: El campo `fecha_creacion` se genera automáticamente al crear un cliente
5. **Opciones de pago**: Las formas de pago están limitadas a: `tarjeta_credito`, `qr`, `efectivo`