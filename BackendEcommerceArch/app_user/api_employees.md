# API de Empleados y Grupos

## Base URL
```
http://localhost:8000/api/users/
```

## 🔐 Autenticación
Todas las rutas requieren autenticación con Token en el header:
```
Authorization: Token <tu_token>
```

---

## 📋 API de Grupos (auth_group)

### 1. Listar Grupos
```http
GET /api/users/groups/
```

**Respuesta:**
```json
{
  "success": true,
  "count": 3,
  "groups": [
    {
      "id": 1,
      "name": "vendedores",
      "users_count": 5,
      "permissions_count": 10
    }
  ]
}
```

### 2. Crear Grupo
```http
POST /api/users/groups/
```

**Body:**
```json
{
  "name": "vendedores"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Grupo creado exitosamente",
  "group": {
    "id": 4,
    "name": "vendedores"
  }
}
```

### 3. Eliminar Grupo
```http
DELETE /api/users/groups/{id}/
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Grupo \"vendedores\" eliminado exitosamente"
}
```

---

## 👥 API de Empleados

### 1. Listar Empleados
Lista todos los usuarios que NO son clientes (excluye grupo id=3) y NO son superusers.

```http
GET /api/users/employees/
```

**Respuesta:**
```json
{
  "success": true,
  "count": 10,
  "employees": [
    {
      "id": 5,
      "username": "juan.perez",
      "email": "juan@tienda.com",
      "first_name": "Juan",
      "last_name": "Pérez",
      "is_active": true,
      "is_staff": false,
      "date_joined": "2024-01-15T10:30:00Z",
      "last_login": "2024-11-10T08:00:00Z",
      "groups": [
        {
          "id": 4,
          "name": "vendedores"
        }
      ],
      "group_names": ["vendedores"]
    }
  ]
}
```

### 2. Crear Empleado
Crea un usuario y lo asigna automáticamente al grupo especificado.

```http
POST /api/users/employees/create/
```

**Body:**
```json
{
  "username": "juan.perez",
  "email": "juan@tienda.com",
  "password": "Password123!",
  "first_name": "Juan",
  "last_name": "Pérez",
  "group_id": 4,
  "is_staff": false
}
```

**Campos:**
- `username`: (requerido) Nombre de usuario único
- `email`: (requerido) Email único
- `password`: (requerido) Contraseña
- `first_name`: (opcional) Nombre
- `last_name`: (opcional) Apellido
- `group_id`: (requerido) ID del grupo al que pertenecerá
- `is_staff`: (opcional, default: false) Si puede acceder al admin de Django

**Respuesta:**
```json
{
  "success": true,
  "message": "Empleado creado exitosamente",
  "employee": {
    "id": 25,
    "username": "juan.perez",
    "email": "juan@tienda.com",
    "first_name": "Juan",
    "last_name": "Pérez",
    "is_staff": false,
    "is_active": true,
    "group_id": 4,
    "group_name": "vendedores"
  }
}
```

### 3. Activar/Desactivar Empleado
Cambia el estado `is_active` del empleado (toggle).

```http
PATCH /api/users/employees/{user_id}/toggle-active/
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Empleado activado exitosamente",
  "employee": {
    "id": 25,
    "username": "juan.perez",
    "email": "juan@tienda.com",
    "is_active": true,
    "groups": [...],
    "group_names": ["vendedores"]
  }
}
```

### 4. Eliminar Empleado
Elimina completamente el usuario empleado.

```http
DELETE /api/users/employees/{user_id}/delete/
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Empleado \"juan.perez\" eliminado exitosamente"
}
```

**Nota:** No se puede eliminar superusers.

---

## 🔗 API de Relación Usuario-Grupo

### 1. Agregar Usuario a Grupo
```http
POST /api/users/add-user-to-group/
```

**Body:**
```json
{
  "user_id": 25,
  "group_id": 4
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario agregado al grupo exitosamente",
  "user_id": 25,
  "username": "juan.perez",
  "group_id": 4,
  "group_name": "vendedores"
}
```

### 2. Remover Usuario de Grupo
```http
POST /api/users/remove-user-from-group/
```

**Body:**
```json
{
  "user_id": 25,
  "group_id": 4
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario removido del grupo exitosamente",
  "user_id": 25,
  "username": "juan.perez",
  "group_id": 4,
  "group_name": "vendedores"
}
```

---

## 📊 Flujo Recomendado para /admin/employees

### Paso 1: Crear un Grupo
```bash
POST /api/users/groups/
{
  "name": "vendedores"
}
```

### Paso 2: Crear Empleado y Asignarlo al Grupo
```bash
POST /api/users/employees/create/
{
  "username": "maria.garcia",
  "email": "maria@tienda.com",
  "password": "SecurePass123!",
  "first_name": "María",
  "last_name": "García",
  "group_id": 4
}
```

### Paso 3: Listar Empleados
```bash
GET /api/users/employees/
```

---

## ❌ Errores Comunes

### Grupo ya existe
```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": {
    "name": ["Ya existe un grupo con este nombre."]
  }
}
```

### Usuario ya existe
```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": {
    "username": ["Este nombre de usuario ya existe."],
    "email": ["Este email ya está registrado."]
  }
}
```

### Grupo no encontrado
```json
{
  "success": false,
  "message": "Datos inválidos",
  "errors": {
    "group_id": ["Grupo no encontrado."]
  }
}
```

---

## 🔍 Notas Importantes

1. **Diferencia entre Clientes y Empleados:**
   - Clientes: Creados con `/api/users/register/` y automáticamente asignados al grupo id=3
   - Empleados: Creados con `/api/users/employees/create/` y asignados al grupo que especifiques

2. **Tabla auth_user_groups:**
   - Esta tabla se actualiza automáticamente cuando usas `group_id` en la creación
   - También puedes usar `/add-user-to-group/` para agregar grupos adicionales

3. **is_staff vs is_superuser:**
   - `is_staff=true`: Puede acceder al admin de Django
   - `is_superuser=true`: Tiene todos los permisos (no se puede crear desde estas APIs)

4. **Seguridad:**
   - Todas las rutas requieren autenticación
   - No se pueden eliminar ni modificar superusers
