# 🔐 Panel de Super Administración - Guía de Prueba

## 📋 Resumen del Sistema

El Panel de Super Admin implementa un sistema completo de control técnico con gestión de roles, permisos y auditoría.

### 🎯 Características Implementadas

1. **Gestión de Usuarios** (`UsersPage`)
   - CRUD completo de usuarios del sistema
   - Cambio de roles en tiempo real
   - Activación/desactivación de cuentas
   - Estadísticas de usuarios por rol
   - Búsqueda y filtros avanzados

2. **Roles y Permisos** (`RolesPage`)
   - 4 roles del sistema: SuperAdmin, Admin, Seller, Cliente
   - 22 permisos distribuidos en 5 categorías
   - Visualización de matriz de permisos
   - Control de acceso a rutas
   - Jerarquía de roles

3. **Logs del Sistema** (`SystemLogsPage`)
   - Registro automático de todas las acciones
   - 14 tipos de acciones rastreadas
   - Filtrado por nivel, acción, usuario, fecha
   - Exportación de logs en JSON
   - Paginación y búsqueda
   - Limpieza de logs antiguos

## 🔑 Usuarios Predefinidos

El sistema inicializa automáticamente 4 usuarios de prueba:

### 1. Super Administrador 👑
```
Email: superadmin@boutique.com
Password: superadmin123
Rol: superadmin
Acceso: Todos los paneles (/superadmin/*, /admin/*, /seller/*, /shop)
```

### 2. Administrador 💼
```
Email: admin@boutique.com
Password: admin123
Rol: admin
Acceso: Panel Admin y Seller (/admin/*, /seller/*, /shop)
```

### 3. Vendedor 🛒
```
Email: seller@boutique.com
Password: seller123
Rol: seller
Acceso: Panel de Ventas (/seller/*, /shop)
```

### 4. Cliente 👤
```
Email: cliente@boutique.com
Password: cliente123
Rol: cliente
Acceso: Tienda en línea (/shop, /cart, /checkout, /orders, /profile)
```

## 🧪 Pasos para Probar

### Paso 1: Acceder al Panel de Super Admin

1. Abrir la aplicación en el navegador
2. Hacer clic en "Iniciar Sesión" en el navbar
3. Usar las credenciales del Super Admin:
   - Email: `superadmin@boutique.com`
   - Password: `superadmin123`
4. Navegar a `/superadmin/users` (o hacer clic en el ícono de la corona en el navbar)

### Paso 2: Explorar la Página de Usuarios

1. **Ver Estadísticas**: Observar las tarjetas de stats (Total, Activos, Super Admins, Admins, Vendedores)
2. **Tabla de Usuarios**: Ver los 4 usuarios predefinidos con sus roles
3. **Filtros**:
   - Buscar por nombre o email
   - Filtrar por rol (dropdown)
   - Filtrar por estado (activo/inactivo)
4. **Crear Usuario**:
   - Click en "Nuevo Usuario"
   - Completar el formulario (nombre, apellido, email, password, rol, teléfono)
   - Guardar y verificar que aparece en la tabla
5. **Editar Usuario**:
   - Click en el ícono de editar (lápiz)
   - Modificar datos (nombre, email, teléfono)
   - Guardar cambios

### Paso 3: Prueba Crítica - Cambio de Rol

**Objetivo**: Verificar que al cambiar el rol de un usuario, el sistema actualiza correctamente el acceso a rutas.

1. **En la tabla de usuarios**, localizar al usuario `cliente@boutique.com`
2. **Cambiar su rol**: En la columna "Rol", seleccionar "admin" del dropdown
3. **Confirmar el cambio** en el diálogo de confirmación
4. **Observar**:
   - Toast de éxito: "Rol cambiado a admin"
   - El select muestra ahora "admin"
   - Se registra un log del cambio
5. **Cerrar sesión** del Super Admin (logout)
6. **Iniciar sesión con el usuario modificado**:
   - Email: `cliente@boutique.com`
   - Password: `cliente123`
7. **Verificar acceso**:
   - El usuario ahora debería tener acceso a `/admin/dashboard`
   - El navbar debería mostrar el ícono del Panel Admin (Shield)
   - Navegar a `/admin/dashboard` y verificar que carga correctamente
8. **Repetir con otros roles**:
   - Cambiar de admin → seller
   - Verificar acceso a `/seller/home` y POS
   - Cambiar de seller → cliente
   - Verificar que solo tiene acceso a /shop

### Paso 4: Explorar Roles y Permisos

1. Navegar a `/superadmin/roles`
2. **Ver los 4 roles**: SuperAdmin (rojo), Admin (rosa), Seller (índigo), Cliente (gris)
3. **Expandir cada rol** (click en la tarjeta):
   - Ver permisos por categoría (Productos, Ventas, Usuarios, Sistema, Reportes)
   - Iconos ✓ (check) = permiso otorgado
   - Iconos ✗ (x) = permiso denegado
   - Ver rutas permitidas para cada rol
   - Leer descripción del rol
4. **Comparar permisos**:
   - SuperAdmin: 22/22 permisos (todos)
   - Admin: 14/22 permisos
   - Seller: 4/22 permisos
   - Cliente: 1/22 permisos

### Paso 5: Revisar Logs del Sistema

1. Navegar a `/superadmin/logs`
2. **Ver estadísticas**: Total, Hoy, Exitosos, Info, Advertencias, Errores
3. **Tabla de logs**: Observar todos los registros (login, logout, cambios de rol, etc.)
4. **Filtrar logs**:
   - Por nivel (info, success, warning, error)
   - Por acción (ej: "user.login", "user.role_changed")
   - Por rango de fechas (inicio y fin)
   - Por búsqueda de texto
   - Click en "Aplicar Filtros"
5. **Ver detalles**: Click en "Ver detalles" para expandir metadata del log
6. **Exportar logs**: Click en "Exportar" para descargar JSON
7. **Limpiar logs antiguos**: Click en "Limpiar Antiguos" (elimina logs > 30 días)
8. **Paginación**: Navegar entre páginas (20 logs por página)

### Paso 6: Activar/Desactivar Usuarios

1. En `/superadmin/users`
2. **Desactivar un usuario**:
   - Click en el botón de estado (Eye/EyeOff) o en el ícono de basura
   - Confirmar
   - El estado cambia a "Inactivo" (gris)
   - Se registra un log de "user.status_changed"
3. **Intentar login con usuario inactivo**:
   - Cerrar sesión
   - Intentar login con el usuario desactivado
   - El login debería fallar (usuario inactivo)
4. **Reactivar usuario**:
   - Login como Super Admin
   - Click en el botón de estado del usuario inactivo
   - El estado cambia a "Activo" (verde)
5. **Verificar login**:
   - Ahora el usuario puede hacer login correctamente

### Paso 7: Navegación entre Paneles

Desde el Panel de Super Admin, usar los **Quick Links** en el sidebar:

1. **→ Panel Admin**: Navega a `/admin/dashboard`
   - Verificar acceso completo al panel administrativo
   - Ver productos, órdenes, estadísticas
2. **→ Panel Vendedor**: Navega a `/seller/home`
   - Verificar acceso al POS
   - Ver estadísticas de ventas
3. **→ Ver Tienda**: Navega a `/shop`
   - Verificar catálogo de productos
   - Funcionalidades de cliente

### Paso 8: Pruebas de Seguridad

1. **Intentar acceso sin permisos**:
   - Cerrar sesión del Super Admin
   - Login como `cliente@boutique.com`
   - Intentar acceder a `/superadmin/users` directamente en la URL
   - **Resultado esperado**: Redirección a "/" (sin acceso)

2. **Intentar acceso con rol incorrecto**:
   - Login como `seller@boutique.com`
   - Intentar acceder a `/admin/dashboard`
   - **Resultado esperado**: Acceso denegado o redirección

3. **Verificar protección de rutas**:
   - Cada ruta está protegida por `ProtectedRoute` con `allowedRoles`
   - `/superadmin/*` → solo 'superadmin'
   - `/admin/*` → 'admin' y 'superadmin'
   - `/seller/*` → 'seller', 'admin' y 'superadmin'

## 📊 Sistema de Permisos

### Categorías de Permisos

#### 🟣 Productos (5 permisos)
- `products.view`: Ver catálogo
- `products.create`: Crear productos
- `products.edit`: Editar productos
- `products.delete`: Eliminar productos
- `products.manage_stock`: Gestionar inventario

#### 🟢 Ventas (4 permisos)
- `sales.view`: Ver ventas
- `sales.create`: Crear ventas
- `sales.manage_orders`: Gestionar órdenes
- `sales.refunds`: Procesar devoluciones

#### 🔵 Usuarios (5 permisos)
- `users.view`: Ver usuarios
- `users.create`: Crear usuarios
- `users.edit`: Editar usuarios
- `users.delete`: Eliminar usuarios
- `users.manage_roles`: Gestionar roles

#### 🔴 Sistema (4 permisos)
- `system.view_logs`: Ver logs
- `system.manage_settings`: Configuración
- `system.backup`: Respaldo de datos
- `system.maintenance`: Mantenimiento

#### 🟡 Reportes (4 permisos)
- `reports.sales`: Reportes de ventas
- `reports.inventory`: Reportes de inventario
- `reports.financial`: Reportes financieros
- `reports.export`: Exportar datos

### Distribución por Rol

| Rol | Permisos | Rutas | Descripción |
|-----|----------|-------|-------------|
| **SuperAdmin** | 22/22 | Todas | Control total del sistema |
| **Admin** | 14/22 | /admin/*, /seller/*, /shop | Gestión de tienda |
| **Seller** | 4/22 | /seller/*, /shop | Punto de venta |
| **Cliente** | 1/22 | /shop, /cart, /orders, /profile | Compras en línea |

## 🔧 Tecnologías Utilizadas

- **React 19.2.0** + TypeScript
- **localStorage**: Persistencia de datos (users, logs)
- **Framer Motion**: Animaciones
- **Tailwind CSS**: Estilos con paleta roja para super admin
- **Lucide React**: Iconografía (Crown, Shield, Users, FileText)
- **React Router DOM v6**: Rutas protegidas
- **React-toastify**: Notificaciones

## 📁 Estructura de Archivos

```
src/
├── components/
│   └── superadmin/
│       └── SuperAdminLayout.tsx (186 líneas)
├── pages/
│   └── superadmin/
│       ├── UsersPage.tsx (450+ líneas)
│       ├── RolesPage.tsx (300+ líneas)
│       └── SystemLogsPage.tsx (400+ líneas)
├── services/
│   └── superadmin/
│       ├── userManagementService.ts (242 líneas)
│       ├── roleService.ts (185 líneas)
│       └── systemLogsService.ts (247 líneas)
├── context/
│   └── AuthContext.tsx (actualizado con logging)
├── router/
│   └── AppRouter.tsx (rutas /superadmin/*)
└── main.tsx (inicialización de usuarios)
```

## 🗄️ Almacenamiento (localStorage)

- `boutique_system_users`: Todos los usuarios del sistema
- `boutique_system_logs`: Registros de actividad (máx 1000)
- `auth_token`: Token de autenticación
- `user`: Usuario actual en sesión

## ✅ Checklist de Pruebas

- [ ] Login con cada uno de los 4 usuarios predefinidos
- [ ] Crear un nuevo usuario desde UsersPage
- [ ] Editar información de un usuario existente
- [ ] Cambiar rol de cliente → admin → verificar acceso a /admin/dashboard
- [ ] Cambiar rol de admin → seller → verificar acceso a /seller/home
- [ ] Desactivar un usuario → verificar que no puede hacer login
- [ ] Reactivar usuario → verificar que puede hacer login
- [ ] Ver todos los roles y permisos en RolesPage
- [ ] Expandir cada rol y revisar permisos otorgados
- [ ] Ver logs del sistema en SystemLogsPage
- [ ] Filtrar logs por nivel, acción, fecha
- [ ] Exportar logs a JSON
- [ ] Usar quick links para navegar entre paneles
- [ ] Intentar acceso no autorizado (cliente → /superadmin/users)
- [ ] Verificar que los logs se registran automáticamente

## 🎨 Paleta de Colores

- **Super Admin**: Red 600/700 (rojo oscuro) 🔴
- **Admin**: Rose 600/700 (rosa) 🌹
- **Seller**: Indigo 600/700 (índigo) 💼
- **Cliente**: Gray (gris) 👤

## 📝 Notas Importantes

1. **Inicialización automática**: Los usuarios se crean automáticamente al cargar la app (main.tsx)
2. **Logs automáticos**: Login, logout y cambios de rol se registran automáticamente
3. **Validación de email**: No permite emails duplicados al crear usuarios
4. **Soft delete**: Los usuarios se desactivan, no se eliminan permanentemente (por defecto)
5. **Máximo de logs**: 1000 registros (auto-trimming para evitar overflow)
6. **Rutas protegidas**: Todas las rutas de super admin requieren rol 'superadmin'

## 🚀 Próximos Pasos Opcionales

- Página de Settings para configuración del sistema
- Backup/Restore de datos
- Gráficos de actividad de usuarios
- Exportación de usuarios a CSV
- Sistema de notificaciones de seguridad
- Autenticación de dos factores (2FA)
