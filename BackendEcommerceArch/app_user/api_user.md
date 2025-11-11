# 👥 API de Usuarios - Documentación Completa

## 🔐 Autenticación y Autorización

### 🔓 **APIs PÚBLICAS** (Sin autenticación):
- ✅ Login de usuarios
- ✅ Registro de nuevos usuarios

### 🔐 **APIs AUTENTICADAS** (Con token):
- ✅ Logout de usuarios
- ✅ Gestión de usuarios (CRUD)
- ✅ Gestión de grupos y permisos

---

## 📋 APIs Disponibles

## 1. **AUTENTICACIÓN**

### 1.1 **Login de Usuario** 🔓 PÚBLICO
- **URL**: `POST /api/users/login/`
- **Método**: POST
- **Autenticación**: ❌ No requerida
- **Descripción**: Autentica usuario por email y password, retorna token

#### JSON de entrada:
```json
{
    "email": "usuario@ejemplo.com",
    "password": "miPassword123"
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Login exitoso",
    "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
    "user_id": 1,
    "email": "usuario@ejemplo.com",
    "username": "usuario123"
}
```

#### Error - Credenciales inválidas (401):
```json
{
    "success": false,
    "message": "Credenciales inválidas"
}
```

#### Error - Usuario no encontrado (404):
```json
{
    "success": false,
    "message": "Usuario no encontrado"
}
```

#### Error - Datos inválidos (400):
```json
{
    "success": false,
    "message": "Datos inválidos",
    "errors": {
        "email": ["This field is required."],
        "password": ["This field is required."]
    }
}
```

---

### 1.2 **Registro de Usuario** 🔓 PÚBLICO
- **URL**: `POST /api/users/register/`
- **Método**: POST
- **Autenticación**: ❌ No requerida
- **Descripción**: Registra nuevo usuario cliente (no admin) y retorna token automáticamente

#### JSON de entrada:
```json
{
    "username": "nuevoUsuario123",
    "email": "nuevo@ejemplo.com",
    "password": "passwordSeguro123",
    "first_name": "Juan",
    "last_name": "Pérez"
}
```

**Campos obligatorios**: `username`, `email`, `password`
**Campos opcionales**: `first_name`, `last_name`

#### Respuesta exitosa (201):
```json
{
    "success": true,
    "message": "Usuario registrado exitosamente",
    "token": "8833a08188b51abcf8317bc835cd3e4bbdfc6aa2b",
    "user_id": 5,
    "username": "nuevoUsuario123",
    "email": "nuevo@ejemplo.com",
    "first_name": "Juan",
    "last_name": "Pérez"
}
```

#### Error - Datos inválidos (400):
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

#### Error - Error del servidor (500):
```json
{
    "success": false,
    "message": "Error al crear el usuario",
    "error": "Descripción del error interno"
}
```

---

### 1.3 **Logout de Usuario** 🔐 AUTENTICADO
- **URL**: `POST /api/users/logout/`
- **Método**: POST
- **Autenticación**: ✅ Requerida
- **Descripción**: Cierra sesión eliminando el token del usuario

#### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

#### Body: No requiere datos

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Logout exitoso"
}
```

#### Error - Token no encontrado (400):
```json
{
    "success": false,
    "message": "Token no encontrado"
}
```

#### Error - No autenticado (401):
```json
{
    "detail": "Authentication credentials were not provided."
}
```

---

## 2. **GESTIÓN DE USUARIOS** 🔐 AUTENTICADO

### 2.1 **Listar todos los usuarios**
- **URL**: `GET /api/users/users/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

#### Respuesta exitosa (200):
```json
{
    "count": 3,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "password": "pbkdf2_sha256$...", 
            "last_login": "2025-11-11T10:30:00.123456Z",
            "is_superuser": false,
            "username": "usuario1",
            "first_name": "Juan",
            "last_name": "Pérez",
            "email": "juan@ejemplo.com",
            "is_staff": false,
            "is_active": true,
            "date_joined": "2025-11-10T08:15:00.123456Z",
            "groups": [],
            "user_permissions": []
        },
        {
            "id": 2,
            "username": "usuario2",
            "first_name": "María",
            "last_name": "González",
            "email": "maria@ejemplo.com",
            "is_staff": false,
            "is_active": true,
            "date_joined": "2025-11-09T14:22:00.123456Z",
            "groups": [],
            "user_permissions": []
        }
    ]
}
```

---

### 2.2 **Obtener usuario específico**
- **URL**: `GET /api/users/users/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "password": "pbkdf2_sha256$...",
    "last_login": "2025-11-11T10:30:00.123456Z",
    "is_superuser": false,
    "username": "usuario1",
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@ejemplo.com",
    "is_staff": false,
    "is_active": true,
    "date_joined": "2025-11-10T08:15:00.123456Z",
    "groups": [],
    "user_permissions": []
}
```

---

### 2.3 **Crear usuario**
- **URL**: `POST /api/users/users/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "username": "nuevoAdmin",
    "email": "admin@ejemplo.com",
    "password": "passwordSeguro123",
    "first_name": "Administrador",
    "last_name": "Sistema",
    "is_staff": true,
    "is_superuser": false,
    "is_active": true
}
```

---

### 2.4 **Actualizar usuario**
- **URL**: `PUT /api/users/users/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "username": "usuarioActualizado",
    "email": "actualizado@ejemplo.com",
    "first_name": "Nombre Actualizado",
    "last_name": "Apellido Actualizado",
    "is_staff": false,
    "is_active": true
}
```

---

### 2.5 **Actualización parcial**
- **URL**: `PATCH /api/users/users/{id}/`
- **Método**: PATCH
- **Autenticación**: ✅ Requerida

#### JSON de entrada (solo campos a actualizar):
```json
{
    "first_name": "Nuevo Nombre",
    "is_active": false
}
```

---

### 2.6 **Eliminar usuario**
- **URL**: `DELETE /api/users/users/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```
No Content
```

---

## 3. **GESTIÓN DE GRUPOS** 🔐 AUTENTICADO

### 3.1 **Listar grupos**
- **URL**: `GET /api/users/groups/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Administradores",
            "permissions": [1, 2, 3, 4]
        },
        {
            "id": 2,
            "name": "Clientes",
            "permissions": [5, 6]
        }
    ]
}
```

---

### 3.2 **Crear grupo**
- **URL**: `POST /api/users/groups/`
- **Método**: POST
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "name": "Moderadores",
    "permissions": [1, 2, 3]
}
```

---

### 3.3 **Obtener grupo específico**
- **URL**: `GET /api/users/groups/{id}/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "id": 1,
    "name": "Administradores",
    "permissions": [1, 2, 3, 4]
}
```

---

### 3.4 **Actualizar grupo**
- **URL**: `PUT /api/users/groups/{id}/`
- **Método**: PUT
- **Autenticación**: ✅ Requerida

#### JSON de entrada:
```json
{
    "name": "Administradores Actualizados",
    "permissions": [1, 2, 3, 4, 5]
}
```

---

### 3.5 **Eliminar grupo**
- **URL**: `DELETE /api/users/groups/{id}/`
- **Método**: DELETE
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (204):
```
No Content
```

---

### 3.6 **Agregar usuario a un grupo** ⭐ NUEVA
- **URL**: `POST /api/users/add-user-to-group/`
- **Método**: POST
- **Autenticación**: ✅ Requerida
- **Descripción**: Crea la relación en la tabla `auth_user_groups` para asociar un usuario con un grupo

#### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

#### JSON de entrada:
```json
{
    "user_id": 5,
    "group_id": 2
}
```

#### Respuesta exitosa (201):
```json
{
    "success": true,
    "message": "Usuario agregado al grupo exitosamente",
    "user_id": 5,
    "username": "cliente123",
    "group_id": 2,
    "group_name": "Clientes"
}
```

#### Error - Usuario ya en el grupo (400):
```json
{
    "success": false,
    "message": "El usuario ya pertenece a este grupo"
}
```

#### Error - Usuario no encontrado (404):
```json
{
    "success": false,
    "message": "Usuario no encontrado"
}
```

#### Error - Grupo no encontrado (404):
```json
{
    "success": false,
    "message": "Grupo no encontrado"
}
```

#### Error - Datos inválidos (400):
```json
{
    "success": false,
    "message": "Datos inválidos",
    "errors": {
        "user_id": ["Usuario no encontrado."],
        "group_id": ["Grupo no encontrado."]
    }
}
```

---

### 3.7 **Remover usuario de un grupo** ⭐ NUEVA
- **URL**: `POST /api/users/remove-user-from-group/`
- **Método**: POST
- **Autenticación**: ✅ Requerida
- **Descripción**: Elimina la relación en la tabla `auth_user_groups` desasociando un usuario de un grupo

#### Headers requeridos:
```
Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b
```

#### JSON de entrada:
```json
{
    "user_id": 5,
    "group_id": 2
}
```

#### Respuesta exitosa (200):
```json
{
    "success": true,
    "message": "Usuario removido del grupo exitosamente",
    "user_id": 5,
    "username": "cliente123",
    "group_id": 2,
    "group_name": "Clientes"
}
```

#### Error - Usuario no pertenece al grupo (400):
```json
{
    "success": false,
    "message": "El usuario no pertenece a este grupo"
}
```

#### Error - Usuario no encontrado (404):
```json
{
    "success": false,
    "message": "Usuario no encontrado"
}
```

#### Error - Grupo no encontrado (404):
```json
{
    "success": false,
    "message": "Grupo no encontrado"
}
```

---

## 4. **GESTIÓN DE PERMISOS** 🔐 AUTENTICADO

### 4.1 **Listar permisos**
- **URL**: `GET /api/users/permissions/`
- **Método**: GET
- **Autenticación**: ✅ Requerida

#### Respuesta exitosa (200):
```json
{
    "count": 10,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": 1,
            "name": "Can add user",
            "content_type": 4,
            "codename": "add_user"
        },
        {
            "id": 2,
            "name": "Can change user",
            "content_type": 4,
            "codename": "change_user"
        },
        {
            "id": 3,
            "name": "Can delete user",
            "content_type": 4,
            "codename": "delete_user"
        }
    ]
}
```

---

## 🔗 Resumen de URLs

### **URLs PÚBLICAS** (Sin autenticación):
```bash
POST   /api/users/login/         # Login con email/password
POST   /api/users/register/      # Registro de nuevos usuarios
```

### **URLs AUTENTICADAS** (Con token):
```bash
POST   /api/users/logout/        # Cerrar sesión

# GESTIÓN DE USUARIOS
GET    /api/users/users/         # Listar usuarios
POST   /api/users/users/         # Crear usuario
GET    /api/users/users/{id}/    # Obtener usuario específico
PUT    /api/users/users/{id}/    # Actualizar usuario completo
PATCH  /api/users/users/{id}/    # Actualizar usuario parcial
DELETE /api/users/users/{id}/    # Eliminar usuario

# GESTIÓN DE GRUPOS
GET    /api/users/groups/        # Listar grupos
POST   /api/users/groups/        # Crear grupo
GET    /api/users/groups/{id}/   # Obtener grupo específico
PUT    /api/users/groups/{id}/   # Actualizar grupo
DELETE /api/users/groups/{id}/   # Eliminar grupo

# RELACIÓN USUARIOS-GRUPOS
POST   /api/users/add-user-to-group/       # Agregar usuario a grupo
POST   /api/users/remove-user-from-group/  # Remover usuario de grupo

# GESTIÓN DE PERMISOS
GET    /api/users/permissions/        # Listar permisos
POST   /api/users/permissions/        # Crear permiso
GET    /api/users/permissions/{id}/   # Obtener permiso específico
PUT    /api/users/permissions/{id}/   # Actualizar permiso
DELETE /api/users/permissions/{id}/   # Eliminar permiso
```

---

## 🚀 Ejemplos de uso en Frontend

### JavaScript - Login:
```javascript
const loginUser = async (email, password) => {
    const response = await fetch('/api/users/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Guardar token en localStorage
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.user_id);
        console.log('Login exitoso:', data.message);
    } else {
        console.error('Error login:', data.message);
    }
    
    return data;
};
```

### JavaScript - Registro:
```javascript
const registerUser = async (userData) => {
    const response = await fetch('/api/users/register/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: userData.username,
            email: userData.email,
            password: userData.password,
            first_name: userData.firstName,
            last_name: userData.lastName
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Usuario registrado, ya tiene token automáticamente
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userId', data.user_id);
        console.log('Registro exitoso:', data.message);
    }
    
    return data;
};
```

### JavaScript - Logout:
```javascript
const logoutUser = async () => {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('/api/users/logout/', {
        method: 'POST',
        headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
        }
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Limpiar almacenamiento local
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        console.log('Logout exitoso:', data.message);
    }
    
    return data;
};
```

### JavaScript - Obtener usuarios (autenticado):
```javascript
const getUsers = async () => {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('/api/users/users/', {
        method: 'GET',
        headers: {
            'Authorization': 'Token ' + token,
        }
    });
    
    const data = await response.json();
    return data;
};
```

### JavaScript - Verificar si usuario está logueado:
```javascript
const isUserLoggedIn = () => {
    const token = localStorage.getItem('userToken');
    return token !== null && token !== undefined;
};

const getCurrentUserId = () => {
    return localStorage.getItem('userId');
};

const getCurrentToken = () => {
    return localStorage.getItem('userToken');
};
```

### JavaScript - Agregar usuario a un grupo:
```javascript
const addUserToGroup = async (userId, groupId) => {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('/api/users/add-user-to-group/', {
        method: 'POST',
        headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            group_id: groupId
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        console.log('Usuario agregado al grupo:', data.message);
    } else {
        console.error('Error:', data.message);
    }
    
    return data;
};
```

### JavaScript - Remover usuario de un grupo:
```javascript
const removeUserFromGroup = async (userId, groupId) => {
    const token = localStorage.getItem('userToken');
    
    const response = await fetch('/api/users/remove-user-from-group/', {
        method: 'POST',
        headers: {
            'Authorization': 'Token ' + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user_id: userId,
            group_id: groupId
        })
    });
    
    const data = await response.json();
    
    if (data.success) {
        console.log('Usuario removido del grupo:', data.message);
    } else {
        console.error('Error:', data.message);
    }
    
    return data;
};
```

---

## 🎯 Flujo de trabajo típico

### 1. **Registro de nuevo usuario**:
```javascript
// 1. Usuario llena formulario de registro
const newUser = {
    username: "cliente123",
    email: "cliente@ejemplo.com", 
    password: "miPassword123",
    firstName: "Juan",
    lastName: "Pérez"
};

// 2. Registrar usuario (recibe token automáticamente)
const result = await registerUser(newUser);

// 3. Usuario ya está logueado y puede navegar
if (result.success) {
    window.location.href = '/dashboard';
}
```

### 2. **Login de usuario existente**:
```javascript
// 1. Usuario ingresa credenciales
const credentials = {
    email: "cliente@ejemplo.com",
    password: "miPassword123"
};

// 2. Hacer login
const result = await loginUser(credentials.email, credentials.password);

// 3. Redirigir si es exitoso
if (result.success) {
    window.location.href = '/dashboard';
}
```

### 3. **Logout**:
```javascript
// 1. Usuario hace click en cerrar sesión
const result = await logoutUser();

// 2. Redirigir a página de inicio
if (result.success) {
    window.location.href = '/';
}
```

---

## ❌ Errores comunes

### Error 401 - No autenticado:
```json
{
    "detail": "Authentication credentials were not provided."
}
```

### Error 401 - Token inválido:
```json
{
    "detail": "Invalid token."
}
```

### Error 400 - Validación:
```json
{
    "username": ["This field is required."],
    "email": ["Enter a valid email address."],
    "password": ["This field is required."]
}
```

### Error 404 - Usuario no encontrado:
```json
{
    "success": false,
    "message": "Usuario no encontrado"
}
```

---

## 📝 Notas importantes

1. **Login por email**: El sistema permite login usando email en lugar de username
2. **Token automático**: Al registrarse, el usuario recibe token inmediatamente
3. **Usuarios normales**: El registro crea usuarios normales (no admin ni staff)
4. **Token único**: Cada usuario tiene un token único para autenticación
5. **Logout seguro**: El logout elimina completamente el token del servidor
6. **Gestión completa**: APIs CRUD completas para usuarios, grupos y permisos
7. **Validaciones**: Usernames y emails únicos, validaciones de campos
8. **Seguridad**: Passwords encriptados automáticamente
9. **Relación usuarios-grupos**: Las APIs `add-user-to-group` y `remove-user-from-group` gestionan la tabla intermedia `auth_user_groups` automáticamente
10. **Validación de existencia**: Ambas APIs validan que el usuario y grupo existan antes de crear/eliminar la relación
11. **Prevención de duplicados**: No se puede agregar un usuario a un grupo si ya pertenece a él

Todas las APIs están listas para integrar con tu frontend. El flujo de autenticación es simple y seguro. 🚀