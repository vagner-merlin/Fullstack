# 🚀 Guía Rápida: Cómo Probar el Sistema de Super Admin

## 📋 Modos de Autenticación

El sistema soporta **DOS MODOS**:

### 1️⃣ Modo MOCK (Desarrollo/Pruebas) - **RECOMENDADO PARA PRUEBAS**
Usa usuarios locales almacenados en localStorage. **No necesita backend**.

### 2️⃣ Modo REAL (Producción)
Se conecta al backend de Django para autenticación.

---

## ⚙️ Configuración

### Opción A: Modo MOCK (Sin Backend)

**1. Crear archivo `.env.local` en la raíz del proyecto:**

```bash
# .env.local
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_AUTH=true
```

**2. Reiniciar el servidor de desarrollo:**

```bash
npm run dev
```

**3. ¡Listo! Ya puedes usar los 4 usuarios predefinidos:**

| Email | Password | Rol | Acceso |
|-------|----------|-----|--------|
| `superadmin@boutique.com` | `superadmin123` | Super Admin 👑 | /superadmin/*, /admin/*, /seller/*, /shop |
| `admin@boutique.com` | `admin123` | Admin 💼 | /admin/*, /seller/*, /shop |
| `seller@boutique.com` | `seller123` | Vendedor 🛒 | /seller/*, /shop |
| `cliente@boutique.com` | `cliente123` | Cliente 👤 | /shop, /cart, /orders, /profile |

---

### Opción B: Modo REAL (Con Backend Django)

**1. Crear archivo `.env.local`:**

```bash
# .env.local
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK_AUTH=false
```

**2. Asegurarse de que el backend Django esté corriendo:**

```bash
# En el directorio del backend Django
python manage.py runserver
```

**3. El frontend se conectará al backend para:**
   - Login: `POST /api/auth/login/`
   - Registro: `POST /api/auth/register/`
   - Usuario actual: `GET /api/auth/me/`

---

## 🧪 Prueba Rápida del Super Admin (Modo MOCK)

### Paso 1: Configurar Modo MOCK

Crea `.env.local` con:
```
VITE_USE_MOCK_AUTH=true
```

### Paso 2: Iniciar la App

```bash
npm run dev
```

### Paso 3: Login como Super Admin

1. Abrir http://localhost:5173
2. Click en "Iniciar Sesión"
3. Credenciales:
   - **Email:** `superadmin@boutique.com`
   - **Password:** `superadmin123`
4. Click en "Iniciar Sesión"

### Paso 4: Acceder al Panel de Super Admin

Tienes 3 opciones:

**Opción 1:** Click en el ícono de la **Corona** 👑 en el navbar
**Opción 2:** Ir directamente a `http://localhost:5173/superadmin/users`
**Opción 3:** Desde el menú hamburguesa (móvil)

### Paso 5: Probar Gestión de Usuarios

1. **Ver usuarios:**
   - Verás los 4 usuarios predefinidos en la tabla
   - Stats: Total, Activos, Super Admins, Admins, Vendedores

2. **Cambiar rol de un usuario:**
   - Localizar `cliente@boutique.com` en la tabla
   - En la columna "Rol", cambiar de `cliente` a `admin`
   - Confirmar el cambio
   - ✅ Toast: "Rol cambiado a admin"

3. **Verificar el cambio:**
   - Logout (botón en sidebar o navbar)
   - Login con `cliente@boutique.com` / `cliente123`
   - **Ahora verás el ícono del Panel Admin** (Shield) en el navbar
   - Click en el ícono → Acceso a `/admin/dashboard` ✅

4. **Desactivar un usuario:**
   - Login como super admin nuevamente
   - En `/superadmin/users`, click en el botón de estado de un usuario
   - El estado cambia a "Inactivo"
   - Logout e intentar login con ese usuario
   - **Error:** "Usuario desactivado. Contacte al administrador." ✅

### Paso 6: Revisar Logs

1. Navegar a `/superadmin/logs`
2. Verás todos los logs registrados:
   - `user.login` - Logins exitosos
   - `user.logout` - Cierre de sesión
   - `user.role_changed` - Cambios de rol
   - `user.status_changed` - Activación/desactivación
3. Filtrar por nivel, acción, fecha
4. Exportar logs con el botón "Exportar"

### Paso 7: Ver Roles y Permisos

1. Navegar a `/superadmin/roles`
2. Verás las 4 tarjetas de roles
3. Click en cualquier rol para expandir:
   - Ver permisos otorgados (✓ check verde)
   - Ver permisos denegados (✗ x gris)
   - Ver rutas permitidas

---

## 🔧 Solución de Problemas

### ❌ "Credenciales inválidas"

**Causa:** Contraseña incorrecta o usuario no existe.

**Solución:**
1. Verificar que estás en **Modo MOCK** (`.env.local` con `VITE_USE_MOCK_AUTH=true`)
2. Usar las credenciales exactas:
   - `superadmin@boutique.com` / `superadmin123`
   - `admin@boutique.com` / `admin123`
   - `seller@boutique.com` / `seller123`
   - `cliente@boutique.com` / `cliente123`
3. Reiniciar el dev server: `npm run dev`

### ❌ "Usuario desactivado"

**Causa:** El usuario fue desactivado desde el panel de super admin.

**Solución:**
1. Login como super admin
2. Ir a `/superadmin/users`
3. Click en el botón de estado del usuario (Eye icon)
4. Activar el usuario

### ❌ No veo el ícono de Super Admin (Corona)

**Causa:** No has iniciado sesión con un usuario con rol `superadmin`.

**Solución:**
- Solo el usuario `superadmin@boutique.com` tiene acceso al panel de super admin
- Login con esas credenciales para ver el ícono de la corona

### ❌ "No se encuentra el nombre 'VITE_USE_MOCK_AUTH'"

**Causa:** No se creó el archivo `.env.local`.

**Solución:**
1. Crear `.env.local` en la raíz del proyecto
2. Copiar el contenido de `.env.example`
3. Reiniciar: `npm run dev`

---

## 📊 Resumen de Funcionalidades

### Panel de Super Admin (`/superadmin/*`)

| Página | Ruta | Descripción |
|--------|------|-------------|
| **Usuarios** | `/superadmin/users` | Gestión de usuarios, roles, activación |
| **Roles** | `/superadmin/roles` | Visualización de permisos y rutas |
| **Logs** | `/superadmin/logs` | Auditoría del sistema |

### Acciones Disponibles

✅ Crear usuarios nuevos
✅ Editar información de usuarios
✅ Cambiar roles de usuarios
✅ Activar/desactivar cuentas
✅ Ver estadísticas de usuarios
✅ Filtrar y buscar usuarios
✅ Ver matriz de permisos por rol
✅ Ver logs del sistema con filtros
✅ Exportar logs a JSON
✅ Navegar entre paneles (Admin, Seller, Super Admin)

---

## 🎯 Flujo de Prueba Recomendado

1. ✅ **Login como Super Admin** (`superadmin@boutique.com`)
2. ✅ **Crear un nuevo usuario** con rol `seller`
3. ✅ **Cambiar rol** de `cliente@boutique.com` a `admin`
4. ✅ **Logout y login** con `cliente@boutique.com`
5. ✅ **Verificar acceso** a `/admin/dashboard`
6. ✅ **Login como super admin** nuevamente
7. ✅ **Desactivar** el usuario creado
8. ✅ **Intentar login** con usuario desactivado (debe fallar)
9. ✅ **Revisar logs** en `/superadmin/logs`
10. ✅ **Ver permisos** en `/superadmin/roles`

---

## 📝 Notas Importantes

- **Persistencia:** Todos los datos se guardan en `localStorage`
- **Contraseñas:** En modo MOCK, las contraseñas están hardcodeadas
- **Logs:** Máximo 1000 registros (auto-trimming)
- **Roles:** 4 roles fijos (no se pueden crear roles nuevos por ahora)
- **Permisos:** 22 permisos distribuidos en 5 categorías

---

## 🔄 Cambiar de Modo MOCK a REAL

### Para conectar al backend Django:

1. **Modificar `.env.local`:**
   ```bash
   VITE_USE_MOCK_AUTH=false
   VITE_API_URL=http://localhost:8000
   ```

2. **Reiniciar:**
   ```bash
   npm run dev
   ```

3. **Requisitos del backend:**
   - Endpoint: `POST /api/auth/login/`
   - Body: `{ "email": "...", "password": "..." }`
   - Response: `{ "access_token": "...", "refresh_token": "...", "user": {...} }`

---

## ✅ Checklist de Verificación

- [ ] Archivo `.env.local` creado con `VITE_USE_MOCK_AUTH=true`
- [ ] Servidor dev corriendo (`npm run dev`)
- [ ] Login exitoso con `superadmin@boutique.com` / `superadmin123`
- [ ] Ícono de corona visible en navbar
- [ ] Acceso a `/superadmin/users` funcional
- [ ] Tabla de usuarios muestra 4 usuarios predefinidos
- [ ] Cambio de rol funciona correctamente
- [ ] Toast notifications aparecen en los cambios
- [ ] Logs se registran en `/superadmin/logs`
- [ ] Desactivar usuario impide el login
- [ ] Permisos visibles en `/superadmin/roles`

---

**¡Ya estás listo para probar el Panel de Super Admin! 🎉**

Para más detalles, consulta `SUPERADMIN_TESTING_GUIDE.md`.
